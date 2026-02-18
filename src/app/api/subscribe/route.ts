import { NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  return xff ? (xff.split(",")[0]?.trim() ?? "") : "";
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({ email: "" }));
    const normalized = String(email ?? "")
      .trim()
      .toLowerCase();

    if (!normalized || !isValidEmail(normalized)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const scriptUrl = process.env.GAS_WEBHOOK_URL;
    const token = process.env.GAS_TOKEN;

    if (!scriptUrl || !token) {
      return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
    }

    const ip = getClientIp(req);
    const ua = req.headers.get("user-agent") ?? "";

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: normalized,
        source: "newsletter",
        token,
        ip,
        ua,
      }),
    });

    const data = await res.json().catch(() => ({ ok: false }));

    // Apps Script почти всегда вернет 200, поэтому смотрим data.ok
    if (!data?.ok) {
      return NextResponse.json(
        { ok: false, error: data?.error || "Upstream error" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
