import React from 'react';
import styled from 'styled-components';
import { Input } from './Input';
import { Dropdown } from './Dropdown';
import { Button } from './Button';
import { FiFilter, FiX } from 'react-icons/fi';

const FilterBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
    & > div {
    width: 200px;
  }
`;

interface FilterOption {
  label: string;
  value: string;
}

interface SortOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  searchPlaceholder: string;
  filterOptions: FilterOption[];
  sortOptions: SortOption[];
  onSearch: (searchTerm: string) => void;
  onFilter: (filterValue: string) => void;
  onSort: (sortValue: string) => void;
  onClearFilters: () => void;
  onAdvancedFilters: () => void;
  currentSearchTerm: string;
  currentFilterValue: string;
  currentSortValue: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder,
  filterOptions,
  sortOptions,
  onSearch,
  onFilter,
  onSort,
  onClearFilters,
  onAdvancedFilters,
  currentSearchTerm,
  currentFilterValue,
  currentSortValue,
}) => {
  const isFiltersApplied = () => {
    return currentSearchTerm !== '' || 
           currentFilterValue !== filterOptions[0].value || 
           currentSortValue !== sortOptions[0].value;
  };

  return (
    <FilterBarContainer>
      <Input
        placeholder={searchPlaceholder}
        onChange={(e) => onSearch(e.target.value)}
        value={currentSearchTerm}
      />
      <FilterGroup>
        <Dropdown
          items={filterOptions}
          onChange={onFilter}
          placeholder="Filter by"
          value={currentFilterValue}
        />
        <Dropdown
          items={sortOptions}
          onChange={onSort}
          placeholder="Sort by"
          value={currentSortValue}
        />
      </FilterGroup>
      <Button
        variant="secondary"
        icon={<FiFilter />}
        onClick={onAdvancedFilters}
      >
        Advanced Filters
      </Button>
      {isFiltersApplied() && (
        <Button
          variant="tertiary"
          icon={<FiX />}
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      )}
    </FilterBarContainer>
  );
};

export default FilterBar;