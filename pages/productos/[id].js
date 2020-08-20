import React, {useEffect, useState, useContext} from 'react'
import {useRouter} from 'next/router'
import {FirebaseContext} from '../../firebase'
import Error404 from '../../componets/layout/404'
import Layout from '../../componets/layout/Layout'
import styled from '@emotion/styled'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {es} from 'date-fns/locale'
import {Campo, InputSubmit} from '../../componets/ui/Formulario'
import Boton from '../../componets/ui/Boton'


const TituloProducto = styled.h1`
    margin-top : 5rem;
    text-align : center;
`;

const ContenedorProducto = styled.div`
    @media(min-width : 768px){
        display : grid;
        grid-template-columns : 2fr 1fr;
        column-gap : 2rem;
    }
`;

const ImagenPrincipal = styled.img`
    max-width : 100%;
`;

const Rigth = styled.div`
    margin : 0 2rem;

    h2{
        margin : 2rem 0;
    };

    li{
        border: 1px solid #e1e1e1;
        padding : 2rem;
    };

    span{
        font-weight : bold;
    };


`;

const Lefth = styled.aside`
    margin : 0 2rem;

    h2{
        margin : 2rem 0;
    };

    div{
        margin-top : 5rem; 
    };

    p{
        text-align : center;
    };
`;

const CreadorProducto = styled.p`
    padding : .5rem 2rem;
    background-color : #DA552F;
    color : #fff;
    text-transform : uppercase;
    font-weight : bold;
    display : inline-block;
    text-align : center;
`;

const Producto = () => {
    //routing para obtener el id actual
    const router = useRouter();
    const {query : {id}} = router;

    //state del componente
    const [producto, guardarProducto] = useState({})
    const [error, guardarError] = useState(false)
    const [comentario, guardarComentario] = useState({})
    const [consultarDB, guardarConsultaDB] = useState(true)

    //context de firebase
    const {firebase, usuario} = useContext(FirebaseContext)

    //funcion para cargar el producto 
    const obtenerProductos = async () => {
        const productoQuery = await firebase.db.collection('productos').doc(id);
        const producto = await productoQuery.get();
        if(producto.exists){
            guardarProducto(producto.data())
            guardarConsultaDB(false)
        }else{
            guardarError(true)
            guardarConsultaDB(false)
        }
    }

    useEffect(()=>{
        if(id && consultarDB){
            obtenerProductos();
        }
    }, [id])

    if(Object.keys(producto).length === 0 && !error) return 'Cargando...';

    const {nombre, empresa, url, 
            urlimagen, descripcion, votos, 
            comentarios, creado, creador, haVotado} = producto;

    //administrar y registrar votos
    const votarProducto = async () => {
        if(!usuario){
            return router.push('/login');
        }

        //obtener y sumar el nuevo voto
        const totalVotos = votos + 1;

        //verificar si el usuario ya a votado
        if(haVotado.includes(usuario.uid)) return;

        //se registra el voto
        const nuevosVotos = [...haVotado, usuario.uid]

        //actualizar la base de datos
        await firebase.db.collection('productos').doc(id).update(
            {votos : totalVotos, haVotado : nuevosVotos});

        //actualizar el state
        guardarProducto({
            ...producto,
            votos : totalVotos
        })

        //actualizar
        guardarConsultaDB(true)
    }

    const handleComentario = e => {
        guardarComentario({
            ...comentario,
            [e.target.name] : e.target.value
        })
    }

    const agregarComentario = async e => {
        e.preventDefault()

        //validaciones de autenticacion y de contenido del comentario
        if(!usuario){return router.push('/login')}
        if(comentario.mensaje.trim() === '') return;

        //informacion extra del comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        //tomar copia de comentarios y agregarlo al arreglo
        const nuevosComentarios = [...comentarios, comentario]

        //actualizar base de datos
        await firebase.db.collection('productos').doc(id).update({comentarios : nuevosComentarios})

        //actualizar el state del producto
        guardarProducto({
            ...producto,
            comentarios : nuevosComentarios
        })

        //actualizar
        guardarConsultaDB(true)
    }

    const esCreador = (id) => {
        if(creador.id === id){
            return true;
        }
    }

    //funcion que reviza que el creador del producto sea el mismo que esta autenticado
    const puedeBorrar = () => {
        if(!usuario) return false;
        if(creador.id == usuario.uid){
            return true;
        }
    }

    const eliminarProducto = async () => {
        if(!usuario) return router.push('/login');
        if(creador.id !== usuario.uid){
            return router.push('/');
        }

        try{
            await firebase.db.collection('productos').doc(id).delete()
            router.push('/')
        }catch(error){
            console.log(error)
        }
    }

    return (
        <Layout>
            <>
                {error ? <Error404 /> : (

                        <div className='contenedor'>
                        <TituloProducto>{nombre}</TituloProducto>

                        <ContenedorProducto>
                            <Rigth>

                                <p>
                                    publicado hace {formatDistanceToNow(new Date(creado), {locale : es})}
                                </p>
                                
                                <p>Por: {creador.nombre} de {empresa}</p>

                                <ImagenPrincipal src={urlimagen} />
                                
                                <p>{descripcion}</p>
                                
                                {usuario &&
                                    <>
                                        <h2>Agrega tu comentario</h2>
                                        <form onSubmit={agregarComentario}>
                                            <Campo>
                                                <input 
                                                    type='text'
                                                    name='mensaje'
                                                    onChange={handleComentario}
                                                />
                                            </Campo>
            
                                            <InputSubmit
                                                type='submit'
                                                value='Agregar comentario'
                                            />
                                        </form>
                                    </>
                                }

                                <h2>
                                Comentarios
                                </h2>
                                {comentarios.length === 0 ? "Aún no hay comentarios" : (
                                    <ul>
                                    {comentarios.map((comentario, i) => (
                                        <li
                                            key={`${comentario.usuarioId}-${i}`}
                                        >
                                            <p>{comentario.mensaje}</p>
                                            <p>
                                                Escrito por: {' '}
                                                <span>{comentario.usuarioNombre}</span>
                                            </p>
                                            {esCreador(comentario.usuarioId) && 
                                                <CreadorProducto>Es creador</CreadorProducto>
                                            }
                                        </li>
                                    ))}
                                </ul>
                                )}
                            </Rigth>

                            <Lefth>
                                <Boton
                                    target='_blank'
                                    bgColor='true'
                                    href={url}
                                >
                                    Visitar URL
                                </Boton>
                                    
                                <div>
                                    <p>{votos} Votos</p>
                                    {usuario &&
                                        <Boton onClick={() => votarProducto()}>
                                        Votar
                                        </Boton>            
                                    }
                        
                                </div>
                            </Lefth>
                        </ContenedorProducto>

                        {puedeBorrar() && 
                            <Boton
                                onClick={eliminarProducto}
                            >
                                Eliminar Producto        
                            </Boton>
                        }

                    </div>
                    
                )}
            
            </>
        </Layout>
    )
}

export default Producto