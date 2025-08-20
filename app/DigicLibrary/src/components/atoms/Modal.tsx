import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(107, 114, 128, 0.5);
  overflow-y: auto;
  height: 100%;
  width: 100%;
`;

const ModalContainer = styled.div`
  position: relative;
  top: 5rem;
  margin: auto;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  width: 24rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 0.375rem;
  background-color: white;
`;

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;