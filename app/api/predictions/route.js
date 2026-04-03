import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

async function getDb() {
  const client = await clientPromise;
  return client.db("worldcup2026");
}

// GET all predictions (admin)
export async function GET() {
  try {
    const db = await getDb();
    const predictions = await db
      .collection("predictions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(predictions);
  } catch (e) {
    console.error(e);
    return NextResponse.json([]);
  }
}

// POST create new prediction (just name)
export async function POST(req) {
  try {
    const { name } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
    const db = await getDb();
    const result = await db.collection("predictions").insertOne({
      name: name.trim(),
      createdAt: new Date(),
    });
    return NextResponse.json({ id: result.insertedId.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
