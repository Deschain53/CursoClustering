const datos = [
    {id: 1,  parametros: [0.58,0.33], },
    {id: 2,  parametros: [0.90,0.11], },
    {id: 3,  parametros: [0.68,0.17], },
    {id: 4,  parametros: [0.11,0.44], },
    {id: 5,  parametros: [0.47,0.81], },
    {id: 6,  parametros: [0.24,0.83], },
    {id: 7,  parametros: [0.09,0.18], },
    {id: 8,  parametros: [0.82,0.11], },
    {id: 9,  parametros: [0.65,0.50], },
    {id: 10, parametros: [0.09,0.63], },
    {id: 11, parametros: [0.98,0.24], },
]

const norma = (d1 = [2,2], d2 = [0,0]) => { //} ||x-y||^2 
    let resultado = 0;

    if(d1.length === d2.length){

    for (let i = 0; i < d1.length; i++) {
        //console.log('d1['+i+'] = '+ d1[i]);
        //console.log('d2['+i+'] = '+ d2[i]);
        //console.log('diferencia: ' + (d1[i] - d2[i]))
        resultado = resultado + Math.pow((d1[i] - d2[i]),2);    //Elevando al cuadrado la diferencia
    }

    }

    return resultado;
}

const obtenPertenencia = (dato = [], centroides = [], m = 2) => {
    let arrayPertenencia = [];
    //console.log(dato.length)
    //console.log(centroides[0].length)

    if( (centroides !== []) && (dato.length === centroides[0].length)){

    for (let i = 0; i < centroides.length; i++) {

        let aux = 0;  //Auxiliar en la suma de denominador Uij
        
        for (let j = 0; j < centroides.length; j++) {
            const div = norma(dato,centroides[i]) / norma(dato,centroides[j]);
            //console.log(div)
            aux = aux + Math.pow(div, 1/(m-1))
            //console.log(aux);
        }
        
        arrayPertenencia.push(1/aux);
    
    } 

    }

    return arrayPertenencia;
}


const obtenenCoordenadaCentroide = (arrayAuxNumeradorDenominador,p) => {
    let num = 0; 
    let den = 0;

    for (let i = 0; i < arrayAuxNumeradorDenominador.length; i++) {
        const {parametros, pertenenciaALaM} = arrayAuxNumeradorDenominador[i];

        den = den + pertenenciaALaM;
        num = num + parametros[p];

    }

    const coordenadaCentroide = num/den;

    return coordenadaCentroide;
}


const obtenCentroidesNuevos = (datos = [], m = 2) => {
    let centroides = [];

    for (let j = 0; j < datos[0].pertenencia.length; j++) {
        //onst element = datos[0].pertenencia[j];
        
        const arrayAuxNumeradorDenominador = datos.map( dato => { 
            const pertenenciaALaM =  Math.pow(dato.pertenencia[j],m);
            return {
                parametros: dato.parametros.map( p => p*pertenenciaALaM),
                pertenenciaALaM
            }
        })

        let centroideJ = [];

        for (let k = 0; k < datos[0].pertenencia.length; k++) {
            const pK = obtenenCoordenadaCentroide(arrayAuxNumeradorDenominador,k);
            centroideJ.push(pK)
        }

        centroides.push(centroideJ);
    }

    return centroides;
}

const obtenArregloConPertenencia = (datos = [], centroides = [], m = 2) => {
    return datos.map( dato => {{
        return { ...dato, pertenencia: obtenPertenencia(dato.parametros,centroides,m) }
    }})
} 


export const fuzzy_K_means_functions = (d = datos, c = 2, m = 2, iteraciones = 12 ) => {
    const iterationMemory = [] ; //{datosConPertenencia: [], centroides: []}
    let datosMemory = [];
    let centroideMemory = [];

    //Si se quisiera hacer para c numero de clusters se podrian elegir c centroides
    const centroidesIniciales = [[0.2,0.5],[0.8,0.5],];

    //Iteracion inicial - iteracion 0
    datosMemory = obtenArregloConPertenencia(d, centroidesIniciales, m);
    centroideMemory = obtenCentroidesNuevos(datosMemory, 2)
    iterationMemory.push({datos: datosMemory, centroides: centroideMemory})
    //console.log(centroideMemory)
    

    for (let i = 0; i < iteraciones ; i++) {
        //const datosConPertenencia = obtenArregloConPertenencia(d, centroidesIniciales, m);
        //const nuevosCentroides = obtenCentroidesNuevos(datosConPertenencia, 2)
        datosMemory = obtenArregloConPertenencia(d, centroideMemory, m);
        centroideMemory = obtenCentroidesNuevos(datosMemory, 2)

        iterationMemory.push({datos: datosMemory, centroides: centroideMemory})
        //console.log(centroideMemory)
    }




    //const datosProcesados = d;

    return { centroidesIniciales, iterationMemory }
}


    //console.log(datos)
    //console.log('parametros' + datos[0].parametros);
    //console.log('centroide' + centroidesIniciales[0]);
    //console.log( norma(datos[0].parametros,centroidesIniciales[0]));
//
    //console.log('parametros' + datos[0].parametros);
    //console.log('centroide' + centroidesIniciales[1]);
    //console.log( norma(datos[0].parametros,centroidesIniciales[1]));

    //console.log(obtenPertenencia(datos[0].parametros, centroidesIniciales, 2))


    //Encontrando pertenencia de centroides iniciales:
    //const datosConPertenencia = datos.map( dato => {{
    //    return { ...dato, pertenencia: obtenPertenencia(dato.parametros,centroidesIniciales,2) }
    //}})


//for (let i = 0; i < datos.length; i++) {
//    const uij = datos[i].pertenencia[j];
//    const uijM = Math.pow(uij,m);
//    console.log(uijM)
//}




