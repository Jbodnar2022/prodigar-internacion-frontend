import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { EditIcon } from '@chakra-ui/icons'
import {  
  HStack, useToast, Select, Spinner,
  FormErrorMessage, IconButton,
  FormLabel,  
  Input,
  Button,
  Box,  
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,  
  Stack
} from "@chakra-ui/react";
import axios from "../axios";
import { useDisclosure } from '@chakra-ui/react'
import TableBody from '../shared/TableBody';
import DowloadExcel from '../shared/DowloadExcel';
import AlertDialogCustom from '../shared/AlertDialogCustom';

const baseURL = "/api/pacientes";

export default function PacientesTable() {
    const toast = useToast()
    const [data, setData] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [obraSocial, setObraSocial] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [obrasSociales, setObrasSociales] = useState([]);
    
    useEffect(() => {      
      getObrasSociales();
      getPacientes();
    }, []);

    const {
      setValue,
      handleSubmit,
      register,
      reset,  
      formState: { errors, isSubmitting }
    } = useForm({criteriaMode: "all"});

    function getPacientes() {
      setIsLoading(true);
      axios.get(baseURL).then((response) => {
        setData(response.data);
        setIsLoading(false);
      });
    }

    function getObrasSociales() {
      setIsLoading(true);
      axios.get("/api/Obrasocials").then((response) => {
        setObrasSociales([{ nombre: '', value: '' }, ...response.data]);
        setIsLoading(false);
      });
    }

    const columns = React.useMemo(
      () => [
        {
          Header: 'Id',
          accessor: 'idPaciente',
        },
        {
          Header: 'Apellido',
          accessor: 'apellido',
        },        
        {
          Header: 'Nombre',
          accessor: 'nombre',
        },

        {
          Header: 'Telefono',
          accessor: 'telefono',
        },
        {
          Header: 'Localidad',
          accessor: 'localidad',
        },
        {
          Header: 'Direccion',
          accessor: 'direccion',
        },        
        {
          Header: 'Nro Afiliado',
          accessor: 'nroAfiliado',
        },
        {
          Header: 'Obra Social',
          accessor: 'obraSocial.nombre',
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

    function handleNew() {
      ('New');
      reset();
      onOpen();
    }

    function handleEdit(row) {
      ('Editing', row);
      Object.keys(row).map(function(key) {
        setValue(key, row[key]);
      });
      onOpen();
    }

    function handleDelete(row) {
      ('Delete', row);      
      axios
      .delete(`${baseURL}/${row.idPaciente}`)
      .then(() => {
        toast({
          title: 'Paciente borrado correctamente',
          //description: "We've created your account for you.",
          status: 'success',
          duration: 3000,
          position: 'top',
          isClosable: true,
        })
        getPacientes();
      });
    }
  
    function onSubmit(values) {
      ('values', values)
      return new Promise((resolve) => {
        setTimeout(() => {
          (JSON.stringify(values, null, 2));
          reset();
          resolve();
          onClose();
          toast({
            title: 'Paciente editado correctamente',
            //description: "We've created your account for you.",
            status: 'success',
            duration: 3000,
            position: 'top',
            isClosable: true,
          })
          if (values.idPaciente) {
            ('updating...')
            axios.put(`${baseURL}/${values.idPaciente}`, {
                idPaciente: values.idPaciente,
                nombre: values.nombre,
                apellido: values.apellido,
                telefono: values.telefono,
                localidad: values.localidad,
                direccion: values.direccion,
                idobrasocial: values.idObraSocial,
                nroAfiliado: values.nroAfiliado,
                estado: "1"
              }).then((response) => {
                (response)
                getPacientes();
              });
          } else {
            ('new...', values)
            axios.post(`${baseURL}`, {
              nombre: values.nombre,
              apellido: values.apellido,
              telefono: values.telefono,
              localidad: values.localidad,
              direccion: values.direccion,
              idObraSocial: values.idObraSocial,
              nroAfiliado: values.nroAfiliado
            }).then((response) => {
              (response)
              getPacientes();
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
            <Button colorScheme='teal' size='md' onClick={e=> handleNew()} m={2}>
              Nuevo Paciente
            </Button>                
            <DowloadExcel
              fileName={'Pacientes'}
              sheetName={'Pacientes'}
              apiUrl={'/api/pacientes/excel'}
            ></DowloadExcel>
            {/* apiUrl={'/api/pacientes/'} */}
        </Box>
        <Box borderWidth='2px' p={2} mb={2} borderRadius='lg' overflow='auto'>
          <TableBody columns={columns}  data={data}></TableBody>
        </Box>

        <Modal onClose={onClose} isOpen={isOpen} isCentered size={'xl'}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Nuevo Paciente</ModalHeader>
            <ModalCloseButton />
             <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>                
                  <Stack>
                      <Stack spacing={4}>
                      <HStack>
                      <Box w='50%'>
                            <FormLabel htmlFor="apellido">Apellido</FormLabel>
                                <Input
                                  id="apellido"
                                  placeholder="apellido"
                                  {...register("apellido", {
                                    required: "Campo requerido.",
                                  })}
                                />
                              <ErrorMessage
                                errors={errors}
                                name="apellido" 
                                render={({ messages }) =>
                                  messages &&
                                  Object.entries(messages).map(([type, message]) => (
                                    <Text color='red' key={type}>{message}</Text>
                                  ))
                                }
                              />
                        </Box>
                        <Box w='50%'>
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

                      </HStack>¿
                      <Stack>
                        <FormLabel htmlFor="telefono">Telefono</FormLabel>
                            <Input
                              id="telefono"
                              placeholder="telefono"
                              {...register("telefono")}
                            />
                 
                      </Stack>
                      <Stack>
                        <FormLabel htmlFor="localidad">Localidad</FormLabel>
                        <Input
                              id="localidad"
                              placeholder="localidad"
                              {...register("localidad")}
                            />               
                      </Stack>
                      <Stack>
                        <FormLabel htmlFor="direccion">Direccion</FormLabel>
                        <Input
                              id="direccion"
                              placeholder="direccion"
                              {...register("direccion")}
                            />                
                      </Stack>                      
                      <Stack>
                        <FormLabel htmlFor="nroAfiliado">Nro Afiliado</FormLabel>
                        <Input
                              id="nroAfiliado"
                              placeholder="nroAfiliado"
                              {...register("nroAfiliado")}
                            />                  
                      </Stack>
                      <Stack>
                        <FormLabel htmlFor="obraSocial">Obra Social</FormLabel>
                            <Select 
                            value={obraSocial}
                              {...register("idObraSocial", { required: "Campo requerido" })}
                            >
                              {obrasSociales.map(( value , index) => (
                                <option key={index} value={value.idObraSocial}>
                                  { value.nombre }
                                </option>
                              ))} 
                            </Select>                            
                            <ErrorMessage
                                errors={errors}
                                name="idObraSocial" 
                                render={({ messages }) =>
                                  messages &&
                                  Object.entries(messages).map(([type, message]) => (
                                    <Text color='red' key={type}>{message}</Text>
                                  ))
                                }/>
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