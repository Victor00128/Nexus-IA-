// Función para procesar comandos especiales o lógica de negocio compleja
export const processComplexCommand = (command: string): string | null => {
  const lowerCaseCommand = command.toLowerCase().trim()

  if (lowerCaseCommand.includes("hola") || lowerCaseCommand.includes("saludos")) {
    return "¡Hola! ¿En qué puedo ayudarte hoy?"
  }

  if (lowerCaseCommand.includes("hora actual")) {
    const now = new Date()
    return `La hora actual es: ${now.toLocaleTimeString()}.`
  }

  if (lowerCaseCommand.includes("fecha de hoy")) {
    const today = new Date()
    return `La fecha de hoy es: ${today.toLocaleDateString()}.`
  }

  if (lowerCaseCommand.includes("cuéntame un chiste")) {
    const jokes = [
      "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
      "¿Cuál es el colmo de un electricista? No encontrarle la chispa a su pareja.",
      "¿Qué le dice un semáforo a otro? No me mires que me pongo rojo.",
      "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter.",
    ]
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)]
    return randomJoke
  }

  // Si no es un comando especial, devuelve null para que se envíe a la IA
  return null
}

// Función para generar texto humanizado
export const generateHumanizedText = (inputText: string): string => {
  let humanized = inputText

  // Ejemplo de "humanización" simple:
  humanized = humanized.replace(/muy importante/gi, "es crucial")
  humanized = humanized.replace(/en conclusión/gi, "para cerrar la idea")
  humanized = humanized.replace(/por lo tanto/gi, "así que")
  humanized = humanized.replace(/además/gi, "y también")
  humanized = humanized.replace(/sin embargo/gi, "pero")
  humanized = humanized.replace(/utilizar/gi, "usar")
  humanized = humanized.replace(/implementar/gi, "poner en marcha")

  // Añadir un toque personal o coloquial
  const humanTouches = [
    "¡Fíjate qué interesante!",
    "La verdad es que...",
    "Para que te des una idea,",
    "Como quien dice,",
    "Y lo más importante,",
    "A ver, te explico:",
  ]
  const randomTouch = humanTouches[Math.floor(Math.random() * humanTouches.length)]

  return `${randomTouch} ${humanized.charAt(0).toLowerCase() + humanized.slice(1)}`
}

// Función para generar código web (simulado)
export const generateWebCode = (description: string): string => {
  let code = ``

  if (description.includes("botón")) {
    code += `
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Mi Botón
</button>
`
  } else if (description.includes("formulario")) {
    code += `
<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Usuario
    </label>
    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Usuario">
  </div>
  <div class="flex items-center justify-between">
    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
      Enviar
    </button>
  </div>
</form>
`
  } else if (description.includes("tarjeta")) {
    code += `
<div class="max-w-sm rounded overflow-hidden shadow-lg">
  <img class="w-full" src="https://via.placeholder.com/300" alt="Imagen de tarjeta">
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">Título de la Tarjeta</div>
    <p class="text-gray-700 text-base">
      Aquí va una descripción breve de la tarjeta.
    </p>
  </div>
  <div class="px-6 pt-4 pb-2">
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#tag1</span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#tag2</span>
  </div>
</div>
`
  } else {
    code += `
<div class="text-center p-8 bg-blue-100 rounded-lg">
  <h2 class="text-2xl font-bold text-blue-800 mb-4">¡Bienvenido a tu nueva web!</h2>
  <p class="text-blue-700">Este es un ejemplo básico. Dime qué más quieres agregar.</p>
</div>
`
  }

  return `\`\`\`html\n${code.trim()}\n\`\`\``
}
