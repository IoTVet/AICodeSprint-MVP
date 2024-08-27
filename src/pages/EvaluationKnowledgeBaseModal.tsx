import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/TextArea';
import  FilterBar  from '../components/common/FilterBar';
import  Pagination  from '../components/common/Pagination';
import {
  jobPostingService,
  evaluationService,
  critiqueService,
  applicantService
} from '../api/services/jobPostingService';
import { JobPosting, Evaluation, Critique } from '../api/types';
import usePaginatedData from '../hooks/usePaginatedData';
import LoadingAnimation from '../components/common/LoadingAnimation';
import MiniLoadingAnimation from '../components/common/MiniLoadingAnimation';

const EvaluationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const EvaluationItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  margin-bottom: 1rem;
  padding: 1rem;
`;

const EvaluationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const EvaluationScore = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const EvaluationContent = styled.div`
  margin-top: 0.5rem;
`;

const CritiqueContent = styled.div`
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

interface EvaluationKnowledgeBaseModalProps {
  jobPosting: JobPosting;
  onClose: () => void;
}

const EvaluationKnowledgeBaseModal: React.FC<EvaluationKnowledgeBaseModalProps> = ({ jobPosting, onClose }) => {
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null);
  const [editingCritique, setEditingCritique] = useState<Critique | null>(null);

  const {
    data: evaluations,
    loading,
    error,
    page,
    totalPages,
    search,
    ordering,
    setPage,
    setSearch,
    setOrdering,
    refetch,
  } = usePaginatedData<Evaluation>({
    fetchFunction: (params) => evaluationService.getAll({page: 1}),
    initialOrdering: '-created_at',
  });

  const handleApproveEvaluation = async (evaluationId: number) => {
    try {
      await evaluationService.approve(evaluationId);
      refetch();
    } catch (error) {
      console.error('Error approving evaluation:', error);
    }
  };

  const handleEditEvaluation = (evaluation: Evaluation) => {
    setEditingEvaluation(evaluation);
  };

  const handleEditCritique = (critique: Critique) => {
    setEditingCritique(critique);
  };

  const handleSaveEvaluation = async () => {
    if (editingEvaluation) {
      try {
        await evaluationService.update(editingEvaluation.id, editingEvaluation);
        setEditingEvaluation(null);
        refetch();
      } catch (error) {
        console.error('Error updating evaluation:', error);
      }
    }
  };

  const handleSaveCritique = async () => {
    if (editingCritique && editingEvaluation) {
      try {
        await critiqueService.update(editingCritique.id, editingCritique);
        setEditingCritique(null);
        refetch();
      } catch (error) {
        console.error('Error updating critique:', error);
      }
    }
  };

  const filterOptions = [
    { label: 'All', value: '' },
    { label: 'Approved', value: 'approved' },
    { label: 'Not Approved', value: 'not_approved' },
  ];

  const sortOptions = [
    { label: 'Newest', value: '-created_at' },
    { label: 'Oldest', value: 'created_at' },
    { label: 'Highest Score', value: '-overall_score' },
    { label: 'Lowest Score', value: 'overall_score' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState(filterOptions[0].value);
  const [sortValue, setSortValue] = useState(sortOptions[0].value);
  const [isAdvancedFilterModalOpen, setIsAdvancedFilterModalOpen] = useState(false);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Evaluation Knowledge Base for ${jobPosting.title}`}
    >
           <FilterBar
          searchPlaceholder="Search evaluations..."
          filterOptions={filterOptions}
          sortOptions={sortOptions}
          onSearch={(value) => {
            setSearchTerm(value);
            setSearch(value);
          }}
          onFilter={(value) => {
            setFilterValue(value);
            setSearch(value ? `status=${value}` : '');
          }}
          onSort={(value) => {
            setSortValue(value);
            setOrdering(value);
          }}
          onClearFilters={() => {
            setSearchTerm('');
            setFilterValue(filterOptions[0].value);
            setSortValue(sortOptions[0].value);
            setSearch('');
            setOrdering('-created_at');
          }}
          onAdvancedFilters={() => setIsAdvancedFilterModalOpen(true)}
          currentSearchTerm={searchTerm}
          currentFilterValue={filterValue}
          currentSortValue={sortValue}
        />
      {loading && <MiniLoadingAnimation />}
      {error && <p>Error: {error.message}</p>}
      <EvaluationList>
        <AnimatePresence>
          {evaluations.map((evaluation) => (
            <motion.div
              key={evaluation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EvaluationItem>
                <EvaluationHeader>
                  <span>Applicant ID: 1</span>
                  <EvaluationScore>{(evaluation.overall_score * 100).toFixed(2)}%</EvaluationScore>
                </EvaluationHeader>
                <EvaluationContent>
                  {editingEvaluation?.id === evaluation.id ? (
                    <>
                      <Textarea
                        value={JSON.stringify(editingEvaluation.content)}
                        onChange={(e) => setEditingEvaluation({
                          ...editingEvaluation,
                          content: JSON.parse(e.target.value)
                        })}
                      />
                      <ButtonGroup>
                        <Button onClick={handleSaveEvaluation}>Save</Button>
                        <Button variant="secondary" onClick={() => setEditingEvaluation(null)}>Cancel</Button>
                      </ButtonGroup>
                    </>
                  ) : (
                    <>
                      <pre>{JSON.stringify(evaluation.content, null, 2)}</pre>
                      <Button variant="secondary" onClick={() => handleEditEvaluation(evaluation)}>Edit</Button>
                    </>
                  )}
                </EvaluationContent>
                {/*{evaluation.critique && (*/}
                {/*  <CritiqueContent>*/}
                {/*    <h4>Critique:</h4>*/}
                {/*    {editingCritique?.id === evaluation.critique.id ? (*/}
                {/*      <>*/}
                {/*        <Textarea*/}
                {/*          value={JSON.stringify(editingCritique.content)}*/}
                {/*          onChange={(e) => setEditingCritique({*/}
                {/*            ...editingCritique,*/}
                {/*            content: JSON.parse(e.target.value)*/}
                {/*          })}*/}
                {/*        />*/}
                {/*        <ButtonGroup>*/}
                {/*          <Button onClick={handleSaveCritique}>Save</Button>*/}
                {/*          <Button variant="secondary" onClick={() => setEditingCritique(null)}>Cancel</Button>*/}
                {/*        </ButtonGroup>*/}
                {/*      </>*/}
                {/*    ) : (*/}
                {/*      <>*/}
                {/*        <pre>{JSON.stringify(evaluation.critique.content, null, 2)}</pre>*/}
                {/*        <Button*/}
                {/*          variant="secondary"*/}
                {/*          onClick={() => evaluation.critique && handleEditCritique(evaluation.critique)}*/}
                {/*        >*/}
                {/*          Edit*/}
                {/*        </Button>*/}
                {/*      </>*/}
                {/*    )}*/}
                {/*  </CritiqueContent>*/}
                {/*)}*/}
                {!evaluation.human_approved && (
                  <Button onClick={() => handleApproveEvaluation(evaluation.id)}>
                    Approve Evaluation
                  </Button>
                )}
              </EvaluationItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </EvaluationList>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </Modal>
  );
};

export default EvaluationKnowledgeBaseModal;