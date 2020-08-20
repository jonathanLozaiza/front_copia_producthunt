import Layout from '../componets/layout/Layout'
import DetallesProducto from '../componets/layout/DetallesProducto'
import Error404 from '../componets/layout/404'
import useProductos from '../hooks/useProductos'

const Populares = () => {

  const {productos} = useProductos("votos")

  return (

    <Layout>
        {Object.keys(productos).length === 0 ? (<Error404 />) : 
          (<div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {productos.map(producto => (
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

export default Populares