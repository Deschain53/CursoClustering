import React, {useState} from "react";
import { fuzzy_K_means_functions } from "../algoritmos/funciones"
import { ScatterChartFuzzyCmeans } from "./graficas/ScatterChartFuzzyCmeans";
import { FuzzyCmeansTable } from "./tablas/FuzzyCmeansTable";


//import { ScatterAdvancedChart } from "./graficas/ScatterAdvancedChart";

export const FuzzyCmeans = () => {
    
    const { iterationMemory } = fuzzy_K_means_functions();
    
    const [count, setCount] = useState(0);
    
    const Botones = () => {
        return (
            <>
                <button
                    type="button" 
                    className="btn btn-dark" 
                    onClick={() => { if(count > 0){ setCount(count - 1) } }}>
                    Atrás 
                </button>
                <button
                    type="button" 
                    className="btn btn-dark" 
                    onClick={() => { if(count < iterationMemory.length -2 ){ setCount(count + 1) } }}>
                    Siguiente 
                </button>
            </>
        )
    }

    return (
        <>
        <div className="Title">Fuzzy C means - Ejemplo Jugadores</div>
        
        <div className="container">

            <div className="row justify-content-md-center">
                <Botones/>
            </div>

            <div className="row">
                <div className="col-6">
                    <FuzzyCmeansTable 
                        iterationMemory = {iterationMemory} 
                        count = {0}/>              
                </div>

                <div className="col-6">
                    <FuzzyCmeansTable 
                        iterationMemory = {iterationMemory} 
                        count = {count + 1}/>
                </div>
            </div>

            <div className="row justify-content-md-center">
                <Botones/>
            </div>

            <div className="row">
                <ScatterChartFuzzyCmeans 
                    iterationMemory = {iterationMemory} 
                    count = {count}/>
            </div>
            
            <div className="row">
                Página hecha por Jorge Adrián Lucas Sánchez 
                para el curso "Técnicas de clustering para el diagnostico de procesos"
                impartido por el doctor Antonio Orantes Molina
                la Univesidad Tecnológica de la Mixteca.
            </div>

        </div>
    </>
    )
}