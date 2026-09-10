"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { LatestTelemetry } from "@/types/telemetry";

const DeviceMap = dynamic(() => import("@/components/DeviceMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[350px] items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
      <p className="text-sm text-slate-500">
        Loading map...
      </p>
    </div>
  ),
});

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState<LatestTelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTelemetry() {
    try {
      const response = await fetch("/api/iot/telemetry/latest", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load telemetry"
        );
      }

      setTelemetry(result.data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Gagal mengambil data telemetry");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTelemetry();

    const interval = setInterval(loadTelemetry, 5000);

    return () => clearInterval(interval);
  }, []);

  const isOnline =
    telemetry !== null &&
    Date.now() -
      new Date(telemetry.timestamp).getTime() <
      120000;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
              TANIGA IoT
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Monitoring Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Real-time telemetry monitoring
            </p>
          </div>

          <div
            className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
              isOnline
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            <span>●</span>
            {isOnline
              ? "DEVICE ONLINE"
              : "DEVICE OFFLINE"}
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* DEVICE INFO */}
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Connected Device
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                {telemetry?.deviceId ??
                  "ESP32_TANIGA_001"}
              </h2>
            </div>

            <div className="text-left md:text-right">
              <p className="text-sm text-slate-500">
                Last Update
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {telemetry
                  ? new Date(
                      telemetry.timestamp
                    ).toLocaleString("id-ID")
                  : "Waiting for data..."}
              </p>
            </div>

          </div>
        </section>

        {/* SENSOR CARDS */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <MetricCard
            title="Temperature"
            value={
              telemetry?.temp !== null &&
              telemetry?.temp !== undefined
                ? `${telemetry.temp.toFixed(1)} °C`
                : "--"
            }
            description="Current temperature"
          />

          <MetricCard
            title="Latitude"
            value={
              telemetry?.lat !== null &&
              telemetry?.lat !== undefined
                ? telemetry.lat.toFixed(6)
                : "--"
            }
            description="GPS latitude"
          />

          <MetricCard
            title="Longitude"
            value={
              telemetry?.lng !== null &&
              telemetry?.lng !== undefined
                ? telemetry.lng.toFixed(6)
                : "--"
            }
            description="GPS longitude"
          />

        </section>

        {/* LOWER SECTION */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* GPS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6">
              <p className="text-sm font-medium text-cyan-400">
                LOCATION
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Device Location
              </h2>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

              {telemetry &&
              telemetry.lat !== null &&
              telemetry.lat !== undefined &&
              telemetry.lng !== null &&
              telemetry.lng !== undefined ? (
                <DeviceMap
                  lat={telemetry.lat}
                  lng={telemetry.lng}
                />
              ) : (
                <div className="flex h-[350px] items-center justify-center rounded-xl border border-dashed border-slate-700">
                  <div className="text-center">

                    <div className="text-4xl">
                      ⌖
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Waiting for GPS data...
                    </p>

                  </div>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-4">

                <Coordinate
                  label="Latitude"
                  value={telemetry?.lat}
                />

                <Coordinate
                  label="Longitude"
                  value={telemetry?.lng}
                />

              </div>
            </div>
          </div>

          {/* SYSTEM */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6">
              <p className="text-sm font-medium text-cyan-400">
                SYSTEM
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Device Status
              </h2>
            </div>

            <div className="space-y-1">

              <StatusRow
                label="ESP32"
                status={
                  isOnline
                    ? "Online"
                    : "Offline"
                }
                active={isOnline}
              />

              <StatusRow
                label="Telemetry"
                status={
                  telemetry
                    ? "Receiving"
                    : "No Data"
                }
                active={telemetry !== null}
              />

              <StatusRow
                label="API"
                status={
                  telemetry
                    ? "Connected"
                    : "Unknown"
                }
                active={telemetry !== null}
              />

              <StatusRow
                label="Firebase"
                status={
                  telemetry
                    ? "Connected"
                    : "Unknown"
                }
                active={telemetry !== null}
              />

            </div>
          </div>

        </section>

        {/* FOOTER */}
        <footer className="mt-8 border-t border-slate-900 pt-6 text-center text-xs text-slate-600">
          TANIGA IoT Monitoring System
        </footer>

      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-4 text-3xl font-bold tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-600">
        {description}
      </p>

    </div>
  );
}

function Coordinate({
  label,
  value,
}: {
  label: string;
  value: number | null | undefined;
}) {
  return (
    <div>

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-mono text-sm text-slate-300">
        {value !== null &&
        value !== undefined
          ? value.toFixed(6)
          : "--"}
      </p>

    </div>
  );
}

function StatusRow({
  label,
  status,
  active,
}: {
  label: string;
  status: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 py-4 last:border-b-0">

      <span className="text-sm text-slate-300">
        {label}
      </span>

      <span
        className={`text-sm font-medium ${
          active
            ? "text-emerald-400"
            : "text-red-400"
        }`}
      >
        ● {status}
      </span>

    </div>
  );
}