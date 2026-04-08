export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { image } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "이 사진 속 동전의 발행 연도 4자리 숫자만 말해줘. 만약 동전이 아니거나 연도를 알 수 없으면 '0000'이라고만 답해줘." },
              { type: "image_url", image_url: { url: image } }
            ],
          },
        ],
        max_tokens: 50,
      }),
    });

    const data = await response.json();
    const yearText = data.choices[0].message.content.trim();
    
    res.status(200).json({ year: yearText });
  } catch (error) {
    res.status(500).json({ error: 'OpenAI 인식 실패' });
  }
}
