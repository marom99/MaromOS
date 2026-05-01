import { BaseApp } from "../base/types";
import { SlackAppComponent } from "./components/SlackAppComponent";
import { appMetadata, helpItems } from "./metadata";

export { appMetadata, helpItems } from "./metadata";

export const SlackApp: BaseApp = {
  id: "slack",
  name: "Slack",
  icon: { type: "image", src: appMetadata.icon },
  description: "Case study workspace",
  component: SlackAppComponent,
  helpItems,
  metadata: appMetadata,
};
