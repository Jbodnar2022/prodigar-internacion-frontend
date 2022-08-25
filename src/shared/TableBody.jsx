import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, chakra, IconButton } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useTable, useSortBy, usePagination } from 'react-table'
import styled from 'styled-components'

const Styles = styled.div`
  text-align: center;
  .pagination {
    padding: 0.5rem;
  }
`

export default function TableBody({ columns,  data}) {
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow,
        rows,
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
        
    return (
        <><Table {...getTableProps()} columns={columns} data={data}>
            <Thead>
              {headerGroups.map((headerGroup) => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      isNumeric={column.isNumeric}
                    >
                      {column.render('Header')}
                      <chakra.span pl='4'>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <TriangleDownIcon aria-label='sorted descending' />
                          ) : (
                            <TriangleUpIcon aria-label='sorted ascending' />
                          )
                        ) : null}
                      </chakra.span>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <Tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                        {cell.render('Cell')}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        <Styles>
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                  {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                  {'>>'}
                </button>{' '}
                <span>
                  Page{' '}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{' '}
                </span>
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value))
                  }}
                >
                  {[ 5, 10, 20, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      Mostrar {pageSize}
                    </option>
                  ))}
                </select>
              </div>
        </Styles>
      </>
  )
}