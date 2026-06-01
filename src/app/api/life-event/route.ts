import { NextResponse } from "next/server";
import { z } from "zod";
import { generateLifeEvent } from "@/lib/ai/life-events";

const bodySchema = z.object({
  age: z.number().int().min(0).max(120),
  ageBand: z.enum(["under_18", "adult"]).default("under_18"),
  seed: z.union([z.string(), z.number()]),
  recentTitles: z.array(z.string()).max(10).optional(),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const event = await generateLifeEvent(parsed.data);
  return NextResponse.json({ event });
}
