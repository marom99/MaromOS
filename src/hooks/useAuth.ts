import { useState, useCallback } from "react";
import { toast } from "sonner";
import { track } from "@vercel/analytics";
import { APP_ANALYTICS } from "@/utils/analytics";
import { useChatsStoreShallow } from "@/stores/helpers";
import { loginWithPassword, verifyAuthToken } from "@/api/auth";

export function useAuth() {
  const {
    username,
    isAuthenticated,
    isOwner,
    hasPassword,
    setAuthenticated,
    setIsOwner,
    setUsername,
    logout,
    checkHasPassword: storeCheckHasPassword,
    setPassword: storeSetPassword,
  } = useChatsStoreShallow((state) => ({
    username: state.username,
    isAuthenticated: state.isAuthenticated,
    isOwner: state.isOwner,
    hasPassword: state.hasPassword,
    setAuthenticated: state.setAuthenticated,
    setIsOwner: state.setIsOwner,
    setUsername: state.setUsername,
    logout: state.logout,
    checkHasPassword: state.checkHasPassword,
    setPassword: state.setPassword,
  }));

  const [isVerifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);
  const [verifyPasswordInput, setVerifyPasswordInput] = useState("");
  const [verifyUsernameInput, setVerifyUsernameInput] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [isSettingUsername, setIsSettingUsername] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const [isLogoutConfirmDialogOpen, setIsLogoutConfirmDialogOpen] =
    useState(false);

  const promptVerifyToken = useCallback(() => {
    setVerifyPasswordInput("");
    setVerifyUsernameInput(username && username !== "you" ? username : "");
    setVerifyError(null);
    setVerifyDialogOpen(true);
  }, [username]);

  const promptSetUsername = useCallback(() => {
    setNewUsername(username && username !== "you" ? username : "");
    setNewPassword("");
    setUsernameError(null);
    setIsUsernameDialogOpen(true);
  }, [username]);

  const submitUsernameDialog = useCallback(async () => {
    const trimmedUsername = newUsername.trim();
    const trimmedPassword = newPassword.trim();

    if (!trimmedUsername) {
      setUsernameError("Username required");
      return;
    }

    if (!trimmedPassword) {
      setUsernameError("Password required");
      return;
    }

    setIsSettingUsername(true);
    setUsernameError(null);

    try {
      setUsername(trimmedUsername);
      await storeSetPassword(trimmedPassword);
      setAuthenticated(true);
      setIsOwner(true);
      setIsUsernameDialogOpen(false);
      setNewPassword("");
      toast.success("Success", {
        description: "Profile created successfully",
      });
    } catch (err) {
      console.error("[useAuth] Error setting username:", err);
      const message =
        err instanceof Error ? err.message : "Network error while saving profile";
      setUsernameError(message);
    } finally {
      setIsSettingUsername(false);
    }
  }, [
    newPassword,
    newUsername,
    setAuthenticated,
    setIsOwner,
    setUsername,
    storeSetPassword,
  ]);

  const handleVerifyTokenSubmit = useCallback(
    async (input: string, isPassword: boolean = false) => {
      if (!input.trim()) {
        setVerifyError(isPassword ? "Password required" : "Token required");
        return;
      }

      setIsVerifyingToken(true);
      setVerifyError(null);

      try {
        if (isPassword) {
          const targetUsername = verifyUsernameInput.trim() || "";

          if (!targetUsername) {
            setVerifyError("Username required");
            setIsVerifyingToken(false);
            return;
          }

          // If currently logged in as a different owner, log out first
          if (isOwner && username !== targetUsername) {
            await logout();
          }

          const result = await loginWithPassword({
            username: targetUsername,
            password: input.trim(),
          });
          if (result.username) {
            setUsername(result.username);
            setAuthenticated(true);
            setIsOwner(true);
            track(APP_ANALYTICS.USER_LOGIN_PASSWORD, {
              username: result.username,
            });
            toast.success("Success", {
              description: "Logged in successfully with password",
            });
            setVerifyDialogOpen(false);
            setVerifyPasswordInput("");
          }
        } else {
          if (isOwner) {
            await logout();
          }

          const result = await verifyAuthToken({
            username: verifyUsernameInput.trim() || "",
            token: input.trim(),
          });

          if (result.valid && result.username) {
            setUsername(result.username);
            setAuthenticated(true);
            setIsOwner(true);
            track(APP_ANALYTICS.USER_LOGIN_TOKEN, {
              username: result.username,
            });
            toast.success("Success", {
              description: "Token verified and set successfully",
            });
            setVerifyDialogOpen(false);
          }
        }
      } catch (err) {
        console.error("[useAuth] Error verifying:", err);
        const message =
          err instanceof Error ? err.message : "Network error while verifying";
        setVerifyError(message);
      } finally {
        setIsVerifyingToken(false);
      }
    },
    [setAuthenticated, setIsOwner, setUsername, username, verifyUsernameInput, isOwner, logout]
  );

  const checkHasPassword = useCallback(async () => {
    return storeCheckHasPassword();
  }, [storeCheckHasPassword]);

  const setPassword = useCallback(
    async (password: string) => {
      return storeSetPassword(password);
    },
    [storeSetPassword]
  );

  const handleLogout = useCallback(async () => {
    setVerifyDialogOpen(false);
    setIsLogoutConfirmDialogOpen(false);
    setVerifyPasswordInput("");
    setVerifyUsernameInput("");
    setVerifyError(null);

    await logout();

    toast.success("Logged Out", {
      description: "You have been successfully logged out.",
    });
  }, [logout]);

  const promptLogout = useCallback(async () => {
    setIsLogoutConfirmDialogOpen(true);
  }, []);

  const confirmLogout = useCallback(() => {
    setIsLogoutConfirmDialogOpen(false);
    handleLogout();
  }, [handleLogout]);

  return {
    username,
    isAuthenticated,
    isOwner,
    hasPassword,

    promptSetUsername,
    isUsernameDialogOpen,
    setIsUsernameDialogOpen,
    newUsername,
    setNewUsername,
    newPassword,
    setNewPassword,
    isSettingUsername,
    usernameError,
    submitUsernameDialog,

    promptVerifyToken,
    isVerifyDialogOpen,
    setVerifyDialogOpen,
    verifyPasswordInput,
    setVerifyPasswordInput,
    verifyUsernameInput,
    setVerifyUsernameInput,
    isVerifyingToken,
    verifyError,
    handleVerifyTokenSubmit,

    checkHasPassword,
    setPassword,

    logout: promptLogout,
    confirmLogout,
    isLogoutConfirmDialogOpen,
    setIsLogoutConfirmDialogOpen,
  };
}
