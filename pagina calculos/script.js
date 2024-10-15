// Función para calcular la ganancia neta
function calcularGananciaNeta(ingresos, ivaCredito, ivaDebito, ppm, gastosComunes) {
    const costosSinIva = ivaCredito / 0.19;
    const ivaAPagar = ivaDebito - ivaCredito;
    const gananciaBruta = ingresos - costosSinIva;
    const gananciaNeta = gananciaBruta - ivaAPagar - ppm - gastosComunes;
    const gananciaNetaSinGastosComunes = gananciaBruta - ivaAPagar - ppm; // Sin restar los gastos comunes
    return { gananciaBruta, ivaAPagar, gananciaNeta, gananciaNetaSinGastosComunes };
}

// Manejo del formulario
document.getElementById('calcular-btn').addEventListener('click', function () {
    const ingresos = parseFloat(document.getElementById('ingresos').value);
    const ivaCredito = parseFloat(document.getElementById('iva_credito').value);
    const ivaDebito = parseFloat(document.getElementById('iva_debito').value);
    const ppm = parseFloat(document.getElementById('ppm').value);
    const gastosLuz = parseFloat(document.getElementById('gastos_luz').value);
    const gastosAgua = parseFloat(document.getElementById('gastos_agua').value);
    const gastosInternet = parseFloat(document.getElementById('gastos_internet').value);
    const gastosTelefono = parseFloat(document.getElementById('gastos_telefono').value);
    const gastosComunes = gastosLuz + gastosAgua + gastosInternet + gastosTelefono;

    // Obtener mes y año seleccionados
    const mes = document.getElementById('mes').value;
    const anio = document.getElementById('anio').value;

    // Obtener los resultados guardados
    let resultadosGuardados = JSON.parse(localStorage.getItem('resultados')) || [];

    // Generar un nuevo ID basado en la longitud de los resultados guardados
    const nuevoId = resultadosGuardados.length > 0 ? resultadosGuardados[resultadosGuardados.length - 1].id + 1 : 1;

    const { gananciaBruta, ivaAPagar, gananciaNeta, gananciaNetaSinGastosComunes } = calcularGananciaNeta(ingresos, ivaCredito, ivaDebito, ppm, gastosComunes);

    // Mostrar resultados
    document.getElementById('ganancia_bruta').textContent = `Ganancia Bruta: ${gananciaBruta.toFixed(2)} CLP`;
    document.getElementById('iva_a_pagar').textContent = `IVA a Pagar: ${ivaAPagar.toFixed(2)} CLP`;
    document.getElementById('gastos_comunes').textContent = `Gastos Comunes: ${gastosComunes.toFixed(2)} CLP`;
    document.getElementById('ganancia_neta_sin_gastos').textContent = `Ganancia Neta (sin gastos comunes): ${gananciaNetaSinGastosComunes.toFixed(2)} CLP`;
    document.getElementById('ganancia_neta_con_gastos').textContent = `Ganancia Neta (con gastos comunes): ${gananciaNeta.toFixed(2)} CLP`;

    // Guardar resultados en LocalStorage con ID
    resultadosGuardados.push({
        id: nuevoId,
        mes: mes || "No especificado",
        anio: anio || "No especificado",
        resultado: { gananciaNeta }
    });
    localStorage.setItem('resultados', JSON.stringify(resultadosGuardados));

    // Mostrar resultados almacenados
    actualizarListaResultados(resultadosGuardados);
});

// Función para actualizar la lista de resultados guardados
function actualizarListaResultados(resultadosGuardados) {
    const listaResultados = document.getElementById('lista-resultados');
    listaResultados.innerHTML = '';
    resultadosGuardados.forEach((resultado, index) => {
        const li = document.createElement('li');
        li.textContent = `Mes ${resultado.mes} ${resultado.anio}: Ganancia Neta ${resultado.resultado.gananciaNeta.toFixed(2)} CLP (ID: ${resultado.id})`;
        listaResultados.appendChild(li);
    });
}

// Función para eliminar un resultado por su ID
document.getElementById('eliminar-seleccionado').addEventListener('click', function () {
    const idAEliminar = parseInt(document.getElementById('eliminar-id').value);

    if (isNaN(idAEliminar)) {
        alert("Por favor, ingresa un ID válido.");
        return;
    }

    let resultadosGuardados = JSON.parse(localStorage.getItem('resultados')) || [];

    // Filtrar el resultado a eliminar
    resultadosGuardados = resultadosGuardados.filter(resultado => resultado.id !== idAEliminar);

    // Guardar nuevamente en localStorage
    localStorage.setItem('resultados', JSON.stringify(resultadosGuardados));

    // Actualizar la lista de resultados
    actualizarListaResultados(resultadosGuardados);

    // Limpiar el campo de texto para eliminar
    document.getElementById('eliminar-id').value = '';
});

// Limpiar formulario
document.getElementById('limpiar-btn').addEventListener('click', function () {
    document.getElementById('calculo-form').reset();
});

// Cargar resultados al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const resultadosGuardados = JSON.parse(localStorage.getItem('resultados')) || [];
    actualizarListaResultados(resultadosGuardados);
});
