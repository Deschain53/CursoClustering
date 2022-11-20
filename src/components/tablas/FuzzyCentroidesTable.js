import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

export const FuzzyCentroidesTable = ({
  centroides = [], 
  parametrosName = ["Cluster","Rapidez", "Velocidad"]}) => {

  console.log(centroides)
    return (
    <>
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
          {centroides.map((centroide, index) => (
            <StyledTableRow key={centroide[0]}>
              <StyledTableCell align="left">{index+1}</StyledTableCell>
              <StyledTableCell align="left">{trunca(centroide[0],4)}</StyledTableCell>
              <StyledTableCell align="left">{trunca(centroide[1],4)}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
    )
}

//<StyledTableCell component="th" scope="row">
//{row.name}
//</StyledTableCell>


