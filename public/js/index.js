import "@babel/polyfill";
import { login, obtenerInformes, logout, editarInforme,eliminarInforme, crearInforme, updatePassword, crearProducto, editarBien, borrarProducto, editarLocal, borrarLocal, crearLocal } from "./login"
import { renderSpinner } from "./spinner";
import { renderizarInformes } from "./resultados"

const formAcceso = document.getElementById("upload");
const eliminarC = document.getElementById("EliminarC");
const eliminarIn = document.getElementById("EliminarInforme");
const formFecha = document.getElementById("Fecha");
const formInforme = document.getElementById("crearInforme");
const botonCrearLocal = document.getElementById("crearLocal");
const formCrearLocal = document.getElementById("Formar");
const formCrearProducto = document.getElementById("FormarPr")
const formEditarLocal = document.getElementById("Editar");
const blurer = document.querySelector(".popup");
const publicEdit = document.getElementById("editar");
const botonesEliminar = document.querySelectorAll("#Eliminar");
const cancelar = document.getElementById("cancelarN");
const cancelarE = document.getElementById("cancelarE")
const borrar = document.getElementById("EliminarC");
const cancelarb = document.getElementById("cancelarB");
const botonEditar = document.querySelectorAll("#Cambiar");
const botonEditarPr = document.querySelectorAll("#CambiarPr");
const botonContra = document.getElementById("editarContrasena");
const botonEliminarPR = document.getElementById("EliminarPr")
const borrarPr = document.getElementById("borrarPr");
const formEditarProducto = document.getElementById("EditarPr");
const divisor = document.getElementById("divisor");
const formEditarIn = document.getElementById("EditarInforme");
const logOut = document.getElementById("salir");

if(logOut){
    logOut.addEventListener("click", e => {
        logout();
    })
}

if(divisor){
    divisor.addEventListener("click", e => {
        if(e.target.matches("#EliminarInforme, #EliminarInforme *")){
            const id = e.target.parentElement.parentElement.dataset.id;
            document.getElementById("borrarPr").classList.remove("hiddenForm");
            blurer.classList.remove("hiddenFill");
            eliminarIn.setAttribute("id", id);
            document.getElementById("noticia").innerHTML = "";
            const html = e.target.parentElement.parentElement.cloneNode(true);
            html.removeChild(html.querySelector(".botones"));
            document.getElementById("noticia").insertAdjacentHTML("afterbegin", html.outerHTML)
        }
        if(e.target.matches("#CambiarInforme, #CambiarInforme *")){
            const element = e.target.parentElement.parentElement;
            formEditarIn.classList.remove("hiddenForm");
            blurer.classList.remove("hiddenFill");
            const kilos = element.querySelector("#kilos").textContent.split(" ")[1];
            const precios = element.querySelector("#precios").textContent.split(" ")[1];
            document.getElementById("KG").value = kilos;
            document.getElementById("precio").value = precios;
            publicEdit.setAttribute("id", e.target.parentElement.parentElement.dataset.id);
        }
    })
}

if(formEditarIn){
    formEditarIn.addEventListener("submit", e => {
        e.preventDefault();
        const KG = document.getElementById("KG").value;
        const precio = document.getElementById("precio").value;
        editarInforme(parseFloat(KG),parseFloat(precio),publicEdit.id);
    })
}

if(eliminarIn){
    eliminarIn.addEventListener("click", e => {
        eliminarInforme(eliminarIn.id);
    })
}


if(borrar){
    borrar.addEventListener("click", e => {
        borrarLocal(borrar.id)
    })
}

if(formFecha){
    formFecha.addEventListener("change",async e => {
        const pariente = document.getElementById("divisor");
        if(formFecha.options[formFecha.selectedIndex].value === "Dia"){
            pariente.innerHTML = "";
            renderSpinner(pariente);
            const resultados = await obtenerInformes("Hoy", formFecha.options[formFecha.selectedIndex].dataset.id);
            pariente.innerHTML = "";
            resultados.forEach(el => {
                renderizarInformes(el,pariente)
            })
        } else if(formFecha.options[formFecha.selectedIndex].value === "Mes"){
            pariente.innerHTML = "";
            renderSpinner(pariente);
            const resultados = await obtenerInformes("Mes", formFecha.options[formFecha.selectedIndex].dataset.id);
            pariente.innerHTML = "";
            resultados.forEach(el => {
                renderizarInformes(el,pariente)
            })
        } else{
            pariente.innerHTML = "";
            renderSpinner(pariente);
            const resultados = await obtenerInformes("No", formFecha.options[formFecha.selectedIndex].dataset.id);
            pariente.innerHTML = "";
            resultados.forEach(el => {
                renderizarInformes(el,pariente)
            })
        }
    })
}

if(formInforme){
    formInforme.addEventListener("submit", e => {
        e.preventDefault();
        const KG = document.getElementById("KG").value;
        const precio = document.getElementById("precio").value;
        const select = document.getElementById("Producto");
        const select2 = document.getElementById("Operacion");
        const producto = select.options[select.selectedIndex].dataset.id;
        const operacion = select2.options[select2.selectedIndex].value;
        crearInforme(parseFloat(KG),parseFloat(precio),producto,operacion)
    })
}

if(botonEliminarPR){
    botonEliminarPR.addEventListener("click", e => {
        borrarProducto(botonEliminarPR.id);
    })
}

if(formAcceso){
    formAcceso.addEventListener("submit", async e => {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const contraseña = document.getElementById("password").value;
        login(nombre,contraseña);
    })
}

if(botonCrearLocal){
    botonCrearLocal.addEventListener("click", e => {
        if(formCrearLocal){
            formCrearLocal.classList.remove("hiddenForm");
        }
        if(formCrearProducto){
            formCrearProducto.classList.remove("hiddenForm");
        }
        blurer.classList.remove("hiddenFill")
    })
}

if(cancelar){
    cancelar.addEventListener("click", e => {
        if(formCrearLocal){
            formCrearLocal.classList.add("hiddenForm");
        }
        if(formEditarLocal){
            formEditarLocal.classList.add("hiddenForm");
        }
        if(formCrearProducto){
            formCrearProducto.classList.add("hiddenForm");
        }
        blurer.classList.add("hiddenFill")
    })
}

if(cancelarE){
    cancelarE.addEventListener("click", e => {
        if(formEditarLocal){
            formEditarLocal.classList.add("hiddenForm");
        }
        if(formEditarProducto){
            formEditarProducto.classList.add("hiddenForm");
        }
        if(formEditarIn){
            formEditarIn.classList.add("hiddenForm")
        }
        blurer.classList.add("hiddenFill")
    })
}

if(cancelarb){
    cancelarb.addEventListener("click", e => {
        if(document.getElementById("borrar")){
            document.getElementById("borrar").classList.add("hiddenForm");
        }
        if(borrarPr){
            borrarPr.classList.add("hiddenForm");
        }
        blurer.classList.add("hiddenFill")
    })
}


if(formCrearLocal){
    formCrearLocal.addEventListener("submit", async e => {
        e.preventDefault();
        const form = new FormData();
        form.append("nombre",document.getElementById("nombre").value);
        form.append("contraseña",document.getElementById("password").value);
        form.append("domicilio",document.getElementById("domicilio").value);
        form.append("foto",document.getElementById("foto").files[0]);
        crearLocal(form);
    })
}

if(formCrearProducto){
    formCrearProducto.addEventListener("submit", async e => {
        e.preventDefault();
        const form = new FormData();
        form.append("nombre",document.getElementById("nombre").value);
        if(document.getElementById("foto").files.length !== 0){
            form.append("foto",document.getElementById("foto").files[0]);
        }
        crearProducto(form);
    })
}

if(botonesEliminar){
    botonesEliminar.forEach(el => {
        el.addEventListener("click", e => {
            e.preventDefault();
            if(eliminarC){
                eliminarC.setAttribute("id", e.target.parentElement.parentElement.dataset.id);
            }
            if(botonEliminarPR){
                botonEliminarPR.setAttribute("id", e.target.parentElement.parentElement.dataset.id);
            }
            if(document.getElementById("borrar")){
                document.getElementById("borrar").classList.remove("hiddenForm");
            }
            if(borrarPr){
                borrarPr.classList.remove("hiddenForm")
            }
            document.querySelector(".popup").classList.remove("hiddenFill");
            document.getElementById("noticia").innerHTML = "";
            const html = e.target.parentElement.parentElement.cloneNode(true);
            html.removeChild(html.lastChild);
            document.getElementById("noticia").insertAdjacentHTML("afterbegin", html.outerHTML)
        })
    })
}

if(botonEditar){
    botonEditar.forEach(el => {
        el.addEventListener("click", e => {
            e.preventDefault();
            document.getElementById("Editar").classList.remove("hiddenForm");
            document.querySelector(".popup").classList.remove("hiddenFill");
            let textos = {
                titulo: e.target.parentElement.parentElement.querySelector(".titles").textContent,
                domicilio: e.target.parentElement.parentElement.querySelector(".text").textContent,
            }
            formEditarLocal.querySelector(".h2Form").textContent = `Editando local "${textos.titulo}"`
            publicEdit.setAttribute("id", e.target.parentElement.parentElement.dataset.id);
            document.getElementById("domicilioE").value = textos.domicilio;
            document.getElementById("nombreE").value = textos.titulo;
        })
    })
}

if(botonEditarPr){
    botonEditarPr.forEach(el => {
        el.addEventListener("click", e => {
            e.preventDefault();
            document.getElementById("EditarPr").classList.remove("hiddenForm");
            document.querySelector(".popup").classList.remove("hiddenFill");
            let textos = {
                titulo: e.target.parentElement.parentElement.querySelector(".titles").textContent,
            }
            formEditarProducto.querySelector(".h2Form").textContent = `Editando bien "${textos.titulo}"`
            publicEdit.setAttribute("id", e.target.parentElement.parentElement.dataset.id);
            document.getElementById("nombreE").value = textos.titulo;
        })
    })
}

if(formEditarLocal){
    formEditarLocal.addEventListener("submit", e => {
        e.preventDefault();
        const form = new FormData();
        form.append("nombre",document.getElementById("nombreE").value);
        form.append("domicilio",document.getElementById("domicilioE").value);
        if(document.getElementById("fotoE").files.length !== 0){
            form.append("foto",document.getElementById("fotoE").files[0]);
        }
        editarLocal(form, publicEdit.id);
    })
}

if(formEditarProducto){
    formEditarProducto.addEventListener("submit", e => {
        e.preventDefault();
        const form = new FormData();
        form.append("nombre",document.getElementById("nombreE").value);
        if(document.getElementById("fotoE").files.length !== 0){
            form.append("foto",document.getElementById("fotoE").files[0]);
        }
        editarBien(form, publicEdit.id);
    })
}

if(botonContra){
    botonContra.addEventListener("click", e => {
        e.preventDefault();
        const contraseña = document.getElementById("passwordE").value;
        const newContraseña = document.getElementById("newPassword").value;
        updatePassword(contraseña, newContraseña, publicEdit.id);
    })
}