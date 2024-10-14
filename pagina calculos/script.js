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

    // Obtener los últimos resultados guardados para sumar al siguiente mes
    const resultadosGuardados = JSON.parse(localStorage.getItem('resultados')) || [];
    const ultimoResultado = resultadosGuardados.length > 0 ? resultadosGuardados[resultadosGuardados.length - 1].resultado : { gananciaNeta: 0 };

    const { gananciaBruta, ivaAPagar, gananciaNeta, gananciaNetaSinGastosComunes } = calcularGananciaNeta(ingresos + ultimoResultado.gananciaNeta, ivaCredito, ivaDebito, ppm, gastosComunes);

    // Mostrar resultados
    document.getElementById('ganancia_bruta').textContent = `Ganancia Bruta: ${gananciaBruta.toFixed(2)} CLP`;
    document.getElementById('iva_a_pagar').textContent = `IVA a Pagar: ${ivaAPagar.toFixed(2)} CLP`;
    document.getElementById('gastos_comunes').textContent = `Gastos Comunes Totales: ${gastosComunes.toFixed(2)} CLP`;
    document.getElementById('ganancia_neta_sin_gastos').textContent = `Ganancia Neta sin Gastos Comunes: ${gananciaNetaSinGastosComunes.toFixed(2)} CLP`;
    document.getElementById('ganancia_neta_con_gastos').textContent = `Ganancia Neta con Gastos Comunes: ${gananciaNeta.toFixed(2)} CLP`;

    // Guardar en almacenamiento local
    guardarResultado(mes, anio, gananciaBruta, ivaAPagar, gastosComunes, gananciaNeta, gananciaNetaSinGastosComunes);

    // Limpiar campos del formulario
    document.getElementById('calculo-form').reset();
});

// Función para limpiar los campos del formulario
document.getElementById('limpiar-btn').addEventListener('click', function () {
    document.getElementById('calculo-form').reset();
});

// Función para guardar el resultado
function guardarResultado(mes, anio, gananciaBruta, ivaAPagar, gastosComunes, gananciaNeta, gananciaNetaSinGastosComunes) {
    const resultadosGuardados = JSON.parse(localStorage.getItem('resultados')) || [];
    const resultado = {
        mes,
        anio,
        resultado: {
            gananciaBruta,
            ivaAPagar,
            gastosComunes,
            gananciaNeta,
            gananciaNetaSinGastosComunes
        }
    };
    resultadosGuardados.push(resultado);
    localStorage.setItem('resultados', JSON.stringify(resultadosGuardados));
    mostrarResultadosGuardados();
}

// Función para mostrar los resultados guardados
function mostrarResultadosGuardados() {
    const lista = document.getElementById('lista-resultados');
    lista.innerHTML = '';
    const resultadosGuardados = JSON.parse(localStorage.getItem('resultados')) || [];
    resultadosGuardados.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.mes} ${item.anio}: Ganancia Neta con Gastos: ${item.resultado.gananciaNeta.toFixed(2)} CLP, Ganancia Neta sin Gastos: ${item.resultado.gananciaNetaSinGastosComunes.toFixed(2)} CLP (Índice: ${index + 1})`;
        lista.appendChild(li);
    });
}

// Cargar los resultados guardados al iniciar
document.addEventListener('DOMContentLoaded', mostrarResultadosGuardados);
