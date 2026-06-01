import "server-only";
import { z } from "zod";
import { isOpenAiConfigured, serverEnv } from "@/lib/env";
import { hashSeed, nextRandom } from "@/lib/game/rng";
import { pickFallbackEvent } from "@/lib/game/events";
import type { LifeEvent, LifeEventCategory, PlayerAgeBand } from "@/lib/game/types";

const CATEGORIES: LifeEventCategory[] = [
  "job",
  "emergency",
  "education",
  "business",
  "family",
  "windfall",
];

const choiceSchema = z.object({
  label: z.string().min(1).max(60),
  cash: z.number().min(-500000).max(500000).optional(),
  incomeMultiplier: z.number().min(0.5).max(2).optional(),
  scores: z
    .object({
      wealth: z.number().min(-20).max(20).optional(),
      knowledge: z.number().min(-20).max(20).optional(),
      protection: z.number().min(-20).max(20).optional(),
      happiness: z.number().min(-20).max(20).optional(),
    })
    .optional(),
  insight: z.string().min(1).max(160),
});

const aiEventSchema = z.object({
  category: z.enum(CATEGORIES as [LifeEventCategory, ...LifeEventCategory[]]),
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(220),
  choices: z.array(choiceSchema).min(1).max(4),
});

export interface GenerateLifeEventInput {
  age: number;
  ageBand: PlayerAgeBand;
  seed: string | number;
  recentTitles?: string[];
}

function buildPrompt({ age, recentTitles }: GenerateLifeEventInput): string {
  return [
    `Generate ONE financial-literacy life event for a player who is age ${age} in a game set in Kenya.`,
    `Currency is Kenyan Shillings (KShs). Keep it age-appropriate, encouraging and brand-safe for Liberty Kenya.`,
    `Pick a category from: ${CATEGORIES.join(", ")}.`,
    `Provide 1-4 realistic choices. Each choice may include: cash (KShs delta, negative = cost),`,
    `incomeMultiplier (0.5-2 for lasting income changes), small score nudges (-20..20 for wealth/knowledge/protection/happiness),`,
    `and a one-sentence "insight" teaching the money lesson.`,
    recentTitles?.length
      ? `Avoid repeating these recent events: ${recentTitles.join("; ")}.`
      : "",
    `Respond ONLY with JSON matching: {category, title, description, choices:[{label, cash?, incomeMultiplier?, scores?, insight}]}.`,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Generate an age-appropriate life event via OpenAI, validated against a strict
 * schema. Falls back to the curated pool on any error, invalid output, or when
 * OpenAI is not configured — so the game always works.
 */
export async function generateLifeEvent(
  input: GenerateLifeEventInput,
): Promise<LifeEvent> {
  const fallback = () => {
    const [, event] = pickFallbackEvent(hashSeed(input.seed), input.age);
    return event;
  };

  if (!isOpenAiConfigured) return fallback();

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serverEnv.openAiApiKey}`,
      },
      body: JSON.stringify({
        model: serverEnv.openAiModel,
        temperature: 0.9,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a financial-literacy game designer for Liberty Kenya. Output strict JSON only.",
          },
          { role: "user", content: buildPrompt(input) },
        ],
      }),
      // Avoid hanging the request loop indefinitely.
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) return fallback();

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return fallback();

    const parsed = aiEventSchema.safeParse(JSON.parse(content));
    if (!parsed.success) return fallback();

    const [, rand] = nextRandom(hashSeed(input.seed));
    return {
      id: `ai-${Math.floor(rand * 1e9).toString(36)}`,
      category: parsed.data.category,
      title: parsed.data.title,
      description: parsed.data.description,
      minAge: Math.max(0, input.age - 1),
      maxAge: input.age + 1,
      source: "ai",
      choices: parsed.data.choices.map((c, i) => ({
        id: `c${i}`,
        label: c.label,
        cash: c.cash,
        incomeMultiplier: c.incomeMultiplier,
        scores: c.scores,
        insight: c.insight,
      })),
    };
  } catch {
    return fallback();
  }
}
