export const renderizarInformes = (resultado, parent) => {
    const fechaBien = new Date(resultado.fecha);
    const html = `
    <div class="content" data-id="${resultado._id}">
        <h2 class="h2 titles">${resultado.operacion} de ${resultado.producto.nombre}</h2>
        <p class="text">${fechaBien.toLocaleString("en")}</p>
        <p id="kilos" class="text">Kilos: ${resultado.KG}</p>
        <p id="precios" class="text">Precio: ${resultado.precio}</p>
        <div class="botones">
          <button class="btn-configurar btn btn-sub btn-green" id="CambiarInforme">Cambiar informacion</button>
          <button class="btn-configurar btn btn-sub btn-orange" id="EliminarInforme">Eliminar</button>
        </div>
    </div>
    `
parent.insertAdjacentHTML("afterbegin", html);
}