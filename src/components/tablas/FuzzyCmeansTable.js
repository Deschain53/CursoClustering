import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FuzzyCentroidesTable } from './FuzzyCentroidesTable';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  
  const trunca = (num, dec = 4) => {

    const multiplicador = Math.pow(10,dec);
    const aux = Math.round(multiplicador*num);

    return aux/multiplicador;
  }

export const FuzzyCmeansTable = ({
  iterationMemory = [], 
  count, 
  parametrosName = ["Jugador","Rapidez","Velocidad","PC (1)", "PC (2)"]}) => {


  const iteracion = count;
  const { datos,centroides } = iterationMemory[iteracion];

  console.log(centroides)
    return (
    <>
    <div>{"Pertenencia de elementos, Iteracion: "  + iteracion }</div>
    <TableContainer component={Paper}> 
      <Table sx={{ minWidth: 500 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {parametrosName.map((titulo) => (
              <StyledTableCell align="left">{titulo}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {datos.map((dato) => (
            <StyledTableRow key={dato.id}>
              <StyledTableCell align="left">{dato.id}</StyledTableCell>
              <StyledTableCell align="left">{trunca(dato.parametros[0],4)}</StyledTableCell>
              <StyledTableCell align="left">{trunca(dato.parametros[1],4)}</StyledTableCell>
              <StyledTableCell align="left">{trunca(dato.pertenencia[0],4)}</StyledTableCell>
              <StyledTableCell align="left">{trunca(dato.pertenencia[1],4)}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <div>{"Centroides, Iteracion: "  + iteracion }</div>
    <FuzzyCentroidesTable centroides={centroides}/>
    </>
    )
}

//<StyledTableCell component="th" scope="row">
//{row.name}
//</StyledTableCell>


