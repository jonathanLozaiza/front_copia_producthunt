export default function validarCrearProducto(valores){
    let errores = {}
    
    //validar el nombre del usuario
    if(!valores.nombre){
        errores.nombre = 'El nombre es obligatorio'
    }

    //validar la empresa
    if(!valores.empresa){
        errores.empresa = 'El nombre de la empresa es obligatorio'
    }

    //validar la URL
    if(!valores.url){
        errores.url = 'La url es obligatoria'
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = 'url mal formateada o no valida'
    }

    //validar descripcion
    if(!valores.descripcion){
        errores.descripcion = 'Agrega una descripción para tu producto'
    }

    return errores
}

/*
// validar email

!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

// validar URL

!/^(ftp|http|https):\/\/[^ "]+$/
*/