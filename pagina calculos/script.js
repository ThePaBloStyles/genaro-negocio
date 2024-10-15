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

    // Campos opcionales de gastos
    const gastosLuz = parseFloat(document.getElementById('gastos_luz').value) || 0;
    const gastosAgua = parseFloat(document.getElementById('gastos_agua').value) || 0;
    const gastosInternet = parseFloat(document.getElementById('gastos_internet').value) || 0;
    const gastosTelefono = parseFloat(document.getElementById('gastos_telefono').value) || 0;
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

// Función para eliminar múltiples resultados por sus IDs
document.getElementById('eliminar-seleccionado').addEventListener('click', function () {
    const idsAEliminar = document.getElementById('eliminar-id').value.split(',').map(Number);

    if (idsAEliminar.some(isNaN)) {
        alert("Por favor, ingresa IDs válidos.");
        return;
    }

    let resultadosGuardados = JSON.parse(localStorage.getItem('resultados')) || [];

    // Filtrar los resultados que no están en los IDs a eliminar
    resultadosGuardados = resultadosGuardados.filter(resultado => !idsAEliminar.includes(resultado.id));

    // Guardar nuevamente los resultados filtrados
    localStorage.setItem('resultados', JSON.stringify(resultadosGuardados));

    // Actualizar la lista
    actualizarListaResultados(resultadosGuardados);
});

// Función para sumar los resultados seleccionados
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

// Limpiar resultados al hacer clic en el botón de "Limpiar"
document.getElementById('limpiar-btn').addEventListener('click', function () {
    document.getElementById('calculo-form').reset();
    document.getElementById('ganancia_bruta').textContent = '';
    document.getElementById('iva_a_pagar').textContent = '';
    document.getElementById('gastos_comunes').textContent = '';
    document.getElementById('ganancia_neta_sin_gastos').textContent = '';
    document.getElementById('ganancia_neta_con_gastos').textContent = '';
});
