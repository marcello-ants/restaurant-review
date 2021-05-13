import React from "react";
import Modal from "@material-ui/core/Modal";

const ModalComponent = ({ children, isOpen, onModalClose }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onModalClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      style={{ display: "flex" }}
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;
