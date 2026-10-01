import { Dialog, DialogButton } from './Dialog';

interface ErrorDialogProps {
  open: boolean;
  title?: string;
  /** The sentence thrown by the service layer — shown verbatim. */
  message: string;
  onClose: () => void;
}

/**
 * The single error surface of the app. Services throw `Error('user sentence')`,
 * hooks own `{ error, clearError }`, pages render this. No toasts, no inline red text.
 */
export function ErrorDialog({ open, title = 'Something went wrong', message, onClose }: ErrorDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={message}
      actions={
        <DialogButton variant="primary" onClick={onClose}>
          OK
        </DialogButton>
      }
    />
  );
}
