type Role = 'system' | 'user' | 'assistant';

interface Message { role: Role; content: string; }

export async function generateMessage(messages: Message[]) {
    const apiKey = process.env.OPEN_ROUTER_API_KEY;
    const model  = process.env.OPEN_ROUTER_MODEL_NAME;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({ messages, model }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
}
