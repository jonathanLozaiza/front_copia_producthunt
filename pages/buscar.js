import React, {useEffect, useState} from 'react'
import Layout from '../componets/layout/Layout'
import {useRouter} from 'next/router'
import useProductos from '../hooks/useProductos'
import Error404 from '../componets/layout/404'
import DetallesProducto from '../componets/layout/DetallesProducto'

const Buscar = () => {

    const router = useRouter()
    const {query : {q}} = router

    //state del componente
    const [resultado, guardarResultado] = useState([])

    //todos los productos creados
    const {productos} = useProductos('creado')

    useEffect(()=>{
        const busqueda = q.toLowerCase();
        const filtro = productos.filter(producto => {
            return (
                producto.nombre.toLowerCase().includes(busqueda) ||
                producto.descripcion.toLowerCase().includes(busqueda)
            )
        })
        guardarResultado(filtro)
    },[q, productos])

    return (
        <Layout>
            {
                Object.keys(resultado).length === 0 ? (<Error404 />) : 
                (<div className="listado-productos">
                <div className="contenedor">
                    <ul className="bg-white">
                    {resultado.map(producto => (
                        <DetallesProducto
                        key={producto.id}
                        producto={producto}
                        />
                    ))}
                    </ul>
                </div>
                </div>)
            }
        </Layout>
    )
}

export default Buscar