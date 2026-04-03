import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function getDb() {
  const client = await clientPromise;
  return client.db("worldcup2026");
}

// PATCH update prediction fields
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = await getDb();
    await db.collection("predictions").updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
