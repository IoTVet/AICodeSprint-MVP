import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Flex,
  VStack,
  Icon,
  Text,
  Tooltip,
  Avatar,
  Button,
  Divider,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Heading,
  useBreakpointValue,
  IconButton,
} from '@chakra-ui/react';
import {
  FiHome,
  FiBriefcase,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiBookOpen,
  FiLogOut,
  FiUser,
  FiMenu,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { icon: FiHome, label: 'Dashboard', to: '/' },
  { icon: FiBriefcase, label: 'Job Postings', to: '/job-postings' },
  { icon: FiUsers, label: 'Applicants', to: '/applicants' },
  { icon: FiBookOpen, label: 'Company Context', to: '/company-context' },
  { icon: FiBarChart2, label: 'Analytics', to: '/analytics' },
  { icon: FiSettings, label: 'Settings', to: '/settings' },
];

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

export const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const activeBgColor = useColorModeValue('blue.50', 'blue.900');
  const activeTextColor = 'blue.500';
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  useEffect(() => {
    if (isMobile) {
      onClose();
    }
  }, [location, isMobile, onClose]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const sidebarWidth = isExpanded ? '240px' : '80px';

  const SidebarContent = useMemo(() => (
    <VStack spacing={6} align="stretch" w={sidebarWidth} h="full">
      <Flex direction="column" align="center" py={4} px={2}>
        <Avatar
          size="lg"
          src={user?.profile_picture}
          name={`${user?.first_name} ${user?.last_name}`}
          mb={2}
        />
        <AnimatePresence>
          {isExpanded && (
            <MotionFlex
              direction="column"
              align="center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Heading size="sm">{`${user?.first_name} ${user?.last_name}`}</Heading>
              <Text fontSize="xs" color="gray.500">{user?.email}</Text>
              {user?.company?.name && (
                <Text fontSize="xs" fontWeight="bold" color={activeTextColor}>
                  {user.company.name}
                </Text>
              )}
            </MotionFlex>
          )}
        </AnimatePresence>
      </Flex>

      <VStack spacing={1} align="stretch" px={2}>
        {navItems.map(({ icon, label, to }) => (
          <Tooltip key={to} label={label} placement="right" isDisabled={isExpanded}>
            <Box>
              <NavLink to={to} onClick={isMobile ? onClose : undefined}>
                {({ isActive }) => (
                  <MotionFlex
                    align="center"
                    p={3}
                    borderRadius="md"
                    bg={isActive ? activeBgColor : 'transparent'}
                    color={isActive ? activeTextColor : textColor}
                    _hover={{ bg: hoverBgColor }}
                    transition={{ duration: 0.2 }}
                    animate={{ width: isExpanded ? '100%' : '48px' }}
                  >
                    <Icon as={icon} boxSize={5} flexShrink={0} />
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                        >
                          <Text ml={4} fontWeight={isActive ? 'bold' : 'normal'}>{label}</Text>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </MotionFlex>
                )}
              </NavLink>
            </Box>
          </Tooltip>
        ))}
      </VStack>

      <Divider my={200} />

      <VStack spacing={2} p={2}>
        <Menu>
          <Tooltip label="User Menu" placement="right" isDisabled={isExpanded}>
            <MenuButton
              as={Button}
              variant="ghost"
              w="full"
              justifyContent={isExpanded ? 'flex-start' : 'center'}
            >
              <Icon as={FiUser} boxSize={5} />
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                  >
                    <Text ml={4}>{user?.first_name} {user?.last_name}</Text>
                  </motion.div>
                )}
              </AnimatePresence>
            </MenuButton>
          </Tooltip>
          <MenuList zIndex={11}>
            <MenuItem icon={<FiUser />}>Profile</MenuItem>
            <MenuItem icon={<FiSettings />}>Account Settings</MenuItem>
            <MenuItem icon={<FiLogOut />} onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>

        {!isMobile && (
          <Tooltip label={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'} placement="right">
            <Button
              variant="ghost"
              w="full"
              justifyContent={isExpanded ? 'flex-start' : 'center'}
              onClick={toggleSidebar}
              mt={2}
            >
              <Icon as={isExpanded ? FiChevronLeft : FiChevronRight} boxSize={5} />
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                  >
                    <Text ml={4}>{isExpanded ? 'Collapse' : 'Expand'}</Text>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </Tooltip>
        )}
      </VStack>
    </VStack>
  ), [isExpanded, user, isMobile, onClose, activeBgColor, activeTextColor, textColor, hoverBgColor, handleLogout, toggleSidebar]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <MotionBox
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        bg={bgColor}
        color={textColor}
        height="100vh"
        borderRight="1px"
        borderColor={borderColor}
        position="fixed"
        left={0}
        top={0}
        zIndex={10}
        boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
        overflowX="hidden"
        overflowY="auto"
      >
        {SidebarContent}
      </MotionBox>

      <Box
        ml={{ base: 0, md: sidebarWidth }}
        transition="margin-left 0.3s"
      >
        {isMobile && (
          <IconButton
            icon={<FiMenu />}
            aria-label="Open Menu"
            onClick={onOpen}
            m={4}
          />
        )}
        {/* Main content goes here */}
      </Box>
    </>
  );
};

export default Sidebar;