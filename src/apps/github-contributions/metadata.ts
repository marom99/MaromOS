export const appMetadata = {
  name: "GitHub",
  version: "1.0.0",
  creator: {
    name: "Ryo Lu",
    url: "https://ryo.lu",
  },
  github: "https://github.com/ryokun6/ryos",
  icon: "/icons/default/github-contributions.png",
};

export const helpItems = [
  {
    icon: "📊",
    title: "Activity Heatmap",
    description: "Shows your GitHub contribution history over the past 52 weeks.",
  },
  {
    icon: "🔥",
    title: "Streak Stats",
    description: "Tracks your current and longest contribution streaks in days.",
  },
  {
    icon: "⚙️",
    title: "Configuration",
    description: "Requires GITHUB_TOKEN and GITHUB_USERNAME environment variables to be set on the server.",
  },
  {
    icon: "🔄",
    title: "Refresh",
    description: "Use File ▸ Refresh to manually pull the latest data from GitHub.",
  },
];
