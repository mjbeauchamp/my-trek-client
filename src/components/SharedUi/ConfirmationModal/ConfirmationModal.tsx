import { useRef, useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import { Toaster, toast } from 'react-hot-toast';
import { ErrorAlertBlock } from '../ErrorAlertBlock/ErrorAlertBlock';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void>;
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
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [isOpen]);

  const completeAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');

    if (!onConfirm) {
      console.error('No button action provided to dialog');
      return;
    }

    try {
      setLoading(true);
      await onConfirm();
      setLoading(false);
      onClose();
    } catch (error: any) {
      if (error && error.message) {
        setError(error.message);
        console.error('There was a problem completing modal action: ', error.message);
      } else {
        toast.error('There was a problem completing modal action.');
        console.error('There was a problem completing modal action.');
        onClose();
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} initialFocus={deleteButtonRef} className="confirmation-modal">
        {/* Backdrop */}
        <div className="confirmation-modal__backdrop" aria-hidden="true" />

        <div className="confirmation-modal__container">
          <DialogPanel className="confirmation-modal__panel open">
            <DialogTitle className="confirmation-modal__title fjord-one">{title}</DialogTitle>

            <div className="panel-body">
              {description ? (
                <Description className="confirmation-modal__description">{description}</Description>
              ) : null}

              {children ? children : null}
              {error ? (
                <div className="w-80">
                  <ErrorAlertBlock message={error} />
                </div>
              ) : null}

              {onConfirm && actionBtnText ? (
                <div className="confirmation-modal__actions">
                  <button type="button" onClick={onClose} className="btn outline">
                    CANCEL
                  </button>
                  <button
                    ref={deleteButtonRef}
                    type="button"
                    onClick={(e) => completeAction(e)}
                    className="btn delete"
                    disabled={loading}
                  >
                    {actionBtnText}
                  </button>
                </div>
              ) : null}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <Toaster />
    </>
  );
}
