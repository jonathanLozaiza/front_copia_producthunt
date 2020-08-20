import React from 'react'
import styled from '@emotion/styled'

const Mensaje = styled.h1`
    margin-top : 5rem;
    text-align : center;
`;

const Error404 = () => {
    return(
        <Mensaje>No se puede mostrar</Mensaje>
    )
}

export default Error404