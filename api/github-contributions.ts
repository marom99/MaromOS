import type { IncomingMessage, ServerResponse } from "node:http";

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

type ApiResponse = ServerResponse & {
  status(code: number): ApiResponse;
  json(body: any): ApiResponse;
  send(body: any): ApiResponse;
  redirect(statusOrUrl: string | number, url?: string): ApiResponse;
};

export default async function handler(req: IncomingMessage, res: ApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

  if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
    res.status(503).json({ error: "GitHub credentials not configured" });
    return;
  }

  const now = new Date();
  const to = now.toISOString();
  const fromDate = new Date();
  fromDate.setFullYear(now.getFullYear() - 1);
  const from = fromDate.toISOString();

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { login: GITHUB_USERNAME, from, to },
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        res.status(401).json({ error: "GitHub token invalid or expired" });
        return;
      }
      res.status(502).json({ error: "Failed to fetch data from GitHub" });
      return;
    }

    const result = (await response.json()) as {
      data?: {
        user?: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: number;
              weeks: unknown[];
              months: unknown[];
            };
          };
        };
      };
      errors?: unknown;
    };

    if (result.errors) {
      res.status(502).json({ error: "GitHub GraphQL API returned errors" });
      return;
    }

    if (!result.data?.user) {
      res.status(404).json({ error: "GitHub user not found" });
      return;
    }

    const calendar =
      result.data.user.contributionsCollection.contributionCalendar;
    res.status(200).json(calendar);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}
