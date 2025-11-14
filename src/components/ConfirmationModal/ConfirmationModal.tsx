import { useRef, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react";

interface ConfirmationModalProps {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => Promise<string | undefined>
}

export default function ConfirmationModal({ isOpen, onClose, onConfirm }: ConfirmationModalProps) {
  const deleteButtonRef = useRef(null);
  const [loading, setLoading] = useState(false)

  const completeAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
        setLoading(true);
        const result = await onConfirm();
        setLoading(false);

    } catch (err) {
        console.log('ERROR DELETING ITEM')
    } finally {
        onClose();
    }

    
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      initialFocus={deleteButtonRef}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded bg-white p-6 shadow-md">
          <DialogTitle className="text-lg font-medium text-gray-900">
            Delete item?
          </DialogTitle>

          <Description className="mt-2 text-sm text-gray-500">
            This action cannot be undone. Are you sure you want to permanently delete this item?
          </Description>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              ref={deleteButtonRef}
              type="button"
              onClick={(e) => completeAction(e)}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}