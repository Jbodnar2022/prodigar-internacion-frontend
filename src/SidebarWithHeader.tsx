import React, { ReactNode } from 'react';

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuGroup,
  MenuOptionGroup,
  MenuItemOption,
  Image
} from '@chakra-ui/react';
import {
  FiHome,
  FiUser,
  FiLifeBuoy,
  FiUserPlus,
  FiDollarSign,
  FiUserMinus,
  FiUserX,
  FiBook,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiDatabase,
  FiStar,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { Link, useNavigate } from "react-router-dom"

interface LinkItemProps {
  name: string;
  icon: IconType;
  route: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Pacientes', icon: FiUser, route: '/pacientes'},
  { name: 'Obras Sociales', icon: FiLifeBuoy, route: '/obras-sociales' },
  { name: 'Especialidades', icon: FiStar, route: '/especialidades' },
  { name: 'Profesionales', icon: FiUserMinus, route: '/profesionales' },
  { name: 'Pagos', icon: FiDollarSign, route: '/pagos' },
  { name: 'Facturación', icon: FiDatabase, route: '/facturacion' },
  { name: 'X Obra Social', icon: FiBook, route: '/rfacturacion' }, 
  { name: 'X Mensual', icon: FiBook, route: '/rfacmensual' },  
  { name: 'Usuarios', icon: FiUserX, route: '/usuarios' },  
];


export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {  
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="sans-serif" fontWeight="bold">
          Prodigar
        </Text>

        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} route={link.route}>
          {link.name}
        </NavItem>    
            
      ))}

    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  route: ReactText;
}
const NavItem = ({ icon, route, children, ...rest }: NavItemProps) => {
  return (
    <Link style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }} to={route} >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'green.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>

    
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  let navigate = useNavigate();

  function onClose() {
    localStorage.clear();
    navigate("/", { replace: true });
    window.location.reload();
  }

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        Prodigar
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>

          <Menu>

            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">Administrador</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem onClick={onClose}>Salir</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};