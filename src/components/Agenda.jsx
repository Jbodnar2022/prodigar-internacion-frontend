import React, { useState, useEffect } from 'react';
import moment from 'moment';
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
import AlertDialogCustom from '../shared/AlertDialogCustom';
import { useDisclosure } from '@chakra-ui/react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DowloadExcel from '../shared/DowloadExcel';
import TableBody from '../shared/TableBody'
import styled from 'styled-components'

const Styles = styled.div`
  text-align: center;
  .pagination {
    padding: 0.5rem;
  }
`

const baseURL = "/api/pagos";

export default function Agenda() {
    const toast = useToast()
    const [data, setData] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const [startDate, setStartDate] = useState(new Date())
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      getPacientes()
      getProfecionales()
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

    function getPacientes() {
      setIsLoading(true)
      axios.get("/api/pacientes").then((response) => {
        setPacientes(response.data);
        setIsLoading(false)
      });
    }

    function getProfecionales() {
      setIsLoading(true)
      axios.get("/api/profesionales").then((response) => {
        setProfesionales(response.data);
        setIsLoading(false)
      });
    }

    const columns = React.useMemo(
      () => [
        {
          Header: 'Id',
          accessor: 'idPago',
        },
        {
          Header: 'Profesional',
          accessor: 'profesional.apellido',
        },
        {
          Header: 'Monotributo',
          accessor: 'monotributo',
        },        
        {
          Header: 'Paciente',
          accessor: 'paciente.apellido',
        },
        {
          Header: 'FechaLiqui',
          accessor: x => {
            return moment(x.fechaLiqui)
              .local()
              .format("MM-YYYY")
          }
        },
        {
          Header: 'Honorarios',
          accessor: 'honorarios',
        },
        {
          Header: 'SesionesReales',
          accessor: 'sesionesReales',
        },             
        {
          Header: 'A Pagar',
          accessor: 'apagar',
        }, 
        {
          Header: 'ValorOs',
          accessor: 'valorOs',
        },   
        {
          Header: 'SesionesAuto',
          accessor: 'sesionesAuto',
        },
        {
          Header: 'A Facturar',
          accessor: 'afacturar',
        }, 
        {
          Header: 'Margen',
          accessor: 'margen',
        },                 
        // {
        //   Header: 'Observaciones',
        //   accessor: 'observaciones',
        // },
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

    const columnsOptions = React.useMemo(
      () => [
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
      .delete(`${baseURL}/${row.idPago}`)
      .then(() => {
        getData();
        toast({
          title: 'Pago borrado correctamente',
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
            title: 'Pago editado correctamente',
            //description: "We've created your account for you.",
            status: 'success',
            duration: 3000,
            position: 'top',
            isClosable: true,
          })
          if (values.idPago) {
            axios.put(`${baseURL}/${values.idPago}`, {
                idPago: values.idPago,
                idProfesional: values.idProfesional,
                idPaciente: values.idPaciente,
                fechaLiqui: moment(startDate, 'YYYY-MM'),
                honorarios: values.honorarios,
                sesionesReales: values.sesionesReales,
                apagar: values.honorarios * values.sesionesReales,
                monotributo: values.monotributo,
                sesionesAuto: values.sesionesAuto,
                valorOs: values.valorOs,
                afacturar: values.valorOs * values.sesionesAuto,
                margen: (values.valorOs * values.sesionesAuto) -(values.honorarios * values.sesionesReales),
              }).then((response) => {                
                getData();
              });
          } else {
            axios.post(`${baseURL}`, {
              idProfesional: values.idProfesional,
              idPaciente: values.idPaciente,
              fechaLiqui: moment(startDate, 'YYYY-MM'),
              honorarios: values.honorarios,
              monotributo: values.monotributo,
              sesionesReales: values.sesionesReales,
              apagar: values.honorarios * values.sesionesReales,
              sesionesAuto: values.sesionesAuto,
              valorOs: values.valorOs,
              afacturar: values.valorOs * values.sesionesAuto,
              margen:  (values.valorOs * values.sesionesAuto) -(values.honorarios * values.sesionesReales),
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
              Nuevo Pago
            </Button>
            <DowloadExcel
              fileName={'Pagos'}
              sheetName={'Pagos'}
              apiUrl={'/api/pagos/excel'}
            ></DowloadExcel>           
        </Box>
        <Box borderWidth='2px' p={2} mb={2} borderRadius='lg' overflow='auto'>
          <TableBody columns={columns}  data={data}></TableBody>
        </Box>

        <Modal onClose={onClose} isOpen={isOpen} isCentered size={'xl'}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Nuevo Pago</ModalHeader>
            <ModalCloseButton />
             <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>                
                  <Stack>
                    <Stack spacing={4}>
                      <HStack>
                        <Box w='50%'>
                          <FormLabel htmlFor="idProfesional">Profesional</FormLabel>
                          <Select 
                              {...register("idProfesional", { required: "Campo requerido." })}
                            >
                              {profesionales.map((value, index) => (
                                <option key={index} value={value.idProfesional}>
                                  { value.apellido + " " + value.nombre }
                                </option>
                              ))} 
                            <ErrorMessage
                                errors={errors}
                                name="idprofesional" 
                                render={({ messages }) =>
                                  messages &&
                                  Object.entries(messages).map(([type, message]) => (
                                    <Text color='red' key={type}>{message}</Text>
                                  ))
                                }
                              />   
                          </Select>

                        </Box>
                        <Box w='50%'>
                          <FormLabel htmlFor="idPaciente">Paciente</FormLabel>
                          <Select 
                              {...register("idPaciente")}
                            >
                              {pacientes.map((value, index) => (
                                <option key={index} value={value.idPaciente}>
                                  { value.nombre + " " + value.apellido}
                                </option>
                              ))} 
                          </Select>
                        </Box>
                      </HStack>
                      <Stack>
                        <Box>
                          {/* <FormLabel htmlFor="fechaLiqui">FechaLiqui</FormLabel>
                              <Input
                                id="fechaLiqui"
                                placeholder="fechaLiqui"
                                {...register("fechaLiqui")}
                              /> */}
                          <FormLabel htmlFor="fechaLiqui">FechaLiqui</FormLabel>
                          <DatePicker id="fechaLiqui" {...register("fechaLiqui")}
                            selected={startDate} onChange={(date) => setStartDate(date)} />
                        </Box>
                      </Stack>
                      <Stack>
                        <Box>
                          <FormLabel htmlFor="honorarios">Honorarios</FormLabel>
                              <Input
                                id="honorarios"
                                placeholder="honorarios"
                                {...register("honorarios")}
                              />
                        </Box>
                      <Box>
                          <FormLabel htmlFor="sesionesReales">Sesiones Reales</FormLabel>
                              <Input
                                id="sesionesReales"
                                placeholder="sesionesReales"
                                {...register("sesionesReales")}
                              />
                        </Box>  
                        <Box>
                          <FormLabel htmlFor="valorOs">Valor OS</FormLabel>
                              <Input
                                id="valorOs"
                                placeholder="valorOs"
                                {...register("valorOs")}
                              />
                        </Box>                   
                        <Box>
                          <FormLabel htmlFor="sesionesAuto">Sesiones Auto</FormLabel>
                              <Input
                                id="sesionesAuto"
                                placeholder="sesionesAuto"
                                {...register("sesionesAuto")}
                              />
                        </Box>
                      </Stack>

                      <Stack>
                        <Box>
                          <FormLabel htmlFor="monotributo">Monotributo</FormLabel>
                              <Input
                                id="monotributo"
                                placeholder="monotributo"
                                {...register("monotributo")}
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