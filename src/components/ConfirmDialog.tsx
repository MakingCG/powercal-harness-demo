import { Dialog, DialogButton } from './Dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  /** Runs on the cancel button only — a backdrop dismiss just closes the dialog. */
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
}

/** Yes/no question. `destructive` = red confirm (delete, overwrite on import). */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      title={title}
      description={description}
      actions={
        <>
          <DialogButton
            onClick={() => {
              onCancel?.();
              onOpenChange(false);
            }}
          >
            {cancelLabel}
          </DialogButton>
          <DialogButton
            variant={variant === 'destructive' ? 'destructive' : 'primary'}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </DialogButton>
        </>
      }
    />
  );
}
