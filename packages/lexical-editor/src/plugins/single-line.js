import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
	COMMAND_PRIORITY_HIGH,
	INSERT_LINE_BREAK_COMMAND,
	INSERT_PARAGRAPH_COMMAND,
	INSERT_TAB_COMMAND,
	LineBreakNode,
	ParagraphNode,
	TabNode,
} from "lexical";
import { $getAllNodes } from "../shared/get-all-nodes";
import { useLayoutEffectImpl } from "../shared/use-layout-effect-impl";

/**
 * Plugin to ensure that the editor only contains a single line.
 * @returns {null} Null.
 */
export const SingleLinePlugin = () => {
	const [ editor ] = useLexicalComposerContext();

	useLayoutEffectImpl( () => {
		return mergeRegister(
			// Disallow line breaks.
			editor.registerNodeTransform( LineBreakNode, node => node.remove() ),
			editor.registerCommand( INSERT_LINE_BREAK_COMMAND, () => true, COMMAND_PRIORITY_HIGH ),
			// Disallow paragraphs. Except the first one, because text nodes are always wrapped in a paragraph.
			editor.registerNodeTransform( ParagraphNode, node => editor.getEditorState().read( () => {
				const paragraphs = $getAllNodes( { type: ParagraphNode.getType() } );
				if ( paragraphs.length <= 1 ) {
					return;
				}
				if ( paragraphs.length === 2 ) {
					// Remove the new paragraph.
					node.remove();
					return;
				}
				// Remove all paragraphs except the first one.
				for ( let i = 1; i < paragraphs.length; i++ ) {
					paragraphs[ i ].remove();
				}
			} ) ),
			editor.registerCommand( INSERT_PARAGRAPH_COMMAND, () => true, COMMAND_PRIORITY_HIGH ),
			// Disallow tabs.
			editor.registerNodeTransform( TabNode, node => node.remove() ),
			editor.registerCommand( INSERT_TAB_COMMAND, () => true, COMMAND_PRIORITY_HIGH ),
		);
	}, [ editor ] );

	return null;
};
