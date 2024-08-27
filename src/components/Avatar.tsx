// components/Avatar.tsx
import React from 'react';
import styled from 'styled-components';

interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
}

const AvatarWrapper = styled.div<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  background-color: ${props => props.theme.colors.primary};
  font-size: ${props => props.size / 2}px;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 40 }) => {
  const initial = name.charAt(0).toUpperCase();

  if (src) {
    return <AvatarImage src={src} alt={name} />;
  }

  return (
    <AvatarWrapper size={size}>
      {initial}
    </AvatarWrapper>
  );
};