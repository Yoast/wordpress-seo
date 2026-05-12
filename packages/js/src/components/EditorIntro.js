import { ReactComponent as Yoast } from "../../images/yoast.svg";
import { __ } from "@wordpress/i18n";

/**
 * The introduction component for the editor.
 *
 * @param {Object} props The component props.
 * @param {boolean} props.withPromptForContentSuggestions Whether to show the prompt for content suggestions.
 * @param {string} props.children The children to render inside the component.
 * @returns {JSX.Element} The editor introduction component.
 */
export const EditorIntro = ( { withPromptForContentSuggestions, children } ) => {
	return <div className="yst-px-4 yst-pt-4">
		<Yoast className="yst-w-14 yst-text-primary-500" />
		{ children }
		<p className="yst-text-slate-600 yst-mb-0 yst-mt-3">
			{ withPromptForContentSuggestions ? __( "Optimize your content for discovery or get new content suggestions.", "wordpress-seo" )
				: __( "Optimize your content for discovery.", "wordpress-seo" ) }
		</p>
	</div>;
};
