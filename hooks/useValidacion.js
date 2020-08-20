import React, {useState, useEffect} from 'react'


const useValidacion = (initialState, validar, fn) => {
    
    const [valores, guardarValores] = useState(initialState)
    const [errores, guardarErrores] = useState({})
    const [submitForm, guardarSubmitForm] = useState(false)

    useEffect(()=>{
        if(submitForm){
            const noErrores = Object.keys(errores).length === 0;
            if(noErrores){
                fn() // Fn función que se ejecuta en el componente
            }
            guardarSubmitForm(false)
        }
    },[submitForm])

    //funcion que se ejecuta conforme el usuario escribe algo
    const handleChange = e => {
        guardarValores({
            ...valores,
            [e.target.name] : e.target.value
        })   
    }

    //funcion que se ejecuta cuando el usuario hace submit
    const handleSubmit = e => {
        e.preventDefault()
        const erroresValidacion = validar(valores)
        guardarErrores(erroresValidacion)
        guardarSubmitForm(true)
    }

    //cuando se realiza el evento de blur
    const handleBlur = () => {
        const erroresValidacion = validar(valores)
        guardarErrores(erroresValidacion)
    }

    return {
        valores,
        errores,
        handleChange,
        handleSubmit,
        handleBlur
    }

}

export default useValidacion