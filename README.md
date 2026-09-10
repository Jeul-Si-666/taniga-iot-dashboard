# TANIGA IoT Dashboard

Real-time IoT monitoring dashboard untuk memantau telemetry
perangkat melalui web.

## Overview

TANIGA merupakan sistem monitoring IoT yang menghubungkan
perangkat ESP32 dengan web dashboard.

Sistem menerima data telemetry seperti:

- Temperature
- GPS Latitude
- GPS Longitude
- Device Status

Data kemudian ditampilkan pada dashboard secara real-time.

## System Architecture

ESP32
  ↓
WiFi
  ↓
IoT API
  ↓
Firebase
  ↓
Next.js Dashboard
  ↓
Web Map

## Hardware

Perangkat menggunakan ESP32 sebagai microcontroller utama.

Detail rangkaian dapat dilihat pada:

`hardware/`

## Dashboard

Dashboard menampilkan:

- Device status
- Temperature
- GPS coordinates
- Device location pada map
- Last telemetry update

## Technologies

### Hardware
- ESP32
- GPS
- Temperature Sensor

### Backend
- Next.js API Routes
- Firebase

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Leaflet
- OpenStreetMap

## Deployment

Dashboard di-deploy menggunakan Vercel.

## Project Structure

```text
app/          → Next.js application
components/   → Reusable UI components
types/        → TypeScript types
hardware/     → Hardware documentation
public/       → Public assets
