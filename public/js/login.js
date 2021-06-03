import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (nombre, contraseña) => {
    try{
        const res = await axios({
            method: "POST",
            url: "/api/locales/acceder",
            data: {
                nombre,
                contraseña
            }
        });

        if(res.data.status === "correcto"){
            showAlert("success","Bien hecho, has accedido")
            window.setTimeout(() => {
                location.assign("/app/crearInforme")
            }, 3500)
        }

    } catch(err){
        showAlert("error",err.response.data.message)
    }
}

export const logout = async () => {
    try{
        const res = await axios({
            method: "GET",
            url: "/api/locales/salir",
        });

        if(res.data.status === "correcto"){
            showAlert("success","Bien hecho, has salido del inventario")
            window.setTimeout(() => {
                location.assign("/acceso")
            }, 3500)
        }

    } catch(err){
        showAlert("error",err.response.data.message)
    }
}


export const crearLocal = async form => {
    try{
        const res = await axios({
            method: "POST",
            url: "/api/locales",
            data: form
        });

        if(res.data.status === "correcto"){
            const formCrearLocal = document.getElementById("Formar");
            if(formCrearLocal){
                formCrearLocal.innerHTML = `
                <h2 class="h2 titles h2Form">Creado con exito</h2>
                `
            }
            window.setTimeout(() => {
                window.location.reload();
            }, 3500)
        }

    } catch(err){
        showAlert("error",err.response.data.message)
    }
}

export const crearProducto = async form => {
    try{
        const res = await axios({
            method: "POST",
            url: "/api/productos",
            data: form
        });

        if(res.data.status === "correcto"){
            const formCrearProducto = document.getElementById("FormarPr")
            if(formCrearProducto){
                formCrearProducto.innerHTML = `
                <h2 class="h2 titles h2Form">Creado con exito</h2>
                `
            }
            window.setTimeout(() => {
                window.location.reload();
            }, 3500)
        }

    } catch(err){
        showAlert("error",err.response.data.message)
    }
}

export const crearInforme = async (KG,precio,producto,operacion) => {
    try{
        const res = await axios({
            method: "POST",
            url: "/api/informes",
            data: {
                KG,
                precio,
                producto,
                operacion
            }
        });

        if(res.data.status === "correcto"){
            showAlert("success","Informe creado")
            window.setTimeout(() => {
                window.location.reload();
            }, 2500)
        }

    } catch(err){
        showAlert("error",err.response.data.message)
    }
}

export const obtenerInformes = async (filtro,id) => {
    try{
        const res = await axios({
            method: "GET",
            url: `/api/informes?local=${id}`
        });
        const date = new Date();
        let correcto = [];

        if(filtro === "Hoy"){
            res.data.data.doc.map(el => {
                let fecha = Date.parse(el.fecha);
                let actual = new Date(fecha);
                if(date.getDate() === actual.getDate() && date.getMonth() === actual.getMonth()  && date.getFullYear() === actual.getFullYear()){
                    correcto.push(el);
                }
            })
            return correcto
        } else if(filtro === "Mes"){
            res.data.data.doc.map(el => {
                let fecha = Date.parse(el.fecha);
                let actual = new Date(fecha);
                if(date.getMonth() === actual.getMonth() && date.getFullYear() === actual.getFullYear()){
                    correcto.push(el);
                }
            })
            return correcto
        } else{
            res.data.data.doc.map(el => {
                correcto.push(el);
            })
            return correcto
        }
    } catch(err){
        showAlert("error",err.response.data.message)
    }
}

export const borrarLocal = async id => {
    try{
        const res = await axios({
            method: "DELETE",
            url: `/api/locales/${id}`
        });
        const borrar = document.getElementById("borrar");
        if(borrar){
            borrar.innerHTML = `
            <h2 class="h2 titles h2Form">Eliminado con exito</h2>
            `
        }
        window.setTimeout(() => {
            window.location.reload();
        }, 2500)
    }

    catch(err){
        showAlert("error",err.response.data.message)
    }
}

export const borrarProducto = async id => {
    try{
        const res = await axios({
            method: "DELETE",
            url: `/api/productos/${id}`
        });
        const borrarPr = document.getElementById("borrarPr");
        if(borrarPr){
            borrarPr.innerHTML = `
            <h2 class="h2 titles h2Form">Eliminado con exito</h2>
            `
        }
        window.setTimeout(() => {
            window.location.reload();
        }, 2500)
    }

    catch(err){
        showAlert("error",err.response.data.message)
    }
}

export const eliminarInforme = async id => {
    try{
        await axios({
            method: "DELETE",
            url: `/api/informes/${id}`
        });
        const eliminarIn = document.getElementById("borrarPr");
        if(eliminarIn){
            eliminarIn.innerHTML = `
            <h2 class="h2 titles h2Form">Eliminado con exito</h2>
            `
        }
        window.setTimeout(() => {
            window.location.reload();
        }, 2500)
    }

    catch(err){
        showAlert("error",err.response.data.message)
    }
}

export const editarLocal = async (form ,id) => {
    try{
        await axios({
            method: "PATCH",
            url: `/api/locales/${id}`,
            data: form
        });
        const formEditarLocal = document.getElementById("Editar");
        if(formEditarLocal){
            formEditarLocal.innerHTML = `
            <h2 class="h2 titles h2Form">Editado con exito</h2>
            `
        }
        window.setTimeout(() => {
            window.location.reload();
        }, 2500)
    }

    catch(err){
        showAlert("error",err.response.data.message)
    }
}

export const editarInforme = async (KG, precio, id) => {
    try{
        await axios({
            method: "PATCH",
            url: `/api/informes/${id}`,
            data: {
                KG,
                precio
            }
        });
        const formEditarIn = document.getElementById("EditarInforme");
        if(formEditarIn){
            formEditarIn.innerHTML = `
            <h2 class="h2 titles h2Form">Editado con exito</h2>
            `
        }
        window.setTimeout(() => {
            window.location.reload();
        }, 2500)
    }

    catch(err){
        showAlert("error",err.response.data.message)
    }
}

export const editarBien = async (form ,id) => {
    try{
        await axios({
            method: "PATCH",
            url: `/api/productos/${id}`,
            data: form
        });
        const formEditarProducto = document.getElementById("EditarPr");
        if(formEditarProducto){
            formEditarProducto.innerHTML = `
            <h2 class="h2 titles h2Form">Editado con exito</h2>
            `
        }
        window.setTimeout(() => {
            window.location.reload();
        }, 2500)
    }

    catch(err){
        showAlert("error",err.response.data.message)
    }
}


export const updatePassword = async (contraseña, newContraseña, id) => {
    try{
        const res = await axios({
            method: "PATCH",
            url: `/api/locales/cambiar/${id}`,
            data: {
                contraseña,
                newContraseña
            }
        });

        const formEditarLocal = document.getElementById("Editar");
        if(formEditarLocal){
            formEditarLocal.innerHTML = `
            <h2 class="h2 titles h2Form">Editado con exito</h2>
            `
        }
        window.setTimeout(() => {
            window.location.reload();
        }, 2500)

    } catch(err){
        showAlert("error",err.response.data.message)
    }
}