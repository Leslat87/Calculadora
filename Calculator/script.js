document.addEventListener('DOMContentLoaded', function() {
  // Se ejecuta cuando el contenido HTML ha sido completamente cargado y parseado

  let currentOperation = '';
  // Se declara una variable para almacenar la operación actual

  let history = JSON.parse(localStorage.getItem('operationHistory')) || [];
  // Se obtiene el historial de operaciones almacenado en el localStorage, si no existe se inicializa como un array vacío

  const display = document.querySelector('.calculator-screen');
  // Se selecciona el elemento HTML con la clase 'calculator-screen' para mostrar el resultado de las operaciones

  const keys = document.querySelector('.calculator-keys');
  // Se selecciona el elemento HTML con la clase 'calculator-keys' que contiene las teclas de la calculadora

  // Función para actualizar el valor en la pantalla de la calculadora
  function updateDisplay(value) {
    // Actualiza el valor mostrado en la pantalla de la calculadora con el valor pasado como argumento
    display.value = value;
  }

  // Función para añadir una operación al historial
  function addToHistory(operation, result) {
    // Agrega una nueva entrada al historial de operaciones con la operación y el resultado pasados como argumentos
    history.push({ operation, result });
    localStorage.setItem('operationHistory', JSON.stringify(history));
    // Se actualiza el historial en el localStorage
    updateHistoryDisplay();
    // Se actualiza la visualización del historial en la interfaz
  }

  // Función para realizar el cálculo de la operación ingresada
  function calculate() {
    // Intenta realizar el cálculo de la operación actual
    try {
      const result = eval(currentOperation);
      // Evalúa la operación actual y guarda el resultado
      updateDisplay(result);
      // Actualiza la pantalla con el resultado
      addToHistory(currentOperation, result);
      // Agrega la operación y el resultado al historial
      currentOperation = result.toString();
      // Convierte el resultado a string y lo asigna como nueva operación actual
    } catch (error) {
      updateDisplay('Error');
      // En caso de error, muestra 'Error' en la pantalla
      currentOperation = '';
      // Reinicia la operación actual
    }
  }

  // Función para eliminar el último dígito de la operación actual
  function deleteLastDigit() {
    // Elimina el último dígito de la operación actual
    if (currentOperation.length > 0) {
      if (currentOperation.endsWith(" ")) {
        currentOperation = currentOperation.slice(0, -3);
      } else {
        currentOperation = currentOperation.slice(0, -1);
      }
      // Verifica si el último carácter es un espacio y lo elimina correctamente
      updateDisplay(currentOperation);
      // Actualiza la pantalla con la operación actualizada
    }
  }

  // Evento click para las teclas de la calculadora
  keys.addEventListener('click', e => {
    // Agrega un evento de click a las teclas de la calculadora
    if (!e.target.matches('button')) return;

    const key = e.target;
    const action = key.classList[0];
    const keyValue = key.value;

    if (action === 'operator') {
      if (keyValue === '=') {
        calculate();
      } else {
        currentOperation += ` ${keyValue} `;
        updateDisplay(currentOperation);
      }
    } else if (action === 'all-clear') {
      currentOperation = '';
      updateDisplay('0');
    } else {
      currentOperation += keyValue;
      updateDisplay(currentOperation);
    }
  });

  // Función para actualizar el historial en la interfaz
  function updateHistoryDisplay() {
    // Actualiza la visualización del historial en la interfaz
    const historyElement = document.getElementById('operationHistory');
    historyElement.innerHTML = '';

    history.forEach(item => {
      const operationElement = document.createElement('li');
      operationElement.classList.add('list-group-item');
      operationElement.textContent = `${item.operation} = ${item.result}`;
      historyElement.appendChild(operationElement);
    });
  }

  updateHistoryDisplay();
  // Se llama a la función para actualizar el historial al cargar la página

  // Botón para limpiar el historial de operaciones
  const clearHistoryButton = document.createElement('button');
  clearHistoryButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'clear-history-button');
  clearHistoryButton.innerHTML = 'Limpiar historial';
  clearHistoryButton.addEventListener('click', () => {
    localStorage.removeItem('operationHistory');
    history = [];
    updateHistoryDisplay();
  });
  document.querySelector('.calculator-keys').appendChild(clearHistoryButton);
  // Se crea un botón para limpiar el historial y se agrega al final de las teclas de la calculadora

  // Evento click para eliminar el último dígito
  document.getElementById('deleteLastDigit').addEventListener('click', deleteLastDigit);
  // Agrega un evento de click al botón de eliminar el último dígito
});
