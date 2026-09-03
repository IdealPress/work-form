import { LIST_UUID, SUBSCRIPTION_ENDPOINT } from "lib/newsletter";

/*
 * The newsletter form's one server-side hop. It exists because listmonk sends
 * no CORS headers, so the page cannot call it — see `lib/newsletter.js`.
 *
 * It forwards to listmonk's *public* subscription endpoint, which needs no
 * credentials: there is no token here, and nothing this route can do that a
 * stranger with curl could not already do against the instance directly. The
 * admin API, which does hold a token and can read every subscriber, is not
 * reachable from here.
 */

// listmonk's own ceiling for the field; anything longer is not an address that
// got mistyped, and there is no reason to carry it upstream.
const MAX_EMAIL = 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const email =
    typeof req.body?.email === "string" ? req.body.email.trim() : "";

  if (!email || email.length > MAX_EMAIL) {
    return res
      .status(400)
      .json({ message: "Please enter your email address." });
  }

  /*
   * The consent tick is checked here as well as in the form. Under UK GDPR the
   * click on the confirmation email is the consent record, but the tick is what
   * the reader actually saw and agreed to, and a gate that only exists in the
   * markup is not a gate — this route is as reachable as any other URL.
   */
  if (req.body?.consent !== true) {
    return res
      .status(400)
      .json({ message: "Please confirm you would like the newsletter." });
  }

  let response;
  let payload;

  try {
    response = await fetch(SUBSCRIPTION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, list_uuids: [LIST_UUID] }),
    });
    payload = await response.json().catch(() => ({}));
  } catch {
    return res
      .status(502)
      .json({ message: "The newsletter service is unavailable right now." });
  }

  /*
   * A 400 is the reader's to fix and its message says how, so it is passed
   * through as it stands. Anything else is ours — a list that stopped being
   * public, an instance that is down, or the captcha in listmonk's security
   * settings being switched on, which starts rejecting every submission that
   * does not carry a solved challenge. None of those are worth retrying and all
   * of them should be visible rather than silent, so they surface as a 502 with
   * whatever listmonk said about them.
   */
  if (!response.ok) {
    const status = response.status === 400 ? 400 : 502;
    return res
      .status(status)
      .json({ message: payload?.message || "Something went wrong." });
  }

  // Narrowed to the one field the page acts on, so nothing else listmonk
  // chooses to return travels back to the browser.
  return res.status(200).json({ has_optin: payload?.data?.has_optin === true });
}
