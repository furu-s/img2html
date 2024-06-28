import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios'
import Anthropic from '@anthropic-ai/sdk';


export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            throw new Error('API key is not defined');
        }

        const anthropic = new Anthropic({ apiKey });

        const reqJson = await req.json();

        const base64Image = reqJson['base64Image'];


        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 1000,
            temperature:1,
            system: "You must say only HTML. You must not say like: Here is the HTML representation of the provided image using Tailwind CSS:",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: "image/png",
                                data: base64Image.split(',')[1]
                            }
                        },
                        {
                            type: "text",
                            text: "Generate the HTML that represents this image using TailWind CSS. Output as complete HTML including head"
                        }
                    ]
                }
            ],
        });

        console.log(response);

        // @ts-ignore
        return NextResponse.json({text: response.content[0].text})
    } catch (error) {
        console.error('Error fetching haiku:', error);
        return NextResponse.json({ error: 'Failed to fetch haiku' });
    }
}
