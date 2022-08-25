import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  HStack, useToast, Spinner,
  FormLabel, IconButton,
  Input,
  Button,
  Box,
  Link,
  Text,
  Switch,Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,  
  Stack
} from "@chakra-ui/react";
import axios from "../axios";
import moment from 'moment';
import { useDisclosure } from '@chakra-ui/react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DowloadExcel from '../shared/DowloadExcel';
import TableBody from "../shared/TableBody"
import AlertDialogCustom from '../shared/AlertDialogCustom';

const baseURL = "/api/facturacions";


const baseURLCalcular = "/Calcular";

export default function Facturacion() {
    const toast = useToast()
    const [data, setData] = useState([]);
    const [fechaFactura, setFechaFactura] = useState(null)
    const [fechaRef, setFechaRef] = useState(null)
    const [fechaPago, setFechaPago] = useState(null)
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {      
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

    function getCalcular() {
      setIsLoading(true)
      axios.get(baseURLCalcular).then((response) => {
        setData(response.data);
        setIsLoading(false)
        getData();
        toast({
          title: 'Se calculo la facturación correctamente',
          //description: "We've created your account for you.",
          status: 'success',
          duration: 3000,
          position: 'top',
          isClosable: true,
        })       
      });
    }

    function getPacientes() {
      setIsLoading(true);
      axios.get(baseURL).then((response) => {
        setData(response.data);
        setIsLoading(false);
      });
    }

    const columns = React.useMemo(
      () => [
          {
            Header: 'Id',
            accessor: 'idFacturacion',
          },
          {
            Header: 'Obra Social',
            accessor: 'obraSocial.nombre',
          },
          {
            Header: 'Paciente',
            accessor: 'paciente.apellido',
          },
          {
            Header: 'Importe',
            accessor: 'importe',
          },
          {
            Header: 'Fecha_Factura',
            accessor: x => {
              return x.fecha != null ? moment(x.fecha)
                .local()
                .format("DD-MM-YYYY") : ''
            }
          },
          {
            Header: 'Fecha_Ref',
            accessor: x => {
              return x.fechaRef != null ? moment(x.fechaRef)
                .local()
                .format("DD-MM-YYYY") : ''
            }
          },
          {
            Header: 'Fecha_Pago',
            accessor: x => {
              return x.fechaPago != null ? moment(x.fechaPago)
                .local()
                .format("DD-MM-YYYY") : ''
            }
          },
          {
            Header: 'Nro Factura',
            accessor: 'nroFactura',
          },
          {
            Header: 'Debito',
            accessor: 'debito',
          },
          {
            Header: 'Gastos',
            accessor: 'gastos',
          },
          {
            Header: 'Abel',
            accessor: 'abel',
          },
          {
            Header: 'CP',
            accessor: 'cp',
          },
          {
            Header: 'Pagaron',
            accessor: 'pagaron',
          },
          {
            Header: 'Ganancia',
            accessor: 'ganancia',
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
      
    const { isOpen, onOpen, onClose } = useDisclosure()

    function handleEdit(row) {
     
      Object.keys(row).map(function(key) {
        setValue(key, row[key]);
      });
      onOpen();
    }

    function handleDelete(row) {      
      axios
      .delete(`${baseURL}/${row.idFacturacion}`)
      .then(() => {
        getPacientes();
        toast({
          title: 'Facturación borrado correctamente',
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
            title: 'Facturación editado correctamente',
            //description: "We've created your account for you.",
            status: 'success',
            duration: 3000,
            position: 'top',
            isClosable: true,
          })                      
            axios.put(`${baseURL}/${values.idFacturacion}`, {
                idFacturacion: values.idFacturacion,
                importe: values.importe,
                nroFactura: values.nroFactura,
                pagaron: values.pagaron,
                fecha : moment(fechaFactura, 'YYYY-MM-DD'),
                fechaRef : moment(fechaRef, 'YYYY-MM-DD'),
                fechaPago : moment(fechaPago, 'YYYY-MM-DD'),
                debito : values.debito,
                cp : values.cp,
                gastos : values.gastos,
                ganancia : values.ganancia,
                abel : values.abel,
              }).then((response) => {
                getData();
              });
        }, 1000);
      });
    }

    if(isLoading)
      return (<div style={{left: '50%', top: '50%', position: 'absolute'}}><Spinner size='xl'color='green.500' /></div>)
  
    return (
      <>

        <Box borderWidth='0px' p={2} mb={2} borderRadius='lg' overflow='hidden'>
            <Button colorScheme='teal' isLoading={isSubmitting} size='md' onClick={e=> getCalcular()} m={2}>
              Calcular Facturación
            </Button>
            <DowloadExcel
              fileName={'Facturacion'}
              sheetName={'Facturacion'}
              apiUrl={'/api/Facturacions/excel'}
            ></DowloadExcel>
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
        </Modal>
</>
    )
  }