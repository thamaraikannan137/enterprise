import { useMemo } from 'react';
import { DataTable, type Column } from '../../common';
import type { LegalEntity } from '../../../types/organization';

interface LegalEntityTableProps {
  legalEntities: LegalEntity[];
  onRowClick?: (legalEntity: LegalEntity) => void;
  loading?: boolean;
}

export const LegalEntityTable = ({ 
  legalEntities, 
  onRowClick, 
  loading = false 
}: LegalEntityTableProps) => {
  const columns: Column<LegalEntity>[] = useMemo(
    () => [
      {
        id: 'entity_name',
        label: 'Entity Name',
        minWidth: 200,
        sortable: true,
        filterable: true,
      },
      {
        id: 'legal_name',
        label: 'Legal Name',
        minWidth: 200,
        sortable: true,
        filterable: true,
      },
      {
        id: 'company_identification_number',
        label: 'CIN',
        minWidth: 150,
        sortable: true,
        filterable: true,
      },
      {
        id: 'date_of_incorporation',
        label: 'Date of Incorporation',
        minWidth: 150,
        sortable: true,
        format: (value) => {
          if (!value) return '';
          return new Date(value as string).toLocaleDateString();
        },
      },
      {
        id: 'type_of_business',
        label: 'Type of Business',
        minWidth: 150,
        sortable: true,
        filterable: true,
      },
      {
        id: 'sector',
        label: 'Sector',
        minWidth: 150,
        sortable: true,
        filterable: true,
      },
      {
        id: 'city',
        label: 'City',
        minWidth: 120,
        sortable: true,
        filterable: true,
      },
      {
        id: 'state',
        label: 'State',
        minWidth: 120,
        sortable: true,
        filterable: true,
      },
      {
        id: 'currency',
        label: 'Currency',
        minWidth: 100,
        sortable: true,
        filterable: true,
      },
    ],
    []
  );

  return (
    <DataTable
      title="Legal Entities"
      data={legalEntities}
      columns={columns}
      onRowClick={onRowClick}
      loading={loading}
      searchable={true}
      filterable={true}
      exportable={true}
      printable={true}
      selectable={true}
      pagination={true}
      rowsPerPageOptions={[10, 25, 50, 100]}
      defaultRowsPerPage={10}
      getRowId={(row) => row.id || String(row)}
    />
  );
};






