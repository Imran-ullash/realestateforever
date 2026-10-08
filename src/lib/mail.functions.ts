import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const DEFAULT_CLIENT_EMAIL = "info@realestateforever.com";
const CHATBOT_DESTINATION_EMAIL = "ullashsoftvence@gmail.com";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const LOGO_CID = "real-estate-forever-logo";
const SENDER_NAME = "Real Estate Forever";

const schema = z.object({
  form: z.enum(["hero", "enquiry", "chatbot"]),
  name: z.string().trim().max(100).default(""),
  email: z.string().trim().max(255).default(""),
  phone: z.string().trim().max(50).default(""),
  subject: z.string().trim().max(200).default(""),
  message: z.string().trim().max(5000).default(""),
  property: z.string().trim().max(200).default(""),
  conversationContext: z.string().trim().max(10000).default(""),
});

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
const b64 = (s: string) => btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
const header = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);

export const sendFormEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const isHero = data.form === "hero";
    const isChatbot = data.form === "chatbot";
    const TO = isChatbot
      ? (process.env["CHATBOT_EMAIL"] || CHATBOT_DESTINATION_EMAIL)
      : (process.env["CLIENT_EMAIL"] || DEFAULT_CLIENT_EMAIL);

    const title = isChatbot
      ? "New Chatbot Inquiry"
      : isHero
        ? "New Join Request"
        : "New Private Enquiry";
    const formLabel = isChatbot
      ? "Website Chatbot"
      : isHero
        ? "About Us — Join form"
        : "Contact — Private enquiry form";
    const intro = isChatbot
      ? "A visitor submitted an inquiry through the website AI chatbot on RealEstateForever.com."
      : isHero
        ? "A visitor submitted the About Us join form on RealEstateForever.com."
        : "A visitor submitted the private enquiry form on RealEstateForever.com.";

    const submittedAt = new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/New_York",
    }).format(new Date());

    const subjectLine = isChatbot
      ? "New Chatbot Inquiry — RealEstateForever.com"
      : `Website ${isHero ? "Join Request" : "Enquiry"}${data.name ? ` — ${data.name}` : ""} | Real Estate Forever`;

    const rows: [string, string][] = isChatbot
      ? [
          ["Subject", subjectLine],
          ["Name", data.name || "—"],
          ["Email", data.email || "—"],
          ...(data.property ? [["Property", data.property] as [string, string]] : []),
          ["Inquiry", data.message || "—"],
          ["Source", "Website Chatbot"],
          ["Date", `${submittedAt} ET`],
          ...(data.phone ? [["Phone", data.phone] as [string, string]] : []),
          ...(data.conversationContext ? [["Conversation Context", data.conversationContext] as [string, string]] : []),
        ]
      : isHero
        ? [
            ["Form", formLabel],
            ["Name", data.name],
            ["Email", data.email],
            ["Phone", data.phone],
          ]
        : [
            ["Form", formLabel],
            ["Name", data.name],
            ["Email", data.email],
            ["Subject", data.subject],
            ["Message", data.message],
          ];

    const resendKey = process.env["RESEND_API_KEY"];
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const gmailKey = process.env["GOOGLE_MAIL_API_KEY"];

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;color:#f4efe4;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#ffffff;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#0a0a0a;border:1px solid #3e3424;border-radius:8px;overflow:hidden;box-shadow:0 18px 45px rgba(0,0,0,.35);">
            <tr>
              <td style="height:4px;background:#c9a45c;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td align="center" style="padding:34px 32px 26px;border-bottom:1px solid #2e291f;">
                <img src="cid:${LOGO_CID}" width="280" alt="Real Estate Forever" style="display:block;width:100%;max-width:280px;height:auto;border:0;">
              </td>
            </tr>
            <tr>
              <td style="padding:34px 32px 12px;">
                <p style="margin:0 0 10px;color:#c9a45c;font-size:12px;line-height:18px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">New website submission</p>
                <h1 style="margin:0;color:#f4efe4;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:38px;font-weight:400;">${esc(title)}</h1>
                <p style="margin:12px 0 0;color:#d1cbbc;font-size:15px;line-height:24px;">${esc(intro)}</p>
                <p style="margin:12px 0 0;color:#a9a394;font-size:14px;line-height:22px;">Received ${esc(submittedAt)} ET</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 36px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border:1px solid #302b22;border-radius:7px;border-collapse:separate;overflow:hidden;">
                  ${rows
        .map(
          ([key, value], index) => `<tr>
                    <td valign="top" style="width:110px;padding:18px 20px;color:#c9a45c;font-size:12px;line-height:20px;font-weight:700;letter-spacing:1px;text-transform:uppercase;${index ? "border-top:1px solid #302b22;" : ""}">${esc(key)}</td>
                    <td valign="top" style="padding:18px 20px;color:#f4efe4;font-size:16px;line-height:24px;word-break:break-word;${index ? "border-top:1px solid #302b22;" : ""}">${key === "Email" && z.string().email().safeParse(value).success
              ? `<a href="mailto:${esc(value)}" style="color:#f4efe4;text-decoration:underline;text-decoration-color:#c9a45c;">${esc(value)}</a>`
              : esc(value || "—").replace(/\n/g, "<br>")
            }</td>
                  </tr>`,
        )
        .join("")}
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:22px 32px;background:#0d0d0d;border-top:1px solid #2e291f;color:#817b70;font-size:12px;line-height:19px;">
                Real Estate Forever &nbsp;&middot;&nbsp; Private real estate opportunities
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
    const replyTo = z.string().email().safeParse(data.email).success ? `Reply-To: ${data.email}\r\n` : "";
    const boundary = "real-estate-forever-email";
    const { emailLogoBase64 } = await import("./email-logo.server");
    const raw = b64(
      `From: ${SENDER_NAME} <deepakavology2@gmail.com>\r\nTo: ${TO}\r\n${replyTo}Subject: ${header(subjectLine)}\r\nMIME-Version: 1.0\r\nContent-Type: multipart/related; boundary="${boundary}"\r\n\r\n` +
      `--${boundary}\r\nContent-Type: text/html; charset="UTF-8"\r\nContent-Transfer-Encoding: 8bit\r\n\r\n${html}\r\n` +
      `--${boundary}\r\nContent-Type: image/png\r\nContent-Transfer-Encoding: base64\r\nContent-ID: <${LOGO_CID}>\r\nContent-Disposition: inline; filename="real-estate-forever-logo.png"\r\n\r\n${emailLogoBase64}\r\n` +
      `--${boundary}--`,
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    // 1. If Resend API Key is configured (ideal for Vercel deployment)
    if (resendKey) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Real Estate Forever <onboarding@resend.dev>",
            to: [TO],
            reply_to: data.email || undefined,
            subject: subjectLine,
            html: html,
          }),
        });
        if (res.ok) {
          console.log(`[mail] Inquiry email successfully delivered via Resend to ${TO}`);
          return { ok: true, error: "" };
        }
        const body = await res.text();
        console.error(`[mail] Resend dispatch failed [${res.status}]: ${body}`);
        return { ok: false, error: `Resend dispatch failed [${res.status}]` };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[mail] Resend exception:", msg);
        return { ok: false, error: msg };
      }
    }

    // 2. If Lovable / Gmail Gateway is configured
    if (lovableKey && gmailKey) {
      try {
        const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": gmailKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ raw }),
        });
        if (!res.ok) {
          const body = await res.text();
          console.error(`[mail] Gmail send failed [${res.status}]: ${body}`);
          return { ok: false, error: `Gmail send failed [${res.status}]` };
        }
        return { ok: true, error: "" };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[mail] Gmail send failed:", msg);
        return { ok: false, error: msg };
      }
    }

    // 3. Development / Sandbox fallback logger
    console.log(`[mail] Inbound inquiry routed to ${TO}:`, {
      destination: TO,
      subject: subjectLine,
      name: data.name,
      email: data.email,
      property: data.property,
      inquiry: data.message,
      source: formLabel,
      date: `${submittedAt} ET`,
      conversationContext: data.conversationContext,
    });
    return { ok: true, error: "" };
  });
