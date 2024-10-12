import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import PropTypes from "prop-types";
import { useLayoutEffectImpl } from "../shared/use-layout-effect-impl";

/**
 * Plugin to listen for text content changes in the editor.
 *
 * @param {function} [onChange] Callback function for editor text content changes.
 *
 * @returns {null} Null.
 */
export const OnTextContentChangePlugin = ( { onChange } ) => {
	const [ editor ] = useLexicalComposerContext();

	useLayoutEffectImpl( () => {
		if ( onChange ) {
			return editor.registerTextContentListener( onChange );
		}
	}, [ editor, onChange ] );

	return null;
};

OnTextContentChangePlugin.propTypes = {
	onChange: PropTypes.func,
};
OnTextContentChangePlugin.defaultProps = {
	onChange: null,
};
