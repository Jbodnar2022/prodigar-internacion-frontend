import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { Table, Thead, Tbody, Tr, Th, Td, chakra, IconButton } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon, SearchIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { useTable, useSortBy, usePagination } from 'react-table'
import { Center, Square, Circle, HStack, useToast, Spinner } from '@chakra-ui/react'
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
import { useDisclosure } from '@chakra-ui/react'
import TableBody from "../shared/TableBody"
import styled from 'styled-components'
import AlertDialogCustom from '../shared/AlertDialogCustom';
const Styles = styled.div`
  text-align: center;
  .pagination {
    padding: 0.5rem;
  }
`
const baseURL = "/api/Obrasocials";

export default function ObrasSociales() {
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
          accessor: 'idObraSocial',
        },
        {
          Header: 'Razon Social',
          accessor: 'razonSocial',
        },
        {
          Header: 'Nombre',
          accessor: 'nombre',
        },
        {
          Header: 'Domicilio',
          accessor: 'domicilio',
        },
        {
          Header: 'CUIT',
          accessor: 'cuit',
        },
        {
          Header: 'Condicion Iva',
          accessor: 'condicionIva',
        },
        {
          Header: 'Condicion Venta',
          accessor: 'condicionVenta',
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
      .delete(`${baseURL}/${row.idObraSocial}`)
      .then(() => {
        getData();
        toast({
          title: 'Obra Social borrada correctamente',
          status: 'success',
          duration: 3000,
          position: 'top',
          isClosable: true,
        })
      });
    }
  
    function onSubmit(values) {
      (values)
      return new Promise((resolve) => {
        setTimeout(() => {
          (JSON.stringify(values, null, 2));
          reset();
          resolve();
          onClose();
          toast({
            title: 'Obra Social editada correctamente',
            //description: "We've created your account for you.",
            status: 'success',
            duration: 3000,
            position: 'top',
            isClosable: true,
          })
          if (values.idObraSocial) {
            
            axios.put(`${baseURL}/${values.idObraSocial}`, {
                idObraSocial: values.idObraSocial,
                razonSocial: values.razonSocial,
                nombre: values.nombre,
                domicilio: values.domicilio,
                cuit: values.cuit,
                condicionIva: values.condicionIva,
                condicionVenta: values.condicionVenta,
              }).then((response) => {
                (response)
                getData();
              });
          } else {
            
            axios.post(`${baseURL}`, {
              razonSocial: values.razonSocial,
              nombre: values.nombre,
              domicilio: values.domicilio,
              cuit: values.cuit,
              condicionIva: values.condicionIva,
              condicionVenta: values.condicionVenta,
            }).then((response) => {
              (response)
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
            Nueva Obra Social
            </Button>
        </Box>
        <Box borderWidth='2px' p={2} mb={2} borderRadius='lg' overflow='auto'>
          <TableBody columns={columns}  data={data}></TableBody>
        </Box>

        <Modal onClose={onClose} isOpen={isOpen} isCentered size={'xl'}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Nueva Obra Social</ModalHeader>
            <ModalCloseButton />
             <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>                
                  <Stack>
                      <Stack spacing={4}>
                      <Stack>
                        <Box>
                          <FormLabel htmlFor="razonSocial">Razon Social</FormLabel>
                          <Input
                                  id="razonSocial"
                                  placeholder="razonSocial"
                                  {...register("razonSocial", { required: "Campo requerido." })}
                                />
                              <ErrorMessage
                                errors={errors}
                                name="razonSocial"
                                render={({ message }) => <Text color='red'>{message}</Text>}
                              />
                        </Box>
                      </Stack>
                      <Stack>
                        <Box>
                        <FormLabel htmlFor="nombre">Nombre</FormLabel>
                                <Input
                                  id="nombre"
                                  placeholder="nombre"
                                  {...register("nombre", { required: "Campo requerido." })}
                                />
                              <ErrorMessage
                                errors={errors}
                                name="nombre"
                                render={({ message }) => <Text color='red'>{message}</Text>}
                              />
                        </Box>
                      </Stack>
                      <Stack>
                        <Box>
                          <FormLabel htmlFor="domicilio">Domicilio</FormLabel>
                          <Input
                              id="domicilio"
                              placeholder="domicilio"
                              {...register("domicilio")}
                            />
                        </Box>
                      </Stack>
                      <Stack>
                        <Box>
                          <FormLabel htmlFor="cuit">CUIT</FormLabel>
                          <Input
                              id="cuit"
                              placeholder="cuit"
                              {...register("cuit")}
                            />
                        </Box>
                      </Stack>
                      <Stack>
                        <Box>
                          <FormLabel htmlFor="condicionIva">Condicion Iva</FormLabel>
                          <Input
                              id="condicionIva"
                              placeholder="condicionIva"
                              {...register("condicionIva")}
                            />
                        </Box>
                      </Stack>
                      <Stack>
                        <Box>
                          <FormLabel htmlFor="condicionVenta">Condicion Venta</FormLabel>
                          <Input
                              id="condicionVenta"
                              placeholder="condicionVenta"
                              {...register("condicionVenta")}
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