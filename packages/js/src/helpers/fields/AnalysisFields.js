import { dispatch, select, subscribe } from "@wordpress/data";
import {
	metaKeyFocusKw,
	metaKeyIsCornerstone,
	metaKeyLinkdex,
	metaKeyContentScore,
	metaKeyInclusiveLanguageScore,
} from "../../shared-admin/constants";

import isRestMetaActive, { shouldSkipMetaWrite } from "./is-rest-meta-active";

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
// Keyed by meta key so that rapid successive writes for the same key collapse to the last value.
const pendingWrites = new Map();
let unsubscribeFlush = null;

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
		if ( pendingWrites.size === 0 ) {
			return;
		}
		const meta = Object.fromEntries( pendingWrites );
		pendingWrites.clear();
		dispatch( "core/editor" ).editPost( { meta } );
	}, "core/editor" );
}

/**
 * Dispatches a meta write immediately if the editor is ready, or queues it for the next flush.
 * When the editor is already ready any previously queued writes are flushed together with this
 * one in a single editPost call to minimise unnecessary state updates.
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
	pendingWrites.set( metaKey, String( value ) );
	if ( ! isEditorReady() ) {
		scheduleFlush();
		return;
	}
	// Cancel any pending flush subscription — we are dispatching everything now.
	if ( unsubscribeFlush ) {
		unsubscribeFlush();
		unsubscribeFlush = null;
	}
	const meta = Object.fromEntries( pendingWrites );
	pendingWrites.clear();
	if ( undoIgnore ) {
		const postType = select( "core/editor" ).getCurrentPostType();
		const postId = select( "core/editor" ).getCurrentPostId();
		dispatch( "core" ).editEntityRecord( "postType", postType, postId, { meta }, { undoIgnore: true } );
	} else {
		dispatch( "core/editor" ).editPost( { meta } );
	}
}

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
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyFocusKw ] ?? "";
		}
		return AnalysisFields.keyphraseElement?.value ?? "";
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
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyIsCornerstone ] === "1";
		}
		return AnalysisFields.isCornerstoneElement?.value === "1";
	}

	/**
	 * Setter for the SEO (overall) score.
	 *
	 * @param {string} value The SEO (overall) score.
	 *
	 * @returns {void}
	 */
	static set seoScore( value ) {
		if ( isRestMetaActive() ) {
			writeOrQueue( metaKeyLinkdex, value, true );
			return;
		}
		if ( AnalysisFields.seoScoreElement ) {
			AnalysisFields.seoScoreElement.value = value;
		}
	}

	/**
	 * Getter for the SEO (overall) score.
	 *
	 * @returns {string} The SEO (overall) score.
	 */
	static get seoScore() {
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyLinkdex ] ?? "";
		}
		return AnalysisFields.seoScoreElement?.value ?? "";
	}

	/**
	 * Setter for the Readability (overall) score.
	 *
	 * @param {string} value The Readability (overall) score.
	 *
	 * @returns {void}
	 */
	static set readabilityScore( value ) {
		if ( isRestMetaActive() ) {
			writeOrQueue( metaKeyContentScore, value, true );
			return;
		}
		if ( AnalysisFields.readabilityScoreElement ) {
			AnalysisFields.readabilityScoreElement.value = value;
		}
	}

	/**
	 * Getter for the Readability (overall) score.
	 *
	 * @returns {string} The Readability (overall) score.
	 */
	static get readabilityScore() {
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyContentScore ] ?? "";
		}
		return AnalysisFields.readabilityScoreElement?.value ?? "";
	}

	/**
	 * Setter for the inclusive language (overall) score.
	 *
	 * @param {string} value The inclusive language (overall) score.
	 *
	 * @returns {void}
	 */
	static set inclusiveLanguageScore( value ) {
		if ( isRestMetaActive() ) {
			writeOrQueue( metaKeyInclusiveLanguageScore, value, true );
			return;
		}
		if ( AnalysisFields.inclusiveLanguageScoreElement ) {
			AnalysisFields.inclusiveLanguageScoreElement.value = value;
		}
	}

	/**
	 * Getter for the inclusive language (overall) score.
	 *
	 * @returns {string} The inclusive language (overall) score.
	 */
	static get inclusiveLanguageScore() {
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyInclusiveLanguageScore ] ?? "";
		}
		return AnalysisFields.inclusiveLanguageScoreElement?.value ?? "";
	}
}
