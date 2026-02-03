//para el manejo de useState y useEffect
import { useState, useEffect } from "react";

export function useFetch(asyncCallback){
    const [data, setData]= useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(()=>{

        async function fetchData(){
            try{
                //ejecuta la funcion de la api
                const result = await asyncCallback();
                setData(result);
            }catch(error){
                //si la api falla,
                setError(error.message);
            }finally{
                setLoading(false);
            }
        }

        fetchData(); //ejecutar el componente
    }, []);
    return {data, loading, error};
}
