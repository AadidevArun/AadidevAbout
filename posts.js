/* ============================================================
   posts.js — Aadidev's Journal.

   HOW TO ADD A POST (takes 2 minutes):
   1. Copy one of the blocks below (from { to },)
   2. Paste it at the TOP of the list (newest first)
   3. Fill in your own words
   4. Save → commit → push. The website updates itself!

   FIELDS:
   • id      – short-unique-name-with-dashes (used in the share link)
   • type    – "book" | "video" | "note"
   • title   – shown big on the card
   • date    – e.g. "Jul 2026"
   • rating  – 1 to 5 stars (books only, remove line if none)
   • youtube – the YouTube video ID, the part after watch?v=
               (videos only)
   • cover   – path to an image, e.g. "assets/journal/mybook.jpg"
               (optional — videos get their thumbnail automatically)
   • summary – one short line for the card
   • body    – your full review/story. Each "..." is one paragraph.
   ============================================================ */

var POSTS = [

  {
    id:      "diary-of-a-wimpy-kid-review",
    type:    "book",
    title:   "Diary of a Wimpy Kid — worth the hype?",
    date:    "Jul 2026",
    rating:  4,
    cover:   "",
    summary: "Greg Heffley is basically me on a school day. Almost.",
    body: [
      "I finished this book in two days. TWO DAYS. That never happens with school books, so that tells you something.",
      "The best part is that Greg feels like a real kid — he makes bad choices, blames Rowley, and somehow you still want him to win. The cheese touch chapter had me laughing out loud on the bus.",
      "Why not 5 stars? The ending felt a bit rushed, and I wanted more cricket in it (okay, there is no cricket in it, but there should be).",
      "Read it if: you like funny books, comics mixed with text, and stories about surviving school. Skip it if: you only like serious adventure books."
    ]
  },

  {
    id:      "my-first-cricket-vlog",
    type:    "note" ,
    title:   "Match-day vlog: my first 50!",
    date:    "Jun 2026",
    summary: "Behind the scenes of the innings I will never forget.",
    body: [
      "This is the video I was most nervous to upload — it's the full story of my first fifty, from the morning nerves to the last ball.",
      "I filmed the warm-up, the toss, and dad's reaction from the boundary (turn the volume down for that part).",
      "If you watch one video on my channel, make it this one. And subscribe if you want the next milestone video — working on it already!"
    ]
  },

  {
    id:      "welcome-to-my-journal",
    type:    "note",
    title:   "Welcome to my Journal",
    date:    "Jun 2026",
    summary: "What this page is, and what's coming next.",
    body: [
      "This is my new corner of the site — book reviews, video breakdowns, match stories, and whatever else I'm into that week.",
      "I read a lot and I film a lot, so instead of those thoughts disappearing, they'll live here.",
      "Coming soon: my top 5 cricket books, and a review of the video that took me three weekends to edit."
    ]
  }

];
