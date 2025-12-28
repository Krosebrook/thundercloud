import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GenerateWebsiteOptions {
  prompt: string;
  maxTokens?: number;
}

export interface GenerateWebsiteResult {
  html: string;
  metadata: {
    model: string;
    tokensUsed: number;
    finishReason: string;
  };
}

export async function generateWebsite(
  options: GenerateWebsiteOptions
): Promise<GenerateWebsiteResult> {
  const { prompt, maxTokens = 4096 } = options;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract HTML from response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Expected text response from Claude');
    }

    const html = content.text;

    return {
      html,
      metadata: {
        model: message.model,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
        finishReason: message.stop_reason || 'unknown',
      },
    };
  } catch (error) {
    console.error('Anthropic API Error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to generate website'
    );
  }
}

export async function* generateWebsiteStream(
  options: GenerateWebsiteOptions
): AsyncGenerator<string, void, unknown> {
  const { prompt, maxTokens = 4096 } = options;

  try {
    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      stream: true,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        yield event.delta.text;
      }
    }
  } catch (error) {
    console.error('Anthropic API Error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to generate website'
    );
  }
}

export { anthropic };
