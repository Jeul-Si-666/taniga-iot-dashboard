import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.deviceId) {
      return NextResponse.json(
        {
          success: false,
          message: "deviceId is required",
        },
        { status: 400 }
      );
    }

    const telemetry = {
      deviceId: data.deviceId,
      temp: data.temp ?? null,
      lat: data.lat ?? null,
      lng: data.lng ?? null,
      battery: data.battery ?? null,
      timestamp: new Date().toISOString(),
    };

    const ref = db.ref(`telemetry/${data.deviceId}`).push();

    await ref.set(telemetry);

    return NextResponse.json({
      success: true,
      message: "Telemetry received",
      key: ref.key,
      data: telemetry,
    });
  } catch (error) {
    console.error("Telemetry error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}