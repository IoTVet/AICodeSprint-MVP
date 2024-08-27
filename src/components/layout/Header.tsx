import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiBell, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../Avatar';
import {
  Box,
  Flex,
  Input,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      as={motion.header}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      // transition={{ duration: 0.3 }}
      bg={bgColor}
      boxShadow="sm"
      py={4}
      px={8}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center" width="100%" maxWidth="600px">
          <Input
            placeholder="Search..."
            variant="filled"
            size="md"
            borderRadius="full"
            _focus={{ boxShadow: 'none' }}
            mr={4}
          />
          <IconButton
            aria-label="Search"
            icon={<FiSearch />}
            size="md"
            colorScheme="blue"
            borderRadius="full"
          />
        </Flex>

        <Flex align="center">
          <IconButton
            aria-label="Notifications"
            icon={<FiBell />}
            size="md"
            variant="ghost"
            mr={2}
            position="relative"
          >
            <Badge
              position="absolute"
              top="-1"
              right="-1"
              colorScheme="red"
              borderRadius="full"
              boxSize="1.25em"
            >
              3
            </Badge>
          </IconButton>

          <Menu>
            <MenuButton>
              <Avatar
                src={user?.profile_picture}
                name={`${user?.first_name} ${user?.last_name}` || 'User'}
                size={40}
              />
            </MenuButton>
            <MenuList>
              <Text px={3} py={2} fontWeight="bold" color={textColor}>
                {`${user?.first_name} ${user?.last_name}`}
              </Text>
              <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};