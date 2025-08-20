import styled from 'styled-components';

export const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #2563eb;
  }

  &.secondary {
    background-color: #6b7280;
    &:hover {
      background-color: #4b5563;
    }
  }
`;