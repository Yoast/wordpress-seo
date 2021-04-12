import { createElement } from "@wordpress/element";
import TextareaAutosize from "react-autosize-textarea";
import { Inserter } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { dispatch } from "@wordpress/data";

/**
 * Properties for the BlockAppender.
 */
export interface BlockAppenderProps {
	clientId: string;
	label: string;
}

/**
 * Block Appender for adding an inner block to a schema block.
 *
 * @param clientId The id of the parent block in which a block should be added when using the appender.
 * @param label A string
 *
 * @constructor
 */
export default function BlockAppender( { clientId, label }: BlockAppenderProps ) {
	const { insertDefaultBlock, startTyping } = dispatch(
		"core/block-editor",
	);

	/**
	 * Function called when a block is appended.
	 */
	const onAppend = () => {
		insertDefaultBlock( {}, clientId );
		startTyping();
	};

	/* The appender "button" is in-fact a text field so as to support
	 * transitions by WritingFlow occurring by arrow key press. WritingFlow
	 * only supports tab transitions into text fields and to the block focus
	 * boundary.
	 *
	 * See: https://github.com/WordPress/gutenberg/issues/4829#issuecomment-374213658
	 */

	return (
		<div
			data-root-client-id={ clientId || "" }
			className="wp-block block-editor-default-block-appender"
		>
			<TextareaAutosize
				role="button"
				aria-label={ __( "Add block", "yoast-schema-blocks" ) }
				className="block-editor-default-block-appender__content"
				readOnly={ true }
				onFocus={ onAppend }
				value={ label }
			/>
			<Inserter
				rootClientId={ clientId }
				position="bottom right"
			/>
		</div>
	);
}
