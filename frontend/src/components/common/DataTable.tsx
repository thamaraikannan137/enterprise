import { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Checkbox,
  Box,
  Toolbar,
  Typography,
  Tooltip,
  Select,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import {
  ViewColumn as ViewColumnIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'select';
  filterOptions?: { value: string; label: string }[];
}

export interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  printable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  onFilterChange?: (filters: Record<string, any>) => void;
  getRowId?: (row: T) => string | number;
}

export function DataTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  onRowClick,
  loading = false,
  searchable = true,
  filterable = true,
  exportable = true,
  printable = true,
  selectable = true,
  pagination = true,
  rowsPerPageOptions = [10, 25, 50, 100],
  defaultRowsPerPage = 10,
  onFilterChange,
  getRowId = (row: T) => row.id || row._id || String(row),
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchText, setSearchText] = useState('');
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((col) => String(col.id)))
  );
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);

  // Filter columns based on visibility
  const visibleColumnsList = useMemo(
    () => columns.filter((col) => visibleColumns.has(String(col.id))),
    [columns, visibleColumns]
  );

  // Apply search and filters
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter((row) =>
        visibleColumnsList.some((col) => {
          const value = row[col.id];
          if (value === null || value === undefined) return false;
          const stringValue = String(value).toLowerCase();
          return stringValue.includes(searchLower);
        })
      );
    }

    // Apply column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result = result.filter((row) => {
          const cellValue = row[key];
          if (cellValue === null || cellValue === undefined) return false;
          return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
        });
      }
    });

    return result;
  }, [data, searchText, filters, visibleColumnsList]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage, pagination]);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Column visibility
  const handleColumnToggle = useCallback((columnId: string) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  }, []);

  // Helper to extract text from React elements or values
  const extractText = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (typeof value === 'object' && 'props' in value) {
      // React element - try to extract text
      if (value.props?.label) return String(value.props.label);
      if (value.props?.children) {
        if (typeof value.props.children === 'string') return value.props.children;
        if (Array.isArray(value.props.children)) {
          return value.props.children.map((child: any) => extractText(child)).join(' ');
        }
      }
    }
    return String(value);
  };

  // Export to Excel
  const handleExportExcel = useCallback(() => {
    const exportData = filteredData.map((row) => {
      const exportRow: Record<string, any> = {};
      visibleColumnsList.forEach((col) => {
        const value = row[col.id];
        const formattedValue = col.format ? col.format(value, row) : value;
        exportRow[col.label] = extractText(formattedValue);
      });
      return exportRow;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, title || 'Sheet1');
    XLSX.writeFile(wb, `${title || 'data'}_${new Date().toISOString().split('T')[0]}.xlsx`);
  }, [filteredData, visibleColumnsList, title]);

  // Print
  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableHtml = `
      <html>
        <head>
          <title>${title || 'Table'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            @media print {
              body { margin: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <h2>${title || 'Table'}</h2>
          <table>
            <thead>
              <tr>
                ${visibleColumnsList.map((col) => `<th>${col.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${filteredData
                .map(
                  (row) =>
                    `<tr>${visibleColumnsList
                      .map((col) => {
                        const value = row[col.id];
                        const formattedValue = col.format ? col.format(value, row) : value;
                        const displayValue = extractText(formattedValue);
                        return `<td>${displayValue}</td>`;
                      })
                      .join('')}</tr>`
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(tableHtml);
    printWindow.document.close();
    printWindow.print();
  }, [filteredData, visibleColumnsList, title]);

  // Filter change handler
  const handleFilterChange = useCallback(
    (columnId: string, value: any) => {
      const newFilters = { ...filters, [columnId]: value };
      setFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    [filters, onFilterChange]
  );

  // Clear all filters and search
  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchText('');
    setPage(0);
    onFilterChange?.({});
  }, [onFilterChange]);

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return (
      searchText.trim() !== '' ||
      Object.values(filters).some((value) => value !== null && value !== undefined && value !== '')
    );
  }, [searchText, filters]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {title && (
          <Typography variant="h6" component="div" sx={{ flex: '1 1 100%' }}>
            {title}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          {searchable && (
            <TextField
              size="small"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
          )}

          {selectable && (
            <Tooltip title="Column Selection">
              <IconButton onClick={(e) => setColumnMenuAnchor(e.currentTarget)}>
                <ViewColumnIcon />
              </IconButton>
            </Tooltip>
          )}

          {filterable && (
            <Tooltip title="Filters">
              <IconButton onClick={(e) => setFilterMenuAnchor(e.currentTarget)}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}

          {hasActiveFilters && (
            <Tooltip title="Clear Filters">
              <IconButton onClick={handleClearFilters} color="error">
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}

          {exportable && (
            <Tooltip title="Download Excel">
              <IconButton onClick={handleExportExcel} disabled={filteredData.length === 0}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}

          {printable && (
            <Tooltip title="Print">
              <IconButton onClick={handlePrint} disabled={filteredData.length === 0}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>

      {/* Column Selection Menu */}
      <Menu
        anchorEl={columnMenuAnchor}
        open={Boolean(columnMenuAnchor)}
        onClose={() => setColumnMenuAnchor(null)}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Toggle Columns
          </Typography>
        </MenuItem>
        {columns.map((col) => (
          <MenuItem key={String(col.id)} onClick={() => handleColumnToggle(String(col.id))}>
            <Checkbox checked={visibleColumns.has(String(col.id))} />
            {col.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
        PaperProps={{
          sx: { minWidth: 300, maxWidth: 400, maxHeight: 500, overflow: 'auto' },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Column Filters
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {columns
              .filter((col) => col.filterable !== false)
              .map((col) => {
                if (col.filterType === 'select' && col.filterOptions) {
                  return (
                    <FormControl key={String(col.id)} fullWidth size="small">
                      <InputLabel>{col.label}</InputLabel>
                      <Select
                        value={filters[String(col.id)] || ''}
                        label={col.label}
                        onChange={(e) => handleFilterChange(String(col.id), e.target.value)}
                      >
                        <MenuItem value="">
                          <em>All</em>
                        </MenuItem>
                        {col.filterOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }
                return (
                  <TextField
                    key={String(col.id)}
                    size="small"
                    label={col.label}
                    value={filters[String(col.id)] || ''}
                    onChange={(e) => handleFilterChange(String(col.id), e.target.value)}
                    placeholder={`Filter ${col.label}...`}
                    fullWidth
                  />
                );
              })}
          </Box>
          {hasActiveFilters && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                fullWidth
                startIcon={<ClearIcon />}
                onClick={() => {
                  handleClearFilters();
                  setFilterMenuAnchor(null);
                }}
              >
                Clear All Filters
              </Button>
            </Box>
          )}
        </Box>
      </Menu>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {visibleColumnsList.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={visibleColumnsList.length} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumnsList.length} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow
                  key={getRowId(row)}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {visibleColumnsList.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={String(column.id)} align={column.align || 'left'}>
                        {column.format ? column.format(value, row) : value ?? ''}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      )}
    </Paper>
  );
}

