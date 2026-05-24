export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Content from "@/lib/models/Content";

const DEFAULT_CONTENT: Record<string, any> = {
  hero: {
    badge: "Est. 2014 • Pendurthi, AP",
    headline: "FORGE YOUR LEGEND",
    subtext:
      "Experience the gold standard of fitness. Elite equipment, expert guidance, and a community built on grit and glory.",
    ctaPrimary: "Start Training",
    ctaSecondary: "Explore Services",
  },
  about: {
    title: "Built for Champions",
    subtitle: "Our Story",
    description:
      "Royal Fitness Gym was founded in 2014 with a single goal: to create a space where ordinary people could achieve extraordinary results. Located in Pendurthi, AP, we've grown into the region's premier fitness destination.",
    mission:
      "To empower every member with elite-level training, personalized coaching, and a community that pushes you beyond your limits.",
    vision:
      "To be the most trusted gym in Andhra Pradesh, transforming lives through fitness, discipline, and dedication.",
    stats: [
      { label: "Active Members", value: "1500+", icon: "users" },
      { label: "Modern Equipment", value: "50+", icon: "dumbbell" },
      { label: "Elite Trainers", value: "15", icon: "award" },
      { label: "Years Active", value: "10+", icon: "calendar" },
    ],
  },
  services: [
    {
      id: "1",
      title: "Strength & Conditioning",
      description:
        "Build raw strength with our fully equipped weight room. Free weights, barbells, and dedicated squat racks.",
      icon: "dumbbell",
    },
    {
      id: "2",
      title: "CrossFit & HIIT",
      description:
        "High-intensity training programs that push your limits and accelerate fat burning.",
      icon: "zap",
    },
    {
      id: "3",
      title: "Yoga & Flexibility",
      description:
        "Improve your flexibility, reduce stress, and enhance recovery with our guided yoga sessions.",
      icon: "heart",
    },
    {
      id: "4",
      title: "Personal Training",
      description:
        "One-on-one sessions with our certified expert trainers for customized workout programs.",
      icon: "user",
    },
    {
      id: "5",
      title: "Cardio Zone",
      description:
        "State-of-the-art treadmills, ellipticals, and rowing machines for peak cardiovascular performance.",
      icon: "activity",
    },
    {
      id: "6",
      title: "Nutrition Coaching",
      description:
        "Expert dietary guidance and meal planning to fuel your fitness transformation from the inside.",
      icon: "leaf",
    },
  ],
  testimonials: [
    {
      id: "1",
      name: "Ravi Kumar",
      role: "Lost 18 kg in 4 months",
      text: "Royal Fitness completely changed my life. The trainers here don't just guide you — they push you beyond what you thought possible. Best investment I've ever made.",
      rating: 5,
    },
    {
      id: "2",
      name: "Priya Sharma",
      role: "Yoga & Strength Member",
      text: "The equipment is world-class and the atmosphere is incredibly motivating. I've been a member for 2 years and I'm still being challenged every single day.",
      rating: 5,
    },
    {
      id: "3",
      name: "Mohammed Farhan",
      role: "CrossFit Enthusiast",
      text: "The CrossFit program here is absolutely elite. Coach Raju has completely redesigned my body in 6 months. 100% recommend for anyone serious about fitness.",
      rating: 5,
    },
  ],
  contact: {
    address: "Sarada Nagar, Karmika Nagar, Pendurthi, Chinnamusidivada, AP 531173",
    phone: "074796 49999",
    whatsapp: "917479649999",
    email: "info@royalfitnessgym.com",
    hours: {
      weekdays: "5:00 AM - 10:00 PM",
      sunday: "6:00 AM - 8:00 PM",
      elite: "Open 24/7 for Elite Members",
    },
    mapUrl: "",
  },
  gym: {
    name: "Royal Fitness Gym",
    tagline: "Forge Your Legend",
    established: "2014",
    location: "Pendurthi, AP",
    social: {
      instagram: "#",
      facebook: "#",
      youtube: "#",
    },
  },
};

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section) {
      let doc = await Content.findOne({ section });
      if (!doc) {
        // Return default content if not in DB yet
        const defaultData = DEFAULT_CONTENT[section];
        if (!defaultData) {
          return NextResponse.json({ error: "Section not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, section, data: defaultData });
      }
      return NextResponse.json({ success: true, section: doc.section, data: doc.data });
    }

    // Return all sections
    const docs = await Content.find({});
    const result: Record<string, any> = { ...DEFAULT_CONTENT };
    docs.forEach((doc) => {
      result[doc.section] = doc.data;
    });

    return NextResponse.json({ success: true, content: result });
  } catch (error) {
    console.error("Content GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json({ error: "Section and data are required" }, { status: 400 });
    }

    const doc = await Content.findOneAndUpdate(
      { section },
      { data },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, section: doc.section, data: doc.data });
  } catch (error) {
    console.error("Content POST Error:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
