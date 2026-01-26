import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const MAX_PROMPT_LENGTH = 2000;
const MIN_PROMPT_LENGTH = 5;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ===== AUTHENTICATION CHECK =====
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's auth token
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify the JWT token and get user claims
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.log('Invalid JWT token:', claimsError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user:', userId);

    // ===== INPUT VALIDATION =====
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize and validate prompt
    const sanitizedPrompt = prompt.trim();

    if (sanitizedPrompt.length < MIN_PROMPT_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Prompt too short. Minimum ${MIN_PROMPT_LENGTH} characters required.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (sanitizedPrompt.length > MAX_PROMPT_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Prompt too long. Maximum ${MAX_PROMPT_LENGTH} characters allowed.` }),
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
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `Kamu adalah asisten AI untuk guru Indonesia yang membantu membuat Rencana Pelaksanaan Pembelajaran (RPP). Berikan response dalam bahasa Indonesia yang jelas dan terstruktur.\n\nPertanyaan: ${sanitizedPrompt}`
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
          
          console.log('Gemini API success for user:', userId);
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
          { role: 'user', content: sanitizedPrompt }
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
    
    console.log('Lovable AI success (fallback) for user:', userId);
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
