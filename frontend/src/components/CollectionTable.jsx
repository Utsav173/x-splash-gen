import { Paper, Toolbar, Typography, alpha } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';

const columns = [
  { field: 'title', headerName: 'Name', flex: 1 },
  {
    field: 'createdAt',
    headerName: 'Date',
    flex: 1,
    type: 'Date',
    valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
  },
  {
    field: 'image',
    headerName: 'Images',
    type: 'number',
    valueGetter: (params) => params.row.images.length,
    flex: 1,
  },
];

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        My Collections
      </Typography>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function CollectionTable({ rows }) {
  return (
    <div style={{ width: 'auto' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar />

        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          getRowId={(row) => row._id}
        />
      </Paper>
    </div>
  );
}

CollectionTable.propTypes = {
  rows: PropTypes.array.isRequired,
};
