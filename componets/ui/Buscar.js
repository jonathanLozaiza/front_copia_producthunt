import React, {useState} from 'react'
import styled from '@emotion/styled'
import Router from 'next/router'

const InputText = styled.input`
    border : 1px solid var(--gris3);
    padding: 1rem;
    min-width : 300px;
`;

const InputSubmit = styled.input`
    height : 32px;
    width : 32px;
    display: block;
    background-size : 3rem;
    background-image : url('/static/img/lupa2.png');
    background-repeat : no-repeat;
    position : absolute;
    right : 1rem;
    top: 5px;
    background-color : white;
    border : none;
    text-indent : -9999px;

    :hover{
        cursor:pointer;
    }
`
const Formulario = styled.form`
    position : relative;
`

const Buscar = () => {

    const [busqueda, guardarBusqueda] = useState('')

    const buscarProducto = e => {
        e.preventDefault()

        //validacion
        if(busqueda.trim() === '') return;

        //redireccionar al componente de busqueda
        Router.push({
            pathname : '/buscar',
            query : {'q' : busqueda}
        })
    }

    return (
        <Formulario onSubmit={buscarProducto}>
            <InputText 
                type="text" 
                placeholder="Buscar Productos"
                onChange={e => guardarBusqueda(e.target.value)} 
            />

            <InputSubmit type="submit" />
        </Formulario>
    )
}

export default Buscar