import React from 'react';
import styled from 'styled-components';
import { Card } from '../atoms/Card';
import { theme } from '../../styles/globalStyles';

const StatCardWrapper = styled(Card)`
  padding: 1.25rem;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  font-size: 1.5rem;
  color: ${({ color }) => color || '#3b82f6'};
`;

const TextWrapper = styled.div`
  margin-left: 1.25rem;
  flex: 1;
`;

const Title = styled.dt`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${() => theme.colors.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Value = styled.dd`
  font-size: 1.125rem;
  font-weight: 500;
  color: ${() => theme.colors.text};
`;

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, iconColor }) => {
  return (
    <StatCardWrapper>
      <Content>
        <IconWrapper color={iconColor}>{icon}</IconWrapper>
        <TextWrapper>
          <dl>
            <Title>{title}</Title>
            <Value>{value}</Value>
          </dl>
        </TextWrapper>
      </Content>
    </StatCardWrapper>
  );
};

export default StatCard;