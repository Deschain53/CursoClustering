import React from "react";
import { Chart } from "react-google-charts";

export const getdata = (iterationMemory = [], index =  0) => {
  const data = iterationMemory[index].datos.map( dato => dato.parametros);
  const dataEnunciado = [['Rapidez', 'Resistencia']].concat(data);

  return dataEnunciado;
}

export const getDataConCentroides = (iterationMemory = [], index = 0 ) => {
  const data = getdata(iterationMemory)

  const viejo = iterationMemory[index].centroides;
  const nuevo = iterationMemory[index+1].centroides;//.map( dato => dato.parametros);

  const viejoConEnunciado = data.concat(viejo);  //['Rapidez', 'Resistencia'].concat
  const nuevoConEnunciado = data.concat(nuevo);

  //console.log(viejoConEnunciado)

  return {
    old : viejoConEnunciado,
    new : nuevoConEnunciado
  }
}


export function ScatterChartFuzzyCmeans({iterationMemory = [], count = 0 }) {

  //console.log(count)
  

  const options = {
    title: 'Comparación entre velocidad y resistencia - Iteracion ' + count + ' => ' + (count+1),
    hAxis: {title: 'Velocidad', minValue: 0, maxValue: 1},
    vAxis: {title: 'Resistencia', minValue: 0, maxValue: 1},
    legend: 'none',
    pointShape: "point"
  };
    
  const dataJunta =   getDataConCentroides(iterationMemory,count)//[data,diffdata]

  return (
    <>
    <Chart
      chartType="ScatterChart"
      width="100%"
      height="400px"
      diffdata = {dataJunta}
      options = {options}
      />

      </>
  );
}