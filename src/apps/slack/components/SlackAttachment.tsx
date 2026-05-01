import { FigmaLogo, FileText, Image as ImageIcon } from "@phosphor-icons/react";
import type { SlackAttachment } from "../types";

interface SlackAttachmentProps {
  attachment: SlackAttachment;
}

export function SlackAttachmentCard({ attachment }: SlackAttachmentProps) {
  if (attachment.kind === "image") {
    return (
      <figure className="slack-attachment slack-attachment--image">
        <img
          src={attachment.url}
          alt={attachment.caption ?? "Attachment"}
          loading="lazy"
        />
        {attachment.caption && (
          <figcaption className="slack-attachment-caption">
            <ImageIcon size={12} weight="bold" /> {attachment.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (attachment.kind === "figma") {
    return (
      <a
        href={attachment.url}
        className="slack-attachment slack-attachment--figma"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="slack-attachment-icon">
          <FigmaLogo size={20} weight="fill" />
        </div>
        <div className="slack-attachment-meta">
          <strong>{attachment.fileName ?? attachment.caption ?? "Figma file"}</strong>
          {attachment.fileMeta && <span>{attachment.fileMeta}</span>}
        </div>
      </a>
    );
  }

  return (
    <a
      href={attachment.url}
      className="slack-attachment slack-attachment--file"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="slack-attachment-icon">
        <FileText size={20} weight="bold" />
      </div>
      <div className="slack-attachment-meta">
        <strong>{attachment.fileName ?? attachment.caption ?? "File"}</strong>
        {attachment.fileMeta && <span>{attachment.fileMeta}</span>}
      </div>
    </a>
  );
}
