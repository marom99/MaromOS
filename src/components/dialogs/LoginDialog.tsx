import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/useThemeStore";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;

  usernameInput: string;
  onUsernameInputChange: (value: string) => void;
  passwordInput: string;
  onPasswordInputChange: (value: string) => void;
  onLoginSubmit: () => Promise<void>;
  isLoginLoading: boolean;
  loginError: string | null;
}

export function LoginDialog({
  isOpen,
  onOpenChange,
  usernameInput,
  onUsernameInputChange,
  passwordInput,
  onPasswordInputChange,
  onLoginSubmit,
  isLoginLoading,
  loginError,
}: LoginDialogProps) {
  const currentTheme = useThemeStore((state) => state.current);
  const isXpTheme = currentTheme === "xp" || currentTheme === "win98";
  const { t } = useTranslation();
  const dialogTitle = t("common.auth.dialogTitle");

  const themeFont = isXpTheme
    ? "font-['Pixelated_MS_Sans_Serif',Arial] text-[11px]"
    : "font-geneva-12 text-[12px]";

  const themeFontStyle: React.CSSProperties | undefined = isXpTheme
    ? {
        fontFamily: '"Pixelated MS Sans Serif", "ArkPixel", Arial',
        fontSize: "11px",
      }
    : undefined;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isLoginLoading) {
      await onLoginSubmit();
    }
  };

  // Automatically close when login completes successfully
  const prevLoading = React.useRef(isLoginLoading);
  React.useEffect(() => {
    const finishedSuccessfully =
      prevLoading.current && !isLoginLoading && !loginError;
    if (isOpen && finishedSuccessfully) {
      onOpenChange(false);
    }
    prevLoading.current = isLoginLoading;
  }, [isOpen, isLoginLoading, loginError, onOpenChange]);

  const dialogContent = (
    <div className="pt-3 pb-6 px-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className={cn("text-gray-700", themeFont)} style={themeFontStyle}>
              {t("common.auth.username")}
            </Label>
            <Input
              autoFocus
              value={usernameInput}
              onChange={(e) => onUsernameInputChange(e.target.value)}
              className={cn("shadow-none h-8", themeFont)}
              style={themeFontStyle}
              disabled={isLoginLoading}
            />
          </div>
          <div className="space-y-2">
            <Label className={cn("text-gray-700", themeFont)} style={themeFontStyle}>
              {t("common.auth.password")}
            </Label>
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => onPasswordInputChange(e.target.value)}
              className={cn("shadow-none h-8", themeFont)}
              style={themeFontStyle}
              disabled={isLoginLoading}
            />
          </div>
        </div>

        {loginError && (
          <p className={cn("text-red-600 mt-3", themeFont)} style={themeFontStyle}>
            {loginError}
          </p>
        )}

        <DialogFooter className="mt-6 gap-1 sm:justify-end">
          <Button
            type="submit"
            variant="retro"
            disabled={isLoginLoading || !usernameInput.trim() || !passwordInput.trim()}
            className={cn("w-full sm:w-auto h-7", themeFont)}
            style={themeFontStyle}
          >
            {isLoginLoading ? t("common.auth.loggingIn") : t("common.auth.logIn")}
          </Button>
        </DialogFooter>
      </form>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("max-w-[400px]", isXpTheme && "p-0 overflow-hidden")}
        style={isXpTheme ? { fontSize: "11px" } : undefined}
        onKeyDown={(e: React.KeyboardEvent) => e.stopPropagation()}
      >
        {isXpTheme ? (
          <>
            <DialogHeader>{dialogTitle}</DialogHeader>
            <div className="window-body">{dialogContent}</div>
          </>
        ) : currentTheme === "macosx" ? (
          <>
            <DialogHeader>{dialogTitle}</DialogHeader>
            {dialogContent}
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            {dialogContent}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
