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
legacy meta box in the block editor), so nothing in premium needs to change
for premium-only sites to get RTC. Setting the flag on the free-plugin meta
box is sufficient.

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
17 Yoast SEO fields between the Yoast Redux store and core-data meta:

- Content: focus keyphrase, SEO title, meta description, cornerstone flag
- Advanced: noindex, nofollow, advanced robots (noimageindex/noarchive/nosnippet),
  breadcrumb title, canonical URL
- Schema: page type, article type
- Social: Open Graph title/description/image, Twitter title/description/image

Derived score fields (`linkdex`, `content_score`,
`inclusive_language_score`) are intentionally not bridged — each client
computes its own score from the post content, and a "last writer wins" on
the persisted value is acceptable. Image-ID companion fields
(`opengraph-image-id`, `twitter-image-id`) follow whichever client last set
the image URL; the REST save path preserves the pairing.

Add-on plugins that inject additional Yoast meta via the
`add_extra_wpseo_meta_fields` filter will have those fields correctly saved
via the REST entity (same mechanism as the core fields), but their live
values will not stream through the bridge unless the add-on extends the map.
This is the correct factoring: add-ons that want live cross-collaborator
editing of their own fields should own that wiring, not us.
