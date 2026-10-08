# Branded enquiry email

## Changes
- Send both website forms to `sandeep1avology@gmail.com`.
- Keep Gmail sending entirely server-side through the connected integration.
- Redesign the received email with the Real Estate Forever logo, black background, warm ivory text, gold accents, and clearly arranged submitted details.
- Preserve the existing website forms, messages, and behavior.

## Verification
- Confirm the project builds cleanly.
- Send a real test submission through the same server-side Gmail path and verify the response.

## Technical details
- Update only `src/lib/mail.functions.ts`.
- Use the existing hosted logo URL so it displays inside Gmail without exposing credentials.
- Keep submitted values escaped before inserting them into the HTML email.
