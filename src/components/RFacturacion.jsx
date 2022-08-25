import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { Table, Thead, Tbody, Tr, Th, Td, chakra, IconButton } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon, SearchIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { useTable, useSortBy, usePagination } from 'react-table'
import { Center, Square, Circle, HStack, useToast, Select, Spinner } from '@chakra-ui/react'
import {
  Container,
  Flex,
  Heading,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Link,
  Text
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
  Stack,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react'
import axios from "../axios";
import TableBody from "../shared/TableBody"
import AlertDialogCustom from '../shared/AlertDialogCustom';
import { useDisclosure } from '@chakra-ui/react'
import styled from 'styled-components'

const Styles = styled.div`
  text-align: center;
  .pagination {
    padding: 0.5rem;
  }`

const baseURL = "/FacMensualOsocial";

export default function Reportes() {
    const toast = useToast()
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setPageSize(5)
      getData();
    }, []);


    function getData() {
      setIsLoading(true)
      axios.get(baseURL).then((response) => {
        setData(response.data);
        setIsLoading(false)
      });
    }

    const columns = React.useMemo(
      () => [
        {
          Header: 'Id',
          accessor: 'id',
        },        
        {
          Header: 'Mes',
          accessor: 'mes',
        },
        {
          Header: 'Facturado',
          accessor: 'facturado',
        },
        {
          Header: 'Pagado',
          accessor: 'pagado',
        },        
        {
          Header: 'Obrasocial',
          accessor: 'obrasocial',
        },        

      ],
      [],
    )
  
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow,
      page, // Instead of using 'rows', we'll use page,
      // which has only the rows for the active page
      // The rest of these things are super handy, too ;)
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      state: { pageIndex, pageSize } } =
      useTable({ columns, data }, useSortBy, usePagination)
    
    const { isOpen, onOpen, onClose } = useDisclosure()

    function handleNew() {      
      reset();
      onOpen();
    }





    if(isLoading)
      return (<div style={{left: '50%', top: '50%', position: 'absolute'}}><Spinner size='xl'color='green.500' /></div>)
  
    return (
      <>
        <Box borderWidth='0px' p={2} mb={2} borderRadius='lg' overflow='hidden'>
            <Button colorScheme='teal' size='md' onClick={e=> handleNew()}>
              Reporte de Facturación Mensual x Obra Social
            </Button>
        </Box>
        <Box borderWidth='2px' p={2} mb={2} borderRadius='lg' overflow='auto'>
          <TableBody columns={columns}  data={data}></TableBody>
        </Box>

</>
    )
  }