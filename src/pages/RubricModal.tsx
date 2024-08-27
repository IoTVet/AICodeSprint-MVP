import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/TextArea';
import { rubricService } from '../api/services/jobPostingService';
import { Rubric, RubricContent, Category, ScoringLevel } from "../api/types";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

import 'react-resizable/css/styles.css';
import LoadingAnimation from '../components/common/LoadingAnimation';
import MiniLoadingAnimation from '../components/common/MiniLoadingAnimation';

const ModalContent = styled(ResizableBox)`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const RubricContainer = styled(motion.div)`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ScrollableContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const RubricTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  flex-grow: 1;
`;

const TableHead = styled.thead`
  background-color: #f3f4f6;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const TableBody = styled.tbody`
  background-color: white;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f9fafb;
  }
`;

const TableHeader = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #374151;
  border-top: 1px solid #e5e7eb;
  position: relative;
  cursor: pointer;
`;

const CellContent = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const FullTextPopup = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ActionButton = styled(Button)`
  padding: 0.25rem;
  font-size: 1rem;
  margin-left: 0.25rem;
`;

const EditCellModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const EditCellContent = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
`;

const RubricModal: React.FC<{ jobPostingId: number; onClose: () => void }> = ({ jobPostingId, onClose }) => {
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [modalSize, setModalSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    fetchRubric();
    calculateInitialSize();
    window.addEventListener('resize', calculateInitialSize);
    return () => window.removeEventListener('resize', calculateInitialSize);
  }, [jobPostingId]);

  const calculateInitialSize = () => {
    const screenArea = window.innerWidth * window.innerHeight;
    const modalArea = screenArea * 0.9; // 90% of screen area
    const aspectRatio = 4 / 3; // You can adjust this for your preferred shape
    const width = Math.sqrt(modalArea * aspectRatio);
    const height = width / aspectRatio;
    setModalSize({ width: Math.floor(width), height: Math.floor(height) });
  };

  const fetchRubric = async () => {
    try {
      const response = await rubricService.getById(rubric!.id);
      setRubric(response.data);
    } catch (error) {
      console.error('Error fetching rubric:', error);
    }
  };

  const handleCellEdit = (row: number, col: number, value: string | number) => {
    if (!rubric) return;

    const updatedRubric = { ...rubric };
    if (row === -1 && col === -1) {
      // Editing rubric title
      updatedRubric.content.title = value as string;
    } else if (row === -1) {
      // Editing level (this should not happen as levels are now numbers)
      console.warn("Attempting to edit level number, which should be auto-generated");
    } else if (col === -1) {
      // Editing category name
      updatedRubric.content.categories[row].name = value as string;
    } else {
      // Editing scoring level description
      updatedRubric.content.categories[row].scoring_levels[col].description = value as string;
    }

    setRubric(updatedRubric);
  };

  const addCategory = () => {
    if (!rubric) return;

    const newCategory: Category = {
      name: 'New Category',
      weight: 0,
      scoring_levels: rubric.content.categories[0].scoring_levels.map(level => ({
        ...level,
        description: ''
      }))
    };

    const updatedRubric = {
      ...rubric,
      content: {
        ...rubric.content,
        categories: [...rubric.content.categories, newCategory]
      }
    };

    setRubric(updatedRubric);
  };

  const removeCategory = (index: number) => {
    if (!rubric) return;

    const updatedRubric = {
      ...rubric,
      content: {
        ...rubric.content,
        categories: rubric.content.categories.filter((_, i) => i !== index)
      }
    };

    setRubric(updatedRubric);
  };

  const addScoringLevel = () => {
    if (!rubric) return;

    const newLevelNumber = rubric.content.categories[0].scoring_levels.length + 1;
    const newLevel: ScoringLevel = {
      level: newLevelNumber,
      score: 0,
      description: ''
    };

    const updatedRubric = {
      ...rubric,
      content: {
        ...rubric.content,
        categories: rubric.content.categories.map(category => ({
          ...category,
          scoring_levels: [...category.scoring_levels, newLevel]
        }))
      }
    };

    setRubric(updatedRubric);
  };

  const removeScoringLevel = (index: number) => {
    if (!rubric) return;

    const updatedRubric = {
      ...rubric,
      content: {
        ...rubric.content,
        categories: rubric.content.categories.map(category => ({
          ...category,
          scoring_levels: category.scoring_levels
            .filter((_, i) => i !== index)
            .map((level, newIndex) => ({ ...level, level: newIndex + 1 }))
        }))
      }
    };

    setRubric(updatedRubric);
  };

  const handleSaveRubric = async () => {
  if (rubric) {
    try {
      await rubricService.update(rubric);
      setIsEditing(false);
      fetchRubric();
    } catch (error) {
      console.error('Error updating rubric:', error);
    }
  }
};

  const truncateText = (text: string, maxWords: number) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  if (!rubric) return <MiniLoadingAnimation />;

  return (
    <Modal isOpen={true} onClose={onClose} title="Rubric Editor">
      <ModalContent
        width={modalSize.width}
        height={modalSize.height}
        minConstraints={[300, 300]}
        maxConstraints={[window.innerWidth * 0.95, window.innerHeight * 0.95]}
        onResize={(e: React.SyntheticEvent, { size }: ResizeCallbackData) => setModalSize(size)}
      >
        <RubricContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold">
              {isEditing ? (
                <Input
                  value={rubric?.content.title || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCellEdit(-1, -1, e.target.value)}
                />
              ) : (
                rubric?.content.title || 'Rubric'
              )}
            </h2>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <FiEdit2 className="mr-2" />
                Edit Rubric
              </Button>
            )}
          </div>
          <ScrollableContent>
            <RubricTable>
              <TableHead>
                <TableRow>
                  <TableHeader>Category</TableHeader>
                  {rubric?.content.categories[0].scoring_levels.map((level, index) => (
                    <TableHeader key={index}>
                      Level {level.level}
                      {isEditing && (
                        <ActionButton onClick={() => removeScoringLevel(index)}>
                          <FiTrash2 />
                        </ActionButton>
                      )}
                    </TableHeader>
                  ))}
                  {isEditing && (
                    <TableHeader>
                      <ActionButton onClick={addScoringLevel}>
                        <FiPlus />
                      </ActionButton>
                    </TableHeader>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {rubric.content.categories.map((category, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={category.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCellEdit(rowIndex, -1, e.target.value)}
                        />
                      ) : (
                        `${category.name} (${category.weight}%)`
                      )}
                      {isEditing && (
                        <ActionButton onClick={() => removeCategory(rowIndex)}>
                          <TrashIcon className="h-4 w-4" />
                        </ActionButton>
                      )}
                    </TableCell>
                    {category.scoring_levels.map((level, colIndex) => (
                      <TableCell
                        key={colIndex}
                        onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={() => isEditing && setEditingCell({ row: rowIndex, col: colIndex })}
                      >
                        <CellContent>{truncateText(level.description, 30)}</CellContent>
                        {hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex && (
                          <FullTextPopup
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            {level.description}
                          </FullTextPopup>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </RubricTable>
          </ScrollableContent>
          {isEditing && (
            <div className="mt-4 flex justify-between p-4 border-t">
              <Button onClick={addCategory}>
                <FiPlus className="mr-2" />
                Add Category
              </Button>
              <div>
                <Button onClick={handleSaveRubric} className="mr-2">Save</Button>
                <Button onClick={() => setIsEditing(false)} variant="secondary">Cancel</Button>
              </div>
            </div>
          )}
        </RubricContainer>
      </ModalContent>
      <AnimatePresence>
        {editingCell && (
          <EditCellModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingCell(null)}
          >
            <EditCellContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <Textarea
                value={rubric.content.categories[editingCell.row].scoring_levels[editingCell.col].description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleCellEdit(editingCell.row, editingCell.col, e.target.value)}
              />
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setEditingCell(null)}>
                  <FiX className="mr-2" />
                  Close
                </Button>
              </div>
            </EditCellContent>
          </EditCellModal>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default RubricModal;