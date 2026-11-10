/* ============================================================
   stories.js — Configure story chapters here.

   Rules:
   • enabled: false  → hidden completely, pill won't appear
   • default: true   → this story shows on page load
   • If no default:true, the first enabled story wins
   • "travel" type always reads from DATA.journey in data.js
   ============================================================ */

var STORIES = [

  /* ── Travel Journey ────────────────────────────────────── */
  {
    id:       "travel",
    enabled:  true,
    default:  true,
    label:    "Travel",
    icon:     "🌍",
    accent:   "#F13024",
    type:     "map-journey",
    sectionLabel: "A Life in Motion",
    title:    "From Bhilai to the World."
  },

  /* ── School Journey ─────────────────────────────────────── */
  {
    id:       "school",
    enabled:  true,
    default:  false,           
    label:    "Schools",
    icon:     "🎓",
    accent:   "#4361ee",
    type:     "path-timeline",
    sectionLabel: "The Learning Path",
    title:    "Nine Schools. Two Countries.",
    items: [
      {
        year:     "2017",
        name:     "Happy Tree Nursery",
        location: "London, United Kingdom",
        flag:     "🇬🇧",
        logo:     "assets/schools/01_happy_tree.jpg",
        note:     "First steps in London. First friends. First everything."
      },
      {
        year:     "2017",
        name:     "Infant Jesus Convent ISC School",
        location: "Thiruvananthapuram, India",
        flag:     "🇮🇳",
        logo:     "assets/schools/02_infant.jpg",
        note:     "Roots and rhythms. India left a mark that never faded."
      },
      {
        year:     "2018",
        name:     "Kinderland Pre School",
        location: "Vakkom, India",
        flag:     "🇮🇳",
        logo:     "assets/schools/03_kinderland.jpg",
        note:     "Backwaters breeze and the first sounds of learning."
      },
      {
        year:     "2018",
        name:     "Elmwood Infant School",
        location: "London, United Kingdom",
        flag:     "🇬🇧",
        logo:     "assets/schools/04_elmwood.jpg",
        note:     "London chapters deepen. Rain, wonder, and curiosity."
      },
      {
        year:     "2019",
        name:     "Chestnut Park Primary School",
        location: "London, United Kingdom",
        flag:     "🇬🇧",
        logo:     "assets/schools/05_chestnut.jpg",
        note:     "Finding the stride — cricket, class, and growing confidence."
      },
      {
        year:     "2022",
        name:     "Quest Primary School",
        location: "London, United Kingdom",
        flag:     "🇬🇧",
        logo:     "assets/schools/06_quest.jpg",
        note:     "Bigger school. Bigger ambitions. The hunger sharpens."
      },
      {
        year:     "2023",
        name:     "Applegarth Academy",
        location: "London, United Kingdom",
        flag:     "🇬🇧",
        logo:     "assets/schools/07_appleGarth.jpg",
        note:     "DevNation was born here. The creator inside wakes up."
      },
      {
        year:     "2023",
        name:     "Forestdale Primary School",
        location: "London, United Kingdom",
        flag:     "🇬🇧",
        logo:     "assets/schools/08_forestdale.jpg",
        note:     "Seasons of growth — goals, wickets, and moments to remember."
      },
      {
        year:     "2025",
        name:     "Wallington County Grammar School",
        location: "London, United Kingdom",
        flag:     "🇬🇧",
        logo:     "assets/schools/09_wcgs.jpg",
        note:     "The dream school. Earned. Selected. Proud. Still writing this chapter."
      }
    ]
  },

  /* ── Honours Board ──────────────────────────────────────── */
  {
    id:       "achievements",
    enabled:  true,
    default:  false,
    label:    "Honours",
    icon:     "🏆",
    accent:   "#e68e2e",
    type:     "trophy-wall",
    sectionLabel: "Honours Board",
    title:    "Every Win Tells a Story."
  },

  /* ── Journal — posts live in posts.js ───────────────────── */
  {
    id:       "journal",
    enabled:  true,
    default:  false,
    label:    "Journal",
    icon:     "✍️",
    accent:   "#2EC4A6",
    type:     "journal",
    sectionLabel: "The Journal",
    title:    "Books. Videos. Thoughts."
  }

];
