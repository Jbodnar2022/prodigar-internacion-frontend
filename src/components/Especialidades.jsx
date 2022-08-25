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

const baseURL = "/api/especialidades";

export default function Especialidades() {
    const toast = useToast()
    const [data, setData] = useState([]);
    const [tiposervicio, setTipoServicio] = useState(null);
    let options = [{name: ' ', value: '' },{name: 'Sesiones/Visitas', value: 'Sesiones/Visitas/Horas'}, {name: 'Sesiones/Visitas/Horas', value: 'Sesiones/Visitas'},{name: 'Horas', value: 'Horas'}];
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setPageSize(5)
      getData();
    }, []);

    const {
      setValue,
      handleSubmit,
      register,
      reset,  
      formState: { errors, isSubmitting }
    } = useForm({criteriaMode: "all"});

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
          accessor: 'idespecialidades',
        },
        {
          Header: 'Nombre',
          accessor: 'nombre',
        },
        {
          Header: 'Tipo Servicio',
          accessor: 'tiposervicio',
        },
        {
            Header: '',
            accessor: 'action',
            Cell: row => (
            <div>
              <HStack spacing='4px'>
                <Box p={1} borderRadius='lg' overflow='hidden'>
                  <IconButton aria-label='Search database' onClick={e=> handleEdit(row.row.original)} icon={<EditIcon />} />                
                </Box>
                <Box p={1} borderRadius='lg' overflow='hidden'>
                  <AlertDialogCustom handleDelete={ e=> handleDelete(row.row.original)}></AlertDialogCustom>
                </Box>
              </HStack>
            </div>),
        }
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

    function handleEdit(row) {
      Object.keys(row).map(function(key) {
        setValue(key, row[key]);
      });
      // con esto se setea el combo
      setValue('tiposervicio', row['tiposervicio'].trim());
      onOpen();
    }

    function handleDelete(row) {
      axios
      .delete(`${baseURL}/${row.idespecialidades}`)
      .then(() => {
        getData();
        toast({
          title: 'Especialidad borrada correctamente',
          //description: "We've created your account for you.",
          status: 'success',
          duration: 3000,
          position: 'top',
          isClosable: true,
        })
      });
    }
  
    function onSubmit(values) {
      return new Promise((resolve) => {
        setTimeout(() => {
          reset();
          resolve();
          onClose();
          toast({
            title: 'Especialidad editada correctamente',
            //description: "We've created your account for you.",
            status: 'success',
            duration: 3000,
            position: 'top',
            isClosable: true,
          })
          if (values.idespecialidades) {
            axios.put(`${baseURL}/${values.idespecialidades}`, {
                idespecialidades: values.idespecialidades,
                nombre: values.nombre,
                tiposervicio: values.tiposervicio,
              }).then((response) => {
                getData();
              });
          } else {            
            axios.post(`${baseURL}`, {
              nombre: values.nombre,
              tiposervicio: values.tiposervicio,              
            }).then((response) => {              
              getData();
            });
          }
        }, 1000);
      });
    }
  
    if(isLoading)
      return (<div style={{left: '50%', top: '50%', position: 'absolute'}}><Spinner size='xl'color='green.500' /></div>)
  
    return (
      <>
        <Box borderWidth='0px' p={2} mb={2} borderRadius='lg' overflow='hidden'>
            <Button colorScheme='teal' size='md' onClick={e=> handleNew()}>
              Nueva Especialidad
            </Button>
        </Box>
        <Box borderWidth='2px' p={2} mb={2} borderRadius='lg' overflow='auto'>
          <TableBody columns={columns}  data={data}></TableBody>
        </Box>

        <Modal onClose={onClose} isOpen={isOpen} isCentered size={'xl'}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Nueva Especialidad</ModalHeader>
            <ModalCloseButton />
             <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>                
                  <Stack>
                      <Stack spacing={4}>
                      <Stack>
                        <Box w='50%'>
                            <FormLabel htmlFor="nombre">Nombre</FormLabel>
                                <Input
                                  id="nombre"
                                  placeholder="nombre"
                                  {...register("nombre", { required: "This is required." })}
                                />
                              <ErrorMessage
                                errors={errors}
                                name="nombre"
                                render={({ message }) => <Text color='red'>{message}</Text>}
                              />
                        </Box>
                      </Stack>
                      <Stack>
                        <FormLabel htmlFor="tiposervicio">Tipo Servicio</FormLabel>
                            <Select 
                            value={tiposervicio}
                              {...register("tiposervicio")}
                            >
                              {options.map(({ value: currentValue, name }, index) => (
                                <option key={index} value={currentValue}>
                                  {name}
                                </option>
                              ))} 
                            </Select>
                      </Stack>
                    </Stack>
                  </Stack>                  
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="teal" isLoading={isSubmitting} type="submit" mr={3}>Guardar</Button>
                  <Button variant='ghost' onClick={onClose}>Cerrar</Button>
                </ModalFooter>
            </form>
          </ModalContent>
        </Modal></>
    )
  }