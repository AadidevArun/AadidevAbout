/* ============================================================
   data.js — Edit this file to update the portfolio content.
   No HTML knowledge needed. Save the file and refresh the browser.
   ============================================================ */

var DATA = {

  /* ── Personal ───────────────────────────────────────────── */
  name:    { first: "Aadidev", last: "Arun" },
  tagline: "Cricketer. Footballer. Creator.",
  bio:     "13-year-old YouTuber, cricketer and content creator from two countries. I've lived in India and England, explored Scotland too — and I bring all of it to DevNation.",
  youtube: { label: "DevNation", url: "https://www.youtube.com/@aadidev.arunIS09" },
  instagram: { label: "Instagram", url: "#" },
  tiktok:    { label: "TikTok",    url: "#" },

  /* ── Stats ──────────────────────────────────────────────── */
  stats: [
    { num: 412,  suffix: "+", label: "Subscribers" },
    { num: 27,   suffix: "",  label: "Videos"      },
    { num: 1380, suffix: "+", label: "Views"        },
    { num: 7,    suffix: "",  label: "Seasons"      }
  ],

  /* ── Journey ─────────────────────────────────────────────
     lat/lng are used to place dots on the world map.
     Keep them accurate.
  ─────────────────────────────────────────────────────────── */
  journey: [
    {
      date:    "Sep 2013",
      city:    "Bhilai",
      country: "India",
      flag:    "🇮🇳",
      lat:     21.21,
      lng:     81.38,
      headline: "Born in Bhilai.",
      story:   "The steel city of Chhattisgarh. Where it all began. The first heartbeat, the first breath — India."
    },
    {
      date:    "Dec 2013",
      city:    "Vakkom, Kerala",
      country: "India",
      flag:    "🇮🇳",
      lat:     8.57,
      lng:     76.72,
      headline: "The backwaters chapter.",
      story:   "Kerala. Coconut trees, backwaters, and a boy barely three months old. The south had a different rhythm."
    },
    {
      date:    "Apr 2014",
      city:    "London",
      country: "United Kingdom",
      flag:    "🇬🇧",
      lat:     51.51,
      lng:     -0.12,
      headline: "First flight to London.",
      story:   "Rain, double-deckers and a whole new world. The UK chapter begins. Cricket obsession meets Premier League fever."
    },
    {
      date:    "Jul 2015",
      city:    "India",
      country: "India",
      flag:    "🇮🇳",
      lat:     20.59,
      lng:     78.96,
      headline: "Back to roots.",
      story:   "India called again. The heat, the colour, the cricket on every street corner. Home is always home."
    },
    {
      date:    "Sep 2015",
      city:    "United Kingdom",
      country: "United Kingdom",
      flag:    "🇬🇧",
      lat:     52.36,
      lng:     -1.17,
      headline: "UK — the return.",
      story:   "Second time crossing the sky. The UK felt more familiar now. Settling in, making sense of two worlds."
    },
    {
      date:    "May 2016",
      city:    "Scotland",
      country: "United Kingdom",
      flag:    "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
      lat:     56.49,
      lng:     -4.20,
      headline: "The highlands call.",
      story:   "Scotland. Mountains, misty mornings and some of the most beautiful landscapes on earth. A different kind of magic."
    },
    {
      date:    "Mar 2017",
      city:    "India",
      country: "India",
      flag:    "🇮🇳",
      lat:     8.57,
      lng:     76.72,
      headline: "India, one more time.",
      story:   "Cricket season. Back to India, bat in hand, ready to play. Every trip home sharpens the hunger."
    },
    {
      date:    "Sep 2018",
      city:    "United Kingdom",
      country: "United Kingdom",
      flag:    "🇬🇧",
      lat:     51.51,
      lng:     -0.12,
      headline: "Home base. For now.",
      story:   "UK. This time it stuck. Cricket, football, music — all happening here. This is the chapter being written right now."
    }
  ],

  /* ── Passions ─────────────────────────────────────────────*/
  passions: [
    {
      id:    "cricket",
      label: "Cricket",
      color: "#e63946",
      icon:  "🏏",
      headline: "Cricket runs in my veins.",
      body: "Opening batsman, 7 seasons deep. Every cover drive, every yorker, every run-out — I live for this game.",
      items: [
        { title: "Favourite Player",   text: "Sanju Samson — the captain, the keeper, the match-winner." },
        { title: "Rising Star",        text: "Vaibhav Suryavanshi — 14 years old and already a legend." },
        { title: "My Dream XI",        text: "Rohit · Vaibhav · Virat · Samson · Hardik · Jadeja · Ashwin · Bumrah · Siraj · Kuldeep · Arshdeep" },
        { title: "DevNation Cricket",  text: "Match reviews, player analyses, prediction videos — cricket through a 13-year-old's honest eyes." }
      ]
    },
    {
      id:    "football",
      label: "Football",
      color: "#4361ee",
      icon:  "⚽",
      headline: "Three Lions. Always.",
      body: "England through and through. 24 goals, 19 assists, 41 matches. The game never stops teaching me.",
      items: [
        { title: "Club",              text: "England national team — every tournament, every match, full belief." },
        { title: "My Stats",          text: "24 goals · 19 assists · 41 matches · 4-3-3 formation" },
        { title: "Style of Play",     text: "Always looking for goal. Press high, win back fast." },
        { title: "Role Model",        text: "Players who play with passion, not just talent." }
      ]
    },
    {
      id:    "music",
      label: "Music",
      color: "#7209b7",
      icon:  "🎵",
      headline: "Music is my third language.",
      body: "Six7 on repeat. Music before every match, after every innings. It's the soundtrack to everything.",
      items: [
        { title: "Favourite Group",    text: "Six7 — the sound, the harmonies. Permanently on repeat." },
        { title: "Match Day Playlist", text: "Pump-up bangers only. The right music changes the whole game." },
        { title: "DevNation Sessions", text: "Music reactions, reviews and the songs that soundtrack my life — all on the channel." },
        { title: "Instruments",        text: "Learning, growing, listening. Music is a journey, not a destination." }
      ]
    }
  ],

  /* ── Honours Board ───────────────────────────────────────
     Add items here. Fields:
       id       – unique string, no spaces
       category – cricket | football | youtube | academic | certification | community
       badge    – emoji shown on card when no image
       title    – short award name
       tagline  – one-line subtitle on the card
       date     – display date string
       image    – path to image (leave '' for placeholder gradient)
       description – 2–3 sentences for the card back / detail intro
       detail   – longer text shown in the detail overlay
       featured – true = larger card in the grid
  ─────────────────────────────────────────────────────────── */
  honours: [

    /* ── Cricket ──────────────────────────────────────────── */
    {
      id:          "cricket-best-bat",
      category:    "cricket",
      badge:       "🏏",
      title:       "Best Batsman Award",
      tagline:     "Top scorer of the season",
      date:        "Summer 2023",
      image:       "",
      description: "Recognised as the leading run-scorer across the entire season, maintaining a consistent average through 14 competitive matches.",
      detail:      "Awarded at the end-of-season presentation night. The award recognised consistent top-order batting through a challenging season that included rain delays, tough pitches, and some of the best bowling attacks in the league. Every innings was a lesson in patience and precision.",
      featured:    true
    },
    {
      id:          "cricket-motm",
      category:    "cricket",
      badge:       "⭐",
      title:       "Player of the Match",
      tagline:     "Match-winning performance",
      date:        "Aug 2023",
      image:       "",
      description: "Awarded for a decisive innings that turned the game around in the final overs — a display of nerve, technique, and pure cricketing instinct.",
      detail:      "The match was finely balanced going into the last 4 overs. A partnership-breaking innings and a run-out sealed the victory. Voted Man of the Match by the opposing team captain. One of the most memorable performances of the season.",
      featured:    false
    },
    {
      id:          "cricket-7seasons",
      category:    "cricket",
      badge:       "🏆",
      title:       "7 Seasons Certificate",
      tagline:     "Seven consecutive seasons recognised",
      date:        "2024",
      image:       "",
      description: "A certificate of outstanding commitment — seven unbroken seasons of competitive cricket from age 6. Dedication, rain or shine.",
      detail:      "Seven seasons. Dozens of matches. Representing clubs across India and the United Kingdom. The certificate was presented at the annual club awards, recognising long-term commitment and love for the sport. Started at age 6, still going strong.",
      featured:    true
    },
    {
      id:          "cricket-fielding",
      category:    "cricket",
      badge:       "🥉",
      title:       "Best Fielder Trophy",
      tagline:     "Agility, reflexes, and three run-outs",
      date:        "2022",
      image:       "",
      description: "Three direct-hit run-outs and a spectacular boundary catch earned this award from coaches and teammates alike.",
      detail:      "Fielding is the area of the game that requires the most discipline — it never switches off. The trophy recognised consistent pressure in the field, quick ground-fielding, and three direct-hit run-outs that changed match momentum.",
      featured:    false
    },

    /* ── Football ─────────────────────────────────────────── */
    {
      id:          "football-topscorer",
      category:    "football",
      badge:       "⚽",
      title:       "Top Goal Scorer",
      tagline:     "24 goals across 41 matches",
      date:        "2023–24",
      image:       "",
      description: "24 goals and 19 assists across 41 matches. Playing in a 4-3-3, every match was an opportunity to create and finish.",
      detail:      "Goals came in all forms — headers, tap-ins, long-range strikes, and penalties. The 19 assists are the number that matters most: creating chances for teammates is as important as scoring. One of the most consistent goal-scoring seasons at this level.",
      featured:    false
    },
    {
      id:          "football-gold-medal",
      category:    "football",
      badge:       "🥇",
      title:       "Tournament Gold Medal",
      tagline:     "Winners — inter-school tournament",
      date:        "Spring 2024",
      image:       "",
      description: "A winners' medal from the inter-school football tournament. Five matches, five clean sheets in the knockout stages. Champions.",
      detail:      "The tournament brought together 12 schools. The team's defensive record in the knockouts was remarkable: five consecutive clean sheets. The final was decided by a penalty shootout — nerves of steel required. Gold medal well earned.",
      featured:    false
    },

    /* ── YouTube / DevNation ──────────────────────────────── */
    {
      id:          "yt-400-subs",
      category:    "youtube",
      badge:       "▶",
      title:       "400+ Subscribers",
      tagline:     "DevNation community milestone",
      date:        "2024",
      image:       "",
      description: "DevNation crossed 400 subscribers — a community of cricket fans, football supporters, and content lovers who keep coming back.",
      detail:      "Started with zero. No algorithm hacks, no paid promotion. Just consistent uploads, honest opinions, and genuine passion for cricket and football. 400 feels like 4 million when you know every single person chose to subscribe. The journey continues.",
      featured:    true
    },
    {
      id:          "yt-1k-views",
      category:    "youtube",
      badge:       "🎬",
      title:       "1,380+ Total Views",
      tagline:     "Cumulative views across 27 videos",
      date:        "2024",
      image:       "",
      description: "Crossing 1,380 views across 27 videos. Every view is someone who chose to spend their time watching DevNation content.",
      detail:      "The top-performing video was a cricket match review. Reaction videos on IPL moments and player analysis consistently drive the most engagement. The audience is global — views from India, the UK, UAE, and Australia. 27 videos and counting.",
      featured:    false
    },

    /* ── Academic ─────────────────────────────────────────── */
    {
      id:          "grammar-school",
      category:    "academic",
      badge:       "🎓",
      title:       "Grammar School Selection",
      tagline:     "Wallington County Grammar School",
      date:        "2025",
      image:       "",
      description: "Selected for one of the UK's top grammar schools through competitive entrance examination — years of hard work across three countries.",
      detail:      "Wallington County Grammar School is consistently ranked among the top secondary schools in England. The 11+ entrance exam tests verbal reasoning, non-verbal reasoning, and mathematics at a high level. Selected from hundreds of applicants. A milestone that marks the start of a new chapter.",
      featured:    true
    },

    /* ── Certification ────────────────────────────────────── */
    {
      id:          "coding-cert",
      category:    "certification",
      badge:       "💻",
      title:       "Coding Certificate",
      tagline:     "Intro to programming — distinction",
      date:        "2023",
      image:       "",
      description: "Completed a structured introduction to programming covering logic, algorithms, and problem solving — passed with distinction.",
      detail:      "The course covered HTML basics, block-based programming, and introductory Python. Completed all modules and passed the final assessment with distinction. The first step into the world of tech — and definitely not the last.",
      featured:    false
    },

    /* ── Community ────────────────────────────────────────── */
    {
      id:          "community-spirit",
      category:    "community",
      badge:       "🌟",
      title:       "Community Spirit Award",
      tagline:     "Sportsmanship & leadership recognised",
      date:        "2023",
      image:       "",
      description: "Awarded by coaches and teammates for exceptional sportsmanship, positive attitude, and leadership both on and off the pitch.",
      detail:      "The award is voted for by peers and coaches at the end of the season. It recognises the player who best embodies the values of the club: respect, effort, and encouragement of others. Winning this one means more than any trophy, because it comes from the people you play alongside every week.",
      featured:    false
    }

  ],

  /* ── Contact ─────────────────────────────────────────────*/
  guestbook_key: "aadidev-gb-final-v1"
};
