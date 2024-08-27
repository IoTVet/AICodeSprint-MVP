import React from 'react';
import { Box, Text, Flex, Avatar, useColorModeValue, Link } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RiRobot2Line, RiUser3Line } from 'react-icons/ri';

interface MarkdownContentProps {
  children: string;
}

const CodeBlock: React.FC<{ inline?: boolean; children?: React.ReactNode }> = ({ inline, children }) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  return (
    <Box
      as="code"
      bg={bgColor}
      color={textColor}
      p={inline ? 1 : 2}
      borderRadius="md"
      fontSize="sm"
    >
      {children}
    </Box>
  );
};
const MarkdownContent: React.FC<MarkdownContentProps> = ({ children }) => {
  const bgColor = useColorModeValue(
    'gray.100',
    'gray.700'
  );
  const textColor = useColorModeValue(
    'black',
     'gray.100'
  );
  const linkColor = useColorModeValue('blue.600', 'blue.300');
  const codeColor = useColorModeValue('gray.100', 'gray.700');

  const components: Components = {
  p: ({ node, ...props }) => <Text fontSize="sm" mb={2} {...props} />,
  ul: ({ node, ...props }) => <Box as="ul" pl={4} mb={2} {...props} />,
  ol: ({ node, ...props }) => <Box as="ol" pl={4} mb={2} {...props} />,
  li: ({ node, ...props }) => <Box as="li" mb={1} {...props} />,
  a: ({ node, ...props }) => (
    <Link
      color="brand.500"
      textDecoration="underline"
      _hover={{ color: 'brand.600' }}
      {...props}
    />
  ),
  code: ({ inline, children, ...props }: { inline?: boolean; children?: React.ReactNode }) => (
    <CodeBlock inline={inline}>{children}</CodeBlock>
  ),
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Flex justifyContent={'flex-end'} alignItems="flex-end" mb={4}>
        <Box
          bg={bgColor}
          color={textColor}
          borderRadius="1px"
          px={4}
          py={3}
          maxWidth="100%"
          boxShadow="md"
        >

            <Box fontSize="sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {children}
              </ReactMarkdown>
            </Box>

        </Box>



      </Flex>
    </motion.div>
  );
};

export default MarkdownContent;