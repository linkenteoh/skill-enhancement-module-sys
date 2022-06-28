import React from 'react';
import '../css/components.css'
import { useTable, useSortBy, useGlobalFilter, useAsyncDebounce, usePagination } from 'react-table'
import {matchSorter} from 'match-sorter'

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
      setGlobalFilter(value || undefined)
    }, 200)
  
    return (
      <div className="d-flex justify-content-between">
        <input
          value={value || ""}
          className="form-control search-input"
          onChange={e => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`Search ...`}
        />
  
      </div>
    )
  }
  
  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
  }
  
  // Let the table remove the filter if the string is empty
  fuzzyTextFilterFn.autoRemove = val => !val
  
  // Table component
  export default function Table ({columns, data, disabledSearch}){
      const filterTypes = React.useMemo(
        () => ({
          // Add a new fuzzyTextFilterFn filter type.
          fuzzyText: fuzzyTextFilterFn,
          // Or, override the default text filter to use
          // "startWith"
          text: (rows, id, filterValue) => {
            return rows.filter(row => {
              const rowValue = row.values[id]
              return rowValue !== undefined
                ? String(rowValue)
                    .toLowerCase()
                    .startsWith(String(filterValue).toLowerCase())
                : true
            })
          },
        }),
        []
      )
  
      const {
          getTableProps,
          getTableBodyProps,
          headerGroups,
          page,
          rows,
          prepareRow,
          state,
          visibleColumns,
          preGlobalFilteredRows,
          setGlobalFilter,
          canPreviousPage,
          canNextPage,
          pageOptions,
          pageCount,
          gotoPage,
          nextPage,
          previousPage,
          setPageSize,
          state: { pageIndex, pageSize },
        } = useTable(
          {
            columns,
            data,
            filterTypes
          },
          useGlobalFilter,
          useSortBy,
          usePagination,
          
          // useFilters
        )
  
        return (
          <div>
            {
              !disabledSearch && <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
            }
            
            <table className="table table-hover no-border" {...getTableProps()}>
              <thead className="table-light box-shadow">
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render('Header')}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ''}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
  
            <div className="table-pagination d-flex justify-content-between">
              <div>
                <select
                  value={pageSize}
                  className="form-select"
                  onChange={e => {
                    setPageSize(Number(e.target.value))
                  }}
                >
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize} records
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button className="btn btn-light" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  First
                </button>{' '}
                <button className="btn btn-light" onClick={() => previousPage()} disabled={!canPreviousPage}>
                  <i class="fas fa-less-than"></i>
                </button>{' '}
                <span>
                  Page{' '}
                  <strong>
                    {pageIndex + 1} 
                  </strong>
                  {' '}
                  of {pageOptions.length}
                  {' '}
                </span>
                <button className="btn btn-light" onClick={() => nextPage()} disabled={!canNextPage}>
                  <i class="fas fa-greater-than"></i>
                </button>{' '}
                <button className="btn btn-light" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                  Last
                </button>{' '}
              </div>
            </div>
          </div>
  
        )
  }

