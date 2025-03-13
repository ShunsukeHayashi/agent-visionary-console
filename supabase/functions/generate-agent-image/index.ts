
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in Supabase secrets');
    }

    const { agentName, agentType, agentDescription } = await req.json();

    if (!agentName || !agentType) {
      return new Response(
        JSON.stringify({ error: 'Agent name and type are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Construct a prompt based on agent details
    const promptBase = `Create a professional, friendly avatar image for an AI agent named "${agentName}". The agent is a ${agentType} type AI`;
    const promptDetails = agentDescription ? 
      ` with the following characteristics: ${agentDescription}` : 
      '.';
    
    // Add style guidance
    const styleGuidance = ' The image should be a minimalist, modern digital illustration with a clean background. Make it look professional and suitable for a business application. No text in the image.';
    
    const prompt = promptBase + promptDetails + styleGuidance;
    
    console.log("Generating image with prompt:", prompt);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }
    
    return new Response(
      JSON.stringify({ imageUrl: data.data[0].url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error generating agent image:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
