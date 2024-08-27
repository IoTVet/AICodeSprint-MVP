// components/common/DatePicker.tsx
import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { FiCalendar } from 'react-icons/fi';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  isClearable?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const StyledDatePickerWrapper = styled.div`
  position: relative;
`;

const StyledDatePicker = styled(ReactDatePicker)`
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const CalendarIcon = styled(FiCalendar)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

export const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  placeholderText,
  isClearable = true,
  minDate,
  maxDate,
}) => {
  return (
    <StyledDatePickerWrapper>
        {/* @ts-ignore */}
      <StyledDatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholderText}
        isClearable={isClearable}
        minDate={minDate}
        maxDate={maxDate}
        dateFormat="MMMM d, yyyy"
      />
      <CalendarIcon />
    </StyledDatePickerWrapper>
  );
};