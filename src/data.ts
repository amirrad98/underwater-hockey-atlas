import { importedArticles, importedResources, importedPlaces } from "./research-data";
export interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  sections: { heading: string; body: string }[];
  sourceIds: string[];
  related: string[];
}
export interface Resource { version?: string; rights?: string; jurisdiction?: string; sourceRecords?: Record<string, unknown>[];
  id: string;
  title: string;
  url: string;
  publisher: string;
  topic: string;
  language: string;
  audience: string;
  authority: string;
  access: string;
  status: string;
  date: string;
  note: string;
}
export interface Place { sourceIds?: string[]; metadata?: Record<string, unknown>;
  id: string;
  name: string;
  country: string;
  region: string;
  lat: number | null;
  lon: number | null;
  precision: string;
  description: string;
  url: string;
}

const starterResources: Resource[] = [
  {
    id: "cmas",
    title: "CMAS underwater hockey hub",
    url: "https://www.cmas.org/hockey.html",
    publisher: "CMAS",
    topic: "World",
    language: "English",
    audience: "Everyone",
    authority: "International federation",
    access: "Public",
    status: "Checked",
    date: "2026-10-02",
    note: "Official starting point for international events, news and regulations. Landing page checked; linked documents are separate records.",
  },
  {
    id: "rules",
    title: "Rules of Play · V13 index",
    url: "https://www.gbuwh.co.uk/page/uwh-rules",
    publisher: "British Octopush Association",
    topic: "Rules",
    language: "English",
    audience: "Players & referees",
    authority: "National organization",
    access: "Public",
    status: "Checked",
    date: "2025-02-27",
    note: "Index checked 2 Oct 2026. Lists Rules of Play V13, referee signals, penalties and separate tournament regulations. The linked PDF was not fully audited in this prototype.",
  },
  {
    id: "cmas-overview",
    title: "CMAS introduction & regulations gateway",
    url: "https://www.cmas.org/hockey/how-to-regulations.html",
    publisher: "CMAS",
    topic: "Rules",
    language: "English",
    audience: "Beginners",
    authority: "International federation",
    access: "Public",
    status: "Checked",
    date: "2026-10-02",
    note: "Introductory overview, not a substitute for versioned rules. Its summarized playing-area dimensions must not be treated as a complete facility specification.",
  },
  {
    id: "australia-faq",
    title: "Your first questions, answered",
    url: "https://underwaterhockeyaustralia.org.au/faq.html",
    publisher: "Underwater Hockey Australia",
    topic: "Getting started",
    language: "English",
    audience: "Beginners",
    authority: "National organization",
    access: "Public",
    status: "Checked",
    date: "2026-10-02",
    note: "Accessible introduction to joining, swimming confidence and equipment. Confirm loan gear and session arrangements with the actual club.",
  },
  {
    id: "chicago-equipment",
    title: "Equipment: a club perspective",
    url: "https://www.chicagounderwaterhockey.us/resources/equipment/",
    publisher: "Chicago Underwater Hockey",
    topic: "Equipment",
    language: "English",
    audience: "Beginners",
    authority: "Club guidance",
    access: "Public",
    status: "Checked",
    date: "2026-10-02",
    note: "Explains local loan kit and gear choices. Local practice, product preferences and modifications are not universal competition requirements.",
  },
  {
    id: "chicago-drills",
    title: "Puckwork video collection",
    url: "https://www.chicagounderwaterhockey.us/drills/",
    publisher: "Chicago Underwater Hockey",
    topic: "Skills",
    language: "English",
    audience: "Players & coaches",
    authority: "Club guidance",
    access: "Public",
    status: "Checked",
    date: "2026-10-02",
    note: "Index of curls, push-pull, figure patterns and flick tutorials. Index checked; individual videos have not all been reviewed. Use supervised coaching for in-water practice.",
  },
  {
    id: "boa-welfare",
    title: "Safeguarding & welfare resources",
    url: "https://www.gbuwh.co.uk/page/safeguarding-welfare",
    publisher: "British Octopush Association",
    topic: "Safety",
    language: "English",
    audience: "Players & coaches",
    authority: "National organization",
    access: "Public",
    status: "Checked",
    date: "2026-05-19",
    note: "UK-specific entry point for safeguarding, conduct, risk assessments and concussion guidance. Page checked 2 Oct 2026; each linked policy needs its own version review.",
  },
  {
    id: "boa-history",
    title: "History of underwater hockey & the BOA",
    url: "https://www.gbuwh.co.uk/page/history-uwh-boa",
    publisher: "British Octopush Association",
    topic: "History",
    language: "English",
    audience: "Everyone",
    authority: "National organization",
    access: "Public",
    status: "Historical",
    date: "2020-03-16",
    note: "Historical recollections including Alan Blake and Cliff Underwood. Index checked 2 Oct 2026; distinguish firsthand recollection from a comprehensive international history.",
  },
  {
    id: "boa-clubs",
    title: "Find a UK club",
    url: "https://www.gbuwh.co.uk/clubs",
    publisher: "British Octopush Association",
    topic: "World",
    language: "English",
    audience: "Everyone",
    authority: "National organization",
    access: "Public",
    status: "Checked",
    date: "2026-10-02",
    note: "Registered-club directory with regional navigation. Session times and eligibility should be confirmed before travelling.",
  },
  {
    id: "nz-clubs",
    title: "New Zealand club directory",
    url: "https://www.underwaterhockeynz.com/play-uwh/uwh-clubs",
    publisher: "Underwater Hockey New Zealand",
    topic: "World",
    language: "English",
    audience: "Everyone",
    authority: "National organization",
    access: "Public",
    status: "Indexed",
    date: "2026-10-02",
    note: "Official club-finding entry point found in search. Individual club records and venues have not been checked here.",
  },
  {
    id: "nz-events",
    title: "New Zealand competition pathways",
    url: "https://www.underwaterhockeynz.com/events-1/tournaments-2",
    publisher: "Underwater Hockey New Zealand",
    topic: "World",
    language: "English",
    audience: "Players & coaches",
    authority: "National organization",
    access: "Public",
    status: "Indexed",
    date: "2026-10-02",
    note: "National overview of school, club, regional and international pathways. Search-indexed; current individual event details need confirmation.",
  },
  {
    id: "usoa",
    title: "US underwater hockey introduction",
    url: "https://www.underwater-society.org/uwh",
    publisher: "Underwater Society of America",
    topic: "Getting started",
    language: "English",
    audience: "Beginners",
    authority: "National organization",
    access: "Public",
    status: "Indexed",
    date: "2026-10-02",
    note: "Search-indexed sport introduction; direct page retrieval failed during this build. Do not imply all linked material has been checked.",
  },
  {
    id: "canada",
    title: "Canadian Underwater Games Association",
    url: "https://www.cuga.org/",
    publisher: "CUGA",
    topic: "World",
    language: "English",
    audience: "Everyone",
    authority: "National organization",
    access: "Public",
    status: "Indexed",
    date: "2026-10-02",
    note: "Canadian organization entry point supplied in project research context. Direct retrieval failed; older Prince George schedule information is not used as current.",
  },
  {
    id: "brisbane-equipment",
    title: "Personal equipment guide",
    url: "https://www.brisbaneuwh.com.au/blog/what-personal-equipment-do-you-need-to-play-underwater-hockey/",
    publisher: "Brisbane Barracudas",
    topic: "Equipment",
    language: "English",
    audience: "Beginners",
    authority: "Club guidance",
    access: "Public",
    status: "Indexed",
    date: "2026-10-02",
    note: "Search-indexed club guide covering mouth and ear protection. Equipment commentary is local guidance; check current event rules before buying.",
  },
  {
    id: "timber-notes",
    title: "Timber Whales · supplied research notes",
    url: "#/wiki/timber-whales",
    publisher: "Project research handoff",
    topic: "Clubs",
    language: "English",
    audience: "Everyone",
    authority: "Supplied research",
    access: "Source pending",
    status: "Supplied",
    date: "2026-09-12",
    note: "User-supplied field-level findings report a 12 Sep 2026 Instagram fall schedule. Original post URL and 21-source catalog are pending Library import; not independently checked in this build.",
  },
];

const starterArticles: Article[] = [
  {
    id: "start-here",
    title: "A whole game beneath the surface",
    category: "Getting started",
    summary:
      "A weighted puck, a short stick, and a team that moves in three dimensions.",
    sourceIds: ["cmas-overview", "usoa"],
    related: ["first-session", "equipment", "rules"],
    sections: [
      {
        heading: "Follow the puck",
        body: "Underwater hockey is played along a swimming-pool floor. Players use short sticks to move a weighted puck toward the opposing goal, returning to the surface to breathe. The surface and the floor are both part of the experience: looking down helps you follow play while teammates continue the move below.",
      },
      {
        heading: "Watch the team, too",
        body: "For a first viewing, choose one simple question: where can the player with the puck go next? Look for a teammate nearby and space beyond the immediate contest. This is an editorial viewing exercise, not a rule or a prescribed team system.",
      },
      {
        heading: "Find your way through the atlas",
        body: "Begin with a supervised first session, learn the equipment, then use the rules reference to understand what is allowed. The skill and formation pages offer conceptual ways to discuss play with a coach. Every article connects back to its sources so you can distinguish official requirements from local teaching choices.",
      },
    ],
  },
  {
    id: "first-session",
    title: "Your first pool session",
    category: "Getting started",
    summary:
      "Arrive with questions. Leave knowing the kit, the signals and the people.",
    sourceIds: ["australia-faq", "boa-welfare"],
    related: ["safety", "equipment", "timber-whales"],
    sections: [
      {
        heading: "Before you go",
        body: "Contact the club to ask whether the session welcomes beginners, what swimming confidence they expect and which equipment can be borrowed. Underwater Hockey Australia describes confident swimming and comfort in deep water as the starting point; being an elite swimmer is not required. Local arrangements still matter.",
      },
      {
        heading: "A useful arrival checklist",
        body: "Ask the session leader to explain the playing area, stop signal, supervision arrangements and how to ask for help. Get the equipment fitted before joining play. Tell the leader that this is your first visit and ask for a suitable introduction. This checklist is an editorial prompt for a conversation with the club, not a substitute for its induction.",
      },
      {
        heading: "One achievable goal",
        body: "Make the first visit about understanding the environment and handling the equipment comfortably. Ask for feedback on one skill at a time. Membership, safeguarding, age requirements and health declarations vary by organization; check the local process instead of assuming another country’s policy applies.",
      },
    ],
  },
  {
    id: "rules",
    title: "Read the game, then read the rules",
    category: "Rules",
    summary:
      "Keep the official rulebook, tournament conditions and local practice clearly separated.",
    sourceIds: ["rules", "cmas-overview"],
    related: ["equipment", "formations", "safety"],
    sections: [
      {
        heading: "The version matters",
        body: "The BOA rules page lists Rules of Play V13 and was updated on 27 February 2025. The project’s supplied research identifies CMAS v13, February 2025, as the current listed edition. This prototype checked the index, not every clause in the PDF. Follow the versioned document and any applicable event bulletin when resolving a specific ruling.",
      },
      {
        heading: "Three different kinds of guidance",
        body: "Rules of play describe the game. Tournament regulations govern how an event is organized. A club may adapt a training exercise for its participants or pool. A useful question is therefore “Which document applies to this session?” rather than treating every piece of coaching advice as an international requirement.",
      },
      {
        heading: "Dimensions need their context",
        body: "Do not use an introductory webpage or this conceptual atlas to certify a playing area. The CMAS overview summarizes pool dimensions; the supplied research flags that summary as potentially misleading without the rulebook’s full context. Exact dimensions, depths, tolerances and equipment specifications require a clause-level check before publication here.",
      },
    ],
  },
  {
    id: "equipment",
    title: "A small kit with a specific purpose",
    category: "Equipment",
    summary:
      "Understand the mask, snorkel, fins, stick and protection before shopping.",
    sourceIds: ["chicago-equipment", "brisbane-equipment", "rules"],
    related: ["first-session", "puck-control", "safety"],
    sections: [
      {
        heading: "See, move, play",
        body: "A mask supports underwater vision; a snorkel is used at the surface; fins support movement. The short stick plays the puck. A protective glove covers the playing hand, while mouth protection and a cap with ear protection address vulnerable areas. Your club can help fit the kit and explain the applicable equipment rules.",
      },
      {
        heading: "Try before committing",
        body: "Chicago Underwater Hockey offers beginners club equipment and recommends trying different pieces before buying. Its page describes local preferences, including sticks and fins. Treat these as experience from a club, not a universal shopping list or an endorsement by this atlas.",
      },
      {
        heading: "A practical inspection",
        body: "Ask a coach to check fit, condition, sharp edges and suitability for the session. Avoid copying a modification merely because a player on a video uses it. When preparing for competition, compare your exact equipment against the applicable rulebook and organizer guidance.",
      },
    ],
  },
  {
    id: "puck-control",
    title: "Puck control: make the next touch easier",
    category: "Skills",
    summary: "Explore control, turns and changes of direction with a coach.",
    sourceIds: ["chicago-drills"],
    related: ["passing", "equipment", "formations"],
    sections: [
      {
        heading: "Build a vocabulary",
        body: "Chicago’s drill index includes standard and reverse curls, push-pull patterns, figure patterns and an introduction to the flick. These names offer a useful vocabulary for asking a coach what to demonstrate. Linked videos are a starting point for discussion; they have not all been reviewed by this atlas.",
      },
      {
        heading: "A conceptual progression",
        body: "Editorial learning prompt: begin by asking how to keep the puck in a useful position, then how to change direction, then how to choose a teammate. Ask your coach to demonstrate slowly and explain what they are watching. The goal of this progression is understanding, not a timed underwater challenge.",
      },
      {
        heading: "Notice the outcome",
        body: "After an attempt, ask whether the puck ended where you intended and whether your next action was available. A dramatic move is less useful if it leaves you without an option. Use the answer to choose the next thing to practise in the supervised session.",
      },
    ],
  },
  {
    id: "passing",
    title: "Passing: make a connection",
    category: "Skills",
    summary:
      "Think about the receiver, the route and what happens after the pass.",
    sourceIds: ["chicago-drills"],
    related: ["puck-control", "formations", "learning-path"],
    sections: [
      {
        heading: "A coaching conversation",
        body: "The questions here are original conceptual prompts, not official technique instructions. Where is your teammate? Is there an open route between you? What will they be able to do when the puck arrives? Discuss those questions at the surface before trying a coach-led activity.",
      },
      {
        heading: "Start with a shared intention",
        body: "Ask the coach to distinguish a controlled transfer along the floor from a lifted flick. Chicago’s resource index includes a flick introduction, but the index alone cannot establish safe technique or the right exercise for your group. Let the coach choose spacing and progression.",
      },
      {
        heading: "Keep watching after release",
        body: "A useful review question is whether the receiver had a playable next touch. When watching a match, pause mentally after each pass and notice whether the passing player creates another option. This observational exercise can help make teamwork visible without prescribing a single style.",
      },
    ],
  },
  {
    id: "formations",
    title: "Formations are a conversation about space",
    category: "Tactics",
    summary:
      "Read the 3–3 and 2–2–2 boards as conceptual arrangements, not fixed positions.",
    sourceIds: ["rules"],
    related: ["passing", "puck-control", "learning-path"],
    sections: [
      {
        heading: "What the diagrams mean",
        body: "The atlas diagrams are original schematic teaching aids. A 3–3 board groups six markers into two lines; a 2–2–2 board groups them into three. They are not a CMAS recommendation, a measured pool plan or a claim about how every team uses those names. Teams can define their roles differently.",
      },
      {
        heading: "Ask about relationships",
        body: "Use a board to discuss who supports the puck, who covers space behind the move and where an outlet could appear. Move one marker and ask which other player’s responsibility changes. The value is in the discussion with teammates, not in memorizing six dots.",
      },
      {
        heading: "A board cannot show everything",
        body: "A top-down drawing hides depth, surface recovery, substitutions and changing possession. Real play will not resemble a static diagram for long. Have a coach explain the local team’s language and review actual game situations before treating an arrangement as a system.",
      },
    ],
  },
  {
    id: "safety",
    title: "Good sessions begin with shared safety",
    category: "Safety",
    summary:
      "Supervision, clear stop signals, suitable equipment and a culture of speaking up.",
    sourceIds: ["boa-welfare", "australia-faq"],
    related: ["first-session", "equipment", "rules"],
    sections: [
      {
        heading: "Keep learning supervised",
        body: "Use organized, appropriately supervised sessions and follow the pool and club’s safety procedures. This atlas does not provide breath-hold training: do not practise underwater breath-holding alone, hyperventilate before submerging, or turn a drill into a maximum-duration contest. Ask the session leader how supervision and emergency response work before joining in.",
      },
      {
        heading: "Know the local process",
        body: "The BOA welfare page links safeguarding policies, codes of conduct, risk assessments and concussion guidance. These are UK organizational resources, not automatically the policy for a Canadian or Australian club. Ask your own organization where to report concerns and which participation requirements apply.",
      },
      {
        heading: "Speak up early",
        body: "Stop and tell the session leader if equipment is unsuitable, you feel unwell or you are uncomfortable with an activity. A webpage cannot assess an individual’s fitness to participate. Discuss health questions with an appropriate health professional and the club’s designated contact before participation.",
      },
    ],
  },
  {
    id: "history",
    title: "From a winter pool game to a wider world",
    category: "History",
    summary:
      "Begin with the people who described the early game in their own words.",
    sourceIds: ["boa-history", "cmas"],
    related: ["start-here", "world-guide", "timber-whales"],
    sections: [
      {
        heading: "Southsea, 1954",
        body: "The BOA history collection includes Alan Blake’s account of seeking a competitive pool activity as the 1954 summer diving season ended. It also collects Cliff Underwood’s recollection of the game spreading among diving clubs and the need for more consistent rules as clubs began playing one another.",
      },
      {
        heading: "Names carry history",
        body: "The BOA still uses Octopush alongside underwater hockey. Follow its historical accounts for the language and experiences of the early British game. These recollections are an entry point, not a complete history of every country’s participation.",
      },
      {
        heading: "An open research trail",
        body: "The next edition should add sourced national timelines, early clubs and competition milestones. Each dated event needs a traceable record. A club revival should be distinguished from its first founding, and an archived team listing should not be presented as evidence of current activity.",
      },
    ],
  },
  {
    id: "world-guide",
    title: "Find the community, then confirm the session",
    category: "World",
    summary:
      "National directories are useful doors into a sport built around local pools.",
    sourceIds: ["boa-clubs", "nz-clubs", "nz-events", "canada"],
    related: ["first-session", "timber-whales", "history"],
    sections: [
      {
        heading: "Start with the organization",
        body: "The BOA maintains a registered-club directory, while Underwater Hockey New Zealand offers a club-finding entry point. National indexes can help identify a relevant club, but the club itself is usually the next place to confirm a beginner session, venue and contact route.",
      },
      {
        heading: "Read the map honestly",
        body: "Map points preserve each catalog’s precision: some are city or suburb points, others are sourced venue points. National organizations and locations without verified coordinates remain unpinned. The list is a small editorial selection, not a census of the sport or a statement that unlisted countries have no underwater hockey.",
      },
      {
        heading: "Before travelling",
        body: "Confirm dates, local time, pool address, eligibility and whether visitors are welcome. Old directories can outlive pool bookings. The Timber Whales profile demonstrates why dated club updates and historical listings need different labels.",
      },
    ],
  },
  {
    id: "learning-path",
    title: "A route from curious to connected",
    category: "Getting started",
    summary: "Four stages for exploring the wiki alongside real club coaching.",
    sourceIds: ["australia-faq", "chicago-drills", "rules"],
    related: ["first-session", "puck-control", "formations"],
    sections: [
      {
        heading: "01 · Get oriented",
        body: "Read the sport introduction and first-session page. Find a club, ask about a beginner visit and learn its safety arrangements. This route is an editorial reading sequence rather than a formal qualification.",
      },
      {
        heading: "02 · Get comfortable",
        body: "Explore the equipment guide with the people who will help fit your kit. Ask the coach to choose one manageable skill. Use the puck-control vocabulary to describe what you are learning.",
      },
      {
        heading: "03 · Find a teammate",
        body: "Read passing and the conceptual formation guide. Ask how your club describes support, space and roles. Match the words to a demonstration or a piece of game footage.",
      },
      {
        heading: "04 · Build understanding",
        body: "Open the versioned rules gateway, watch a match and ask about a decision you did not understand. Return to the resource library as your questions become more specific. Progress is about understanding and participation, not a breath-hold target.",
      },
    ],
  },
  {
    id: "timber-whales",
    title: "UNBC Timber Whales",
    category: "Clubs",
    summary:
      "A Prince George club story: a revival, a pool community and a new chapter.",
    sourceIds: ["timber-notes", "canada"],
    related: ["first-session", "world-guide", "history"],
    sections: [
      {
        heading: "Fall 2026 · supplied schedule",
        body: "The supplied research notes report a club Instagram update dated 12 September 2026: Canfor Leisure Pool, Sundays 17:45–18:45 and Wednesdays 21:00–22:00, in Prince George local time. These findings were supplied by the project owner; the original post has not been independently retrieved in this build. Confirm with the club before attending.",
      },
      {
        heading: "A revival with earlier roots",
        body: "The supplied research records a revival in 2023 and an earlier team by 2009. These are separate milestones. Older CUGA listings naming Prince George Aquatic Centre and different times are historical and should not override the supplied fall 2026 update.",
      },
      {
        heading: "What remains unconfirmed",
        body: "Leadership changed in 2025, but 2026 leadership is unconfirmed. A public roster has 20 undated entries; it is not a verified current membership or officer list and names are intentionally omitted here. No identities are inferred from photographs.",
      },
      {
        heading: "The next useful update",
        body: "Recover the original 21-source club catalog, attach exact source URLs and verify current newcomer arrangements. Until then, this profile preserves the supplied distinctions and dates without representing its evidence as independently checked.",
      },
    ],
  },
];


/** Canonical URLs deduplicate registry records without losing source-specific evidence. */
export function canonicalSourceUrl(value: string): string {
  const url = new URL(value, 'https://atlas.local');
  url.protocol = 'https:';
  url.hostname = url.hostname.replace(/^www\./, '');
  url.hash = '';
  url.pathname = url.pathname.replace(/\/$/, '') || '/';
  if (url.hostname === 'cmas.org' && ['/hockey', '/hockey.html'].includes(url.pathname)) url.pathname = '/hockey';
  if (url.hostname === 'underwaterhockeynz.com') url.pathname = url.pathname.toLowerCase();
  for (const key of [...url.searchParams.keys()]) if (key.startsWith('utm_') || ['fbclid', 'img_index'].includes(key)) url.searchParams.delete(key);
  return url.href;
}
const importedByUrl = new Map(importedResources.map(source => [canonicalSourceUrl(source.url), source]));
const starterAliases = new Map(starterResources.map(source => [source.id, importedByUrl.get(canonicalSourceUrl(source.url))?.id ?? source.id]));
export const resources: Resource[] = [...importedResources, ...starterResources.filter(source => source.id !== 'timber-notes' && !importedByUrl.has(canonicalSourceUrl(source.url)))];
const importedIds = new Set(importedArticles.map(article => article.id));
export const articles: Article[] = [...starterArticles.filter(article => !importedIds.has(article.id)).map(article => ({ ...article, sourceIds: article.sourceIds.map(id => starterAliases.get(id) ?? id) })), ...importedArticles];
export const places: Place[] = importedPlaces;
