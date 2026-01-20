/* External dependencies */
import { useBlockProps } from "@wordpress/block-editor";
import { registerBlockType } from "@wordpress/blocks";

/* Internal dependencies */
import block from "./block.json";
import Faq from "./components/FAQ";
import legacy from "./legacy";

registerBlockType( block, {
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/
	 * @returns {JSX.Element} The editor component.
	 */
	edit: ( { attributes, setAttributes, className } ) => {
		const blockProps = useBlockProps();

		// Because setAttributes is quite slow right after a block has been added we fake having a single question.
		if ( ! attributes.questions || attributes.questions.length === 0 ) {
			attributes.questions = [ { id: Faq.generateId( "faq-question" ), question: "", answer: "", images: [] } ];
		}

		return <div { ...blockProps }>
			<Faq { ...{ attributes, setAttributes, className } } />
		</div>;
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/
	 * @returns {JSX.Element} The display component.
	 */
	save: ( { attributes } ) => {
		const blockProps = useBlockProps.save( attributes );

		return <Faq.Content { ...blockProps } />;
	},

	deprecated: [
		// Legacy versions to support loading and migrating old block data when the question/answer were stored as arrays.
		{
			attributes: block.attributes,
			save: legacy.v26_9.legacySave,
			migrate: legacy.v26_9.migrateToStringFormat,
			isEligible: legacy.v26_9.needsMigration,
		},
		{
			attributes: block.attributes,
			save: legacy.v13_1,
		},
	],
} );

