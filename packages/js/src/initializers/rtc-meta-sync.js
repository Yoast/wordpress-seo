import { dispatch, select, subscribe } from "@wordpress/data";
import { isEqual } from "lodash";

/**
 * Bidirectional bridge between the Yoast editor Redux store (`yoast-seo/editor`)
 * and the WordPress core-data edited post meta.
 *
 * Why this exists:
 *   - WordPress 7.0 / Gutenberg 23.0 ships Real-Time Collaboration (RTC), which
 *     synchronizes post meta between concurrent editors through the core-data
 *     CRDT pipe — but only for meta that Yoast's editor keeps in sync with
 *     core-data. The Yoast meta box maintains its own Redux state and writes
 *     values into hidden `<input>` fields that the classic-form meta-box save
 *     path (`meta-box-loader=1`) POSTs on every save. Without this bridge,
 *     a collaborator's remote edit would not reach the local Yoast Redux store
 *     (so the UI would not update) and a local edit would not reach core-data
 *     (so the remote user would not see it, and the classic-form POST of the
 *     last saver would silently clobber any meta that had been edited through
 *     core-data).
 *
 * What this bridge does:
 *   - On every change to the local Yoast store, mirror the values for each
 *     tracked Yoast meta key into core-data via `editEntityRecord`. core-data's
 *     CRDT pipe will propagate the edit to remote collaborators and include it
 *     in the next REST save.
 *   - On every change to core-data's edited post meta, dispatch the equivalent
 *     Yoast action so the UI and internal state update, and also write the new
 *     value into the existing hidden form field so the classic-form POST never
 *     carries stale data.
 *   - A per-key "in flight" guard prevents ping-pong between the two
 *     subscriptions when an edit we just applied comes back from the other
 *     side.
 *
 * When this bridge runs:
 *   - Only when `core/editor`'s `isCollaborationEnabledForCurrentPost` selector
 *     exists and returns `true`. On WordPress < 7.0 the selector is absent and
 *     the bridge no-ops. On WP 7.0 sites with RTC disabled (via the site
 *     setting) the selector returns `false` and the bridge also no-ops, so the
 *     prior behavior (Yoast's private Redux store only) is preserved.
 */

const META_PREFIX = "_yoast_wpseo_";

/**
 * Builds the DOM id of the hidden form input Yoast renders for each tracked
 * Yoast internal meta key.
 *
 * @param {string} internalKey The Yoast internal meta key, e.g. `focuskw`.
 *
 * @returns {string} The hidden input element id.
 */
const hiddenFieldId = ( internalKey ) => `yoast_wpseo_${ internalKey }`;

/**
 * Coerces the boolean cornerstone state into the "1" string that Yoast persists
 * to post meta (or "0" for the non-cornerstone case).
 *
 * @param {boolean} isCornerstone Whether the post is cornerstone content.
 *
 * @returns {string} The stringified post meta value.
 */
const cornerstoneToString = ( isCornerstone ) => ( isCornerstone ? "1" : "0" );

/**
 * Parses the persisted cornerstone string ("1" or "0") back to a boolean so it
 * can be fed to `setCornerstoneContent`.
 *
 * @param {string} value The post meta string.
 *
 * @returns {boolean} Whether the value represents cornerstone content.
 */
const cornerstoneFromString = ( value ) => value === "1";

/**
 * Field descriptors. Each entry maps a Yoast internal key (without the
 * `_yoast_wpseo_` prefix) to:
 *
 *   - `selector`: a function receiving `select('yoast-seo/editor')` that returns
 *     the current local string value.
 *   - `action`:   a function that dispatches the equivalent Yoast action given
 *     a dispatch-bound store object and the incoming string value.
 *
 * The object keys intentionally preserve the snake_case and kebab-case DB-level
 * names, so camelcase is disabled inside this block.
 */
/* eslint-disable camelcase */
const FIELD_MAP = {
	focuskw: {
		selector: ( s ) => s.getFocusKeyphrase(),
		action: ( d, value ) => d.setFocusKeyword( value ),
	},
	title: {
		selector: ( s ) => s.getSnippetEditorData().title,
		action: ( d, value ) => d.updateData( { title: value } ),
	},
	metadesc: {
		selector: ( s ) => s.getSnippetEditorData().description,
		action: ( d, value ) => d.updateData( { description: value } ),
	},
	is_cornerstone: {
		selector: ( s ) => cornerstoneToString( s.isCornerstoneContent() ),
		action: ( d, value ) => d.setCornerstoneContent( cornerstoneFromString( value ) ),
	},
	"meta-robots-noindex": {
		selector: ( s ) => String( s.getNoIndex() ?? "" ),
		action: ( d, value ) => d.setNoIndex( value ),
	},
	"meta-robots-nofollow": {
		selector: ( s ) => String( s.getNoFollow() ?? "" ),
		action: ( d, value ) => d.setNoFollow( value ),
	},
	"meta-robots-adv": {
		// Yoast Redux state holds the advanced robots options as an array (the
		// MultiSelect prop is `array.isRequired`); post meta stores them as a
		// comma-separated string. Round-trip through the bridge has to match
		// each side's expected shape.
		selector: ( s ) => {
			const value = s.getAdvanced();
			return Array.isArray( value ) ? value.join( "," ) : ( value || "" );
		},
		action: ( d, value ) => d.setAdvanced( value === "" ? [] : value.split( "," ) ),
	},
	bctitle: {
		selector: ( s ) => s.getBreadcrumbsTitle() || "",
		action: ( d, value ) => d.setBreadcrumbsTitle( value ),
	},
	canonical: {
		selector: ( s ) => s.getCanonical() || "",
		action: ( d, value ) => d.setCanonical( value ),
	},
	schema_page_type: {
		selector: ( s ) => s.getPageType() || "",
		action: ( d, value ) => d.setPageType( value ),
	},
	schema_article_type: {
		selector: ( s ) => s.getArticleType() || "",
		action: ( d, value ) => d.setArticleType( value ),
	},
	"opengraph-title": {
		selector: ( s ) => s.getFacebookTitle() || "",
		action: ( d, value ) => d.setFacebookPreviewTitle( value ),
	},
	"opengraph-description": {
		selector: ( s ) => s.getFacebookDescription() || "",
		action: ( d, value ) => d.setFacebookPreviewDescription( value ),
	},
	"twitter-title": {
		selector: ( s ) => s.getTwitterTitle() || "",
		action: ( d, value ) => d.setTwitterPreviewTitle( value ),
	},
	"twitter-description": {
		selector: ( s ) => s.getTwitterDescription() || "",
		action: ( d, value ) => d.setTwitterPreviewDescription( value ),
	},
	/*
	 * Note on image fields (`opengraph-image` / `twitter-image` and their
	 * `*-image-id` counterparts): these are intentionally NOT in the bridge.
	 * The Yoast image setters (`setFacebookPreviewImage`, `setTwitterPreviewImage`)
	 * expect a full media object `{ id, url, alt, warnings }` and write all of
	 * those into hidden form fields; dispatching with just `{ url }` would
	 * leave the corresponding `*-image-id` hidden field at the literal string
	 * "undefined". Image URL and ID still ride core-data's CRDT meta sync
	 * (they are registered with `show_in_rest`), so concurrent saves remain
	 * correct — the local Yoast preview UI just won't show a remote
	 * collaborator's image picker change until the page reloads. Live image
	 * sync would require treating URL+ID as a coupled descriptor, which is
	 * out of scope for this initial bridge.
	 */
};
/* eslint-enable camelcase */

/**
 * Returns `true` if core-data's `core/editor` store reports RTC as enabled for
 * the post currently being edited. No-ops gracefully when the selector is not
 * present (pre-WP 7.0) or when RTC is off.
 *
 * @returns {boolean} Whether the bridge should be active.
 */
const isRtcActive = () => {
	try {
		const editor = select( "core/editor" );
		if ( ! editor || typeof editor.isCollaborationEnabledForCurrentPost !== "function" ) {
			return false;
		}
		return editor.isCollaborationEnabledForCurrentPost() === true;
	} catch ( error ) {
		return false;
	}
};

/**
 * Mirrors a value into the existing hidden form input, when that input exists.
 * Dispatches an `input` event so any listener bound to the classic metabox form
 * (e.g. analysis refresh) is triggered with the same semantics as a user edit.
 *
 * @param {string} internalKey The Yoast internal meta key.
 * @param {string} value       The new value.
 *
 * @returns {void}
 */
const mirrorHiddenField = ( internalKey, value ) => {
	const element = document.getElementById( hiddenFieldId( internalKey ) );
	if ( ! element || element.value === value ) {
		return;
	}
	element.value = value;
	if ( typeof window !== "undefined" && typeof window.Event === "function" ) {
		element.dispatchEvent( new window.Event( "input", { bubbles: true } ) );
	}
};

/**
 * Reads the tracked Yoast fields into a flat `{ [internalKey]: stringValue }`
 * using the selectors declared in `FIELD_MAP`.
 *
 * @returns {Object<string, string>} Snapshot of tracked Yoast values.
 */
const snapshotYoast = () => {
	const state = select( "yoast-seo/editor" );
	const out = {};
	if ( ! state ) {
		return out;
	}
	for ( const [ key, descriptor ] of Object.entries( FIELD_MAP ) ) {
		try {
			out[ key ] = descriptor.selector( state ) ?? "";
		} catch ( error ) {
			out[ key ] = "";
		}
	}
	return out;
};

/**
 * Reads the core-data edited post meta record, restricted to the Yoast keys in
 * `FIELD_MAP`.
 *
 * @param {string} postType The current post type.
 * @param {number} postId   The current post id.
 *
 * @returns {Object<string, string>} Snapshot of tracked post meta values.
 */
const snapshotMeta = ( postType, postId ) => {
	const record = select( "core" ).getEditedEntityRecord( "postType", postType, postId );
	const meta = ( record && record.meta ) || {};
	const out = {};
	for ( const key of Object.keys( FIELD_MAP ) ) {
		out[ key ] = meta[ META_PREFIX + key ] ?? "";
	}
	return out;
};

/**
 * Propagates changes in the local Yoast store to core-data meta. Returns the
 * meta delta (sans META_PREFIX), and mutates `outboundApplied` so the inbound
 * subscription can recognize the echo.
 *
 * @param {Object<string, string>} nextYoast       Latest Yoast snapshot.
 * @param {Object<string, string>} lastYoastSnap   Previous Yoast snapshot.
 * @param {Map<string, string>}    inboundApplied  Guard from inbound writes.
 * @param {Map<string, string>}    outboundApplied Guard to update.
 *
 * @returns {Object<string, string>} Meta keys (with prefix) to push to core-data.
 */
const diffYoastOutbound = ( nextYoast, lastYoastSnap, inboundApplied, outboundApplied ) => {
	const delta = {};
	for ( const key of Object.keys( FIELD_MAP ) ) {
		if ( nextYoast[ key ] === lastYoastSnap[ key ] ) {
			continue;
		}
		if ( inboundApplied.get( key ) === nextYoast[ key ] ) {
			inboundApplied.delete( key );
			continue;
		}
		delta[ META_PREFIX + key ] = nextYoast[ key ];
		outboundApplied.set( key, nextYoast[ key ] );
	}
	return delta;
};

/**
 * Applies core-data meta changes into the Yoast store and the hidden form
 * fields. Updates `inboundApplied` so the outbound subscription can recognize
 * the echo.
 *
 * @param {Object<string, string>} nextMeta        Latest meta snapshot.
 * @param {Object<string, string>} lastMetaSnap    Previous meta snapshot.
 * @param {Map<string, string>}    inboundApplied  Guard to update.
 * @param {Map<string, string>}    outboundApplied Guard from outbound writes.
 * @param {Object}                 yoastDispatch   Bound dispatch for yoast-seo/editor.
 *
 * @returns {void}
 */
const applyInbound = ( nextMeta, lastMetaSnap, inboundApplied, outboundApplied, yoastDispatch ) => {
	for ( const [ key, descriptor ] of Object.entries( FIELD_MAP ) ) {
		if ( nextMeta[ key ] === lastMetaSnap[ key ] ) {
			continue;
		}
		if ( outboundApplied.get( key ) === nextMeta[ key ] ) {
			outboundApplied.delete( key );
			continue;
		}
		inboundApplied.set( key, nextMeta[ key ] );
		try {
			descriptor.action( yoastDispatch, nextMeta[ key ] );
		} catch ( error ) {
			inboundApplied.delete( key );
			console.warn( `[yoast-rtc] failed to dispatch ${ key }`, error );
		}
		mirrorHiddenField( key, nextMeta[ key ] );
	}
};

/**
 * Initializes the RTC meta sync bridge. Safe to call unconditionally — it
 * resolves to a no-op when RTC is unavailable or disabled. Returns a tear-down
 * function that removes the subscriptions, primarily for tests.
 *
 * @returns {Function} Unsubscribe function.
 */
export default function initRtcMetaSync() {
	if ( ! isRtcActive() ) {
		return () => {};
	}

	const coreData = dispatch( "core" );
	const yoastDispatch = dispatch( "yoast-seo/editor" );

	const editorSelect = select( "core/editor" );
	const postType = editorSelect.getCurrentPostType();
	const postId = editorSelect.getCurrentPostId();

	if ( ! postType || ! postId ) {
		return () => {};
	}

	const inboundApplied = new Map();
	const outboundApplied = new Map();

	let lastYoastSnapshot = snapshotYoast();
	let lastMetaSnapshot = snapshotMeta( postType, postId );

	const unsubscribe = subscribe( () => {
		/*
		 * Both branches commit the new snapshot BEFORE dispatching anything,
		 * so a re-entrant subscriber call (triggered synchronously by the
		 * dispatch we are about to make) sees the post-update baseline and
		 * doesn't re-dispatch the same delta.
		 */
		const nextYoast = snapshotYoast();
		if ( ! isEqual( nextYoast, lastYoastSnapshot ) ) {
			const previousYoast = lastYoastSnapshot;
			lastYoastSnapshot = nextYoast;
			const delta = diffYoastOutbound( nextYoast, previousYoast, inboundApplied, outboundApplied );
			if ( Object.keys( delta ).length > 0 ) {
				coreData.editEntityRecord( "postType", postType, postId, { meta: delta } );
			}
		}

		const nextMeta = snapshotMeta( postType, postId );
		if ( ! isEqual( nextMeta, lastMetaSnapshot ) ) {
			const previousMeta = lastMetaSnapshot;
			lastMetaSnapshot = nextMeta;
			applyInbound( nextMeta, previousMeta, inboundApplied, outboundApplied, yoastDispatch );
		}
	} );

	return () => {
		unsubscribe();
	};
}
