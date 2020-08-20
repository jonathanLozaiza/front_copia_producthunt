import React, {useState} from 'react'
import Layout from '../componets/layout/Layout'
import Router from 'next/router'
import {Formulario, Campo, InputSubmit, Error} from '../componets/ui/Formulario'
import styled from '@emotion/styled'
import firebase from '../firebase'

const Titulo = styled.h1`
    text-align : center;
    margin-top : 5rem;
`

//validaciones
import useValidacion from '../hooks/useValidacion'
import validarCrearCuenta from '../validacion/validarCrearCuenta'

const STATE_INICIAL = {
    nombre : '',
    email : '',
    password : ''
}

const CrearCuenta = () => {

    const {valores, errores, handleChange, handleSubmit, handleBlur} = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta)

    //extraemos variables de valores
    const {nombre, email, password} = valores;

    //state para guardar errores de autenticacion
    const [error, guardarError] = useState('')

    // llamando al objeto de la clase Firebase y ejecutando la funcion registrar
    async function crearCuenta(){

        try{
            await firebase.registrar(nombre, email, password);
            Router.push('/')
        }catch(error){ 
            console.error('Hubo un error al crear el usuario', error.message)
            guardarError(error.message)
        }
    }

  return (

    <Layout>
        <>
            <Titulo>Crear cuenta</Titulo>

            <Formulario onSubmit={handleSubmit}>
                <Campo>
                    <label htmlFor='nombre'>Nombre</label>

                    <input 
                        type='text'
                        id='nombre'
                        placeholder='Tu nombre'
                        name='nombre'
                        value={nombre}
                        onChange={handleChange}
                        //onBlur={handleBlur}
                    />
                </Campo>

                {errores.nombre ? <Error>{errores.nombre}</Error> : null}

                <Campo>
                    <label htmlFor='email'>Email</label>

                    <input 
                        type='email'
                        id='email'
                        placeholder='Tu Email'
                        name='email'
                        value={email}
                        onChange={handleChange}
                       // onBlur={handleBlur}
                    />
                </Campo>

                {errores.email ? <Error>{errores.email}</Error> : null}

                <Campo>
                    <label htmlFor='password'>Password</label>

                    <input 
                        type='password'
                        id='password'
                        placeholder='Tu Password'
                        name='password'
                        value={password}
                        onChange={handleChange}
                        //onBlur={handleBlur}
                    />
                </Campo>

                {errores.password ? <Error>{errores.password}</Error> : null}

                {error && <Error>{error}</Error>}
                <InputSubmit 
                    type='submit'
                    value='Crear cuenta'
                />
            </Formulario>
        </>
    </Layout>

  )
}

export default CrearCuenta
