import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { COMMAND_PRIORITY_HIGH, FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND } from "lexical";
import { useLayoutEffectImpl } from "../shared/use-layout-effect-impl";

/**
 * Plugin to "remove" formatting commands.
 * @returns {null} Null.
 */
export const NoFormattingPlugin = () => {
	const [ editor ] = useLexicalComposerContext();

	useLayoutEffectImpl( () => {
		return mergeRegister(
			editor.registerCommand( FORMAT_ELEMENT_COMMAND, () => true, COMMAND_PRIORITY_HIGH ),
			editor.registerCommand( FORMAT_TEXT_COMMAND, () => true, COMMAND_PRIORITY_HIGH ),
		);
	}, [ editor ] );

	return null;
};
