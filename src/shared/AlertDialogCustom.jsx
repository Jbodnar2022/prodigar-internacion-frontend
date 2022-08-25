import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    IconButton
  } from '@chakra-ui/react'
  import { DeleteIcon } from '@chakra-ui/icons'

  export default function AlertDialogCustom({handleDelete}) {
    const [isOpen, setIsOpen] = useState()
    const cancelRef = React.useRef()
    const onClose = () => setIsOpen(false)
  
    const onDelete = () => {
      setIsOpen(false)
      handleDelete();
    }
    return (
      <>
        <IconButton aria-label='Search database' color='red.400' onClick={e=> setIsOpen(true)} icon={<DeleteIcon />}/>
  
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Atención
              </AlertDialogHeader>
  
              <AlertDialogBody>
                ¿Está seguro de borrar esta fila?
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancelar
                </Button>
                <Button colorScheme="red" onClick={onDelete} ml={3}>
                  Borrar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }