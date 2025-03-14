import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyApWYalcn1sLUFwtcUbTBToQkzIu0pVfJ4");

export async function analyzeTask(task: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze this task from a WhatsApp message:
      
      Task: ${task.task}
      Message: ${task.snippet}
      Priority: ${task.priority}
      Deadline: ${task.deadline} at ${task.time}
      Category: ${task.category}
      
      Please provide:
      1. A brief summary of the task
      2. Key points and requirements
      3. Suggested next steps
      4. Any potential challenges or considerations
      
      Format the response in markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing task:", error);
    return "Failed to analyze task. Please try again.";
  }
}

export async function chatWithAI(messages: { role: string; content: string }[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: messages.map(msg => ({
        role: msg.role,
        parts: msg.content,
      })),
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in chat:", error);
    return "Failed to get a response. Please try again.";
  }
}
