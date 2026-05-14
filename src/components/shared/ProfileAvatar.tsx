import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  picture?: string | null;
  fallback: string;
  label: string;
  className?: string;
  imageClassName?: string;
  initialsClassName?: string;
  fit?: "contain" | "cover";
  textShadow?: string;
  style?: React.CSSProperties;
}

export function ProfileAvatar({
  picture,
  fallback,
  label,
  className,
  imageClassName,
  initialsClassName,
  fit = "contain",
  textShadow,
  style,
}: ProfileAvatarProps) {
  return (
    <div
      className={cn(
        "overflow-hidden flex items-center justify-center rounded-full shrink-0 aspect-square shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]",
        picture
          ? "bg-white/70 text-transparent"
          : "bg-[linear-gradient(to_bottom,#dcdcdc,#b8b8b8)] text-white",
        className
      )}
      style={style}
      role="img"
      aria-label={label}
    >
      {picture ? (
        <img
          src={picture}
          alt=""
          aria-hidden="true"
          className={cn(
            "w-full h-full",
            fit === "cover" ? "object-cover" : "object-contain",
            imageClassName
          )}
        />
      ) : (
        <span
          className={cn(
            "select-none font-semibold leading-none",
            initialsClassName
          )}
          style={textShadow ? { textShadow } : undefined}
          aria-hidden="true"
        >
          {fallback}
        </span>
      )}
    </div>
  );
}
