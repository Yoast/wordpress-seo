import { createBlock, registerBlockType } from "@wordpress/blocks";
import { useSelect, useDispatch, register } from "@wordpress/data";
import { useEffect, useRef } from "@wordpress/element";
import { registerPlugin } from "@wordpress/plugins";
import { useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import "./block";
import { store } from "./store";
import { ContentSuggestionBlock } from "./components/content-suggestion-block";

register( store );

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
 * Editor plugin that auto-inserts the Content Planner Banner block
 * after the first paragraph on new posts.
 *
 * Also ensures a paragraph block exists when the canvas is empty,
 * so the banner has a block to follow.
 *
 * @returns {null} Renders nothing.
 */
export const ContentPlannerEditorPlugin = () => {
	const hasInserted = useRef( false );

	const { isNewPost, postType, blocks } = useSelect( select => ( {
		isNewPost: select( "core/editor" ).isEditedPostNew(),
		postType: select( "core/editor" ).getCurrentPostType(),
		blocks: select( "core/block-editor" ).getBlocks(),
	} ), [] );

	const { insertBlock } = useDispatch( "core/block-editor" );

	useEffect( () => {
		if ( hasInserted.current || ! isNewPost || postType !== "post" ) {
			return;
		}

		hasInserted.current = insertBannerAfterFirstParagraph( blocks, insertBlock );
	}, [ blocks, isNewPost, postType, insertBlock ] );

	return null;
};

registerBlockType( "yoast-seo/content-suggestion", {
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
		const blockProps = useBlockProps();
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
