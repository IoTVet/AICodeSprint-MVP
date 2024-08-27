// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Modal } from '../components/common/Modal';
// import { Button } from '../components/common/Button';
// import { Input } from '../components/common/Input';
// import { Textarea } from '../components/common/Textarea';
// import { jobPostingService, evaluationService, critiqueService } from '../api/services/jobPostingService';
// import { JobPosting, Evaluation, Critique } from '../api/types';
//
// const EvaluationList = styled.div`
//   max-height: 400px;
//   overflow-y: auto;
// `;
//
// const EvaluationItem = styled.div`
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   border-radius: 4px;
//   margin-bottom: 1rem;
//   padding: 1rem;
// `;
//
// const EvaluationHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 0.5rem;
// `;
//
// const EvaluationScore = styled.span`
//   font-size: 1.25rem;
//   font-weight: bold;
//   color: ${({ theme }) => theme.colors.primary};
// `;
//
// const EvaluationContent = styled.div`
//   margin-top: 0.5rem;
// `;
//
// const CritiqueContent = styled.div`
//   margin-top: 0.5rem;
//   padding-top: 0.5rem;
//   border-top: 1px solid ${({ theme }) => theme.colors.border};
// `;
//
// const ButtonGroup = styled.div`
//   display: flex;
//   gap: 0.5rem;
//   margin-top: 0.5rem;
// `;
//
// interface EvaluationKnowledgeBaseModalProps {
//   jobPosting: JobPosting;
//   onClose: () => void;
// }
//
// const EvaluationKnowledgeBaseModal: React.FC<EvaluationKnowledgeBaseModalProps> = ({ jobPosting, onClose }) => {
//   const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null);
//   const [editingCritique, setEditingCritique] = useState<Critique | null>(null);
//
//   useEffect(() => {
//     fetchEvaluations();
//   }, [jobPosting.id]);
//
//   const fetchEvaluations = async () => {
//     try {
//       const response = await jobPostingService.getEvaluations(jobPosting.id);
//       setEvaluations(response.data);
//     } catch (error) {
//       console.error('Error fetching evaluations:', error);
//     }
//   };
//
//   const handleApproveEvaluation = async (evaluationId: number) => {
//     try {
//       await jobPostingService.approveEvaluation(jobPosting.id, evaluationId);
//       fetchEvaluations();
//     } catch (error) {
//       console.error('Error approving evaluation:', error);
//     }
//   };
//
//   const handleEditEvaluation = (evaluation: Evaluation) => {
//     setEditingEvaluation(evaluation);
//   };
//
//   const handleEditCritique = (critique: Critique) => {
//     setEditingCritique(critique);
//   };
//
//   const handleSaveEvaluation = async () => {
//     if (editingEvaluation) {
//       try {
//         await evaluationService.update(jobPosting.id, editingEvaluation.id, editingEvaluation);
//         setEditingEvaluation(null);
//         fetchEvaluations();
//       } catch (error) {
//         console.error('Error updating evaluation:', error);
//       }
//     }
//   };
//
//   const handleSaveCritique = async () => {
//     if (editingCritique && editingEvaluation) {
//       try {
//         await critiqueService.update(jobPosting.id, editingEvaluation.id, editingCritique.id, editingCritique);
//         setEditingCritique(null);
//         fetchEvaluations();
//       } catch (error) {
//         console.error('Error updating critique:', error);
//       }
//     }
//   };
//
//   const filteredEvaluations = evaluations.filter(evaluation =>
//     evaluation.applicant_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//
//   return (
//     <Modal
//       isOpen={true}
//       onClose={onClose}
//       title={`Evaluation Knowledge Base for ${jobPosting.title}`}
//     >
//       <Input
//         placeholder="Search evaluations..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <EvaluationList>
//         <AnimatePresence>
//           {filteredEvaluations.map((evaluation) => (
//             <motion.div
//               key={evaluation.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//             >
//               <EvaluationItem>
//                 <EvaluationHeader>
//                   <span>{evaluation.applicant_name}</span>
//                   <EvaluationScore>{(evaluation.overall_score * 100).toFixed(2)}%</EvaluationScore>
//                 </EvaluationHeader>
//                 <EvaluationContent>
//                   {editingEvaluation?.id === evaluation.id ? (
//                     <>
//                       <Textarea
//                         value={editingEvaluation.content.join('\n')}
//                         onChange={(e) => setEditingEvaluation({
//                           ...editingEvaluation,
//                           content: e.target.value.split('\n')
//                         })}
//                       />
//                       <ButtonGroup>
//                         <Button onClick={handleSaveEvaluation}>Save</Button>
//                         <Button variant="secondary" onClick={() => setEditingEvaluation(null)}>Cancel</Button>
//                       </ButtonGroup>
//                     </>
//                   ) : (
//                     <>
//                       {evaluation.content.map((item, index) => (
//                         <p key={index}>{item}</p>
//                       ))}
//                       <Button variant="secondary" onClick={() => handleEditEvaluation(evaluation)}>Edit</Button>
//                     </>
//                   )}
//                 </EvaluationContent>
//                 <CritiqueContent>
//                   <h4>Critique:</h4>
//                   {editingCritique?.id === evaluation.critique.id ? (
//                     <>
//                       <Textarea
//                         value={editingCritique.content}
//                         onChange={(e) => setEditingCritique({
//                           ...editingCritique,
//                           content: e.target.value
//                         })}
//                       />
//                       <ButtonGroup>
//                         <Button onClick={handleSaveCritique}>Save</Button>
//                         <Button variant="secondary" onClick={() => setEditingCritique(null)}>Cancel</Button>
//                       </ButtonGroup>
//                     </>
//                   ) : (
//                     <>
//                       <p>{evaluation.critique.content}</p>
//                       <Button variant="secondary" onClick={() => handleEditCritique(evaluation.critique)}>Edit</Button>
//                     </>
//                   )}
//                 </CritiqueContent>
//                 {!evaluation.human_approved && (
//                   <Button onClick={() => handleApproveEvaluation(evaluation.id)}>
//                     Approve Evaluation
//                   </Button>
//                 )}
//               </EvaluationItem>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </EvaluationList>
//     </Modal>
//   );
// };
export default {};