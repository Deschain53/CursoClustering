import * as data from '../data/bank';

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
 
    const tipoDeTrabajo = ['admin.','blue-collar','entrepreneur','housemaid','management','retired','self-employed','services','student','technician','unemployed','unknown'];
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
        if(dato.age != null &dato.job != null &dato.marital != null & dato.education != null & dato.default != null & dato.loan != null & dato.contact != null & dato.poutcome != null ) {
            return {
                //...dato,
                age: decadaEdad(dato.age),
                job: transforma(dato.job,tipoDeTrabajo),    
                marital: transforma(dato.marital, estadoCivil),
                education: transforma(dato.education,educacion),
                default: transforma(dato.default,deudor),
                loan: transforma(dato.loan,prestamo),
                contact: transforma(dato.contact,tipoContacto),
                poutcome: transforma(dato.poutcome,resultadoAnterior),
                cluster:-1, 
                distancias: [],
            }
        }}
    })

    console.log(datosProcesados)


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
    
    console.log(centroidesIniciales)


//2 - Calculando distancias a los centroides 

    const atributos = ["age","job","marital", "education", "default", "loan", "contact", "poutcome",]

    //Función para obtener la distancia de un dato a un arreglo de centroides, devuelve un arreglo con las distancias
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

    

    const datosConDistanciaCentroides = datosProcesados.map(dato => {
        if(dato){ 
            return {...dato, distancias : obtenDistanciaCentroides(dato, centroidesIniciales,atributos )  }
        }})

        console.log(datosConDistanciaCentroides);
    

//3 - Asignar grupo a cluster más cercano
    
    const asignaACluster = (distancias = []) => {
        const valorMinimo = Math.min.apply(null,distancias);
        const posicionValorMinimo = distancias.findIndex( distancia => distancia === valorMinimo );
        
        return posicionValorMinimo;
    }



    const datosConClusterAsignado = datosConDistanciaCentroides.map( dato => { 
        if(dato!= undefined)
        return {...dato, cluster: asignaACluster(dato.distancias)  }})


//5 - Encontrar los nuevos centroides 

    //Funcion para encontrar nuevos centroides teniendo los datos

    //Determina la cantidad de valores diferentes que puede tomar un atributo numerico
    const determinaNumeroDeAtributo = (atributo = '', datos = []) => {
        const atributoArray = datos.map( dato => {
            if(dato!== undefined)
            return dato[atributo]
        })

        return Math.max.apply(null,atributoArray) +1 
    }

    //Funcion que cuenta el numero de cada variacion de atributo y regresa el resultado en arreglo 
    const cuentaAtributoEnDatos = (atributo = '', datos = []) => {
        const numeroAtributos = determinaNumeroDeAtributo(atributo, datos);
        console.log('Numero maximo ' + atributo +' : ' + numeroAtributos)
        let atributosContabilizados = [];

        for (let i = 0; i < numeroAtributos; i++) {
            let contabilidadAtributoI = 0;
            for (let j = 0; j < datos.length; j++) {
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
            const valorMaximoEnAtributo = Math.max.apply(null,arrayContabilidaAtributos);
            Object.defineProperty(centroide,atributos[j],{value: arrayContabilidaAtributos.findIndex( valor => valor ===valorMaximoEnAtributo ) })
        }

        console.log(centroide)
        return centroide;

    }

    const encontrarNuevosCentroides = (datos = [], k = 2, atributos = []) => {
        let centroides = [];
        
        for (let i = 0; i < k; i++) {
            const elementosClusterI = datos.map( dato => { 
                if(dato!== undefined)
                if(dato.cluster === i){return dato}}
                );
            const centroideI = encontrarCentroide(elementosClusterI, atributos);
            centroides.push(centroideI)
        }
        return centroides;
    }

    console.log(encontrarNuevosCentroides(datosConClusterAsignado,k,atributos))


    return (
    <>
        <div>kmodes</div>
    </>
    )
}



    
    //console.log(datosConDistanciaCentroides[0].distancias )
    //console.log(Math.min.apply(null, datosConDistanciaCentroides[0].distancias) )

    //console.log(datosConClusterAsignado)
    

    //console.log(datosProcesados[0])
    //console.log(centroides)
    //console.log(obtenDistanciaCentroides(datosProcesados[0], centroides, atributos))

    //console.log(datosConDistanciaCentroides);

//    //Funcion para contar el valor de cada atributo
//    const cuentaAtributoEnDatos = (atributo = '', datos = [] ) => {
//
//        let memoriaAtributo = [{valor : datos[0][atributo], numero : 0}];
//
//        //Determinar el numero de atributos diferentes:
//        for (let i = 0; i < datos.length; i++) {
//            if(datos[i][atributo] === memoriaAtributo[0].valor) {
//                //memoriaAtributo[0].numero++;
//            }else{
//                memoriaAtributo.push({valor : datos[i][atributo], numero : 1})
//            }
//        }
//
//    }






        //for (let i = 0; i < datos.length; i++) {
        //    console.log('Para ' + i + ' : ' +datos[i]['age']);
        //    console.log('Para ' + i + ' : ' +datos[i][atributo]);
        //    atributosContabilizados = atributosContabilizados.map(   )
        //    //atributosContabilizados[datos[i][atributo]] = atributosContabilizados[datos[i][atributo]] + 1;   
        //             
        //}



        ///--------------------+

    //onsole.log(determinaNumeroDeAtributo("education",datosConClusterAsignado));

//    const encontrarNuevosCentroides = (datos = [], n, atributos = []) => {
//        let centroides = [];
//
//        for (let i = 0; i < centroides.length; i++) {
//           
//            for (let j = 0; j < atributos.length; j++) {
//                let contaAtributos = new Object();
//                //console.log(atributos[j])
//                //console.log(cuentaAtributoEnDatos(atributos[j], datos))
//                contaAtributos[atributos[j]] = [];             
//                //contaAtributos[atributos[j]] = cuentaAtributoEnDatos(atributos[j], datos);             
//                console.log(contaAtributos);
//            }
//        }
//
//
//        return centroides;
//    }


///----------------------


    //const arrayprueba = [datosConClusterAsignado[0],datosConClusterAsignado[1], datosConClusterAsignado[2]];

    //console.log(encontrarNuevosCentroide(arrayprueba, k, atributos))
    //const nuevosCentroides = encontrarNuevosCentroides(datosConClusterAsignado, k, atributos);

    //console.log(arrayprueba)
    //console.log(cuentaAtributoEnDatos('marital',arrayprueba))