import React, {useState, useContext} from 'react'
import Layout from '../componets/layout/Layout'
import Router, {useRouter} from 'next/router'
import {Formulario, Campo, InputSubmit, Error} from '../componets/ui/Formulario'
import styled from '@emotion/styled'
import {FirebaseContext} from '../firebase'
import FileUploader from 'react-firebase-file-uploader'
import Error404 from '../componets/layout/404'

const Titulo = styled.h1`
    text-align : center;
    margin-top : 5rem;
`

//validaciones
import useValidacion from '../hooks/useValidacion'
import validarCrearProducto from '../validacion/validarCrearProducto'

const STATE_INICIAL = {
    nombre : '',
    empresa : '',
    imagen : '',
    url : '',
    urlimagen : '',
    descripcion : ''
}

const NuevoProducto = () => {

  //state de las imagenes
  const [nombreimagen, guardarNombre] = useState('')
  const [subiendo, guaradarSubiendo] = useState(false)
  const [progreso, guardarProgreso] = useState(0)
  const [urlimagen, guardarUrlImagen] = useState('')

  const {valores, errores, handleChange, handleSubmit, handleBlur} = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto)

  //extraemos variables de valores
  const {nombre, empresa, imagen, url, descripcion} = valores;

  //state para guardar errores de autenticacion
  const [error, guardarError] = useState('')

  //hook de routing para redireccionar
  const router = useRouter()

  //context con las operaciones crud de firebase
  const {usuario, firebase} = useContext(FirebaseContext)

  // llamando al objeto de la clase Firebase y ejecutando la funcion registrar
  async function crearProducto(){
    // si el usuario no esta autenticado llevar al login
    if(!usuario){
      return router.push('/login');
    }

    //crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos : 0,
      comentarios : [],
      creado : Date.now(),
      creador : {
        id : usuario.uid,
        nombre : usuario.displayName
      },
      haVotado : []
    }

    //insertar en la base de datos
    await firebase.db.collection('productos').add(producto)

    return router.push('/')
  }

  const handleUploadStart = () => {
    guardarProgreso(0)
    guaradarSubiendo(true)
  }
    
  const handleProgress = progress => guardarProgreso({progreso})
 
  const handleUploadError = error => {
    guaradarSubiendo(false)
    console.error(error)
  }
 
  const handleUploadSuccess = nombre => {
    guardarProgreso(100)
    guaradarSubiendo(false)
    guardarNombre(nombre)
    firebase
      .storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then(url => {
        console.log(url)
        guardarUrlImagen(url)
      })
  }

return (

  <Layout>
        {!usuario ? <Error404 /> : 
          (
            <>
            <Titulo>Nuevo Producto</Titulo>

            <Formulario onSubmit={handleSubmit} className='form'>
                <fieldset>

                  <legend>Información del usuario</legend>

                  <Campo className='form-group'>
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

                  <Campo className='form-group'>
                      <label htmlFor='empresa'>Empresa</label>

                      <input 
                          type='text'
                          id='empresa'
                          placeholder='Nombre de la empresa'
                          name='empresa'
                          value={empresa}
                          onChange={handleChange}
                        // onBlur={handleBlur}
                      />
                  </Campo>

                  {errores.empresa ? <Error>{errores.empresa}</Error> : null}

                  <Campo className='form-group'>
                    <label htmlFor='imagen'>Imagen</label>

                    <FileUploader
                      accept = 'image/*'
                      id='imagen'
                      name='imagen'
                      randomizeFilename
                      storageRef={firebase.storage.ref("productos")}
                      onUploadStart={handleUploadStart}
                      onUploadError={handleUploadError}
                      onUploadSuccess={handleUploadSuccess}
                      onProgress={handleProgress}
                    />
                  </Campo>

                  {errores.imagen ? <Erro>{errores.imagen}</Erro> : null}

                  <Campo className='form-group'>
                      <label htmlFor='url'>URL</label>

                      <input 
                          type='url'
                          id='url'
                          name='url'
                          value={url}
                          placeholder='URL'
                          onChange={handleChange}
                          //onBlur={handleBlur}
                      />
                  </Campo>

                  {errores.url ? <Error>{errores.url}</Error> : null}

                </fieldset>

                <fieldset>
                  <legend>Información del producto</legend>

                  <Campo className='form-group'>
                      <label htmlFor='descripcion'>Descripcion</label>
                    
                      <textarea
                        type = 'text'
                          id='descripcion'
                          name='descripcion'
                          placeholder = 'Descripcion'
                          value={descripcion}
                          onChange={handleChange}
                          //onBlur={handleBlur}
                      ></textarea>
                  </Campo>

                  {errores.descripcion ? <Error>{errores.descripcion}</Error> : null}

                </fieldset>

                {error && <Error>{error}</Error>}
                <InputSubmit 
                    type='submit'
                    value='Crear producto'
                />
            </Formulario>
            </>
          )
        }
          
  </Layout>

)
}

export default NuevoProducto