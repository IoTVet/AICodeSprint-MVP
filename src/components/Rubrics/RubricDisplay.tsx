import React, { useState, useRef, useEffect } from 'react';
import { PencilIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/20/solid';
import { motion, AnimatePresence } from 'framer-motion';
import {RubricContent, Category, ScoringLevel, Rubric} from '../../api/types';

interface RubricDisplayProps {
  rubric: Rubric | null;
  onEditRubric: () => void;
  isApproved: boolean;
  onApproveRubric: () => void;
}

const RubricDisplay: React.FC<RubricDisplayProps> = ({
  rubric,
  onEditRubric,
  isApproved,
  onApproveRubric
}) => {

  const [hoveredCell, setHoveredCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const rubricRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rubricRef.current && !rubricRef.current.contains(event.target as Node)) {
        setHoveredCell(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!rubric) {
    return <p>No rubric available.</p>;
  }

  if (!rubric || !rubric.content || rubric.content.categories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-6 bg-gradient-to-r from-yellow-100 to-yellow-200 border-l-4 border-yellow-500 rounded-lg shadow-lg"
      >
        <p className="text-xl font-bold text-yellow-800 mb-2">No valid rubric available</p>
        <p className="text-yellow-700">Please create or update the rubric for this assignment.</p>
      </motion.div>
    );
  }

  const handleCellHover = (event: React.MouseEvent, rowIndex: number, colIndex: number) => {
    const cellRect = event.currentTarget.getBoundingClientRect();
    const rubricRect = rubricRef.current!.getBoundingClientRect();

    setPopoverPosition({
      top: cellRect.top - rubricRect.top - 10,
      left: cellRect.left - rubricRect.left + cellRect.width / 2,
    });

    setHoveredCell({ rowIndex, colIndex });
  };

  const getCellBackgroundColor = (levelIndex: number, totalLevels: number) => {
    const hue = 200; // Blue hue
    const saturation = 80;
    const lightness = 85 - (levelIndex / (totalLevels - 1)) * 20;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <motion.div
      ref={rubricRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 bg-white rounded-lg shadow-2xl overflow-hidden relative"
    >
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{rubric.content.title || 'Grading Rubric'}</h2>
            <p className="mt-2 text-sm text-gray-600 flex items-center">
              <InformationCircleIcon className="h-5 w-5 mr-1 text-blue-500" />
              This rubric will be used to evaluate submissions. Please review and approve if it aligns with your grading preferences.
            </p>
          </div>
          <div className="flex space-x-2">
            {!isApproved && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onApproveRubric}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Approve Rubric
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEditRubric}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Rubric
            </motion.button>
          </div>
        </div>
      </div>

      <div className="p-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-1/4 p-3 bg-gray-100 border border-gray-300 font-semibold text-gray-700">Category</th>
              {rubric.content.categories[0].scoring_levels.map((_, index) => (
                <th key={index} className="p-3 bg-gray-100 border border-gray-300 font-semibold text-gray-700">
                  Level {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rubric.content.categories.map((category: Category, rowIndex: number) => (
              <tr key={rowIndex}>
                <td className="p-3 border border-gray-300 font-medium text-gray-800 bg-gray-50">
                  {category.name}
                  <span className="block text-sm text-gray-500 mt-1">Weight: {category.weight}%</span>
                </td>
                {category.scoring_levels.map((level: ScoringLevel, colIndex: number) => (
                  <td
                    key={colIndex}
                    className="p-3 border border-gray-300 text-sm relative overflow-hidden group"
                    style={{ backgroundColor: getCellBackgroundColor(colIndex, category.scoring_levels.length) }}
                    onMouseEnter={(e) => handleCellHover(e, rowIndex, colIndex)}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div className="h-full">
                      {level.description.length > 100 ? `${level.description.substring(0, 100)}...` : level.description}
                      <span className="absolute bottom-1 right-1 font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {level.score} pts
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <AnimatePresence>
          {hoveredCell && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 bg-white p-4 rounded-lg shadow-xl border border-gray-200 max-w-md"
              style={{
                top: popoverPosition.top,
                left: popoverPosition.left,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="text-sm text-gray-800">
                {rubric.content.categories[hoveredCell.rowIndex].scoring_levels[hoveredCell.colIndex].description}
              </div>
              <div className="text-sm font-bold text-blue-600 mt-2">
                Score: {rubric.content.categories[hoveredCell.rowIndex].scoring_levels[hoveredCell.colIndex].score} points
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RubricDisplay;