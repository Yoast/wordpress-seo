# RTC-compatible meta box — scope, non-scope, and why

## What this branch does

Opts the Yoast SEO free-plugin meta box (`wpseo_meta`) into WordPress 7.0 /
Gutenberg 23.0's Real-Time Collaboration (RTC) by:

1. Exposing Yoast's existing `_yoast_wpseo_*` post meta via the REST entity
   schema (with a proper auth callback, since the underscore prefix would
   otherwise deny writes by default). This lets core-data's CRDT pipe sync
   Yoast meta between collaborators automatically.
2. Wiring a small bidirectional bridge between the `yoast-seo/editor` Redux
   store and the `core/editor` edited post meta, gated on
   `isCollaborationEnabledForCurrentPost` so it's a strict no-op when RTC is
   off or when running on WordPress < 7.0.
3. Declaring `__rtc_compatible_meta_box => true` on both `add_meta_box` calls
   in `WPSEO_Metabox`, so Gutenberg doesn't disable RTC because of us.

Without all three, flagging the meta box would be dangerous: the classic-form
meta-box POST that Gutenberg always fires on save (`meta-box-loader=1`) carries
the values that were in the hidden form fields at page load. A co-editor's
stale form values would silently clobber meta that the other user just changed
via RTC. The bridge keeps the hidden fields synced to core-data, so the
classic POST always carries fresh values and the REST save + classic POST
converge on the same state.

## What this branch does NOT change (intentional)

### wordpress-seo-premium

The premium link-suggestions meta box
(`classes/metabox-link-suggestions.php`) early-returns when
`WP_Screen::get()->is_block_editor()` and renders its UI through a React
sidebar instead. It is already RTC-pattern-correct (it never appears as a
legacy meta box in the block editor).

However, Premium does add two post-meta keys via the
`wpseo_metabox_entries_general` filter in `classes/multi-keyword.php:21-22`
(`focuskeywords` and `keywordsynonyms`, JSON-encoded arrays of additional
keyphrases and synonyms used by Premium's analysis). That filter only
affects the metabox render path; it does not feed back into
`WPSEO_Meta::$meta_fields`, so my registration loop in this branch does
**not** pick those keys up — they remain non-`show_in_rest` post meta and
therefore do **not** ride core-data's CRDT pipe.

**Implication for Premium-on-RTC sites:** all the standard Yoast fields
this branch tracks will sync between collaborators, but `focuskeywords`
and `keywordsynonyms` will still suffer the stale-form clobber the bridge
prevents elsewhere — User B's classic-form POST after editing the post
will overwrite User A's recent change to either of those two fields.

**Premium follow-up (one filter hook, separate PR):** in
`classes/multi-keyword.php`, also hook `add_extra_wpseo_meta_fields` to
inject the same two keys into `WPSEO_Meta::$meta_fields`. Once that lands,
this branch's `WPSEO_Meta::init()` registration loop will pick them up
automatically, exposing them via REST with the same sanitize / auth /
type / single contract as the free fields. No code change in Free is
needed for Premium to benefit — the plumbing is already in place.

This branch deliberately does not reach across into Premium to make that
fix; the wordpress-seo PR should stay scoped to the Free plugin so the
diff is reviewable in isolation. The two-line Premium PR can ship right
behind it.

### duplicate-post

`src/ui/metabox.php` gates its `add_meta_box` call on
`use_block_editor_for_post()`, so the meta box only appears in the classic
editor. In the block editor the same information is surfaced via a
`PluginDocumentSettingPanel` (`js/src/duplicate-post-edit-script.js`). Also
already RTC-pattern-correct.

(There are separate RTC-adjacent issues in Duplicate Post's Rewrite &
Republish flow — race conditions around concurrent R&R, redirect handling
when a collaborator republishes an R&R copy, and dynamic R&R button state.
Those are addressed in `Yoast/duplicate-post#485`, which is orthogonal to
meta-box compatibility.)

### wordpress-seo-local

`classes/class-metaboxes.php` registers a fully PHP-rendered tabbed form
(Business Info / Opening Hours / Map Settings, ~30 fields, override toggles,
a custom marker media picker) on the `wpseo_locations` CPT. The CPT has
`show_in_rest: true` and uses the block editor, so the meta box does appear
there — and it is not RTC-compatible. Making it so requires migrating the
entire UI to React + REST, which is a separate effort out of scope for this
branch. Until that work happens, sites using Local SEO will continue to have
RTC disabled when editing a Location post (because the Local meta box doesn't
carry the `__rtc_compatible_meta_box` flag). That is the correct behavior:
we do not want to set the flag on a meta box that still saves through
`$_POST` handlers whose behavior is unsafe under concurrent editing.

## Scope of the Yoast free meta box that IS covered

The bridge in `packages/js/src/initializers/rtc-meta-sync.js` explicitly maps
15 Yoast SEO fields between the Yoast Redux store and core-data meta for
live UI sync:

- Content: focus keyphrase, SEO title, meta description, cornerstone flag
- Advanced: noindex, nofollow, advanced robots (noimageindex/noarchive/nosnippet),
  breadcrumb title, canonical URL
- Schema: page type, article type
- Social: Open Graph title/description, Twitter title/description

The bridge also handles two non-trivial value-shape transforms:
- `is_cornerstone` is a boolean in the Yoast store but a `"1"`/`"0"` string in
  post meta.
- `meta-robots-adv` is an array in the Yoast store but a comma-separated
  string in post meta.

### Fields intentionally not bridged for live UI sync

These still ride core-data's CRDT meta sync (because they are registered
with `show_in_rest`) and therefore save correctly under concurrent editing,
but their live values do not stream into the Yoast Redux store on inbound
edits:

- **Derived analysis scores** — `linkdex`, `content_score`,
  `inclusive_language_score`. Each client computes its own from the post
  content; "last writer wins" on the persisted score is acceptable.
- **Social image fields** — `opengraph-image` / `twitter-image` and their
  companion `opengraph-image-id` / `twitter-image-id` keys. Yoast's image
  setters expect a coupled `{ id, url, alt, warnings }` object; bridging
  just the URL would write the literal string `"undefined"` to the
  companion ID hidden field. Treating URL+ID as a single coupled
  descriptor is straightforward but out of scope for the initial bridge —
  saves still propagate correctly via core-data, the local image preview
  just doesn't redraw until the page reloads.
- **`redirect`** — defined in `WPSEO_Meta::$meta_fields` but its UI lives
  in Yoast Premium; there is no free-plugin Redux action to dispatch.

Add-on plugins that inject additional Yoast meta via the
`add_extra_wpseo_meta_fields` filter will have those fields correctly saved
via the REST entity (same mechanism as the core fields), but their live
values will not stream through the bridge unless the add-on extends the
map. This is the correct factoring: add-ons that want live cross-
collaborator editing of their own fields should own that wiring, not us.

## Verification status

What was run locally against the branch:

- `composer check-cs-thresholds` — **PASS**, exact match (2391 errors, 257
  warnings, identical to trunk's baseline). The PHPCS gate in `cs.yml`
  rejects any non-exact count, so this matches CI behavior.
- `composer lint` — **PASS**, all 2775 PHP files parse cleanly.
- `composer audit` — **PASS**, no security advisories on `composer.lock`.
- `lerna run lint` (yarn lint:packages) for `packages/js` — **PASS**, exactly
  43 warnings (unchanged from trunk; the package's `--max-warnings=43`
  threshold is preserved).
- Root `eslint . --max-warnings=0` (yarn lint:tooling) — **PASS**, clean.
- `wp-scripts build --config config/webpack/webpack.config.js` — **PASS**,
  webpack compiles all chunks (3 pre-existing size warnings, no errors).
- `jest tests/initializers/rtcMetaSync.test.js` in `packages/js` — **PASS**,
  11/11 cases including: no-op when RTC absent, outbound + inbound
  mirroring, hidden-field input event dispatch, reentry-loop guards in
  both directions, cornerstone bool↔string transform, meta-robots-adv
  array↔comma-string transform, action-throw recovery.

What was NOT run locally, with explanation:

- **PHP integration tests under `composer test-wp` / `test-wp-env`**. Both
  paths require the `vendor_prefixed/` directory, which is built by
  composer's `prefix-dependencies` post-autoload script. That script
  invokes `humbug/php-scoper`, which depends on `symfony/finder` at a
  version that throws a fatal error under PHP 8.5 (`Return type of
  Finder::getIterator() should ... be compatible with IteratorAggregate`).
  The local development machine ships PHP 8.5; Yoast CI runs the scoper
  under PHP 7.4–8.3 where it works. The new tests at
  `tests/WP/Inc/Wpseo_Meta_Rest_Registration_Test.php` and
  `tests/WP/Admin/Metabox/Metabox_Rtc_Compatible_Flag_Test.php` will be
  exercised by the `WP Test:` matrix in `.github/workflows/test.yml`
  (PHP 7.4 / 8.0 / 8.1 / 8.2 / 8.3 against WP 6.8 + WP latest +
  WP trunk, single + multisite). They are written against the same base
  class as the existing `Meta_Test` and `Metabox_Test` files, so the
  matrix picks them up without configuration changes.
- **TestJS jobs for the 11 sibling JS packages** other than `js` —
  unchanged by this branch (no source files modified outside
  `packages/js/src/`), but CI will run them anyway.
- **CI-only checks** — Coveralls upload, label/milestone validation.

What still needs to happen at PR time:

- Add a `changelog:*` label so `pr-validation.yml` doesn't fail. The
  appropriate label is likely `changelog:enhancements` or `changelog:other`
  depending on Yoast's labeling conventions for compatibility work; the
  PR author / Yoast triage chooses.
- Add a milestone (the validation workflow currently warns but doesn't
  fail on missing milestone, but a release manager will want one).
