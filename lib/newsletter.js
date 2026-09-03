/*
 * Newsletter signup, against the studio's own listmonk instance.
 *
 * Two things are worth knowing before reading the rest.
 *
 * The first is that the browser never talks to listmonk directly. listmonk only
 * emits CORS headers for origins named in its own trusted-URLs setting, and at
 * the time of writing it emits none at all — a preflight for
 * `/api/public/subscription` 404s, and even a plain GET comes back without an
 * `access-control-allow-origin` — so a `fetch` straight from the page would be
 * blocked before it left the browser. `/api/newsletter` in this app forwards
 * the request instead: server to server, where CORS never applies, and where
 * the form goes on working from localhost without anyone having to add a
 * development origin to a production instance's settings.
 *
 * The second is that the list is double opt-in. A 200 means listmonk has sent a
 * confirmation email, not that anybody is subscribed — they become a subscriber
 * only by clicking the link in it. So the copy has to say so, and `has_optin`
 * is what decides which sentence gets shown.
 */

/*
 * The instance and its one public list. Both are public values by design — the
 * subscription endpoint exists to be called by strangers — so they sit here
 * rather than in the environment, where a variable missing at build time would
 * inline as `undefined` and break the form silently. listmonk's admin API is a
 * different thing entirely and appears nowhere in this project: it takes a
 * token granting read and write over every subscriber on the instance, which
 * has no business in a repository or a bundle.
 */
const LISTMONK = "https://listmonk-production-2723.up.railway.app";

/** The "Opt-in list", the only list on the instance marked public. */
export const LIST_UUID = "4181575c-be69-45ed-9294-13273305c3a8";

/** Where the API route forwards to. Never called from the browser — see above. */
export const SUBSCRIPTION_ENDPOINT = `${LISTMONK}/api/public/subscription`;

/*
 * listmonk's own hosted signup page. The bar's button is a real link to it, and
 * the dialog is what JavaScript puts in that link's way — so a reader without
 * it still has somewhere to go rather than a button that does nothing. It is
 * also the dialog form's native `action`, which is what would carry a
 * submission if the script failed after the dialog had already opened.
 */
export const FALLBACK_URL = `${LISTMONK}/subscription/form`;

/*
 * What the reader is told. Kept beside the request rather than in the component
 * because which of these is right is a property of the response, not of the
 * layout — and because the difference between "check your inbox" and "you are
 * subscribed" is the double opt-in, which is easy to get wrong from a distance.
 */
const OPT_IN = "Almost there — check your inbox and click the link to confirm.";
const SUBSCRIBED = "You are subscribed. Thank you.";
const FAILED = "Something went wrong. Please try again.";
const UNREACHABLE = "Could not reach the server. Please try again.";

/**
 * Subscribes an address, via this app's own API route.
 *
 * Always resolves — a caller only has to render `message` and, on `ok`, stop
 * showing the form. listmonk treats an address already on the list as a success
 * and updates it, so there is deliberately no "you are already subscribed"
 * branch here: the endpoint will not say, and building messaging around it
 * would turn the form into a way of testing whether an address is on the list.
 */
export async function subscribe(email, consent) {
  let response;
  let payload;

  try {
    response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, consent }),
    });
    payload = await response.json().catch(() => ({}));
  } catch {
    // A network failure, or the route itself being unreachable.
    return { ok: false, message: UNREACHABLE };
  }

  // listmonk's own wording is better than anything generic — "Invalid email."
  // names the field the reader has to change — so it is preferred where the
  // route passed one through.
  if (!response.ok) return { ok: false, message: payload?.message || FAILED };

  return { ok: true, message: payload?.has_optin ? OPT_IN : SUBSCRIBED };
}
