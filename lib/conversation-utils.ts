// Utility functions for processing user commands and enhancing responses
export const processSpecialCommands = (input: string): string | null => {
  const normalizedInput = input.toLowerCase().trim()

  if (normalizedInput.includes("hello") || normalizedInput.includes("hi")) {
    return "Hello! How can I help you today?"
  }

  if (normalizedInput.includes("current time")) {
    const now = new Date()
    return `The current time is: ${now.toLocaleTimeString()}.`
  }

  if (normalizedInput.includes("today's date")) {
    const today = new Date()
    return `Today's date is: ${today.toLocaleDateString()}.`
  }

  if (normalizedInput.includes("tell me a joke")) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? He was outstanding in his field!",
      "What do you call a bear with no teeth? A gummy bear!",
    ]
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)]
    return randomJoke
  }

  return null
}

// Function to enhance text with more natural language patterns
export const enhanceResponseText = (inputText: string): string => {
  let enhanced = inputText

  // Apply natural language transformations
  enhanced = enhanced.replace(/very important/gi, "crucial")
  enhanced = enhanced.replace(/in conclusion/gi, "to wrap up")
  enhanced = enhanced.replace(/therefore/gi, "so")
  enhanced = enhanced.replace(/furthermore/gi, "also")
  enhanced = enhanced.replace(/however/gi, "but")
  enhanced = enhanced.replace(/utilize/gi, "use")
  enhanced = enhanced.replace(/implement/gi, "set up")

  // Add conversational elements
  const conversationalStarters = [
    "Here's something interesting:",
    "The thing is,",
    "To give you an idea,",
    "Simply put,",
    "Most importantly,",
    "Let me explain:",
  ]
  const randomStarter = conversationalStarters[Math.floor(Math.random() * conversationalStarters.length)]

  return `${randomStarter} ${enhanced.charAt(0).toLowerCase() + enhanced.slice(1)}`
}

// Function to generate web code snippets based on descriptions
export const generateCodeSnippet = (description: string): string => {
  let codeOutput = ``

  if (description.includes("button")) {
    codeOutput += `
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click Me
</button>
`
  } else if (description.includes("form")) {
    codeOutput += `
<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Username
    </label>
    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
  </div>
  <div class="flex items-center justify-between">
    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
      Submit
    </button>
  </div>
</form>
`
  } else if (description.includes("card")) {
    codeOutput += `
<div class="max-w-sm rounded overflow-hidden shadow-lg">
  <img class="w-full" src="https://via.placeholder.com/300" alt="Card image">
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">Card Title</div>
    <p class="text-gray-700 text-base">
      This is a brief description of the card content.
    </p>
  </div>
  <div class="px-6 pt-4 pb-2">
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#tag1</span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#tag2</span>
  </div>
</div>
`
  } else {
    codeOutput += `
<div class="text-center p-8 bg-blue-100 rounded-lg">
  <h2 class="text-2xl font-bold text-blue-800 mb-4">Welcome to your new website!</h2>
  <p class="text-blue-700">This is a basic example. Tell me what else you'd like to add.</p>
</div>
`
  }

  return `\`\`\`html\n${codeOutput.trim()}\n\`\`\``
}
