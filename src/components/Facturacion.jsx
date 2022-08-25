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
import TableBody from "../shared/TableBody"
import AlertDialogCustom from '../shared/AlertDialogCustom';
import DowloadExcel from '../shared/DowloadExcel';
const baseURL = "/api/facturacions";
const baseURLCalcular = "/Calcular";

export default function Facturacion() {
    const toast = useToast()
    const [data, setData] = useState([]);
    const [fechaFactura, setFechaFactura] = useState(null)
    const [fecha, setFecha] = useState(null)
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
        setIsLoading(false)
        getData();      
      });
    }

    const columns = React.useMemo(
      () => [
        {
          Header: 'Id',
          accessor: 'idfacturacion',
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
          Header: 'Facturado',
          accessor: 'facturado',
        },
        {
          Header: 'Pagado',
          accessor: 'pagado',
        },        
        {
          Header: 'Fecha ',
          accessor: x => {
            return x.fecha != null ? moment(x.fecha)
              .local()
              .format("DD-MM-YYYY") : ''
          }
        },
        {
          Header: 'Fecha Factura',
          accessor: x => {
            return x.fechaFactura != null ? moment(x.fechaFactura)
              .local()
              .format("DD-MM-YYYY") : ''
          }
        },
        {
          Header: 'Fecha de Pago',
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
      if (row.fechaFactura) setFechaFactura(new Date(row.fechaFactura))
      if (row.fecha) setFecha(new Date(row.fecha))
      if (row.fechaPago) setFechaPago(new Date(row.fechaPago))
      onOpen();
    }

    function handleDelete(row) {      
      axios
      .delete(`${baseURL}/${row.idfacturacion}`)
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
            axios.put(`${baseURL}/${values.idfacturacion}`, {
                idfacturacion: values.idfacturacion,
                pagado: values.pagado,
                nroFactura: values.nroFactura,
                facturado: values.facturado,
                fecha : moment(fecha, 'YYYY-MM-DD'),
                fechaFactura : moment(fechaFactura, 'YYYY-MM-DD'),
                fechaPago : moment(fechaPago, 'YYYY-MM-DD'),
                debito : values.debito,
                cp : values.cp,
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
            <ModalHeader>Modificar Facturación</ModalHeader>
            <ModalCloseButton />
             <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>                
                  <Stack>
                    <Stack spacing={4}>
                      <HStack>
                      <Box w='50%'>
                            <FormLabel htmlFor="fecha">Fecha</FormLabel>
                            <div style={{border:'1px solid #e2e8f0', padding: '5px', width:'75%' }}>
                            <DatePicker id="fecha" {...register("fecha")}
                                selected={fecha} onChange={(date) => setFecha(date)} 
                                dateFormat="dd-MM-yyyy"/>
                            </div>
                        </Box>    

                        <Box w='50%'>
                            <FormLabel htmlFor="fechaPago">Fecha de Pago</FormLabel>
                            <div style={{border:'1px solid #e2e8f0', padding: '5px', width:'75%' }}>
                              <DatePicker id="fechaPago" {...register("fechaPago")}
                                selected={fechaPago} onChange={(date) => setFechaPago(date)} 
                                dateFormat="dd-MM-yyyy"/>
                            </div>
                        </Box> 
                        </HStack>  
                        <HStack>
                        <Box w='50%'>
                            <FormLabel htmlFor="Fecha_Factura">Fecha Factura</FormLabel>
                            <div style={{border:'1px solid #e2e8f0', padding: '5px', width:'75%' }}>
                            <DatePicker id="Fecha_Factura" {...register("Fecha_Factura")}
                                selected={fechaFactura} onChange={(date) => setFechaFactura(date)} 

                                dateFormat="dd-MM-yyyy"/>
                            </div>
                        </Box>                              
                      
                      <Box w='50%'>
                          <FormLabel htmlFor="nroFactura">Nro Factura</FormLabel>
                          {/* <Switch id='nrofactura' {...register("nrofactura")}/> */}
                          <Input
                              id="nroFactura"
                              placeholder="nroFactura"
                              {...register("nroFactura")}
                          />
                        </Box>
                        <Box w='50%'>
                        <FormLabel htmlFor="facturado">Facturado</FormLabel>
                          <Input
                              id="facturado"
                              placeholder="facturado"
                              {...register("facturado")}
                          />
                        </Box>
                      </HStack>
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