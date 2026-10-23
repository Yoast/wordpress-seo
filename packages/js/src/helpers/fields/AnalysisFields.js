import apiFetch from "@wordpress/api-fetch";
import { dispatch, select, subscribe } from "@wordpress/data";
import {
	metaKeyFocusKw,
	metaKeyIsCornerstone,
	metaKeyLinkdex,
	metaKeyContentScore,
	metaKeyInclusiveLanguageScore,
	metaKeyMetaDescriptionScore,
	metaKeySeoTitleScore,
} from "../../shared-admin/constants";
import { isRestMetaActive, shouldSkipMetaWrite, writeMetaWithoutUndo, getMetaValue, setMetaValue } from "./rest-meta";

/**
 * Returns whether the core/editor store has finished loading the post type config.
 * Dispatching editPost before the entity config is available throws a runtime error.
 *
 * @returns {boolean} True when the post type config is loaded and editPost can be called safely.
 */
function isEditorReady() {
	return Boolean( select( "core/editor" ).getCurrentPostType() );
}

// Pending meta writes buffered before the editor entity config is ready.
// Each entry is { value: string, undoIgnore: boolean } so the undo-ignore flag survives queuing.
// Keyed by meta key so that rapid successive writes for the same key collapse to the last value.
const pendingWrites = new Map();
let unsubscribeFlush = null;

/**
 * Drains pendingWrites, routing undoIgnore entries through writeMetaWithoutUndo and the rest
 * through editPost so that analysis scores never land on the undo stack regardless of when they
 * were queued.
 *
 * @returns {void}
 */
function flushPendingWrites() {
	if ( pendingWrites.size === 0 ) {
		return;
	}
	const scoreMeta = {};
	const editMeta = {};
	for ( const [ key, { value, undoIgnore } ] of pendingWrites ) {
		if ( undoIgnore ) {
			scoreMeta[ key ] = value;
		} else {
			editMeta[ key ] = value;
		}
	}
	pendingWrites.clear();
	if ( Object.keys( scoreMeta ).length > 0 ) {
		writeMetaWithoutUndo( scoreMeta );
	}
	if ( Object.keys( editMeta ).length > 0 ) {
		dispatch( "core/editor" ).editPost( { meta: editMeta } );
	}
}

/**
 * Subscribes to core/editor store changes and flushes pending meta writes as soon as the editor
 * is ready. Unsubscribes immediately after the first successful flush to avoid ongoing overhead.
 *
 * @returns {void}
 */
function scheduleFlush() {
	if ( unsubscribeFlush ) {
		return;
	}
	unsubscribeFlush = subscribe( () => {
		if ( ! isEditorReady() ) {
			return;
		}
		unsubscribeFlush();
		unsubscribeFlush = null;
		flushPendingWrites();
	}, "core/editor" );
}

/**
 * Dispatches a meta write immediately if the editor is ready, or queues it for the next flush.
 * When the editor is already ready any previously queued writes are flushed together with this
 * one to minimise unnecessary state updates.
 *
 * @param {string}  metaKey    The meta key to write.
 * @param {string}  value      The value to write.
 * @param {boolean} undoIgnore When true, the write bypasses the undo stack via editEntityRecord.
 *                             Use for computed values (e.g. analysis scores) that should not
 *                             be undoable.
 *
 * @returns {void}
 */
function writeOrQueue( metaKey, value, undoIgnore = false ) {
	// All meta fields are registered with type: string. Coerce here so callers that pass
	// numeric scores (e.g. linkdex) don't trigger a REST API type-validation error.
	pendingWrites.set( metaKey, { value: String( value ), undoIgnore } );
	if ( ! isEditorReady() ) {
		scheduleFlush();
		return;
	}
	// Cancel any pending flush subscription — we are dispatching everything now.
	if ( unsubscribeFlush ) {
		unsubscribeFlush();
		unsubscribeFlush = null;
	}
	flushPendingWrites();
}

/**
 * Sets a meta value either by writing directly to the DOM element when REST meta is inactive, or via the REST API when active.
 *
 * @param {string} metaKey The meta key to write.
 * @param {HTMLElement|null} element The DOM element to write to when REST meta is inactive.
 * @param {string} value The value to write.
 * @returns {void}
 */

/**
 * Buffer for score meta writes that should not dirty the post independently.
 * Keyed by meta key; holds the latest sanitized score string.
 * Injected into the outgoing save payload by initScoreInjectMiddleware.
 */
const pendingScoreWrites = new Map();

/**
 * Mirrors the PHP sanitizer: only non-negative integers are valid; anything else becomes "0".
 *
 * @param {string} value The raw score value.
 * @returns {string} The sanitized score string.
 */
const sanitizeScore = ( value ) => {
	const parsed = parseInt( value, 10 );
	return ( Number.isInteger( parsed ) && parsed >= 0 ) ? String( parsed ) : "0";
};

/**
 * Returns true when buffering the score would be a no-op.
 *
 * Skips when the sanitized value already matches the committed meta, or when
 * the score is "0" and the committed value is "" (the register_post_meta default
 * for a score that was never persisted — semantically the same as "0").
 *
 * @param {string} metaKey   The meta key to check.
 * @param {string} sanitized The sanitized score string.
 * @returns {boolean} Whether the write should be skipped.
 */
const shouldSkipScoreWrite = ( metaKey, sanitized ) => {
	const currentValue = select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKey ] ?? "";
	return sanitized === currentValue || ( sanitized === "0" && currentValue === "" );
};

const setScoreMeta = ( metaKey, element, value ) => {
	if ( isRestMetaActive() ) {
		const sanitized = sanitizeScore( value );
		if ( ! shouldSkipScoreWrite( metaKey, sanitized ) ) {
			pendingScoreWrites.set( metaKey, sanitized );
		}
		return;
	}
	if ( element ) {
		element.value = value;
	}
};

/**
 * This class is responsible for handling the interaction with the hidden fields for the analysis.
 *
 * When `wpseoScriptData.disableMetaboxInBlockEditor` is true the hidden DOM fields are not rendered.
 * In that case getters read from the `core/editor` store and setters dispatch to it so that
 * WordPress saves the values via the REST API on post save.
 */
export default class AnalysisFields {
	/**
	 * Getter for the keyphraseElement.
	 *
	 * @returns {HTMLElement|null} The keyphraseElement.
	 */
	static get keyphraseElement() {
		return document.getElementById( window.wpseoScriptData?.isPost ? "yoast_wpseo_focuskw" : "hidden_wpseo_focuskw" );
	}

	/**
	 * Getter for the isCornerstoneElement.
	 *
	 * @returns {HTMLElement|null} The isCornerstoneElement.
	 */
	static get isCornerstoneElement() {
		return document.getElementById( window.wpseoScriptData?.isPost ? "yoast_wpseo_is_cornerstone" : "hidden_wpseo_is_cornerstone" );
	}

	/**
	 * Getter for the SEO (overall) score hidden field.
	 *
	 * @returns {HTMLElement|null} The SEO score hidden field.
	 */
	static get seoScoreElement() {
		return document.getElementById( window.wpseoScriptData?.isPost ? "yoast_wpseo_linkdex" : "hidden_wpseo_linkdex" );
	}

	/**
	 * Getter for the Readability (overall) score hidden field.
	 *
	 * @returns {HTMLElement|null} The Readability score hidden field.
	 */
	static get readabilityScoreElement() {
		return document.getElementById( window.wpseoScriptData?.isPost ? "yoast_wpseo_content_score" : "hidden_wpseo_content_score" );
	}

	/**
	 * Getter for the inclusive language (overall) score hidden field.
	 *
	 * @returns {HTMLElement|null} The inclusive language score hidden field.
	 */
	static get inclusiveLanguageScoreElement() {
		return document.getElementById( window.wpseoScriptData?.isPost ? "yoast_wpseo_inclusive_language_score" : "hidden_wpseo_inclusive_language_score" );
	}

	/**
	 * Getter for the SEO title score hidden field.
	 *
	 * @returns {HTMLElement|null} The SEO title score hidden field.
	 */
	static get seoTitleScoreElement() {
		return document.getElementById( window.wpseoScriptData?.isPost ? "yoast_wpseo_seo_title_score" : "hidden_wpseo_seo_title_score" );
	}

	/**
	 * Getter for the meta description score hidden field.
	 *
	 * @returns {HTMLElement|null} The meta description score hidden field.
	 */
	static get metaDescriptionScoreElement() {
		return document.getElementById( window.wpseoScriptData?.isPost ? "yoast_wpseo_meta_description_score" : "hidden_wpseo_meta_description_score" );
	}

	/**
	 * Setter for the keyphrase.
	 *
	 * @param {string} value The keyphrase.
	 *
	 * @returns {void}
	 */
	static set keyphrase( value ) {
		if ( isRestMetaActive() ) {
			if ( ! shouldSkipMetaWrite( metaKeyFocusKw, value ) ) {
				writeOrQueue( metaKeyFocusKw, value );
			}
			return;
		}
		if ( AnalysisFields.keyphraseElement ) {
			AnalysisFields.keyphraseElement.value = value;
		}
	}

	/**
	 * Getter for the keyphrase.
	 *
	 * @returns {string} The keyphrase.
	 */
	static get keyphrase() {
		return getMetaValue( metaKeyFocusKw, AnalysisFields.keyphraseElement, "" );
	}

	/**
	 * Setter for the isCornerstone. The element returns "true" and "false" but we should save "1" and "0".
	 *
	 * @param {boolean} value The isCornerstone.
	 *
	 * @returns {void}
	 */
	static set isCornerstone( value ) {
		if ( isRestMetaActive() ) {
			const newValue = value ? "1" : "0";
			if ( ! shouldSkipMetaWrite( metaKeyIsCornerstone, newValue ) ) {
				writeOrQueue( metaKeyIsCornerstone, newValue );
			}
			return;
		}
		if ( AnalysisFields.isCornerstoneElement ) {
			AnalysisFields.isCornerstoneElement.value = value ? "1" : "0";
		}
	}

	/**
	 * Getter for the isCornerstone. True if value = "1".
	 *
	 * @returns {boolean} The isCornerstone.
	 */
	static get isCornerstone() {
		return getMetaValue( metaKeyIsCornerstone, AnalysisFields.isCornerstoneElement, "0" ) === "1";
	}

	/**
	 * Setter for the SEO (overall) score.
	 *
	 * @param {string} value The SEO (overall) score.
	 *
	 * @returns {void}
	 */
	static set seoScore( value ) {
		setScoreMeta( metaKeyLinkdex, AnalysisFields.seoScoreElement, value );
	}

	/**
	 * Getter for the SEO (overall) score.
	 *
	 * @returns {string} The SEO (overall) score.
	 */
	static get seoScore() {
		return getMetaValue( metaKeyLinkdex, AnalysisFields.seoScoreElement, "" );
	}

	/**
	 * Setter for the Readability (overall) score.
	 *
	 * @param {string} value The Readability (overall) score.
	 *
	 * @returns {void}
	 */
	static set readabilityScore( value ) {
		setScoreMeta( metaKeyContentScore, AnalysisFields.readabilityScoreElement, value );
	}

	/**
	 * Getter for the Readability (overall) score.
	 *
	 * @returns {string} The Readability (overall) score.
	 */
	static get readabilityScore() {
		return getMetaValue( metaKeyContentScore, AnalysisFields.readabilityScoreElement, "" );
	}

	/**
	 * Setter for the inclusive language (overall) score.
	 *
	 * @param {string} value The inclusive language (overall) score.
	 *
	 * @returns {void}
	 */
	static set inclusiveLanguageScore( value ) {
		setScoreMeta( metaKeyInclusiveLanguageScore, AnalysisFields.inclusiveLanguageScoreElement, value );
	}

	/**
	 * Getter for the inclusive language (overall) score.
	 *
	 * @returns {string} The inclusive language (overall) score.
	 */
	static get inclusiveLanguageScore() {
		return getMetaValue( metaKeyInclusiveLanguageScore, AnalysisFields.inclusiveLanguageScoreElement, "" );
	}

	/**
	 * Setter for the SEO title score.
	 *
	 * @param {string} value The SEO title score.
	 *
	 * @returns {void}
	 */
	static set seoTitleScore( value ) {
		setMetaValue( metaKeySeoTitleScore, AnalysisFields.seoTitleScoreElement, value );
	}

	/**
	 * Getter for the SEO title score.
	 *
	 * @returns {string} The SEO title score.
	 */
	static get seoTitleScore() {
		return getMetaValue( metaKeySeoTitleScore, AnalysisFields.seoTitleScoreElement, "" );
	}

	/**
	 * Setter for the meta description score.
	 *
	 * @param {string} value The meta description score.
	 *
	 * @returns {void}
	 */
	static set metaDescriptionScore( value ) {
		setMetaValue( metaKeyMetaDescriptionScore, AnalysisFields.metaDescriptionScoreElement, value );
	}

	/**
	 * Getter for the meta description score.
	 *
	 * @returns {string} The meta description score.
	 */
	static get metaDescriptionScore() {
		return getMetaValue( metaKeyMetaDescriptionScore, AnalysisFields.metaDescriptionScoreElement, "" );
	}
}

/**
 * Returns true when the request method is PUT or POST.
 *
 * @param {Object} options The apiFetch request options.
 * @returns {boolean} Whether the method is a save method.
 */
function isSaveMethod( options ) {
	const method = options.method?.toUpperCase() ?? "";
	return method === "PUT" || method === "POST";
}

/**
 * Returns the REST base and post ID for the currently edited post.
 *
 * @returns {{restBase: string|undefined, postId: number|undefined}} The REST base and post ID.
 */
function getCurrentPostRestContext() {
	const editor   = select( "core/editor" );
	const postType = editor?.getCurrentPostType();
	const postId   = editor?.getCurrentPostId();
	const restBase = select( "core" ).getPostType( postType )?.rest_base;
	return { restBase, postId };
}

/**
 * Returns true when the path targets the given post's REST endpoint (not an autosave).
 *
 * @param {string} path     The request path.
 * @param {string} restBase The post type REST base.
 * @param {number} postId   The post ID.
 * @returns {boolean} Whether the path is a save request for this post.
 */
function matchesPostEndpoint( path, restBase, postId ) {
	const pattern = new RegExp( `/${ restBase }/${ postId }(?:\\?|$)` );
	return pattern.test( path ) && ! path.includes( "autosave" );
}

/**
 * Returns true when the request is a save (PUT/POST) to the current post's REST endpoint
 * and not an autosave sub-resource.
 *
 * @param {Object} options The apiFetch request options.
 * @returns {boolean} Whether scores should be injected into this request.
 */
function isScoreSaveRequest( options ) {
	if ( ! isSaveMethod( options ) ) {
		return false;
	}
	const { restBase, postId } = getCurrentPostRestContext();
	if ( ! restBase || ! postId ) {
		return false;
	}
	return matchesPostEndpoint( options.path ?? "", restBase, postId );
}

/**
 * apiFetch middleware that injects buffered score writes into post save requests.
 *
 * @param {Object}   options The apiFetch request options.
 * @param {Function} next    The next middleware in the chain.
 * @returns {*} The apiFetch response.
 */
function scoreInjectMiddleware( options, next ) {
	if ( pendingScoreWrites.size === 0 || ! isScoreSaveRequest( options ) ) {
		return next( options );
	}
	const scores = Object.fromEntries( pendingScoreWrites );
	pendingScoreWrites.clear();
	return next( {
		...options,
		data: { ...options.data, meta: { ...( options.data?.meta ?? {} ), ...scores } },
	} );
}

/**
 * Registers the score inject middleware with apiFetch.
 *
 * Detecting save via a store subscriber has a timing problem: Gutenberg's save
 * action reads entity edits before the subscriber fires, so any write at that
 * moment lands as a pending edit after the save rather than inside the payload.
 * The middleware approach sidesteps this by operating at the HTTP layer: it
 * intercepts the PUT/POST to the post endpoint and merges the buffered scores
 * into the request body before it goes out. Gutenberg's normal response handling
 * then commits the scores to the core store, so subsequent analysis runs see no
 * difference and skip — no separate PATCH or manual receiveEntityRecords needed.
 *
 * @returns {void}
 */
function initScoreInjectMiddleware() {
	apiFetch.use( scoreInjectMiddleware );
}

// Always register — the buffer is only populated when isRestMetaActive() is true
// (inside setScoreMeta), so the middleware is a safe no-op in classic-editor mode.
initScoreInjectMiddleware();
