import { ALL_USER_PICTURES } from "@/utils/userPictures";

export const MAROM_PICTURE_INDEX = 37;

export const SLACK_PROFILE_PICTURES = [
  ALL_USER_PICTURES[1]?.path,
  ALL_USER_PICTURES[9]?.path,
  ALL_USER_PICTURES[23]?.path,
  ALL_USER_PICTURES[MAROM_PICTURE_INDEX]?.path,
];

export function getSlackInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}
