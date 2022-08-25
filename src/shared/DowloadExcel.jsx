import React, { useState, useEffect } from 'react'
import propTypes from 'prop-types'
import { DownloadIcon } from '@chakra-ui/icons'
import {  
  Button,
} from "@chakra-ui/react";
import axios from "../axios";

export const DowloadExcel = (props) => {
    const { fileName, sheetName, apiUrl } = props

    const exportarExcel = () => {
        axios.get(apiUrl).then((response) => {                              
            var FileSaver = require('file-saver')
            import('xlsx').then((xlsx) => {
                const worksheet = xlsx.utils.json_to_sheet(response.data)
                const workbook = {
                    Sheets: { [sheetName]: worksheet },
                    SheetNames: [sheetName]
                }
                const excelBuffer = xlsx.write(workbook, {
                    bookType: 'xlsx',
                    type: 'array'
                })
                // eslint-disable-next-line no-undef
                const blob = new Blob([excelBuffer], {
                    type:
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
                })
                FileSaver.saveAs(blob, fileName)
            })
        })
    }

    return (<Button colorScheme='teal' size='md' onClick={e=> exportarExcel()} leftIcon={<DownloadIcon />}>Descargar</Button>)
}

DowloadExcel.propTypes = {
    fileName: propTypes.string,
    sheetName: propTypes.string,
    data: propTypes.array
}

export default DowloadExcel
