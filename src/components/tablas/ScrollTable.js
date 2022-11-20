import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

//const columns = [
//  { id: 'name', label: 'Name', minWidth: 50 },
//  { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
//  {
//    id: 'population',
//    label: 'Population',
//    minWidth: 170,
//    align: 'right',
//    format: (value) => value.toLocaleString('en-US'),
//  },
//  {
//    id: 'size',
//    label: 'Size\u00a0(km\u00b2)',
//    minWidth: 170,
//    align: 'right',
//    format: (value) => value.toLocaleString('en-US'),
//  },
//  {
//    id: 'density',
//    label: 'Density',
//    minWidth: 170,
//    align: 'right',
//    format: (value) => value.toFixed(2),
//  },
//];
//
//function createData(name, code, population, size) {
//  const density = population / size;
//  return { name, code, population, size, density };
//}
//
//const rows = [
//  createData('India', 'IN', 1324171354, 3287263),
//  createData('China', 'CN', 1403500365, 9596961),
//  createData('Italy', 'IT', 60483973, 301340),
//  //createData('United States', 'US', 327167434, 9833520),
//  //createData('Canada', 'CA', 37602103, 9984670),
//  //createData('Australia', 'AU', 25475400, 7692024),
//  //createData('Germany', 'DE', 83019200, 357578),
//  //createData('Ireland', 'IE', 4857000, 70273),
//  //createData('Mexico', 'MX', 126577691, 1972550),
//  //createData('Japan', 'JP', 126317000, 377973),
//  //createData('France', 'FR', 67022000, 640679),
//  //createData('United Kingdom', 'GB', 67545757, 242495),
//  //createData('Russia', 'RU', 146793744, 17098246),
//  //createData('Nigeria', 'NG', 200962417, 923768),
//  //createData('Brazil', 'BR', 210147125, 8515767),
//];

export default function StickyHeadTable({data = [{age:0, job:0, marital:0, education:0,  deudor:0, loan:0, contact:0,  poutcome:0, cluster:0, distancias:[]}]}) {

    //console.log(data)

    const titulos = ["Edad","Trabajo", "EstadoCivil",  "Educacion",  "Deudor",  "Prestamo",  "Contacto",  "Antecedente","C",];

    const creaTitulos = (titulos = [], data =[]) => {
        let title = titulos;

        const tope = data[0].distancias != undefined? data[0].distancias.length : 0 ;

        for (let i = 0; i < tope; i++) {
            const name = 'Q' + (i+1) ;
            title.push(name);         
        } 
        return title;
    }
    
    
    //const contenido = data.map(  )
    
    const creaContenido = (data) => {
        const newInfoData = data.map( dato => {
            const {age:Edad, job:Trabajo, marital:EstadoCivil, education:Educacion,  deudor:Deudor, loan:Prestamo, contact:Contacto,  poutcome:Antecedente, cluster:C, distancias } = dato;
            let fila = {Edad, Trabajo, EstadoCivil, Educacion,  Deudor, Prestamo, Contacto,  Antecedente, C, };
            //let col = [age, job, marital, education,  deudor, loan, contact,  poutcome, cluster];

            const tope = distancias != undefined ? distancias.length : 0 ;

            for (let i = 0; i < tope; i++) {
                const stri = "Q" + (i + 1);
                fila[stri] = distancias[i];
                //col.push(distancias[i]);          
            }
            return fila;
        })
        
        return newInfoData;
    } 
    
    const tit = creaTitulos(titulos,data);

    const columns = tit.map(titulo => { return { id: titulo , label: titulo, minWidth: 50, align: 'right', }})

    //const columns = 

    const rows = creaContenido(data);

    //const rows = [[0,0,0,0,0,0,0,0],
    //[0,0,0,0,0,0,0,0],
    //[0,0,0,0,0,5,0,0],
    //[0,0,0,0,0,0,0,0],]

    //const {age, job, marital, education,  deudor, loan, contact,  poutcome, cluster, distancias} = dato; 
    
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {

                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = column.id === "C"? row[column.id] + 1:  row[column.id];

                        return (
                          <TableCell key={row.id*10+column.id} align={column.align}>
                              {value}
                          </TableCell>
                        );
                      
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}


//{column.format && typeof value === 'number'
//? column.format(value)
//: value}