import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a helpful chef assistant. When given a list of ingredients, suggest ONE clear recipe that uses those ingredients. Your response should be well-structured in markdown format with:
- A title
- A list of ingredients with quantities
- Clear step-by-step instructions
Keep the recipe concise and practical.`;

const FALLBACK_RECIPE = `# Simple Pasta Aglio e Olio

## Ingredients
- 400g spaghetti or pasta of choice
- 6 cloves garlic, thinly sliced
- 150ml extra virgin olive oil
- 1 teaspoon red pepper flakes
- Salt and black pepper to taste
- Fresh parsley for garnish (optional)

## Instructions
1. Cook the pasta in salted boiling water until al dente, then drain (reserve 1 cup pasta water)
2. Heat the olive oil in a large pan over medium heat
3. Add sliced garlic and red pepper flakes, stirring gently until fragrant (about 2-3 minutes)
4. Add the drained pasta to the pan
5. Toss well, adding pasta water a little at a time to create a light sauce
6. Season with salt and pepper to taste
7. Serve immediately with fresh parsley if desired

Enjoy your simple, delicious pasta!`;

interface GenerateRequest {
  ingredients: string[];
  model?: string;
}

async function callAnthropic(ingredientsString: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY not set, using fallback recipe');
    return FALLBACK_RECIPE;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `I have these ingredients: ${ingredientsString}. Please suggest a recipe!`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API error:', errorData);
      return FALLBACK_RECIPE;
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      console.error('Unexpected Anthropic response:', data);
      return FALLBACK_RECIPE;
    }

    return content;
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return FALLBACK_RECIPE;
  }
}

async function callGemini(ingredientsString: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set, using fallback recipe');
    return FALLBACK_RECIPE;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemini-3-pro-preview',
          contents: [
            {
              parts: [
                {
                  text: `${SYSTEM_PROMPT}\n\nI have these ingredients: ${ingredientsString}. Please suggest a recipe!`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return FALLBACK_RECIPE;
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error('Unexpected Gemini response:', data);
      return FALLBACK_RECIPE;
    }

    return content;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return FALLBACK_RECIPE;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { ingredients, model = 'claude' } = body;

    // Validate input
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Ingredients array is required and must not be empty' },
        { status: 400 }
      );
    }

    const ingredientsString = ingredients.join(', ');
    let markdown: string;
    let usedFallback = false;

    // Call the appropriate API
    if (model === 'claude') {
      markdown = await callAnthropic(ingredientsString);
    } else {
      // Default to Gemini
      markdown = await callGemini(ingredientsString);
    }

    // Check if fallback was used
    if (markdown === FALLBACK_RECIPE) {
      usedFallback = true;
    }

    return NextResponse.json({
      markdown,
      fallback: usedFallback,
    });
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json(
      {
        markdown: FALLBACK_RECIPE,
        fallback: true,
        error: 'An error occurred while generating the recipe',
      },
      { status: 500 }
    );
  }
}