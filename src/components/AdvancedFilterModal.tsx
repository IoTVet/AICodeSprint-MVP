// components/AdvancedFilterModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Dropdown } from './common/Dropdown';
import { Button } from './common/Button';
import { DatePicker } from './common/DataPicker';

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    postingDateFrom: null,
    postingDateTo: null,
    status: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string) => (date: Date | null) => {
    setFilters(prev => ({ ...prev, [name]: date }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Advanced Filters">
      <FilterSection>
        <FilterLabel>Job Details</FilterLabel>
        <Input
          name="title"
          placeholder="Job Title"
          value={filters.title}
          onChange={handleInputChange}
        />
        <Input
          name="description"
          placeholder="Job Description"
          value={filters.description}
          onChange={handleInputChange}
        />
      </FilterSection>

      <FilterSection>
        <FilterLabel>Company & Location</FilterLabel>
        <FilterGroup>
          <Input
            name="company"
            placeholder="Company"
            value={filters.company}
            onChange={handleInputChange}
          />
          <Input
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleInputChange}
          />
        </FilterGroup>
      </FilterSection>

      <FilterSection>
        <FilterLabel>Salary Range</FilterLabel>
        <FilterGroup>
          <Input
            name="salaryMin"
            placeholder="Min Salary"
            type="number"
            value={filters.salaryMin}
            onChange={handleInputChange}
          />
          <Input
            name="salaryMax"
            placeholder="Max Salary"
            type="number"
            value={filters.salaryMax}
            onChange={handleInputChange}
          />
        </FilterGroup>
      </FilterSection>

      <FilterSection>
        <FilterLabel>Posting Date</FilterLabel>
        <FilterGroup>
          <DatePicker
            selected={filters.postingDateFrom}
            onChange={handleDateChange('postingDateFrom')}
            placeholderText="From Date"
          />
          <DatePicker
            selected={filters.postingDateTo}
            onChange={handleDateChange('postingDateTo')}
            placeholderText="To Date"
          />
        </FilterGroup>
      </FilterSection>

      <FilterSection>
        <FilterLabel>Status</FilterLabel>
        <Dropdown
          items={[
            { label: 'All', value: '' },
            { label: 'Open', value: 'open' },
            { label: 'Closed', value: 'closed' },
          ]}
          onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
          value={filters.status}
          placeholder="Select Status"
        />
      </FilterSection>

      <Button onClick={handleApply}>Apply Filters</Button>
    </Modal>
  );
};

export default AdvancedFilterModal;