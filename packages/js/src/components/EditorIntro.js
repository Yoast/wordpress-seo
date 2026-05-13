import { ReactComponent as Yoast } from "../../images/yoast.svg";
import { __ } from "@wordpress/i18n";

/**
 * Editor intro text.
 *
 * @param {Object} props The component props.
 * @param {boolean} props.withPromptForContentSuggestions Whether to show the prompt for content suggestions.
 * @param {string} props.className Additional class names to apply to the component.
 * @returns {JSX.Element} The editor introduction text component.
 */
export const EditorIntroText = ( { withPromptForContentSuggestions, className } ) => {
	return <p className={ classNames( "yst-text-slate-600 yst-my-3", className ) }>
		{ withPromptForContentSuggestions ? __( "Optimize your content for discovery or get new content suggestions.", "wordpress-seo" )
			: __( "Optimize your content for discovery.", "wordpress-seo" ) }
	</p>;
};

/**
 * The introduction component for the editor.
 *
 * @param {Object} props The component props.
 * @param {string} props.children The children to render inside the component.
 * @returns {JSX.Element} The editor introduction component.
 */
export const EditorIntro = ( { children } ) => {
	return <div className="yst-p-4">
		<Yoast className="yst-w-14 yst-text-primary-500" />
		{ children }
	</div>;
};


