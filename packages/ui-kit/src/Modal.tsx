import React, { useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';

const ACCENT = 'rgb(94, 111, 161)';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleId?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, titleId = 'modal-title', children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button, input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/45 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w-full max-w-[440px] max-h-[90vh] flex flex-col relative"
        style={{ fontFamily: '"Noto Sans", Roboto, sans-serif' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 z-20 bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
        >
          <IoMdClose size={22} color="rgba(255,255,255,0.75)" />
        </button>
        <div
          className="py-2 px-4 pr-[52px] flex items-center gap-3 shrink-0 rounded-t-xl relative z-10"
          style={{ background: ACCENT }}
        >
          <span
            id={titleId}
            className="text-[#eceef5] text-lg font-semibold"
            style={{ fontFamily: '"IBM Plex Serif", serif' }}
          >
            {title}
          </span>
        </div>
        <div className="overflow-y-auto px-6 pt-6 pb-7 flex-1 bg-white rounded-xl -mt-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
