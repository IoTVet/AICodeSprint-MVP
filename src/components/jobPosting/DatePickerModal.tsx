import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiX } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  title,
  onConfirm,
  onCancel,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <FiCalendar className="text-blue-500 mr-2" />
                {title}
              </h2>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
                minDate={new Date()}
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedDate}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ${
                  !selectedDate && 'opacity-50 cursor-not-allowed'
                }`}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DatePickerModal;