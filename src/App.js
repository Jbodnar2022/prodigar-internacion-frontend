import "./App.css";
import React, { useState } from 'react';
import {
  ChakraProvider,
  theme,
  Container,
  Flex,
  Box
} from '@chakra-ui/react';
import SidebarWithHeader from './SidebarWithHeader'
import SimpleLoginCard from './SimpleLoginCard'
import { Routes, Route, Link } from "react-router-dom";
import Pacientes from './components/Pacientes'
import ObrasSociales from './components/ObrasSociales'
import Facturacion from './components/Facturacion'
import Profesionales from './components/Profesionales'
import Especialidades from './components/Especialidades'
import Agenda from './components/Agenda'
import Usuarios from './components/Usuarios'
import RFacturacion from './components/RFacturacion'
import RFacmensual from './components/RFacmensual'
import useToken from './useToken';

function App() {
  const { token, setToken } = useToken();
  
  if(!token) {
    return (<ChakraProvider theme={theme}>
              <SimpleLoginCard setToken={setToken} />
            </ChakraProvider>)
  }

  return (
    <ChakraProvider theme={theme}>
      <SidebarWithHeader>
      <Container maxW="full" bg="white" mt={0} overflow="hidden">
            <Flex>
                <Box
                  w='98%'
                  borderRadius="lg"
                  m={{ sm: 4 }}
                  >
                    <Routes>
                      <Route path="/" element={ <Pacientes/> } />
                      <Route path="/pacientes" element={<Pacientes />} />
                      <Route path="/obras-sociales" element={<ObrasSociales />} />
                      <Route path="/facturacion" element={<Facturacion />} />
                      <Route path="/profesionales" element={<Profesionales />} />
                      <Route path="/especialidades" element={<Especialidades />} />
                      <Route path="/usuarios" element={<Usuarios />} />     
                      <Route path="/rfacturacion" element={<RFacturacion />} />     
                      <Route path="/rfacmensual" element={<RFacmensual />} />                                      
                      <Route path="/pagos" element={<Agenda />} />
                    </Routes>        
                </Box>
            </Flex>
        </Container>
      </SidebarWithHeader>
    </ChakraProvider>
  );

  function Home() {
    return (
      <>
        <main>
          <h2>Welcome to the homepage!</h2>
          <p>You can do this, I believe in you.</p>
         
        </main>
        <nav>
          <Link to="/about">About</Link>
        </nav>
      </>
    );
  }
  
  function About() {
    return (
      <>
        <main>
          <h2>Who are we?</h2>
          <p>
            That feels like an existential question, don't you
            think?
          </p>
        </main>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </>
    );
  }
}

export default App;