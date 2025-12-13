import { useRef, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<string | undefined>;
  title: string;
  actionBtnText?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  children,
  title,
  actionBtnText,
  description,
}: ConfirmationModalProps) {
  const deleteButtonRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const completeAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onConfirm) {
      console.error('No button action provided to dialog');
      return;
    }

    try {
      setLoading(true);
      const result = await onConfirm();
      setLoading(false);
    } catch (err) {
      console.log('ERROR DELETING ITEM');
    } finally {
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        initialFocus={deleteButtonRef}
        className="confirmation-modal"
      >
        {/* Backdrop */}
        <div className="confirmation-modal__backdrop" aria-hidden="true" />

        <div className="confirmation-modal__container">
          <DialogPanel className="confirmation-modal__panel open">
            <DialogTitle className="confirmation-modal__title">{title}</DialogTitle>

            <div className="panel-body">
              {description ? (
                <Description className="confirmation-modal__description">{description}</Description>
              ) : null}

              {children ? children : null}

              {onConfirm && actionBtnText ? (
                <div className="confirmation-modal__actions">
                  <button type="button" onClick={onClose} className="btn">
                    CANCEL
                  </button>
                  <button
                    ref={deleteButtonRef}
                    type="button"
                    onClick={(e) => completeAction(e)}
                    className="btn delete"
                  >
                    {actionBtnText}
                  </button>
                </div>
              ) : null}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
