import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const snapshot = await db
      .ref("telemetry/ESP32_TANIGA_001")
      .limitToLast(1)
      .once("value");

    const data = snapshot.val();

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "No telemetry data found",
        },
        { status: 404 }
      );
    }

    const key = Object.keys(data)[0];

    return NextResponse.json({
      success: true,
      data: {
        key,
        ...data[key],
      },
    });
  } catch (error) {
    console.error("Latest telemetry error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to get telemetry",
      },
      { status: 500 }
    );
  }
}