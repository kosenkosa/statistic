import react from 'react'

import { DataGrid } from '@material-ui/data-grid';

const columns = [
    {
        field: 'id',
        headerName: '№',
        width: 100,
    },
    {
        field: 'Name',
        headerName: 'Виконавець',
        width: 200,
        editable: true,
    },
    {
        field: 'Plan',
        headerName: 'План',
        type: 'number',
        width: 200,
        editable: true,
    },
    {
        field: 'Fact',
        headerName: 'Факт',
        type: 'number',
        width: 200,
        editable: true,
    },
    {
        field: 'Ostatok',
        headerName: 'Залишилось',
        type: 'number',
        width: 200,
        editable: true,

    },
];




const Resalt = (props) => {
    const rows = props.rows

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
              
            disableSelectionOnClick
            />
        </div>
    )
}
export default Resalt