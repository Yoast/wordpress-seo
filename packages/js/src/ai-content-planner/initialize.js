import { createBlock, registerBlockType } from "@wordpress/blocks";
import { useSelect, useDispatch, select as wpSelect } from "@wordpress/data";
import { useEffect, useRef, useCallback } from "@wordpress/element";
import { count } from "@wordpress/wordcount";
import { registerPlugin } from "@wordpress/plugins";
import { useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import domReady from "@wordpress/dom-ready";
import { get } from "lodash";
import FeatureModal from "./containers/feature-modal";
import { CONTENT_PLANNER_STORE, FEATURE_MODAL_STATUS } from "./constants";
import "./block";
import { registerStore } from "./store";
import { CONTENT_SUGGESTIONS_NAME } from "./store/content-suggestions";
import { ContentSuggestionBlock } from "./components/content-suggestion-block";

/**
 * Inserts a Content Planner Banner block after the first paragraph in the editor.
 *
 * If the canvas is empty, inserts a paragraph block first. Returns true when
 * the banner has been inserted or was already present.
 *
 * @param {Array}    blocks      The current list of blocks in the editor.
 * @param {Function} insertBlock The block editor insertBlock dispatch function.
 * @returns {boolean} Whether the banner insertion is complete.
 */
export function insertBannerAfterFirstParagraph( blocks, insertBlock ) {
	const hasBanner = blocks.some( b => b.name === "yoast/content-planner-banner" );
	if ( hasBanner ) {
		return true;
	}

	// If canvas is empty, insert a paragraph first; the effect will re-run.
	if ( blocks.length === 0 ) {
		// eslint-disable-next-line no-undefined
		insertBlock( createBlock( "core/paragraph" ), 0, undefined, false );
		return false;
	}

	const firstParagraphIndex = blocks.findIndex( b => b.name === "core/paragraph" );
	if ( firstParagraphIndex === -1 ) {
		return false;
	}

	// eslint-disable-next-line no-undefined
	insertBlock( createBlock( "yoast/content-planner-banner" ), firstParagraphIndex + 1, undefined, false );
	return true;
}

/**
 * Removes the Content Planner Banner block from the editor if present.
 *
 * @param {Function} removeBlock The block editor removeBlock dispatch function.
 * @returns {void}
 */
function removeBannerBlock( removeBlock ) {
	const blocks = wpSelect( "core/block-editor" ).getBlocks();
	const banner = blocks.find( b => b.name === "yoast/content-planner-banner" );
	if ( banner ) {
		removeBlock( banner.clientId );
	}
}

/**
 * Editor plugin that auto-inserts the Content Planner Banner block
 * after the first paragraph on new posts and renders the shared
 * FeatureModal controlled by the content planner store.
 *
 * @returns {JSX.Element} The FeatureModal element, with visibility controlled by the isOpen prop.
 */
export const ContentPlannerEditorPlugin = () => {
	const hasInserted = useRef( false );

	const { isNewPost, postType, blocks, isModalOpen, skipApprove, isPremium, isEmptyPost, upsellLink } = useSelect( select => {
		const content = select( "core/editor" ).getEditedPostContent();
		return {
			isNewPost: select( "core/editor" ).isEditedPostNew(),
			postType: select( "core/editor" ).getCurrentPostType(),
			blocks: select( "core/block-editor" ).getBlocks(),
			isModalOpen: select( CONTENT_PLANNER_STORE ).selectIsModalOpen(),
			skipApprove: select( CONTENT_PLANNER_STORE ).selectShouldSkipApprove(),
			isPremium: select( "yoast-seo/editor" ).getIsPremium(),
			isEmptyPost: count( content, "words", {} ) === 0,
			upsellLink: select( "yoast-seo/editor" ).selectLink( "https://yoa.st/content-planner-approve-modal" ),
		};
	}, [] );

	const { insertBlock, removeBlock } = useDispatch( "core/block-editor" );
	const { closeModal } = useDispatch( CONTENT_PLANNER_STORE );

	useEffect( () => {
		if ( hasInserted.current || ! isNewPost || postType !== "post" ) {
			return;
		}

		hasInserted.current = insertBannerAfterFirstParagraph( blocks, insertBlock );
	}, [ blocks, isNewPost, postType, insertBlock ] );

	const handleClose = useCallback( () => {
		closeModal();
	}, [ closeModal ] );

	const handleAddOutline = useCallback( () => {
		removeBannerBlock( removeBlock );
	}, [ removeBlock ] );

	return (
		<FeatureModal
			isOpen={ isModalOpen }
			onClose={ handleClose }
			isEmptyPost={ isEmptyPost }
			isPremium={ isPremium }
			upsellLink={ upsellLink }
			onAddOutline={ handleAddOutline }
			initialStatus={ skipApprove ? FEATURE_MODAL_STATUS.contentSuggestionsLoading : null }
		/>
	);
};

registerBlockType( "yoast-seo/content-suggestion", {
	apiVersion: 3,
	title: __( "Content Suggestion", "wordpress-seo" ),
	category: "text",
	supports: { inserter: false },
	transforms: {
		to: [
			{
				type: "block",
				blocks: [ "core/list" ],
				transform: ( { suggestions } ) =>
					createBlock(
						"core/list",
						{},
						suggestions.map( ( suggestion ) => createBlock( "core/list-item", { content: suggestion } ) )
					),
			},
		],
	},
	attributes: {
		title: { type: "string", "default": "" },
		suggestions: { type: "array", items: { type: "string" }, "default": [] },
	},
	edit: ( { attributes } ) => {
		const ref = useRef( null );
		const blockProps = useBlockProps( { ref } );

		useEffect( () => {
			const ownerDoc = ref.current?.ownerDocument ?? document;
			if ( ownerDoc === window.document || ownerDoc.getElementById( "yoast-seo-tailwind-css" ) ) {
				return;
			}
			const mainLink = window.document.getElementById( "yoast-seo-tailwind-css" );
			if ( ! mainLink ) {
				return;
			}
			const link = ownerDoc.createElement( "link" );
			link.id = "yoast-seo-tailwind-css";
			link.rel = "stylesheet";
			link.href = mainLink.href;
			ownerDoc.head.appendChild( link );
		}, [] );

		return (
			<div { ...blockProps }>
				<ContentSuggestionBlock contentNotes={ attributes.suggestions } />
			</div>
		);
	},
	save: () => null,
} );

/**
 * Initializes the Content Planner feature.
 *
 * Registers the editor plugin that handles auto-insertion of the
 * Content Planner Banner block on new posts.
 *
 * @returns {void}
 */
export default function initContentPlanner() {
	registerPlugin( "yoast-content-planner", { render: ContentPlannerEditorPlugin } );
}

domReady( () => {
	registerStore( {
		[ CONTENT_SUGGESTIONS_NAME ]: {
			endpoint: get( window, "wpseoContentPlanner.endpoints.contentPlanner", "" ),
		},
	} );
} );
