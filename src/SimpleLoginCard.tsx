import React, { useState } from 'react';
import { Image } from '@chakra-ui/react'
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
  import PropTypes from 'prop-types';
  import axios from "./axios";
  
  export default function SimpleCard({ setToken }) {
    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async e => {
      e.preventDefault();
      setIsLoading(true);
      axios.post("/api/authenticate/login", { userName, password }).then((response) => {
        setToken({"token":"test123"});
        setIsLoading(false);
      })
      .catch(function (error) {
        console.error(error.toJSON());
        setErrorMessage("Usuario o Contraseña incorrecta")
      });
    }

    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'2xl'}></Heading>

            <Text fontSize='xl'>Sistema Prodigar</Text>
          </Stack>
          <form onSubmit={handleSubmit}>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl id="usuario">
                <FormLabel>Usuario</FormLabel>
                <Input type="text" onChange={e => setUserName(e.target.value)}/>
              </FormControl>
              <FormControl id="password">
                <FormLabel>Contraseña</FormLabel>
                <Input type="password" onChange={e => setPassword(e.target.value)}/>
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type="submit">
                   Ingresar
                </Button>
              </Stack>
            </Stack>
            { errorMessage &&<Text fontSize='15px' color='red' m={2}>{errorMessage}</Text>}
          </Box>
          </form>
        </Stack>
      </Flex>
    );
  }

  SimpleCard.propTypes = {
    setToken: PropTypes.func.isRequired
  }