import { NextResponse } from "next/server";

// Gemini API setup
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const getRuleBasedSuggestion = (age: number, gender: string, packageType: string, notes: string) => {
  const notesLower = (notes || "").toLowerCase();
  let workout = "Standard strength conditioning and circuit training.";
  let diet = "Balanced macronutrient diet (40% Carbs, 30% Protein, 30% Healthy Fats).";
  let target = "General Fitness & Health";

  if (notesLower.includes("weight loss") || notesLower.includes("fat loss") || notesLower.includes("cardio")) {
    target = "Weight Loss & Cardio Conditioning";
    workout = "High-Intensity Interval Training (HIIT) 3x/week, 30 mins LISS cardio daily, and moderate weight training.";
    diet = "Caloric deficit of 300-500 kcal. High protein intake (1.8g/kg body weight) to preserve muscle, complex carbs only post-workout, and plenty of green vegetables.";
  } else if (notesLower.includes("muscle") || notesLower.includes("bulk") || notesLower.includes("bodybuilding") || notesLower.includes("strength")) {
    target = "Muscle Hypertrophy & Strength";
    workout = "Progressive overload weight lifting: Push/Pull/Legs split 4-5x/week, compound movements (squats, deadlifts, bench press) focusing on 8-12 rep ranges.";
    diet = "Caloric surplus of 200-400 kcal. High protein intake (2.0g/kg body weight), clean carbohydrate loading (oats, brown rice, sweet potatoes), and healthy essential fats.";
  } else if (age > 50) {
    target = "Longevity & Joint Mobility";
    workout = "Low-impact resistance training 3x/week, daily dynamic flexibility routines, and yoga/pilates to improve core stability and balance.";
    diet = "Anti-inflammatory nutrient-dense diet. Focus on omega-3 fatty acids (salmon, walnuts), collagen proteins, calcium sources, and hydration.";
  }

  return {
    target,
    workout,
    diet,
    tips: [
      "Ensure a minimum of 7-8 hours of recovery sleep nightly.",
      "Stay hydrated: drink at least 3-4 liters of water throughout the training day.",
      "Consistency is key. Follow your plan diligently for at least 8 weeks to see structural changes.",
    ],
  };
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, age, gender, packageType, notes } = body;

    const memberAge = Number(age) || 25;
    const memberGender = gender || "Male";
    const memberNotes = notes || "";

    // 1. Fallback Rule-Based Generation (Immediate/Stable)
    const suggestions = getRuleBasedSuggestion(memberAge, memberGender, packageType || "Monthly", memberNotes);

    // 2. Try calling Gemini API if key is present
    if (GEMINI_API_KEY) {
      try {
        const prompt = `You are the lead AI Fitness Coach at Royal Fitness Gym.
Generate a professional, personalized fitness suggestion plan for our gym member:
- Name: ${name || "Member"}
- Age: ${memberAge}
- Gender: ${memberGender}
- Plan Term: ${packageType || "Monthly"}
- Health Notes/Goals: ${memberNotes}

Respond with a clean JSON format containing these exact keys (do not wrap in markdown code blocks, just raw json):
{
  "target": "Overall Goal",
  "workout": "Customized Workout Suggestion",
  "diet": "Customized Diet Suggestion",
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          
          // Parse JSON out of generated text safely
          const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanText);
          if (parsed.target && parsed.workout && parsed.diet) {
            return NextResponse.json({ success: true, suggestions: parsed });
          }
        }
      } catch (geminiError) {
        console.error("Gemini API call failed, falling back to rule-based:", geminiError);
      }
    }

    return NextResponse.json({ success: true, suggestions });
  } catch (error: any) {
    console.error("AI Suggestions Route Error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
