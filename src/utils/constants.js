/* ═══════════════════════════════════════════
   Constants & Config
   ═══════════════════════════════════════════ */

export const STAGES = ["Wishlist", "Applied", "Screen", "Technical", "Onsite", "Offer", "Rejected"];

export const STAGE_META = {
  Wishlist:  { color: "var(--purple)",     bg: "var(--purple-soft)", emoji: "✦" },
  Applied:   { color: "var(--blue)",       bg: "var(--blue-soft)",   emoji: "◈" },
  Screen:    { color: "var(--yellow)",     bg: "var(--yellow-soft)", emoji: "◎" },
  Technical: { color: "var(--pink)",       bg: "var(--pink-soft)",   emoji: "⟐" },
  Onsite:    { color: "var(--coral)",      bg: "var(--coral-soft)",  emoji: "⬡" },
  Offer:     { color: "var(--green)",      bg: "var(--green-soft)",  emoji: "✿" },
  Rejected:  { color: "var(--text-muted)", bg: "#EEECF2",           emoji: "—" },
};

export const DSA_TOPICS = [
  "Arrays", "Strings", "Hash Maps", "Two Pointers", "Sliding Window",
  "Binary Search", "Linked Lists", "Trees", "Graphs", "BFS/DFS",
  "Dynamic Programming", "Heaps", "Stacks/Queues", "Greedy",
  "Backtracking", "Trie", "Union Find", "Topological Sort",
  "Intervals", "Prefix Sum", "Matrix", "Bit Manipulation",
];

export const SYSDESIGN_TOPICS = [
  "Load Balancing", "Caching", "Database Design", "Sharding",
  "Message Queues", "Microservices", "API Design", "CDN",
  "Consistent Hashing", "Rate Limiting", "Search Systems",
  "Notification Systems", "URL Shortener", "Chat Systems",
  "News Feed", "Video Streaming", "Payment Systems", "Auth/SSO",
];

export const BEHAVIORAL_CATEGORIES = [
  "Leadership", "Conflict Resolution", "Teamwork", "Failure/Growth",
  "Technical Challenge", "Impact/Results", "Communication", "Ambiguity",
];

export const DIFFICULTY = ["Easy", "Medium", "Hard"];

export const DIFF_META = {
  Easy:   { color: "var(--green)",  bg: "var(--green-soft)" },
  Medium: { color: "var(--yellow)", bg: "var(--yellow-soft)" },
  Hard:   { color: "var(--pink)",   bg: "var(--pink-soft)" },
};

export const CONFIDENCE_META = {
  Learning:  { color: "var(--pink)",   bg: "var(--pink-soft)" },
  Decent:    { color: "var(--yellow)", bg: "var(--yellow-soft)" },
  Confident: { color: "var(--green)",  bg: "var(--green-soft)" },
};

export const TABS = [
  { id: "dashboard",  label: "Dashboard",  emoji: "◈" },
  { id: "pipeline",   label: "Pipeline",   emoji: "◫" },
  { id: "dsa",        label: "DSA Prep",   emoji: "⟐" },
  { id: "sysdesign",  label: "Sys Design", emoji: "⬡" },
  { id: "behavioral", label: "Behavioral", emoji: "◉" },
];
