/**
 * useDialog & useToast - Hooks for managing dialog and toast state
 *
 * Provides a clean, imperative-style API for showing confirmation dialogs
 * and toast notifications throughout the app.
 *
 * Usage:
 *   const { dialog, dialogProps, showDialog, showAlert, showConfirm, showDestructive } = useDialog();
 *   const { toast, toastProps, showToast, showSuccess, showError } = useToast();
 *
 *   // In JSX:
 *   <ConfirmDialog {...dialogProps} />
 *   <Toast {...toastProps} />
 *
 *   // To trigger:
 *   showConfirm("Delete?", "Are you sure?", () => doDelete());
 *   showSuccess("Done!");
 */

import { useState, useCallback, useRef } from "react";
import type { DialogType, DialogButton, ConfirmDialogProps } from "@/components/ui/ConfirmDialog";
import type { ToastType, ToastProps } from "@/components/ui/Toast";

// ─── Dialog State ────────────────────────────────────────────────────

interface DialogState {
  visible: boolean;
  type: DialogType;
  title: string;
  message?: string;
  buttons: DialogButton[];
  icon?: string;
  iconColor?: string;
  dismissOnBackdrop?: boolean;
  showCloseButton?: boolean;
}

const DEFAULT_DIALOG_STATE: DialogState = {
  visible: false,
  type: "confirm",
  title: "",
  message: undefined,
  buttons: [{ text: "OK", style: "default" }],
  icon: undefined,
  iconColor: undefined,
  dismissOnBackdrop: true,
  showCloseButton: false,
};

// ─── useDialog Hook ──────────────────────────────────────────────────

export function useDialog() {
  const [dialog, setDialog] = useState<DialogState>({ ...DEFAULT_DIALOG_STATE });
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  /** Close the dialog */
  const closeDialog = useCallback(() => {
    setDialog((prev) => ({ ...prev, visible: false }));
    resolveRef.current = null;
  }, []);

  /**
   * Show a fully custom dialog.
   * Returns a promise that resolves when the dialog is dismissed.
   */
  const showDialog = useCallback(
    (options: {
      type?: DialogType;
      title: string;
      message?: string;
      buttons?: DialogButton[];
      icon?: string;
      iconColor?: string;
      dismissOnBackdrop?: boolean;
      showCloseButton?: boolean;
    }) => {
      return new Promise<boolean>((resolve) => {
        resolveRef.current = resolve;

        const buttons = options.buttons || [{ text: "OK", style: "default" as const }];

        // Wrap button onPress to also close dialog and resolve promise
        const wrappedButtons: DialogButton[] = buttons.map((btn) => ({
          ...btn,
          onPress: () => {
            setDialog((prev) => ({ ...prev, visible: false }));
            btn.onPress?.();
            resolve(btn.style !== "cancel");
            resolveRef.current = null;
          },
        }));

        setDialog({
          visible: true,
          type: options.type || "confirm",
          title: options.title,
          message: options.message,
          buttons: wrappedButtons,
          icon: options.icon,
          iconColor: options.iconColor,
          dismissOnBackdrop: options.dismissOnBackdrop ?? true,
          showCloseButton: options.showCloseButton ?? false,
        });
      });
    },
    []
  );

  /**
   * Show a simple alert with just an OK button.
   * Like Alert.alert(title, message, [{ text: "OK" }])
   */
  const showAlert = useCallback(
    (
      title: string,
      message?: string,
      options?: {
        type?: DialogType;
        buttonText?: string;
        onDismiss?: () => void;
      }
    ) => {
      return showDialog({
        type: options?.type || "info",
        title,
        message,
        buttons: [
          {
            text: options?.buttonText || "OK",
            style: "default",
            onPress: options?.onDismiss,
          },
        ],
        dismissOnBackdrop: true,
      });
    },
    [showDialog]
  );

  /**
   * Show a confirmation dialog with Cancel and Confirm buttons.
   * Returns true if confirmed, false if cancelled.
   */
  const showConfirm = useCallback(
    (
      title: string,
      message?: string,
      onConfirm?: () => void,
      options?: {
        type?: DialogType;
        confirmText?: string;
        cancelText?: string;
        icon?: string;
      }
    ) => {
      return showDialog({
        type: options?.type || "confirm",
        title,
        message,
        icon: options?.icon,
        buttons: [
          { text: options?.cancelText || "Cancelar", style: "cancel" },
          {
            text: options?.confirmText || "Confirmar",
            style: "default",
            onPress: onConfirm,
          },
        ],
      });
    },
    [showDialog]
  );

  /**
   * Show a destructive confirmation dialog (e.g., delete actions).
   * Red-themed with danger icon.
   */
  const showDestructive = useCallback(
    (
      title: string,
      message?: string,
      onConfirm?: () => void,
      options?: {
        confirmText?: string;
        cancelText?: string;
      }
    ) => {
      return showDialog({
        type: "danger",
        title,
        message,
        buttons: [
          { text: options?.cancelText || "Cancelar", style: "cancel" },
          {
            text: options?.confirmText || "Eliminar",
            style: "destructive",
            onPress: onConfirm,
          },
        ],
      });
    },
    [showDialog]
  );

  /**
   * Show a success dialog.
   */
  const showSuccess = useCallback(
    (title: string, message?: string, onDismiss?: () => void) => {
      return showDialog({
        type: "success",
        title,
        message,
        buttons: [
          {
            text: "OK",
            style: "default",
            onPress: onDismiss,
          },
        ],
      });
    },
    [showDialog]
  );

  /**
   * Show a warning dialog with optional confirm action.
   */
  const showWarning = useCallback(
    (
      title: string,
      message?: string,
      onConfirm?: () => void,
      options?: {
        confirmText?: string;
        cancelText?: string;
      }
    ) => {
      return showDialog({
        type: "warning",
        title,
        message,
        buttons: [
          { text: options?.cancelText || "Cancelar", style: "cancel" },
          {
            text: options?.confirmText || "Continuar",
            style: "default",
            onPress: onConfirm,
          },
        ],
      });
    },
    [showDialog]
  );

  /**
   * Show an error dialog.
   */
  const showError = useCallback(
    (title: string, message?: string, onDismiss?: () => void) => {
      return showDialog({
        type: "error",
        title,
        message,
        buttons: [
          {
            text: "OK",
            style: "default",
            onPress: onDismiss,
          },
        ],
      });
    },
    [showDialog]
  );

  // Props to spread on ConfirmDialog component
  const dialogProps: ConfirmDialogProps = {
    visible: dialog.visible,
    type: dialog.type,
    title: dialog.title,
    message: dialog.message,
    buttons: dialog.buttons,
    onDismiss: closeDialog,
    icon: dialog.icon as any,
    iconColor: dialog.iconColor,
    dismissOnBackdrop: dialog.dismissOnBackdrop,
    showCloseButton: dialog.showCloseButton,
  };

  return {
    /** Current dialog state (for custom rendering if needed) */
    dialog,
    /** Props to spread on ConfirmDialog component */
    dialogProps,
    /** Show a fully custom dialog */
    showDialog,
    /** Show a simple OK alert */
    showAlert,
    /** Show a confirm/cancel dialog */
    showConfirm,
    /** Show a destructive (delete) dialog */
    showDestructive,
    /** Show a success dialog */
    showSuccess,
    /** Show a warning dialog with confirm */
    showWarning,
    /** Show an error dialog */
    showError,
    /** Close the dialog manually */
    closeDialog,
  };
}

// ─── Toast State ─────────────────────────────────────────────────────

interface ToastState {
  visible: boolean;
  type: ToastType;
  message: string;
  subtitle?: string;
  duration: number;
  icon?: string;
  position: "top" | "bottom";
}

const DEFAULT_TOAST_STATE: ToastState = {
  visible: false,
  type: "info",
  message: "",
  subtitle: undefined,
  duration: 3000,
  icon: undefined,
  position: "top",
};

// ─── useToast Hook ───────────────────────────────────────────────────

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ ...DEFAULT_TOAST_STATE });

  /** Dismiss the current toast */
  const dismissToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  /**
   * Show a fully custom toast notification.
   */
  const showToast = useCallback(
    (options: {
      type?: ToastType;
      message: string;
      subtitle?: string;
      duration?: number;
      icon?: string;
      position?: "top" | "bottom";
    }) => {
      // If there's already a toast visible, hide it first
      setToast((prev) => {
        if (prev.visible) {
          return { ...prev, visible: false };
        }
        return prev;
      });

      // Small delay so the previous toast can animate out
      setTimeout(() => {
        setToast({
          visible: true,
          type: options.type || "info",
          message: options.message,
          subtitle: options.subtitle,
          duration: options.duration ?? 3000,
          icon: options.icon,
          position: options.position || "top",
        });
      }, 50);
    },
    []
  );

  /** Show a success toast */
  const showSuccess = useCallback(
    (message: string, subtitle?: string) => {
      showToast({ type: "success", message, subtitle });
    },
    [showToast]
  );

  /** Show an error toast */
  const showError = useCallback(
    (message: string, subtitle?: string) => {
      showToast({ type: "error", message, subtitle, duration: 4000 });
    },
    [showToast]
  );

  /** Show a warning toast */
  const showWarning = useCallback(
    (message: string, subtitle?: string) => {
      showToast({ type: "warning", message, subtitle });
    },
    [showToast]
  );

  /** Show an info toast */
  const showInfo = useCallback(
    (message: string, subtitle?: string) => {
      showToast({ type: "info", message, subtitle });
    },
    [showToast]
  );

  // Props to spread on Toast component
  const toastProps: ToastProps = {
    visible: toast.visible,
    type: toast.type,
    message: toast.message,
    subtitle: toast.subtitle,
    duration: toast.duration,
    onDismiss: dismissToast,
    icon: toast.icon as any,
    position: toast.position,
  };

  return {
    /** Current toast state */
    toast,
    /** Props to spread on Toast component */
    toastProps,
    /** Show a fully custom toast */
    showToast,
    /** Show a success toast */
    showSuccess,
    /** Show an error toast */
    showError,
    /** Show a warning toast */
    showWarning,
    /** Show an info toast */
    showInfo,
    /** Dismiss the current toast */
    dismissToast,
  };
}

// ─── Web Transition State ────────────────────────────────────────────

interface WebTransitionState {
  visible: boolean;
  url: string;
  label?: string;
  delay: number;
  accentColor: string;
  icon?: string;
}

const DEFAULT_WEB_TRANSITION_STATE: WebTransitionState = {
  visible: false,
  url: "",
  label: undefined,
  delay: 1200,
  accentColor: "#60a5fa",
  icon: undefined,
};

// ─── useWebTransition Hook ───────────────────────────────────────────

export function useWebTransition() {
  const [webTransition, setWebTransition] = useState<WebTransitionState>({
    ...DEFAULT_WEB_TRANSITION_STATE,
  });

  /** Close the transition overlay */
  const closeTransition = useCallback(() => {
    setWebTransition((prev) => ({ ...prev, visible: false }));
  }, []);

  /**
   * Open a URL with the transition overlay.
   */
  const openUrl = useCallback(
    (
      url: string,
      options?: {
        label?: string;
        delay?: number;
        accentColor?: string;
        icon?: string;
      }
    ) => {
      setWebTransition({
        visible: true,
        url,
        label: options?.label,
        delay: options?.delay ?? 1200,
        accentColor: options?.accentColor || "#60a5fa",
        icon: options?.icon,
      });
    },
    []
  );

  // Props to spread on WebTransition component
  const webTransitionProps = {
    visible: webTransition.visible,
    url: webTransition.url,
    label: webTransition.label,
    delay: webTransition.delay,
    accentColor: webTransition.accentColor,
    icon: webTransition.icon as any,
    onDismiss: closeTransition,
  };

  return {
    /** Current web transition state */
    webTransition,
    /** Props to spread on WebTransition component */
    webTransitionProps,
    /** Open a URL with the transition overlay */
    openUrl,
    /** Close the transition overlay */
    closeTransition,
  };
}
