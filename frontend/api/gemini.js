export default async function handler(req, res) {
    // Solo permitimos que nos envíen datos (POST)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { image } = req.body;

    // Aquí leemos la clave secreta que guardaremos en Vercel
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Falta la configuración de la API Key' });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        const prompt = "Analiza esta imagen. Identifica qué herramienta u objeto de bricolaje/hogar es. Responde SOLO con un JSON válido (sin markdown ```json) con estos campos: { \"title\": \"Nombre corto\", \"keyword\": \"Palabra clave para comprarlo\", \"text\": \"Explica para qué sirve y un consejo de uso.\" }";

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "image/jpeg", data: image } }
                    ]
                }]
            })
        });

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0].content) {
            throw new Error("No se pudo identificar la imagen");
        }

        let textResponse = data.candidates[0].content.parts[0].text;
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        
        res.status(200).json(JSON.parse(textResponse));

    } catch (error) {
        console.error("Error servidor:", error);
        res.status(500).json({ error: "Error analizando la imagen" });
    }
}
