import React, {useEffect, useState} from 'react'
import firebase from '../firebase'

function  useAutentificacion(){
    const [usuarioAutenticado, guardarUsuarioAutenticado] = useState(null)

    useEffect(()=>{
        const unSuscribe = firebase.auth.onAuthStateChanged(usuario => {
            if(usuario){
                guardarUsuarioAutenticado(usuario)
            }else{
                guardarUsuarioAutenticado(null)
            }
        })

        return () => unSuscribe;
    },[])

    return usuarioAutenticado
}

export default useAutentificacion