import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Input, Textarea, Button, Select, Text } from "@chakra-ui/react";
import { contextNoteService } from '../../api/services/jobPostingService';
import { ContextNote, PaginatedResponse } from '../../api/types';

interface ContextNotesManagerProps {
  jobPostingId: number;
}

const ContextNotesManager: React.FC<ContextNotesManagerProps> = ({ jobPostingId }) => {
  const [contextNotes, setContextNotes] = useState<ContextNote[]>([]);
  const [newNote, setNewNote] = useState({ category: '', content: '' });
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchContextNotes();
    fetchCategories();
  }, [jobPostingId]);

  const fetchContextNotes = async () => {
    try {
      const response = await contextNoteService.getAll(jobPostingId);
      setContextNotes(response.data.results);  // Use the 'results' array from the paginated response
    } catch (error) {
      console.error('Error fetching context notes:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await contextNoteService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateNote = async () => {
    try {
      await contextNoteService.create({ ...newNote, job_posting: jobPostingId });
      setNewNote({ category: '', content: '' });
      fetchContextNotes();
    } catch (error) {
      console.error('Error creating context note:', error);
    }
  };

  const handleUpdateNote = async (id: number, updatedNote: Partial<ContextNote>) => {
    try {
      await contextNoteService.update(id, updatedNote);
      fetchContextNotes();
    } catch (error) {
      console.error('Error updating context note:', error);
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await contextNoteService.delete(id);
      fetchContextNotes();
    } catch (error) {
      console.error('Error deleting context note:', error);
    }
  };

  return (
    <Box>
      <Heading size="md" mb={4}>Context Notes</Heading>
      <VStack spacing={4} align="stretch">
        {contextNotes.map((note) => (
          <Box key={note.id} p={4} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">{note.category}</Text>
            <Text>{note.content}</Text>
            <Button onClick={() => handleDeleteNote(note.id)} size="sm" colorScheme="red" mt={2}>Delete</Button>
          </Box>
        ))}
        <Box>
          <Select
            placeholder="Select category"
            value={newNote.category}
            onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
          <Input
            placeholder="New category"
            value={newNote.category}
            onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
            mt={2}
          />
          <Textarea
            placeholder="Enter note content"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            mt={2}
          />
          <Button onClick={handleCreateNote} colorScheme="blue" mt={2}>Add Note</Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default ContextNotesManager;