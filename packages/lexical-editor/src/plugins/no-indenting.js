import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { COMMAND_PRIORITY_HIGH, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND } from "lexical";
import { useLayoutEffectImpl } from "../shared/use-layout-effect-impl";

/**
 * Plugin to "remove" in/outdenting commands.
 * @returns {null} Null.
 */
export const NoIndentingPlugin = () => {
	const [ editor ] = useLexicalComposerContext();

	useLayoutEffectImpl( () => {
		return mergeRegister(
			editor.registerCommand( INDENT_CONTENT_COMMAND, () => true, COMMAND_PRIORITY_HIGH ),
			editor.registerCommand( OUTDENT_CONTENT_COMMAND, () => true, COMMAND_PRIORITY_HIGH ),
		);
	}, [ editor ] );

	return null;
};
