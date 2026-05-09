import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/useThemeStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageAttachmentProps {
  /** Image source - can be a data URL or regular URL */
  src: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Whether to show the remove button */
  showRemoveButton?: boolean;
  /** Callback when remove button is clicked */
  onRemove?: () => void;
  /** Whether clicking the image opens a larger preview */
  enablePreview?: boolean;
  /** Title for the larger image preview */
  previewTitle?: string;
  /** Additional class names */
  className?: string;
}

export function ImageAttachment({
  src,
  alt = "Image attachment",
  showRemoveButton = false,
  onRemove,
  enablePreview = false,
  previewTitle,
  className,
}: ImageAttachmentProps) {
  const theme = useThemeStore((s) => s.current);
  const isMacTheme = theme === "macosx";
  const usesChromeTitle = theme === "macosx" || theme === "xp";
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const title = previewTitle ?? alt;

  const image = (
    <img
      src={src}
      alt={alt}
      className="w-full h-auto object-cover max-h-[200px]"
      style={{ display: "block" }}
    />
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative overflow-visible font-geneva-12 max-w-[280px]",
          className
        )}
      >
        {/* Container with aqua bubble styling for macOS */}
        <div
          className={cn(
            "relative overflow-hidden",
            isMacTheme
              ? "chat-bubble macosx-link-preview rounded-[16px] bg-gray-100"
              : "bg-white border border-gray-200 rounded"
          )}
        >
          {/* Full bleed image for macOS */}
          <div
            className={cn(
              "relative overflow-hidden",
              isMacTheme && "-mx-3 -mt-[6px] -mb-[6px] rounded-[14px]"
            )}
          >
            {enablePreview ? (
              <button
                type="button"
                className="group/image-preview relative block w-full cursor-zoom-in overflow-hidden p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346ae3] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                aria-label={`Preview ${alt}`}
                onClick={() => setIsPreviewOpen(true)}
              >
                {image}
                <span
                  className="pointer-events-none absolute inset-0 rounded-[inherit] bg-black/0 transition-colors duration-150 group-hover/image-preview:bg-black/[0.04] group-active/image-preview:bg-black/[0.07]"
                  aria-hidden="true"
                />
              </button>
            ) : (
              image
            )}
          </div>
        </div>

        {/* Remove button - positioned at top right corner */}
        {showRemoveButton && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={cn(
              "absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center z-20",
              isMacTheme
                ? "rounded-full overflow-hidden"
                : "rounded-sm bg-black/40 backdrop-blur-sm hover:bg-black/60",
              "transition-colors"
            )}
            style={
              isMacTheme
                ? {
                    background: "linear-gradient(rgba(160, 160, 160, 0.9), rgba(255, 255, 255, 0.9))",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2), 0 0.5px 0.5px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(0, 0, 0, 0.2), inset 0 1px 2px 0.5px rgba(187, 187, 187, 0.8)",
                  }
                : undefined
            }
            aria-label="Remove image"
          >
            {/* Top shine for macOS */}
            {isMacTheme && (
              <div
                className="pointer-events-none absolute left-1/2 -translate-x-1/2"
                style={{
                  top: "1px",
                  height: "35%",
                  width: "50%",
                  borderRadius: "9999px",
                  background: "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.2))",
                  filter: "blur(0.3px)",
                  zIndex: 2,
                }}
              />
            )}
            <X
              className={cn(
                "h-2.5 w-2.5 relative z-[3]",
                isMacTheme ? "text-neutral-500" : "text-white"
              )}
              weight="bold"
            />
          </button>
        )}
      </motion.div>

      {enablePreview && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent
            className="max-w-[min(92vw,1100px)]"
            overlayClassName="bg-black/55"
          >
            {usesChromeTitle ? (
              <DialogHeader>{title}</DialogHeader>
            ) : (
              <DialogHeader>
                <DialogTitle className="font-normal text-[16px]">
                  {title}
                </DialogTitle>
              </DialogHeader>
            )}
            <DialogDescription className="sr-only">
              Larger preview of {alt}
            </DialogDescription>
            <div className="min-h-0 p-3 sm:p-4">
              <img
                src={src}
                alt={alt}
                className="mx-auto block max-h-[min(78vh,760px)] max-w-full rounded-[6px] object-contain shadow-[0_2px_10px_rgba(0,0,0,0.24)]"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default ImageAttachment;
