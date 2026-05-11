import { apiHandler } from "./_utils/api-handler.js";

export const runtime = "nodejs";
export const maxDuration = 30;

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const CONTRIBUTIONS_QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            firstDay
            contributionDays {
              date
              contributionCount
              contributionLevel
              weekday
            }
          }
          months {
            name
            year
            firstDay
            totalWeeks
          }
        }
      }
    }
  }
`;

export default apiHandler(
  { methods: ["GET"] },
  async ({ res, logger, startTime }) => {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

    if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
      logger.error("GitHub credentials missing", { 
        hasToken: !!GITHUB_TOKEN, 
        hasUsername: !!GITHUB_USERNAME 
      });
      logger.response(503, Date.now() - startTime);
      res.status(503).json({ error: "GitHub credentials not configured" });
      return;
    }

    const now = new Date();
    const to = now.toISOString();
    const fromDate = new Date();
    fromDate.setFullYear(now.getFullYear() - 1);
    const from = fromDate.toISOString();

    logger.info("Fetching GitHub contributions", { username: GITHUB_USERNAME, from, to });

    try {
      const response = await fetch(GITHUB_GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: CONTRIBUTIONS_QUERY,
          variables: {
            login: GITHUB_USERNAME,
            from,
            to,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("GitHub API error", { status: response.status, error: errorText });
        
        if (response.status === 401) {
          logger.response(401, Date.now() - startTime);
          res.status(401).json({ error: "GitHub token invalid or expired" });
          return;
        }

        logger.response(502, Date.now() - startTime);
        res.status(502).json({ error: "Failed to fetch data from GitHub" });
        return;
      }

      const result = await response.json();

      if (result.errors) {
        logger.error("GitHub GraphQL errors", result.errors);
        logger.response(502, Date.now() - startTime);
        res.status(502).json({ error: "GitHub GraphQL API returned errors" });
        return;
      }

      if (!result.data?.user) {
        logger.error("GitHub user not found", { username: GITHUB_USERNAME });
        logger.response(404, Date.now() - startTime);
        res.status(404).json({ error: "GitHub user not found" });
        return;
      }

      const calendar = result.data.user.contributionsCollection.contributionCalendar;

      logger.info("GitHub contributions fetched", { 
        totalContributions: calendar.totalContributions,
        weeksCount: calendar.weeks.length 
      });

      res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=3600");
      logger.response(200, Date.now() - startTime);
      res.status(200).json(calendar);
    } catch (error) {
      logger.error("Failed to fetch GitHub contributions", error);
      logger.response(500, Date.now() - startTime);
      res.status(500).json({ error: "Internal server error while fetching GitHub contributions" });
    }
  }
);
