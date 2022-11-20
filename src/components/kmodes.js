import * as data from '../data/bank';
import StickyHeadTable from '../components/tablas/ScrollTable';
//import { LineChart } from './LineChart';

export const Kmodes = () => {

    const dataBank = Object.values(data);

    const k = 3;

    

    //const datosConNuevaInfo = dataBank.map(d => {return { cluster:-1, centroide:-1, distancia: [], ...d }});
    //console.log(datosConNuevaInfo);

//    Input variables:
//    # bank client data:
//    1 - age (numeric)
//    2 - job : type of job (categorical: "admin.","unknown","unemployed","management","housemaid","entrepreneur","student",
//                                        "blue-collar","self-employed","retired","technician","services") 
//    3 - marital : marital status (categorical: "married","divorced","single"; note: "divorced" means divorced or widowed)
//    4 - education (categorical: "unknown","secondary","primary","tertiary")
//    5 - default: has credit in default? (binary: "yes","no")
//    6 - balance: average yearly balance, in euros (numeric) 
//    7 - housing: has housing loan? (binary: "yes","no")
//    8 - loan: has personal loan? (binary: "yes","no")
//    # related with the last contact of the current campaign:
//    9 - contact: contact communication type (categorical: "unknown","telephone","cellular") 
//   10 - day: last contact day of the month (numeric)
//   11 - month: last contact month of year (categorical: "jan", "feb", "mar", ..., "nov", "dec")
//   12 - duration: last contact duration, in seconds (numeric)
//    # other attributes:
//   13 - campaign: number of contacts performed during this campaign and for this client (numeric, includes last contact)
//   14 - pdays: number of days that passed by after the client was last contacted from a previous campaign (numeric, -1 means client was not previously contacted)
//   15 - previous: number of contacts performed before this campaign and for this client (numeric)
//   16 - poutcome: outcome of the previous marketing campaign (categorical: "unknown","other","failure","success")
// 
//   Output variable (desired target):
//   17 - y - has the client subscribed a term deposit? (binary: "yes","no")
 
    //Arreglos para convertir los datos y manipularlos más facilmente
    const tipoDeTrabajo = ['admin.','blue-collar','entrepreneur','housemaid','management','retired',
        'self-employed','services','student','technician','unemployed','unknown'];
    const estadoCivil = ["married","divorced","single"];
    const educacion = ["unknown","secondary","primary","tertiary"];
    const deudor = ["yes","no"];
    const prestamo = ["yes","no"];
    const tipoContacto = ["unknown","telephone","cellular"];
    const resultadoAnterior = ["unknown","other","failure","success"];

    //Funcion que compara un atributo con los valores de una matriz para devolver el valor de la coincidencia
    const transforma = (atributo, array = []) => {
        return array.findIndex(elemento => elemento == atributo)
    }

    const decadaEdad = (edad) => {
        return  Math.trunc(edad/10) || 0 ;
    }

//0 - Convirtiendo a datos y verificando que no haya datos faltantes
    const datosProcesados = dataBank.map( dato => {
        if(dato!== undefined){
        if(dato.age != null &dato.job != null &dato.marital != null & dato.education 
            != null & dato.default != null & dato.loan != null & dato.contact != null 
            & dato.poutcome != null ) {
            return {
                //...dato,
                age: decadaEdad(dato.age),
                job: transforma(dato.job,tipoDeTrabajo),    
                marital: transforma(dato.marital, estadoCivil),
                education: transforma(dato.education,educacion),
                deudor: transforma(dato.default,deudor),
                loan: transforma(dato.loan,prestamo),
                contact: transforma(dato.contact,tipoContacto),
                poutcome: transforma(dato.poutcome,resultadoAnterior),
                cluster:-1, 
                distancias: [],
            }
        }}
    })

    //console.log(datosProcesados)


//1 - Eligiendo centroides aleatorios del conjunto de datos:

    //Funcion que elige numero aleatorio entre numeros aleatorios 
    const eligeAleatorio = (max) => {
        return Math.trunc(Math.random() * max)
    }

    //Funcion que elige centroides aletorios de entre un arreglo de objetos
    const eligeCentroideAleatorios = ( n, datos = []) => {
    
        let indexDatos = [];

        for (let i = 0; i < n; i++) {
            indexDatos.push(eligeAleatorio(datos.length));
        }

        let centroides = [];

        for (let i = 0; i < n; i++) {
            centroides.push(datos[indexDatos[i]]);
        }

        return centroides;
    }

    const centroidesIniciales = eligeCentroideAleatorios(k, datosProcesados);
    
   // console.log(centroidesIniciales)


//2 - Calculando distancias a los centroides 

    const atributos = ["age","job","marital", "education", "deudor", "loan", "contact", "poutcome",]

    //Función para obtener la distancia de un dato a un arreglo de centroides, 
    //devuelve un arreglo con las distancias
    const obtenDistanciaCentroides = (dato, centroides= [], atributos = []) => {
        let distancias = []

        for (let i = 0; i < centroides.length; i++) {
            const centroide = centroides[i];
            let distancia = 0;
            //console.log('Para centroide' + i)
            
            for (let j = 0; j < atributos.length; j++) {
                if(dato[atributos[j]] !== centroide[atributos[j]]){
                    distancia++;
                    //console.log(atributos[j] + ' diferente');
                }
            }            
            
            distancias.push(distancia);
        }
        return distancias;
    }

    //Encuentra distancia entre conjunto de datos y centroides
    const getDistanciaCentroides = (data = [], centroides, atributos) => {
        return data.map(dato => {
            if(dato){ 
                return {...dato, distancias : obtenDistanciaCentroides(dato, centroides,atributos )  }
            }})
    }

    const datosConDistanciaCentroides = datosProcesados.map(dato => {
        if(dato){ 
            return {...dato, distancias : obtenDistanciaCentroides(dato, centroidesIniciales,atributos )  }
        }})
    

//3 - Asignar grupo a cluster más cercano
    
    const asignaACluster = (distancias = []) => {
        const valorMinimo = Math.min.apply(null,distancias);
        const posicionValorMinimo = distancias.findIndex( distancia => distancia === valorMinimo );
        
        return posicionValorMinimo;
    }


    const getArregloConClusterAsignado = (datos = []) => {
        return datos.map( dato => { 
            if(dato!= undefined)
            return {...dato, cluster: asignaACluster(dato.distancias)  }})
    }

    const datosConClusterAsignado = datosConDistanciaCentroides.map( dato => { 
        if(dato!= undefined)
        return {...dato, cluster: asignaACluster(dato.distancias)  }})


//4 - Encontrar los nuevos centroides 

    //Funcion para encontrar nuevos centroides teniendo los datos

    //Determina la cantidad de valores diferentes que puede tomar un atributo numerico
    const determinaNumeroDeAtributo = (atributo = '', datos = []) => {
        const atributoArray = datos.map( dato => {
            if(dato!== undefined)
            return dato[atributo]
        })

        //console.log(atributoArray)

        return Math.max.apply(null,atributoArray) +1
    }


    //Funcion que cuenta el numero de cada variacion de atributo y regresa el resultado en arreglo 
    const cuentaAtributoEnDatos = (atributo = '', datos = []) => {
        const numeroAtributos = determinaNumeroDeAtributo(atributo, datos);
        //console.log('Numero maximo ' + atributo +' : ' + numeroAtributos)
        let atributosContabilizados = [];

        for (let i = 0; i < numeroAtributos; i++) {
            let contabilidadAtributoI = 0;
            for (let j = 0; j < datos.length -2; j++) {
                if(datos[j][atributo] == i){
                    
                    contabilidadAtributoI++;
                }
            }

            atributosContabilizados.push(contabilidadAtributoI);
        }

        return atributosContabilizados;
    }

    //Encuentra centroide de un conjunto de datos y regresa con objeto con los valores de cada atributo
    const encontrarCentroide = (datos = [], atributos = []) => {

        let centroide = {};

        for (let j = 0; j < atributos.length; j++) { 
            const arrayContabilidaAtributos = cuentaAtributoEnDatos(atributos[j],datos);
            //console.log(arrayContabilidaAtributos)
            const valorMaximoEnAtributo = Math.max.apply(null,arrayContabilidaAtributos);
            //console.log('Valor maximo + ' + atributos[j]+ ' : '+valorMaximoEnAtributo)
            const posValorMaximo = arrayContabilidaAtributos.findIndex( valor => valor ===valorMaximoEnAtributo);
            //console.log('posicion valor maximo' +  posValorMaximo)
            Object.defineProperty(centroide,atributos[j],{value: posValorMaximo })
        }

        //console.log(centroide)
        return centroide;

    }

    //Encontrar nuevos centroides

    const encontrarCentroideClusterNumero = (datos = [], atributos = [], n) => {

        const elementosClusterI = datos.filter( dato => dato.cluster == n  );
        //console.log(elementosClusterI)

        const conCluster = elementosClusterI.map(dato => {return {...dato, cluster: n, distancias:[]}})
       // console.log(conCluster)

        return encontrarCentroide(conCluster, atributos);
    }

    const encontrarNuevosCentroides = (datos = [], atributos = [], n = 2) => {
        let centros = [];
        
        for (let i = 0; i < n; i++) {
            const centroideI = encontrarCentroideClusterNumero(datos,atributos,n);
            centros.push(centroideI);
        }
        return centros;
    }

    const getCentroidesConTres = (datos= [], atributos = []) => {
        const nuevoCentroide1 = encontrarCentroideClusterNumero(datos, atributos,0);
        //console.log(nuevoCentroide1)
        const nuevoCentroide2 = encontrarCentroideClusterNumero(datos, atributos,1);
        //console.log(nuevoCentroide2)
        const nuevoCentroide3 = encontrarCentroideClusterNumero(datos, atributos,2);
        //console.log(nuevoCentroide3)

        let newCentro = []
        newCentro.push(nuevoCentroide1)
        newCentro.push(nuevoCentroide2)
        newCentro.push(nuevoCentroide3)
        
        return newCentro;
    }
   
    ////Prueba 100
    
    console.log('******************')
    let data100 = [];
    const k100 = 3;

    for (let i = 0; i < 10 ; i++) {
        //data100.push(datosConClusterAsignado[i]);
        data100.push(datosProcesados[i]);
    }

    //console.log(data100)

    const centroidesIniciales100 = eligeCentroideAleatorios(k100, data100);
    //console.log(centroidesIniciales100)

    const distanciaCentroidesIniciales = getDistanciaCentroides(data100,centroidesIniciales100, atributos);
    //console.log(distanciaCentroidesIniciales)

    const clustersAsignados100 = getArregloConClusterAsignado(distanciaCentroidesIniciales);
    //console.log(clustersAsignados100)

    //console.log('Nuevos centroides')
    
   

    const getNumeroElementosEnCadaCluster = (datos = [], n = 3) => {

        let arrayNumero = [];

        for (let i = 0; i < n; i++) {
            const elementosClusterI = datos.filter( dato => dato.cluster == i  );
            arrayNumero.push(elementosClusterI.length)
        }

        return arrayNumero;
    }
        
    const newCentro = getCentroidesConTres(clustersAsignados100, atributos);

    const gdc = getDistanciaCentroides(clustersAsignados100,newCentro, atributos);
    const dcca = getArregloConClusterAsignado(gdc);

    const numeroDeElementosEnCadaClusterInicial = getNumeroElementosEnCadaCluster(dcca,3)

    console.log(numeroDeElementosEnCadaClusterInicial)

    let arregloAux = [];
    let dataAux = dcca;

    //Asignacion de centros, disimilitud y reasignacion de clusters
    for (let i = 0; i < 5; i++) {
        const centros = getCentroidesConTres(dataAux, atributos);
        const disimilitudCentroides = getDistanciaCentroides(dataAux,centros, atributos);
        const elementosCadaCluster = getNumeroElementosEnCadaCluster(dcca,3)
        dataAux = getArregloConClusterAsignado(disimilitudCentroides);
        arregloAux.push({centros,disimilitudCentroides,dataAux,itera:i,elementosCadaCluster})
    }

    console.log(arregloAux)

    console.log('Nuevos centroides')
    
    //const nuevosCentroides = encontrarNuevosCentroides(clustersAsignados100, atributos,3);
    //console.log(nuevosCentroides)


    return (
    <>
        <div>kmodes</div>
        <div>Datos procesados</div>
        <StickyHeadTable data = {data100}/>

        <div>Centroides iniciales - Iteración 0</div>
        <StickyHeadTable data = {centroidesIniciales100}/>

        <div>Distancia a centroides iniciales y clusters asignados - Iteración 0</div>
        <StickyHeadTable data = {clustersAsignados100}/>

        <div>Buscando nuevos centroides - Iteración 0</div>
        <StickyHeadTable data = {newCentro}/>

        <div>Asignando a centroides - Iteración 0</div>
        <StickyHeadTable data = {dcca}/>


        {
            arregloAux.map(( iteracion =>
                { return (<>

                    <div>Centroides nuevos - Iteración {iteracion.itera}</div>
                    <StickyHeadTable data = {iteracion.centros}/>
            
                    <div>Distancia a centroides iniciales y clusters asignados - Iteración {iteracion.itera}</div>
                    <StickyHeadTable data = {iteracion.disimilitudCentroides}/>
            
                    <div>Asignando nuevos clusters - Iteración {iteracion.itera}</div>
                    <StickyHeadTable data = {iteracion.dataAux}/>
                    </>)
                }
            ))
        }


    </>
    )
}


//    const arrayprueba = [datosConClusterAsignado[0],datosConClusterAsignado[1], datosConClusterAsignado[2]];
//    console.log(arrayprueba)
//
//    //console.log(encontrarNuevosCentroides(arrayprueba, k, atributos))
//    console.log('******************')
//    
//    console.log('Num atrib ' + determinaNumeroDeAtributo('job',arrayprueba ))
//    console.log( encontrarCentroide(arrayprueba, atributos))
//    //console.log( encontrarNuevosCentroides(datosConClusterAsignado, atributos))


    