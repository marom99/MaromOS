import type { SlackGif } from "../types";

export function SlackGifMessage({ gif }: { gif: SlackGif }) {
  return (
    <div className="slack-gif">
      <img
        src={gif.url}
        alt={gif.alt}
        width={gif.width}
        height={gif.height}
        loading="lazy"
      />
      <span className="slack-gif-tag">GIF</span>
    </div>
  );
}
