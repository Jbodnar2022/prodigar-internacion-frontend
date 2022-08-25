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

const baseURL = "/api/Usuarios";

export default function Usuarios() {
    const toast = useToast()
    const [data, setData] = useState([]);
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
          accessor: 'idusuario',
        },
        {
          Header: 'Nombre Corto',
          accessor: 'nombreCorto',
        },
        {
          Header: 'Nombre Largo',
          accessor: 'nombreLargo',
        },
        {
            Header: 'Email',
            accessor: 'email',
          },
          {
            Header: 'Contraseña',
            accessor: 'contraseña',
          },
          {
            Header: 'Estado',
            accessor: 'estado',
          }, 
          {
            Header: 'Fecha Alta',
            accessor: 'fechaAlta',
          },  
          {
            Header: 'Fecha Baja',
            accessor: 'fechaBaja',
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
        onOpen();
      }

    function handleDelete(row) {
      axios
      .delete(`${baseURL}/${row.idusuario}`)
      .then(() => {
        getData();
        toast({
          title: 'Usuario borrado correctamente',
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
            title: 'Usuario editado correctamente',
            //description: "We've created your account for you.",
            status: 'success',
            duration: 3000,
            position: 'top',
            isClosable: true,
          })
          if (values.idusuario) {
            axios.put(`${baseURL}/${values.idusuario}`, {
                idusuario: values.idusuario,
                nombreCorto: values.nombreCorto,
                nombreLargo: values.nombreLargo,
                email: values.email,
                contraseña: values.contraseña,
                estado: values.estado,
                fechaAlta: values.fechaAlta,  
                fechaBaja: values.fechaBaja,                                                                                
              }).then((response) => {
                getData();
              });
          } else {            
            axios.post(`${baseURL}`, {
                nombreCorto: values.nombreCorto,
                nombreLargo: values.nombreLargo,
                email: values.email,
                contraseña: values.contraseña,
                estado: values.estado,
                fechaAlta: values.fechaAlta,  
                fechaBaja: values.fechaBaja,              
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
              Nuevo Usuario
            </Button>
        </Box>
        <Box borderWidth='2px' p={2} mb={2} borderRadius='lg' overflow='auto'>
          <TableBody columns={columns}  data={data}></TableBody>
        </Box>

        <Modal onClose={onClose} isOpen={isOpen} isCentered size={'xl'}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Nuevo Usuario</ModalHeader>
            <ModalCloseButton />
             <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>                
                  <Stack>
                      <Stack spacing={4}>
                      <Stack>
                        <Box w='50%'>
                            <FormLabel htmlFor="nombreCorto">Nombre Corto</FormLabel>
                                <Input
                                  id="nombreCorto"
                                  placeholder="nombreCorto"
                                  {...register("nombreCorto", { required: "This is required." })}
                                />
                              <ErrorMessage
                                errors={errors}
                                name="nombreCorto"
                                render={({ message }) => <Text color='red'>{message}</Text>}
                              />
                        </Box>
                      </Stack>
                      <Stack>
                        <Box w='50%'>
                            <FormLabel htmlFor="nombreLargo">Nombre Largo</FormLabel>
                                <Input
                                  id="nombreLargo"
                                  placeholder="nombreLargo"
                                  {...register("nombreLargo", { required: "This is required." })}
                                />
                              <ErrorMessage
                                errors={errors}
                                name="nombreLargo"
                                render={({ message }) => <Text color='red'>{message}</Text>}
                              />
                        </Box>
                      </Stack>
                      <Stack>
                        <Box w='50%'>
                            <FormLabel htmlFor="email">Email</FormLabel>
                                <Input
                                  id="email"
                                  placeholder="email"
                                  {...register("email", { required: "This is required." })}
                                />
                              <ErrorMessage
                                errors={errors}
                                name="email"
                                render={({ message }) => <Text color='red'>{message}</Text>}
                              />
                        </Box>
                      </Stack>                      
                      <Stack>
                        <Box w='50%'>
                            <FormLabel htmlFor="contraseña">Contraseña</FormLabel>
                                <Input
                                  id="contraseña"
                                  placeholder="contraseña"
                                  {...register("contraseña", { required: "This is required." })}
                                />
                              <ErrorMessage
                                errors={errors}
                                name="contraseña"
                                render={({ message }) => <Text color='red'>{message}</Text>}
                              />
                        </Box>
                      </Stack>
                      <Stack>
                        <Box w='50%'>
                            <FormLabel htmlFor="estado">Estado</FormLabel>
                                <Input
                                  id="estado"
                                  placeholder="estado"
                                  {...register("estado", { required: "This is required." })}
                                />
                              <ErrorMessage
                                errors={errors}
                                name="estado"
                                render={({ message }) => <Text color='red'>{message}</Text>}
                              />
                        </Box>
                      </Stack>
                      <Stack>
                        <Box w='50%'>
                            <FormLabel htmlFor="fechaAlta">Fecha Alta</FormLabel>
                                <Input
                                  id="fechaAlta"
                                  placeholder="fechaAlta"
                                  {...register("fechaAlta", { required: "This is required." })}
                                />
                              <ErrorMessage
                                errors={errors}
                                name="fechaAlta"
                                render={({ message }) => <Text color='red'>{message}</Text>}
                              />
                        </Box>
                      </Stack>
                      <Stack>
                        <Box w='50%'>
                            <FormLabel htmlFor="fechaBaja">Fecha Baja</FormLabel>
                                <Input
                                  id="fechaBaja"
                                  placeholder="fechaBaja"
                                  {...register("fechaBaja", { required: "This is required." })}
                                />
                              <ErrorMessage
                                errors={errors}
                                name="fechaBaja"
                                render={({ message }) => <Text color='red'>{message}</Text>}
                              />
                        </Box>
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