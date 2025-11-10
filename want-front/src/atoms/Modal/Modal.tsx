import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";
import SvgClose from "@/assets/svg/close.svg";

export type ModalHandlersType = {
  open: () => void;
};

type ModalPropsType = {
  children: React.ReactNode;
  // onClick?: () => void;
};

const Modal = forwardRef<ModalHandlersType, ModalPropsType>(
  ({ children }, ref) => {
    const dialog = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      open() {
        dialog.current?.showModal();
      },
    }));

    const modalRoot = document.getElementById("modal");

    return modalRoot
      ? createPortal(
          <dialog ref={dialog} className="Modal">
            <form method="dialog" className="Modal__close">
              <button>
                <SvgClose />
              </button>
            </form>
            <div className="Modal__innerWrapper">{children}</div>
          </dialog>,
          document.getElementById("modal") as HTMLElement
        )
      : null;
  }
);

Modal.displayName = "Modal";

export default Modal;
