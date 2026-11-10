/* ============================================================
   map-gl.js — Canvas 2D World Map  v6
   Dot-matrix world from Natural Earth data (MAPDATA)
   UK & India: fine dots + crisp glowing outlines
   Great-circle routes · Aircraft · City markers
   No external libraries — pure Canvas 2D.
   ============================================================ */
(function () {
  'use strict';

  /* ── Canvas setup ───────────────────────────────────────── */
  var MC = document.getElementById('mapcanvas');
  if (!MC || typeof MAPDATA === 'undefined') return;
  var ctx = MC.getContext('2d');
  var DPR = Math.min(2, window.devicePixelRatio || 1);
  var W = 800, H = 500;

  function setSize(w, h) {
    W = w; H = h;
    MC.width  = Math.round(w * DPR);
    MC.height = Math.round(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  setSize(W, H);

  if (window.ResizeObserver) {
    new ResizeObserver(function (entries) {
      var e = entries[0]; if (!e) return;
      var w = Math.round(e.contentRect.width);
      var h = Math.round(e.contentRect.height);
      if (w > 10 && h > 10) {
        setSize(w, h);
        if (activeIdx === 0) {
          var cam = getCameraTarget(0);
          tgt.cx = cam.cx; tgt.cy = cam.cy; tgt.z = cam.z;
        }
      }
    }).observe(MC);
  }

  /* ── Reduced motion ─────────────────────────────────────── */
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var ANIM_SPEED = REDUCED ? 0.08 : 0.0085;

  /* ── Coordinate helpers ─────────────────────────────────── */
  /* world units: x 0..1000 (lng -180..180), y 0..500 (lat 90..-90) */
  var cur = { cx: 500, cy: 220, z: 1.4 };
  var tgt = { cx: 500, cy: 220, z: 1.4 };
  var DEG = Math.PI / 180;
  var KX = 1000 / 360, KY = 500 / 180;

  function wx(lng) { return (lng + 180) * KX; }
  function wy(lat) { return (90 - lat) * KY; }

  function w2c(x, y) {
    return {
      x: (x - cur.cx) * cur.z + W / 2,
      y: (y - cur.cy) * cur.z + H / 2
    };
  }

  /* ── Great-circle SLERP ─────────────────────────────────── */
  function greatCircle(lat1, lng1, lat2, lng2, steps) {
    var f1 = lat1 * DEG, l1 = lng1 * DEG;
    var f2 = lat2 * DEG, l2 = lng2 * DEG;
    var cosD = Math.sin(f1) * Math.sin(f2) + Math.cos(f1) * Math.cos(f2) * Math.cos(l2 - l1);
    var d = Math.acos(Math.max(-1, Math.min(1, cosD)));
    var pts = [];
    for (var i = 0; i <= steps; i++) {
      var frac = i / steps, lat, lng;
      if (d < 0.0001) {
        lat = lat1 + (lat2 - lat1) * frac;
        lng = lng1 + (lng2 - lng1) * frac;
      } else {
        var A = Math.sin((1 - frac) * d) / Math.sin(d);
        var B = Math.sin(frac * d) / Math.sin(d);
        var x = A * Math.cos(f1) * Math.cos(l1) + B * Math.cos(f2) * Math.cos(l2);
        var y = A * Math.cos(f1) * Math.sin(l1) + B * Math.cos(f2) * Math.sin(l2);
        var z = A * Math.sin(f1) + B * Math.sin(f2);
        lat = Math.atan2(z, Math.sqrt(x * x + y * y)) / DEG;
        lng = Math.atan2(y, x) / DEG;
      }
      pts.push({ x: wx(lng), y: wy(lat) });
    }
    return pts;
  }

  /* ── Offscreen dot layer (prerendered once) ─────────────── */
  var OFF_S = 3.6;                       // offscreen px per world unit
  var OFF_W = 1000 * OFF_S, OFF_H = 500 * OFF_S;
  var dotLayer = document.createElement('canvas');
  dotLayer.width = OFF_W; dotLayer.height = OFF_H;

  (function buildDotLayer() {
    var oc = dotLayer.getContext('2d');

    function plot(flat, color, rWorld) {
      oc.fillStyle = color;
      oc.beginPath();
      var r = rWorld * OFF_S;
      for (var i = 0; i < flat.length; i += 2) {
        var x = wx(flat[i]) * OFF_S;
        var y = wy(flat[i + 1]) * OFF_S;
        oc.moveTo(x + r, y);
        oc.arc(x, y, r, 0, Math.PI * 2);
      }
      oc.fill();
    }

    plot(MAPDATA.dots,   'rgba(150,172,222,0.50)', 1.10);  // world — soft steel blue
    plot(MAPDATA.ukDots, 'rgba(99,133,255,0.85)',  0.72);  // UK — royal blue (marker color family)
    plot(MAPDATA.inDots, 'rgba(255,102,84,0.85)',  0.72);  // India — warm accent red
  })();

  /* ── Country outlines (crisp vector, drawn per frame) ───── */
  function prepOutline(rings) {
    return rings.map(function (ring) {
      var pts = ring.map(function (p) { return { x: wx(p[0]), y: wy(p[1]) }; });
      var mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
      pts.forEach(function (p) {
        if (p.x < mnx) mnx = p.x; if (p.x > mxx) mxx = p.x;
        if (p.y < mny) mny = p.y; if (p.y > mxy) mxy = p.y;
      });
      return { pts: pts, b: [mnx, mny, mxx, mxy] };
    });
  }
  var ukOutline = prepOutline(MAPDATA.ukOut);
  var inOutline = prepOutline(MAPDATA.inOut);

  /* ── Stars ──────────────────────────────────────────────── */
  var stars = [];
  var rng = Math.random;
  for (var si = 0; si < 500; si++) {
    stars.push({
      x: rng() * 1000, y: rng() * 500,
      baseAlpha: 0.05 + rng() * 0.35,
      size: 0.4 + rng() * 0.7,
      phase: rng() * Math.PI * 2,
      speed: 0.4 + rng() * 1.2
    });
  }

  /* ── Journey data ───────────────────────────────────────── */
  var journey = DATA.journey;

  var segs = [];
  for (var si2 = 0; si2 < journey.length - 1; si2++) {
    var j0 = journey[si2], j1 = journey[si2 + 1];
    segs.push({ pts: greatCircle(j0.lat, j0.lng, j1.lat, j1.lng, 90), animT: 0 });
  }

  var markers = [];
  for (var mi = 0; mi < journey.length; mi++) {
    markers.push({ landed: mi === 0, pulseT: 0, rippleT: -1 });
  }

  var flowParticles = [];
  for (var fi = 0; fi < segs.length * 5; fi++) {
    flowParticles.push({
      segIdx: Math.floor(fi / 5),
      t: rng(),
      speed: 0.0018 + rng() * 0.0022
    });
  }

  /* ── Camera ─────────────────────────────────────────────── */
  function getCameraTarget(idx) {
    if (idx === 0) {
      /* Fit the UK→India corridor with world context: lng -15..100, lat 0..62 */
      var x0 = wx(-15), x1 = wx(100), y0 = wy(62), y1 = wy(0);
      var z0 = Math.min(W / (x1 - x0), H / (y1 - y0)) * 0.9;
      return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, z: Math.max(1.0, Math.min(3, z0)) };
    }
    var a = journey[idx - 1], b = journey[idx];
    var ax = wx(a.lng), ay = wy(a.lat);
    var bx = wx(b.lng), by = wy(b.lat);
    var cx = (ax + bx) / 2, cy = (ay + by) / 2;
    /* Fit both endpoints with generous margin on the actual canvas —
       fixes long routes (India↔UK) being clipped on narrow screens */
    var zx = W / (Math.abs(bx - ax) + 110);
    var zy = H / (Math.abs(by - ay) + 110);
    var z = Math.max(1.0, Math.min(6, Math.min(zx, zy)));
    return { cx: cx, cy: cy, z: z };
  }

  var activeIdx = 0;
  var t = 0, tick = 0, rafPending = false;

  var initCam = getCameraTarget(0);
  cur.cx = tgt.cx = initCam.cx;
  cur.cy = tgt.cy = initCam.cy;
  cur.z  = tgt.z  = initCam.z;

  /* ── Flight easing ──────────────────────────────────────── */
  function flightPathT(raw) {
    if (raw <= 0) return 0;
    if (raw >= 1) return 1;
    if (raw < 0.18) { var u = raw / 0.18; return 0.18 * u * u * u; }
    if (raw < 0.82) return 0.18 + (raw - 0.18);
    var v = (raw - 0.82) / 0.18;
    return 0.82 + 0.18 * (1 - (1 - v) * (1 - v) * (1 - v));
  }

  function aircraftAlpha(raw) {
    if (raw < 0.07) return raw / 0.07;
    if (raw < 0.9) return 1;
    return Math.max(0, (1 - raw) / 0.1);
  }

  function pathPoint(pts, frac) {
    if (frac <= 0) return pts[0];
    if (frac >= 1) return pts[pts.length - 1];
    var idx = Math.max(0, Math.min(pts.length - 2, Math.floor(frac * (pts.length - 1))));
    var localT = frac * (pts.length - 1) - idx;
    var a = pts[idx], b = pts[idx + 1];
    return { x: a.x + (b.x - a.x) * localT, y: a.y + (b.y - a.y) * localT };
  }

  /* ============================================================
     DRAW
  ============================================================ */

  function drawBackground() {
    ctx.fillStyle = '#070B17';
    ctx.fillRect(0, 0, W, H);
    var grd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
    grd.addColorStop(0, 'rgba(14,22,48,0.6)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
  }

  function drawStars() {
    var twinkle = REDUCED ? 1 : (0.7 + 0.3 * Math.sin(t * 0.6));
    var buckets = [[], [], [], []];
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var c = w2c(s.x, s.y);
      if (c.x < -2 || c.x > W + 2 || c.y < -2 || c.y > H + 2) continue;
      var alpha = REDUCED ? s.baseAlpha : s.baseAlpha * (0.7 + 0.3 * Math.sin(t * s.speed + s.phase));
      var b = Math.min(3, Math.floor(alpha / 0.15));
      buckets[b].push({ x: c.x, y: c.y, r: s.size });
    }
    var alphas = [0.10, 0.20, 0.32, 0.45];
    for (var b2 = 0; b2 < 4; b2++) {
      if (!buckets[b2].length) continue;
      ctx.globalAlpha = alphas[b2] * twinkle;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      for (var k = 0; k < buckets[b2].length; k++) {
        var st = buckets[b2][k];
        ctx.moveTo(st.x + st.r, st.y);
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(160,185,235,0.045)';
    ctx.lineWidth = 0.5;
    for (var lng = -180; lng <= 180; lng += 30) {
      var x = wx(lng);
      var a = w2c(x, wy(84)), b = w2c(x, wy(-60));
      if ((a.x < -2 && b.x < -2) || (a.x > W + 2 && b.x > W + 2)) continue;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (var lat = -60; lat <= 80; lat += 20) {
      var y = wy(lat);
      var l = w2c(wx(-180), y), r = w2c(wx(180), y);
      if ((l.y < -2 && r.y < -2) || (l.y > H + 2 && r.y > H + 2)) continue;
      ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(r.x, r.y); ctx.stroke();
    }
  }

  /* Dot layer: single drawImage of the prerendered bitmap */
  function drawDots() {
    var sx = (cur.cx - (W / 2) / cur.z) * OFF_S;
    var sy = (cur.cy - (H / 2) / cur.z) * OFF_S;
    var sw = (W / cur.z) * OFF_S;
    var sh = (H / cur.z) * OFF_S;

    var ix0 = Math.max(sx, 0), iy0 = Math.max(sy, 0);
    var ix1 = Math.min(sx + sw, OFF_W), iy1 = Math.min(sy + sh, OFF_H);
    if (ix1 <= ix0 || iy1 <= iy0) return;

    var dx = (ix0 - sx) / sw * W, dy = (iy0 - sy) / sh * H;
    var dw = (ix1 - ix0) / sw * W, dh = (iy1 - iy0) / sh * H;

    ctx.globalAlpha = REDUCED ? 1 : 0.92 + 0.08 * Math.sin(t * 0.3);
    ctx.drawImage(dotLayer, ix0, iy0, ix1 - ix0, iy1 - iy0, dx, dy, dw, dh);
    ctx.globalAlpha = 1;
  }

  /* Crisp glowing outlines for UK & India */
  function strokeRings(rings, core, glow) {
    for (var ri = 0; ri < rings.length; ri++) {
      var ring = rings[ri];
      var a = w2c(ring.b[0], ring.b[1]);
      var b = w2c(ring.b[2], ring.b[3]);
      if (b.x < -30 || a.x > W + 30 || b.y < -30 || a.y > H + 30) continue;

      ctx.beginPath();
      var pts = ring.pts;
      for (var k = 0; k < pts.length; k++) {
        var c = w2c(pts[k].x, pts[k].y);
        if (k === 0) ctx.moveTo(c.x, c.y);
        else ctx.lineTo(c.x, c.y);
      }
      ctx.closePath();

      ctx.strokeStyle = glow;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.strokeStyle = core;
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
  }

  function drawOutlines() {
    var breathe = REDUCED ? 1 : 0.8 + 0.2 * Math.sin(t * 0.5);
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.9;
    strokeRings(ukOutline, 'rgba(120,150,255,0.85)', 'rgba(67,97,238,' + (0.14 * breathe) + ')');
    strokeRings(inOutline, 'rgba(255,110,90,0.85)',  'rgba(241,48,36,' + (0.14 * breathe) + ')');
    ctx.globalAlpha = 1;
    ctx.lineJoin = 'miter';
  }

  function drawIllumination(ax, ay) {
    var grd = ctx.createRadialGradient(ax, ay, 0, ax, ay, 180);
    grd.addColorStop(0, 'rgba(110,150,255,0.07)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawRoute(canvasPts, alpha) {
    if (canvasPts.length < 2 || alpha <= 0) return;
    var passes = [
      ['rgba(255,74,74,',  0.09, 7],
      ['rgba(255,100,80,', 0.22, 3.5],
      ['rgba(255,74,74,',  0.95, 1.6],
      ['rgba(255,210,200,',0.28, 0.7]
    ];
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (var p = 0; p < passes.length; p++) {
      ctx.strokeStyle = passes[p][0] + (passes[p][1] * alpha) + ')';
      ctx.lineWidth = passes[p][2];
      ctx.beginPath();
      for (var i = 0; i < canvasPts.length; i++) {
        if (i === 0) ctx.moveTo(canvasPts[i].x, canvasPts[i].y);
        else ctx.lineTo(canvasPts[i].x, canvasPts[i].y);
      }
      ctx.stroke();
    }
    ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
  }

  function drawCompletedRoutes() {
    for (var i = 0; i < activeIdx - 1; i++) {
      var age = (activeIdx - 1) - i;
      var alpha = age === 1 ? 0.6 : age === 2 ? 0.35 : 0.20;
      var pts = segs[i].pts;
      var canvasPts = [];
      for (var k = 0; k < pts.length; k++) canvasPts.push(w2c(pts[k].x, pts[k].y));
      drawRoute(canvasPts, alpha);
    }
  }

  function drawActiveRoute() {
    if (activeIdx === 0) return;
    var seg = segs[activeIdx - 1];
    var rawT = seg.animT;
    var pathT = flightPathT(rawT);
    var count = Math.max(2, Math.floor(pathT * seg.pts.length));
    var canvasPts = [];
    for (var k = 0; k < count; k++) canvasPts.push(w2c(seg.pts[k].x, seg.pts[k].y));
    drawRoute(canvasPts, 1.0);

    var aAlpha = aircraftAlpha(rawT);
    if (aAlpha > 0.01 && count >= 2) {
      var tipPt = canvasPts[count - 1];
      var prevPt = canvasPts[count - 2];
      var angle = Math.atan2(tipPt.y - prevPt.y, tipPt.x - prevPt.x);

      /* Comet tail — bright gradient over the last stretch of the route */
      var tailLen = Math.min(16, count - 1);
      if (tailLen >= 2) {
        var tailStart = canvasPts[count - 1 - tailLen];
        var grad = ctx.createLinearGradient(tailStart.x, tailStart.y, tipPt.x, tipPt.y);
        grad.addColorStop(0, 'rgba(255,190,170,0)');
        grad.addColorStop(1, 'rgba(255,230,220,' + (0.85 * aAlpha) + ')');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (var ti = count - 1 - tailLen; ti < count; ti++) {
          if (ti === count - 1 - tailLen) ctx.moveTo(canvasPts[ti].x, canvasPts[ti].y);
          else ctx.lineTo(canvasPts[ti].x, canvasPts[ti].y);
        }
        ctx.stroke();
        ctx.lineCap = 'butt';
      }

      drawIllumination(tipPt.x, tipPt.y);
      drawAircraft(tipPt.x, tipPt.y, angle, aAlpha);
    }
  }

  function drawAircraft(x, y, angle, alpha) {
    if (alpha <= 0.01) return;

    /* Warm halo under the aircraft */
    var halo = ctx.createRadialGradient(x, y, 0, x, y, 16);
    halo.addColorStop(0, 'rgba(255,160,130,' + (0.30 * alpha) + ')');
    halo.addColorStop(1, 'rgba(255,160,130,0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.translate(x, y); ctx.rotate(angle);
    var pulse = REDUCED ? 1 : 1 + 0.05 * Math.sin(t * 5);
    ctx.scale(pulse, pulse);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    var s = 7;
    ctx.beginPath();
    ctx.moveTo(s * 2.1, 0);
    ctx.bezierCurveTo(s * 1.4, -s * 0.18, s * 0.3, -s * 0.22, -s * 0.5, -s * 0.1);
    ctx.lineTo(-s * 1.0, 0);
    ctx.bezierCurveTo(-s * 0.5, s * 0.1, s * 0.3, s * 0.22, s * 1.4, s * 0.18);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(s * 0.2, -s * 0.1); ctx.lineTo(-s * 0.15, -s * 1.05);
    ctx.lineTo(-s * 0.55, -s * 0.95); ctx.lineTo(-s * 0.45, -s * 0.1);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(s * 0.2, s * 0.1); ctx.lineTo(-s * 0.15, s * 1.05);
    ctx.lineTo(-s * 0.55, s * 0.95); ctx.lineTo(-s * 0.45, s * 0.1);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-s * 0.55, 0); ctx.lineTo(-s * 0.95, -s * 0.48);
    ctx.lineTo(-s * 1.05, -s * 0.44); ctx.lineTo(-s * 1.05, 0);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1; ctx.restore();
  }

  function drawFlowParticles() {
    if (REDUCED) return;
    for (var i = 0; i < flowParticles.length; i++) {
      var fp = flowParticles[i];
      if (fp.segIdx >= activeIdx) continue;
      var seg = segs[fp.segIdx];
      var pathT = fp.segIdx === activeIdx - 1 ? flightPathT(seg.animT) : 1;
      fp.t += fp.speed;
      if (fp.t > pathT) fp.t = 0;
      var pt = pathPoint(seg.pts, fp.t);
      var c = w2c(pt.x, pt.y);
      if (c.x < -4 || c.x > W + 4 || c.y < -4 || c.y > H + 4) continue;
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = 'rgba(255,170,140,1)';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = 'rgba(255,215,195,1)';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawMarkers() {
    for (var i = 0; i <= activeIdx && i < journey.length; i++) {
      var jpt = journey[i];
      var c = w2c(wx(jpt.lng), wy(jpt.lat));
      var isActive = (i === activeIdx);
      var col = jpt.country === 'United Kingdom' ? '#4361ee' : '#F13024';
      var mk = markers[i];

      ctx.globalAlpha = 0.08; ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(c.x, c.y, 18, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;

      if (mk.rippleT >= 0 && mk.rippleT < 1) {
        for (var rr = 0; rr < 2; rr++) {
          var rOff = rr * 0.4;
          var rt = Math.min(1, (mk.rippleT - rOff) * 1.5);
          if (rt > 0) {
            ctx.globalAlpha = (1 - rt) * 0.6;
            ctx.strokeStyle = col; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(c.x, c.y, 8 + rt * 28, 0, Math.PI * 2); ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }

      if (isActive) {
        var pulse = (Math.sin(tick * 0.07) + 1) / 2;
        ctx.globalAlpha = 0.12 + pulse * 0.08;
        ctx.strokeStyle = col; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(c.x, c.y, 12 + pulse * 7, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(c.x, c.y, isActive ? 5 : 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.beginPath(); ctx.arc(c.x, c.y, 2, 0, Math.PI * 2); ctx.fill();
    }
  }

  /* ============================================================
     MAIN LOOP
  ============================================================ */
  function draw() {
    if (typeof activeStoryId !== 'undefined' && activeStoryId !== 'travel') {
      rafPending = false; return;
    }
    requestAnimationFrame(draw);
    t += 0.016; tick++;

    cur.cx += (tgt.cx - cur.cx) * 0.04;
    cur.cy += (tgt.cy - cur.cy) * 0.04;
    cur.z  += (tgt.z  - cur.z ) * 0.04;

    if (activeIdx > 0 && activeIdx <= segs.length) {
      var seg = segs[activeIdx - 1];
      if (seg.animT < 1) seg.animT = Math.min(1, seg.animT + ANIM_SPEED);
      if (seg.animT >= 1 && !markers[activeIdx].landed) {
        markers[activeIdx].landed = true;
        markers[activeIdx].rippleT = 0;
      }
    }

    for (var mi = 0; mi < markers.length; mi++) {
      if (markers[mi].rippleT >= 0 && markers[mi].rippleT < 1) markers[mi].rippleT += 0.012;
    }

    drawBackground();
    drawStars();
    drawGrid();
    drawDots();
    drawOutlines();
    drawCompletedRoutes();
    drawActiveRoute();
    drawFlowParticles();
    drawMarkers();
  }

  /* ── setActive ──────────────────────────────────────────── */
  function setActive(idx) {
    idx = Math.max(0, Math.min(journey.length - 1, idx));
    if (idx === activeIdx) return;
    activeIdx = idx;
    if (idx > 0 && segs[idx - 1]) segs[idx - 1].animT = 0;
    var cam = getCameraTarget(idx);
    tgt.cx = cam.cx; tgt.cy = cam.cy; tgt.z = cam.z;
    var j = journey[idx], el;
    if ((el = document.getElementById('map-flag'))) el.textContent = j.flag;
    if ((el = document.getElementById('map-date'))) el.textContent = j.date + ' · ' + j.country;
    if ((el = document.getElementById('map-city'))) el.textContent = j.city;
    document.querySelectorAll('.jcard').forEach(function (card) {
      card.classList.toggle('active', parseInt(card.dataset.idx, 10) === idx);
    });
  }

  /* ── Scroll detection ───────────────────────────────────── */
  var _lastScroll = 0;
  window.addEventListener('scroll', function () {
    var now = Date.now();
    if (now - _lastScroll < 30) return;
    _lastScroll = now;
    if (typeof activeStoryId !== 'undefined' && activeStoryId !== 'travel') return;
    /* Activation point: centre of the card area. On mobile the map is pinned
       at the top, so centre within the space below it instead. */
    var mid = window.innerHeight * 0.5;
    var mapEl = document.querySelector('.j-map');
    if (mapEl && window.innerWidth <= 768) {
      var mr = mapEl.getBoundingClientRect();
      if (mr.bottom > 0 && mr.bottom < window.innerHeight * 0.8) {
        mid = mr.bottom + (window.innerHeight - mr.bottom) * 0.5;
      }
    }
    var best = -1, bestD = Infinity;
    document.querySelectorAll('.jcard').forEach(function (card) {
      var r = card.getBoundingClientRect();
      var d = Math.abs(r.top + r.height * 0.5 - mid);
      if (d < bestD) { bestD = d; best = parseInt(card.dataset.idx, 10); }
    });
    if (best >= 0) setActive(best);
  }, { passive: true });

  /* ── Public API ─────────────────────────────────────────── */
  window._startMapDraw = function () {
    rafPending = true;
    requestAnimationFrame(draw);
  };

  setTimeout(function () {
    var first = document.querySelector('.jcard[data-idx="0"]');
    if (first) first.classList.add('active');
    var j0 = journey[0], el;
    if ((el = document.getElementById('map-flag'))) el.textContent = j0.flag;
    if ((el = document.getElementById('map-date'))) el.textContent = j0.date + ' · ' + j0.country;
    if ((el = document.getElementById('map-city'))) el.textContent = j0.city;
  }, 80);

  if (typeof activeStoryId !== 'undefined' && activeStoryId === 'travel') {
    window._startMapDraw();
  }

})();
