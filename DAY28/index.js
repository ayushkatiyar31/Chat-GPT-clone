const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: "AIzaSyADTNeJn_v8tZIiJUnGgmCK-1AeBN61yf0" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();
