import React, {useContext} from 'react'
import Buscar from '../ui/Buscar'
import Navegacion from './Navegacion'
import Link from 'next/link'
import styled from '@emotion/styled'
import Boton from '../ui/Boton'
import {FirebaseContext} from '../../firebase'

const ContenedorHeader = styled.div`
    max-width : 1200px;
    width : 95%;
    margin : 0 auto;
    @media (min-width: 768px){
        display: flex;
        justify-content: space-between;
    }

`;

const Logo = styled.p`
    color : var(--naranja);
    font-size : 4rem;
    line-height: 0;
    font-weight : 700;
    font-family : 'Roboto Slab', serif;
    margin-right: 2rem;
    :hover{
        cursor : pointer;
    }
`;

const Header_ = styled.header`
    border-bottom : 2px solid var(--gris3);
    padding : 1rem 0;
`

const Ordenado = styled.div`
    display:flex;
    align-items:center;
`
const Saludo = styled.p`
    margin-right:2rem;
    font-weight : bold;
`

const Header = () => {

    const {usuario, firebase} = useContext(FirebaseContext)

    return (
        <Header_>
            <ContenedorHeader>
                <Ordenado>
                    <Link href='/'><Logo><a>P</a></Logo></Link>

                    <Buscar />

                    <Navegacion />
                </Ordenado>

                <Ordenado>
                    {usuario ? 
                        (<>
                            <Saludo>Hola, {usuario.displayName}</Saludo>

                            <Link href='/'>
                                <Boton 
                                    bgColor='true' 
                                    onClick={() => firebase.cerrarSesion()}
                                >Cerrar Sesión</Boton>
                            </Link>
                        </>)
                    :
                            
                        (   
                            <>
                                <Link href='/login'>
                                    <Boton bgColor='true' >
                                        Login
                                    </Boton>
                                </Link>
                                
                                <Link href='/crear-cuenta'>
                                    <Boton>Crear cuenta</Boton>
                                </Link>
                            </>    
                        )
                    }
                </Ordenado>
            </ContenedorHeader>
        </Header_>
    )
}


export default Header