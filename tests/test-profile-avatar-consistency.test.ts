import { describe, test, expect } from "bun:test";
import { ALL_USER_PICTURES } from "@/utils/userPictures";
import { MAROM_PICTURE_INDEX, SLACK_PROFILE_PICTURES } from "@/apps/slack/components/slackAvatarUtils";

describe("SLACK_PROFILE_PICTURES", () => {
  test("has exactly 4 entries", () => {
    expect(SLACK_PROFILE_PICTURES).toHaveLength(4);
  });

  test("every entry is a non-null string (valid path)", () => {
    for (const path of SLACK_PROFILE_PICTURES) {
      expect(path).toBeString();
      expect(path).not.toBeNull();
    }
  });
});

describe("MAROM_PICTURE_INDEX", () => {
  test("is within valid bounds of ALL_USER_PICTURES", () => {
    expect(MAROM_PICTURE_INDEX).toBeGreaterThanOrEqual(0);
    expect(MAROM_PICTURE_INDEX).toBeLessThan(ALL_USER_PICTURES.length);
  });

  test("SLACK_PROFILE_PICTURES[3] matches ALL_USER_PICTURES[MAROM_PICTURE_INDEX]", () => {
    expect(SLACK_PROFILE_PICTURES[3]).toBe(ALL_USER_PICTURES[MAROM_PICTURE_INDEX]?.path);
  });
});

describe("channel content avatarIndex bounds", () => {
  test("all avatarIndex values in channelContent are within SLACK_PROFILE_PICTURES bounds", async () => {
    const { slackChannels } = await import("@/apps/slack/data/channelContent");
    for (const channel of slackChannels) {
      for (const message of channel.messages) {
        expect(message.avatarIndex).toBeGreaterThanOrEqual(0);
        expect(message.avatarIndex).toBeLessThan(SLACK_PROFILE_PICTURES.length);
      }
    }
  });

  test("all avatarIndex values in dmContent are within SLACK_PROFILE_PICTURES bounds", async () => {
    const { maromDMMessages } = await import("@/apps/slack/data/dmContent");
    for (const message of maromDMMessages) {
      expect(message.avatarIndex).toBeGreaterThanOrEqual(0);
      expect(message.avatarIndex).toBeLessThan(SLACK_PROFILE_PICTURES.length);
    }
  });
});
