import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Category, ScoringLevel, Rubric, RubricContent } from '../../api/types';
import { XMarkIcon } from "@heroicons/react/20/solid";

interface RubricEditModalProps {
  rubric: Rubric;
  onSave: (updatedRubric: Rubric) => void;
  onClose: () => void;
}

const RubricEditModal: React.FC<RubricEditModalProps> = ({ rubric, onSave, onClose }) => {
  const [editedRubric, setEditedRubric] = useState<Rubric>(rubric);

  useEffect(() => {
    setEditedRubric(rubric);
  }, [rubric]);

  const handleContentChange = (updatedContent: Partial<RubricContent>) => {
    setEditedRubric(prev => ({
      ...prev,
      content: { ...prev.content, ...updatedContent }
    }));
  };

  const handleCategoryChange = (index: number, field: keyof Category, value: string | number) => {
    const updatedCategories = [...editedRubric.content.categories];
    updatedCategories[index] = { ...updatedCategories[index], [field]: value };
    handleContentChange({ categories: updatedCategories });
  };

  const handleScoringLevelChange = (categoryIndex: number, levelIndex: number, field: keyof ScoringLevel, value: string | number) => {
    const updatedCategories = [...editedRubric.content.categories];
    updatedCategories[categoryIndex].scoring_levels[levelIndex] = {
      ...updatedCategories[categoryIndex].scoring_levels[levelIndex],
      [field]: field === 'score' ? Number(value) : value,
    };
    handleContentChange({ categories: updatedCategories });
  };

  const addCategory = () => {
    const newCategory: Category = {
      name: 'New Category',
      weight: 0,
      scoring_levels: [
        { level: 1, score: 0, description: 'Description for level 1' },
        { level: 2, score: 0, description: 'Description for level 2' },
      ],
    };
    handleContentChange({ categories: [...editedRubric.content.categories, newCategory] });
  };

  const removeCategory = (index: number) => {
    const updatedCategories = editedRubric.content.categories.filter((_, i) => i !== index);
    handleContentChange({ categories: updatedCategories });
  };

  const addScoringLevel = (categoryIndex: number) => {
    const updatedCategories = [...editedRubric.content.categories];
    const newLevel: ScoringLevel = {
      level: updatedCategories[categoryIndex].scoring_levels.length + 1,
      score: 0,
      description: `Description for level ${updatedCategories[categoryIndex].scoring_levels.length + 1}`,
    };
    updatedCategories[categoryIndex].scoring_levels.push(newLevel);
    handleContentChange({ categories: updatedCategories });
  };

  const removeScoringLevel = (categoryIndex: number, levelIndex: number) => {
    const updatedCategories = [...editedRubric.content.categories];
    updatedCategories[categoryIndex].scoring_levels = updatedCategories[categoryIndex].scoring_levels.filter((_, i) => i !== levelIndex);
    handleContentChange({ categories: updatedCategories });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Edit Rubric</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="rubric-title" className="block text-sm font-medium text-gray-700">
                Rubric Title
              </label>
              <input
                type="text"
                id="rubric-title"
                value={editedRubric.content.title}
                onChange={(e) => handleContentChange({ title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="rubric-description" className="block text-sm font-medium text-gray-700">
                Rubric Description
              </label>
              <textarea
                id="rubric-description"
                value={editedRubric.content.description}
                onChange={(e) => handleContentChange({ description: e.target.value })}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Categories</h3>
              <AnimatePresence>
                {editedRubric.content.categories.map((category, categoryIndex) => (
                  <motion.div
                    key={categoryIndex}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-50 p-4 rounded-lg mb-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => handleCategoryChange(categoryIndex, 'name', e.target.value)}
                        className="font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:border-indigo-500 focus:outline-none"
                      />
                      <button
                        onClick={() => removeCategory(categoryIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">Weight (%)</label>
                      <input
                        type="number"
                        value={category.weight}
                        onChange={(e) => handleCategoryChange(categoryIndex, 'weight', Number(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">Scoring Levels</h4>
                    {category.scoring_levels.map((level, levelIndex) => (
                      <div key={levelIndex} className="mb-2 p-2 bg-white rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Level {level.level}</span>
                          <button
                            onClick={() => removeScoringLevel(categoryIndex, levelIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Score</label>
                            <input
                              type="number"
                              value={level.score}
                              onChange={(e) => handleScoringLevelChange(categoryIndex, levelIndex, 'score', Number(e.target.value))}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                              value={level.description}
                              onChange={(e) => handleScoringLevelChange(categoryIndex, levelIndex, 'description', e.target.value)}
                              rows={2}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => addScoringLevel(categoryIndex)}
                      className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" /> Add Scoring Level
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                onClick={addCategory}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" /> Add Category
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(editedRubric)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RubricEditModal;