# Use original marketplace listing photos

## Goal
Replace repeated placeholder property photos with the original listing photos from DealDeck and InvestorLift wherever a reliable public match exists.

## Work
- Match each existing marketplace entry to its public source listing by city, state, ZIP, and deal details.
- Download only publicly accessible listing photos; do not bypass account walls or bot protection.
- Store matched photos through the project asset system and attach them to the correct listing records.
- Keep the current card design, filters, text, and page structure unchanged.
- Leave the current placeholder on any listing that cannot be matched confidently rather than assigning a wrong image.

## Verification
- Check image loading and listing-to-photo accuracy on desktop and mobile.
- Confirm filters and search still work without browser errors or horizontal overflow.

## Technical notes
- Record source URLs for traceability.
- Use optimized CDN-hosted assets rather than hotlinking third-party images.
