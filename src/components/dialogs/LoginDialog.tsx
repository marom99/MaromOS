import React from "react";
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
  initialTab?: "login" | "signup" | string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;

  usernameInput: string;
  onUsernameInputChange: (value: string) => void;
  passwordInput: string;
  onPasswordInputChange: (value: string) => void;
  onLoginSubmit: () => Promise<void>;
  isLoginLoading: boolean;
  loginError: string | null;

  newUsername?: string;
  onNewUsernameChange?: (value: string) => void;
  newPassword?: string;
  onNewPasswordChange?: (value: string) => void;
  onSignUpSubmit?: () => Promise<void>;
  isSignUpLoading?: boolean;
  signUpError?: string | null;
}

export function LoginDialog({
  initialTab = "login",
  isOpen,
  onOpenChange,
  usernameInput,
  onUsernameInputChange,
  passwordInput,
  onPasswordInputChange,
  onLoginSubmit,
  isLoginLoading,
  loginError,
  newUsername = "",
  onNewUsernameChange,
  newPassword = "",
  onNewPasswordChange,
  onSignUpSubmit,
  isSignUpLoading = false,
  signUpError = null,
}: LoginDialogProps) {
  const currentTheme = useThemeStore((state) => state.current);
  const isXpTheme = currentTheme === "xp" || currentTheme === "win98";
  const { t } = useTranslation();
  const isSignUpMode = initialTab === "signup" && Boolean(onSignUpSubmit);
  const dialogTitle = isSignUpMode
    ? t("common.auth.createProfile", "Create Profile")
    : t("common.auth.dialogTitle");

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
    if (isSignUpMode && onSignUpSubmit && !isSignUpLoading) {
      await onSignUpSubmit();
    } else if (!isLoginLoading) {
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
              value={isSignUpMode ? newUsername : usernameInput}
              onChange={(e) =>
                isSignUpMode
                  ? onNewUsernameChange?.(e.target.value)
                  : onUsernameInputChange(e.target.value)
              }
              className={cn("shadow-none h-8", themeFont)}
              style={themeFontStyle}
              disabled={isSignUpMode ? isSignUpLoading : isLoginLoading}
            />
          </div>
          <div className="space-y-2">
            <Label className={cn("text-gray-700", themeFont)} style={themeFontStyle}>
              {t("common.auth.password")}
            </Label>
            <Input
              type="password"
              value={isSignUpMode ? newPassword : passwordInput}
              onChange={(e) =>
                isSignUpMode
                  ? onNewPasswordChange?.(e.target.value)
                  : onPasswordInputChange(e.target.value)
              }
              className={cn("shadow-none h-8", themeFont)}
              style={themeFontStyle}
              disabled={isSignUpMode ? isSignUpLoading : isLoginLoading}
            />
          </div>
        </div>

        {(isSignUpMode ? signUpError : loginError) && (
          <p className={cn("text-red-600 mt-3", themeFont)} style={themeFontStyle}>
            {isSignUpMode ? signUpError : loginError}
          </p>
        )}

        <DialogFooter className="mt-6 gap-1 sm:justify-end">
          <Button
            type="submit"
            variant="retro"
            disabled={
              isSignUpMode
                ? isSignUpLoading || !newUsername.trim() || !newPassword.trim()
                : isLoginLoading || !usernameInput.trim() || !passwordInput.trim()
            }
            className={cn("w-full sm:w-auto h-7", themeFont)}
            style={themeFontStyle}
          >
            {isSignUpMode
              ? isSignUpLoading
                ? t("common.auth.creating", "Creating...")
                : t("common.auth.createProfile", "Create Profile")
              : isLoginLoading
              ? t("common.auth.loggingIn")
              : t("common.auth.logIn")}
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
