// Thin, SSR-safe wrapper over the globally-loaded PostHog. The CDN snippet in
// Layout.astro sets window.posthog; this no-ops if it's absent — during SSR,
// when an ad blocker strips PostHog, or when no key is configured — so call
// sites never have to null-check.
//
// Event taxonomy (object_action, snake_case):
//   resume_opened          { source }   modal opened (cv view)
//   resume_downloaded                   download link in the viewer
//   resume_opened_in_tab                "open in tab" in the viewer
//   resume_choice          { choice }   the "would you rather" pick
//   contact_email_click                 mailto in the footer
//   contact_link_click     { network }  linkedin / scholar in the footer
//   blog_post_completed    { post }     reader reached the end of a post
export function track(event, properties) {
  if (typeof window === "undefined") return;
  window.posthog?.capture?.(event, properties);
}
