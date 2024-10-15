// Manejo del formulario
document.getElementById('calculo-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar que el formulario se recargue al enviar

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
        mes: mes || "No especificado",
        anio: anio || "No especificado",
        resultado: { gananciaNeta }
    });
    localStorage.setItem('resultados', JSON.stringify(resultadosGuardados));

    actualizarListaResultados(resultadosGuardados);
});

// Cambiamos la función para manejar el botón calcular y el submit
document.getElementById('calcular-btn').addEventListener('click', function () {
    document.getElementById('calculo-form').dispatchEvent(new Event('submit'));
});
