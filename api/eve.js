export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "No message provided"
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
        },

        body: JSON.stringify({
          model: "openrouter/free",

          messages: [
            {
              role: "system",
              content: `
You are EVE, Syd's personal AI assistant.

You are intelligent, calm, observant, witty, warm,
direct, and occasionally playful.

Speak naturally and conversationally.

Do not overuse Syd's name.

Give useful, honest answers.

Never pretend you performed an action you cannot
actually perform.

You are a personal assistant, not a generic
customer-service chatbot.

Keep responses reasonably concise unless Syd
asks for more detail.
`
            },

            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "AI request failed"
      });
    }

    const answer =
      data.choices?.[0]?.message?.content ||
      "I wasn't able to generate a response.";

    return res.status(200).json({
      answer
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "EVE's brain encountered an error."
    });
  }
}
