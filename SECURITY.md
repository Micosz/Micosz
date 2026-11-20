# Security Policy

## System and Scope

This repository contains the Micosz GitHub profile and the Chanakarn personal portfolio in `portfolio/`. Review the complete repository, including the profile SVG assets, browser JavaScript, vendored dependencies, asset loading and Vercel deployment configuration. A nested SECURITY.md may refine a component's policy but must not silently remove a shared security boundary from review.

The current portfolio is a static HTML/CSS/JavaScript application. Vercel serves `portfolio/` as configured in that directory's `vercel.json`. The browser editor stores a local draft and exports a replacement `content.js`; it does not write to GitHub or a shared server. Repository publication is controlled outside the browser editor.

## Threat Model and Trust Boundaries

Visitors control the URL and fragment used to open the site. Edited content and browser-local drafts must remain data when rendered. Review realistic ways an attacker can influence those inputs; do not assume that a remote visitor can modify another visitor's localStorage or the repository.

Published `content.js` and static assets are delivered to every visitor. The course-grade toggle changes presentation only and provides no confidentiality boundary. Treat any newly introduced credentials, private documents, unpublished personal data, privileged API or shared editing feature as a change to this model.

External links, external images and vendored model-loading code cross distinct trust boundaries. Repository write access, hosting credentials and dependency provenance are trusted publishing capabilities, not visitor capabilities. None may be made available to browser code.

## Security Invariants

- Visitor-controlled URL fragments and content fields must not become executable HTML, script, event handlers or unsafe navigation targets.
- Link and image validation must be applied at the actual rendering boundary and preserve documented legitimate schemes and local assets.
- Local editing, preview and export must not mutate another visitor's data or publish to the shared website without an independently authorized publishing operation.
- Secrets, hosting credentials and source documents not deliberately selected for publication must not be included in the static output or repository artifacts.
- Public UI visibility controls must not be represented as access control or used to protect confidential content.
- Third-party dependencies, model parsers and SVG assets must be reviewed in the context in which they are actually loaded and executed.
- Security changes must preserve normal navigation, valid project/contact links, local draft/export workflows, model loading and reduced-motion behavior.

## Reportable Findings and Severity Context

Report a concrete broken invariant with its attacker-controlled source, reachable operation, affected trust boundary, prerequisites and practical impact. Distinguish visitor-to-visitor or publisher-to-visitor compromise from actions requiring existing repository control or the same user's deliberate developer-console modification.

An absent defense-in-depth header or generic best-practice gap is not by itself proof of an exploitable vulnerability. Record such opportunities separately when supported by the actual deployment and code. Calibrate dependency findings to the shipped version and reachable features; the presence of a library name alone does not establish exploitability.

## Out of Scope, Exclusions, and Accepted Risk

No owner-confirmed finding-class exclusions or accepted vulnerabilities have been recorded. Do not infer suppression authority from the site's small size, static deployment, educational purpose or public repository. An inability to inspect a surface is a coverage limitation, not an exclusion or proof of safety.

## Known Limitations and Compensating Controls

Repository review alone does not establish current Vercel account security, GitHub branch protections, deployed response headers or the behavior of linked third-party sites. Record these as unverified unless separately evidenced within authorized scope.

The current editing workflow uses browser-local storage and a manual content export. There is no implemented shared administrator session in the reviewed source; the `#edit` route is therefore not an authenticated administrative control. Revisit this policy before adding server-side storage, collaborative editing, account authentication or privileged integrations.
