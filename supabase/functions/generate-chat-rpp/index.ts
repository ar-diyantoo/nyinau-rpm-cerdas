import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Attempting Gemini API first...');
    
    // Try Gemini first
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (geminiApiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `Kamu adalah asisten AI untuk guru Indonesia yang membantu membuat Rencana Pelaksanaan Pembelajaran (RPP). Berikan response dalam bahasa Indonesia yang jelas dan terstruktur.\n\nPertanyaan: ${prompt}`
                }]
              }]
            }),
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          const result = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Gagal generate response';
          
          console.log('Gemini API success');
          return new Response(
            JSON.stringify({ result }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          console.log('Gemini API failed with status:', geminiResponse.status);
        }
      } catch (geminiError) {
        console.log('Gemini API error:', geminiError instanceof Error ? geminiError.message : String(geminiError));
      }
    }

    // Fallback to Lovable AI
    console.log('Falling back to Lovable AI...');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableApiKey) {
      throw new Error('No AI service available');
    }

    const lovableResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'Kamu adalah asisten AI untuk guru Indonesia yang membantu membuat Rencana Pelaksanaan Pembelajaran (RPP). Berikan response dalam bahasa Indonesia yang jelas dan terstruktur.'
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!lovableResponse.ok) {
      const errorText = await lovableResponse.text();
      console.error('Lovable AI error:', lovableResponse.status, errorText);
      throw new Error('Lovable AI failed');
    }

    const lovableData = await lovableResponse.json();
    const result = lovableData.choices?.[0]?.message?.content || 'Gagal generate response';
    
    console.log('Lovable AI success (fallback)');
    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-chat-rpp:', error);
    return new Response(
      JSON.stringify({ 
        result: 'Maaf, terjadi kesalahan saat memproses permintaan. Silakan coba lagi.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
