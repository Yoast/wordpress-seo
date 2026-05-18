import { createBlock, registerBlockType, getBlockType } from "@wordpress/blocks";
import { useBlockProps } from "@wordpress/block-editor";
import { useEffect, useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { ContentSuggestionBlock } from "../components/content-suggestion-block";

// Both the `ai-content-planner` and `block-editor` webpack bundles load this
// module independently (each has its own module registry), so the call below
// can execute twice on the same page. Guard against the duplicate warning.
if ( ! getBlockType( "yoast-seo/content-suggestion" ) ) {
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
}
