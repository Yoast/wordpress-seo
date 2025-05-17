/* External dependencies */
import { useBlockProps } from "@wordpress/block-editor";
import { registerBlockType } from "@wordpress/blocks";

/* Internal dependencies */
import block from "./block.json";
import HowTo from "./components/HowTo";
import legacy from "./legacy";

registerBlockType( block, {
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 * @returns {Component} The editor component.
	 */
	edit: ( { attributes, setAttributes, className } ) => {
		const blockProps = useBlockProps();

		// Because setAttributes is quite slow right after a block has been added we fake having a single step.
		if ( ! attributes.steps || attributes.steps.length === 0 ) {
			attributes.steps = [ { id: HowTo.generateId( "how-to-step" ), name: [], text: [] } ];
		}

		return <div { ...blockProps }>
			<HowTo { ...{ attributes, setAttributes, className } } />
		</div>;
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 * @returns {Component} The display component.
	 */
	save: ( { attributes } ) => {
		const blockProps = useBlockProps.save( attributes );

		return <HowTo.Content { ...blockProps } />;
	},

	deprecated: [
		{
			attributes: block.attributes,
			save: legacy.v11_4,
		},
		{
			attributes: block.attributes,
			save: legacy.v8_2,
		},
	],
} );
