import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyApWYalcn1sLUFwtcUbTBToQkzIu0pVfJ4");

export async function analyzeTask(task: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      Task ka quick analysis karo:
      
      Task: ${task.task}
      Message: ${task.snippet}
      Priority: ${task.priority}
      Deadline: ${task.deadline} at ${task.time}
      Category: ${task.category}
      
      Ye information Hinglish mein provide karo (mix of Hindi and English):
      1. Task ka 1-2 line ka summary
      
      

      2. Important points aur requirements
      
      

      3. Aage ke steps
      
      

      4. Koi challenges ya considerations
      
      Keep it concise and to the point. Format the response in markdown with emojis.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing task:", error);
    return "Task analysis mein error aa gaya. Please try again.";
  }
}

export async function chatWithAI(messages: { role: string; content: string }[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Convert messages to chat history format
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const lastMessage = messages[messages.length - 1].content;
    const prompt = `
      You are a friendly AI assistant who speaks in Hinglish (mix of Hindi and English).
      Keep your responses concise, friendly, and helpful.
      Use some emojis where appropriate to make the conversation engaging.
      
      Context about the task being discussed:
      ${JSON.stringify(messages[0])}
      
      User's message: ${lastMessage}
    `;

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in chat:", error);
    return "Response generate karne mein error aa gaya. Please try again.";
  }
}
