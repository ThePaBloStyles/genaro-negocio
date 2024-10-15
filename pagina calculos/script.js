// Función para calcular la ganancia neta
function calcularGananciaNeta(ingresos, ivaCredito, ivaDebito, ppm, gastosComunes) {
    const costosSinIva = ivaCredito / 0.19;
    const ivaAPagar = ivaDebito - ivaCredito;
    const gananciaBruta = ingresos - costosSinIva;
    const gananciaNeta = gananciaBruta - ivaAPagar - ppm - gastosComunes;
    const gananciaNetaSinGastosComunes = gananciaBruta - ivaAPagar - ppm;
    return { gananciaBruta, ivaAPagar, gananciaNeta, gananciaNetaSinGastosComunes };
}

// Manejo del formulario
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
    document.getElementById('ganancia_neta_sin_gastos').textContent = `Ganancia Neta (sin gastos comunes): ${
