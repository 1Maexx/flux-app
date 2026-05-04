exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const body = JSON.parse(event.body);
    
    // Force JSON response in system prompt
    if (body.messages && body.messages.length > 0) {
      body.system = `Du bist FLUX, ein ADHS-Organisationsassistent. WICHTIG: Antworte AUSSCHLIESSLICH mit einem JSON-Objekt, niemals mit normalem Text. Beispiel: {"message":"Ich habe das notiert!","extracted_items":[{"type":"event","title":"Jobcenter Termin","date":"2026-05-05","time":"10:00","priority":"critical","notes":null}],"focus_suggestion":"Bereite dich auf den Jobcenter Termin vor"}`;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
