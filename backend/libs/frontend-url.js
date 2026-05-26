/** First origin when FRONTEND_URL is comma-separated (CORS); used in email links. */
export function primaryFrontendUrl() {
    const raw = process.env.FRONTEND_URL || "http://localhost:5173";
    return raw.split(",")[0].trim();
}
