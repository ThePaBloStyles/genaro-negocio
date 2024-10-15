// Función para calcular la ganancia neta
function calcularGananciaNeta(ingresos, ivaCredito, ivaDebito, ppm, gastosComunes) {
    const costosSinIva = ivaCredito / 0.19;
    const ivaAPagar = ivaDebito - ivaCredito;
    const gananciaBruta = ingresos - costosSinIva;
    const gananciaNeta = gananciaBruta - ivaAPagar - ppm - gastosComunes;
    const gananciaNetaSinGastosComunes = gananciaBruta - ivaAPagar - ppm;
    return { gananciaBruta, ivaAPagar, gananciaNeta, gananciaNetaSinGastosComunes };
}

// Manejo del botón Calcular
document.getElementById('calcular-btn').addEventListener('click', function () {
    const ingresos = parseFloat(document.getElementById('ingresos').value) || 0;
    const ivaCredito = parseFloat(document.getElementById('iva_credito').value) || 0;
    const ivaDebito = parseFloat(document.getElementById('iva_debito').value) || 0;
    const ppm = parseFloat(document.getElementById('ppm').value) || 0;
    const gastosLuz = parseFloat(document.getElementById('gastos_luz').value) || 0;
    const gastosAgua = parseFloat(document.getElementById('gastos_agua').value) || 0;
    const gastosInternet = parseFloat(document.getElementById('gastos_internet').value) || 0;
    const gastosTelefono = parseFloat(document.getElementById('gastos_telefono').value) || 0;
    const gastosComunes = gastosLuz + gastosAgua + gastosInternet + gastosTelefono;

    const mes = document.getElementById('mes').value.trim();
    const anio = document.getElementById('anio').value.trim();

    // Validar entradas
    if (!mes || !anio || ingresos <= 0 || ivaCredito < 0 || ivaDebito < 0 || ppm < 0) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    let resultadosGuardados = JSON.parse(localStorage.getItem('resultados')) || [];
    const nuevoId = resultadosGuardados.length > 0 ? resultadosGuardados[resultadosGuardados.length - 1].id + 1 : 1;

    const { gananciaBruta, ivaAPagar, gananciaNeta, gananciaNetaSinGastosComunes } = calcularGananciaNeta(ingresos, ivaCredito, ivaDebito, ppm, gastosComunes);

    // Mostrar resultados
    document.getElementById('ganancia_bruta').textContent = `Ganancia Bruta: ${gananciaBruta.toFixed(2)} CLP`;
    document.getElementById('iva_a_pagar').textContent = `IVA a Pagar: ${ivaAPagar.toFixed(2)} CLP`;
    document.getElementById('gastos_comunes').textContent = `Gastos Comunes: ${gastosComunes.toFixed(2)} CLP`;
    document.getElementById('ganancia_neta_sin_gastos').textContent = `Ganancia Neta (sin gastos comunes): ${gananciaNetaSinGastosComunes.toFixed(2)} CLP`;
    document.getElementById('ganancia_neta_con_gastos').textContent = `Ganancia Neta (con gastos comunes): ${gananciaNeta.toFixed(2)} CLP`;

    // Guardar resultados en LocalStorage
    resultadosGuardados.push({
        id: nuevoId,
        mes: mes,
        anio: anio,
        resultado: { gananciaNeta }
    });
    localStorage.setItem('resultados', JSON.stringify(resultadosGuardados));

    // Actualizar la lista de resultados
    actualizarListaResultados(resultadosGuardados);
});

// Función para actualizar la lista de resultados
function actualizarListaResultados(resultadosGuardados) {
    const listaResultados = document.getElementById('lista-resultados');
    listaResultados.innerHTML = '';
    resultadosGuardados.forEach((resultado) => {
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
    resultadosGuardados = resultadosGuardados.filter(resultado => resultado.id !== idAEliminar);

    localStorage.setItem('resultados', JSON.stringify(resultadosGuardados));
    actualizarListaResultados(resultadosGuardados);
    document.getElementById('eliminar-id').value = '';
});

// Función para sumar ganancias de varios meses
document.getElementById('sumar-meses-btn').addEventListener('click', function () {
    const indices = document.getElementById('meses-sumar').value.split(',').map(Number);
    let resultadosGuardados = JSON.parse(localStorage.getItem('resultados')) || [];

    let sumaTotal = 0;
    indices.forEach(index => {
        const resultado = resultadosGuardados.find(r => r.id === index);
        if (resultado) {
            sumaTotal += resultado.resultado.gananciaNeta;
        }
    });

    document.getElementById('resultado-suma').textContent = `Suma Total: ${sumaTotal.toFixed(2)} CLP`;
});

// Función para limpiar el formulario
document.getElementById('limpiar-btn').addEventListener('click', function () {
    document.getElementById('calculo-form').reset();
    document.getElementById('ganancia_bruta').textContent = '';
    document.getElementById('iva_a_pagar').textContent = '';
    document.getElementById('gastos_comunes').textContent = '';
    document.getElementById('ganancia_neta_sin_gastos').textContent = '';
    document.getElementById('ganancia_neta_con_gastos').textContent = '';
});

// Cargar resultados al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const resultadosGuardados = JSON.parse(localStorage.getItem('resultados')) || [];
    actualizarListaResultados(resultadosGuardados);
});
