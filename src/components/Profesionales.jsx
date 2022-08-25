import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
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
  Stack,    
} from '@chakra-ui/react'
import axios from "../axios";
import TableBody from "../shared/TableBody"
import { useDisclosure } from '@chakra-ui/react'
import AlertDialogCustom from '../shared/AlertDialogCustom';

const baseURL = "/api/profesionales";

export default function Profesionales() {
    const toast = useToast()
    const [data, setData] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [idEspecialidad, setIdEspecilidad] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {      
      getEspecialidades();
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
    
    function getEspecialidades() {
      setIsLoading(true);
      axios.get("/api/especialidades").then((response) => {
        setEspecialidades([{ nombre: '', value: '' }, ...response.data]);
        setIsLoading(false);
      });
    }

    const columns = React.useMemo(
      () => [
        {
          Header: 'Id',
          accessor: 'idProfesional',
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
          Header: 'DNI',
          accessor: 'dni',
        },
        {
          Header: 'Telefono',
          accessor: 'telefono',
        },
        {
          Header: 'Monotributo',
          accessor: 'monotributo',
        },
        {
          Header: 'Especialidad',
          accessor: 'especialidad.nombre',
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
      .delete(`${baseURL}/${row.idProfesional}`)
      .then(() => {
        getData();
        toast({
          title: 'Profesional borrado correctamente',
          //description: "We've created your account for you.",
          status: 'success',
          duration: 3000,
          position: 'top',
          isClosable: true,
        })
      });
    }
  
    function onSubmit(values) {
      //(values)
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
          if (values.idProfesional) {
          
            axios.put(`${baseURL}/${values.idProfesional}`, {
                idProfesional: values.idProfesional,
                nombre: values.nombre,
                apellido: values.apellido,
                dni: values.dni,
                telefono: values.telefono,
                domilicio: values.domilicio,
                domilicio: values.domilicio,
                monotributo: values.monotributo,
                idEspecialidad: values.idEspecialidad
              }).then((response) => {
                (response)
                getData();
              });
          } else {
           
            axios.post(`${baseURL}`, {
              nombre: values.nombre,
              apellido: values.apellido,
              dni: values.dni,
              telefono: values.telefono,
              domilicio: values.domilicio,
              monotributo: values.monotributo,
              idEspecialidad: values.idEspecialidad
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
              Nuevo Profesional
            </Button>
        </Box>
        <Box borderWidth='2px' p={2} mb={2} borderRadius='lg' overflow='auto'>
          <TableBody columns={columns}  data={data}></TableBody>
        </Box>

        <Modal onClose={onClose} isOpen={isOpen} isCentered size={'xl'}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Nuevo Profesional</ModalHeader>
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
                                    required: "This is required."
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
                                  {...register("nombre", { required: "This is required." })}
                                />
                              <ErrorMessage
                                errors={errors}
                                name="nombre"
                                render={({ message }) => <Text color='red'>{message}</Text>}
                              />
                        </Box>                        
                      </HStack>
                      <Stack>
                        <Box>
                          <FormLabel htmlFor="dni">DNI</FormLabel>
                          <Input
                              id="dni"
                              placeholder="dni"
                              {...register("dni")}
                            />
                        </Box>
                      </Stack>
                      <Stack>
                        <FormLabel htmlFor="telefono">Telefono</FormLabel>
                        <Input
                              id="telefono"
                              placeholder="telefono"
                              {...register("telefono")}
                            />               
                      </Stack>
                      <Stack>
                        <FormLabel htmlFor="monotributo">Monotributo</FormLabel>
                        <Input
                              id="monotributo"
                              placeholder="monotributo"
                              {...register("monotributo")}
                            />  
                      </Stack>
                      <Stack>
                        <FormLabel htmlFor="idEspecialidad">Especialidad</FormLabel>
                          <Select 
                              {...register("idEspecialidad", { required: "Campo requerido" })}
                            >
                              {especialidades.map((value, index) => (
                                <option key={index} value={value.idespecialidades}>
                                  {value.nombre}
                                </option>
                              ))} 
                          </Select>
                          <ErrorMessage
                                errors={errors}
                                name="idEspecialidad" 
                                render={({ messages }) =>
                                  messages &&
                                  Object.entries(messages).map(([type, message]) => (
                                    <Text color='red' key={type}>{message}</Text>
                                  ))
                                }
                              />
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