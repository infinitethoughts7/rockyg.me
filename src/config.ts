export const SITE = {
  website: "https://rockyg.me/",
  author: "Rocky G",
  profile: "https://rockyg.me/",
  desc: "Personal blog by Rocky G — developer writing about code, tools, and ideas",
  title: "Rocky G",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "",
  },
  dynamicOgImage: true,
  dir: "ltr",
  lang: "en",
  timezone: "Asia/Kolkata",
} as const;
