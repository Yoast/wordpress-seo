import { ReactComponent as Yoast } from "../../images/yoast.svg";
import { __ } from "@wordpress/i18n";

/**
 * The introduction component for the editor.
 *
 * @param {Object} props The component props.
 * @param {boolean} props.withPromptForContentSuggestions Whether to show the prompt for content suggestions.
 * @returns {JSX.Element} The editor introduction component.
 */
export const EditorIntro = ( { withPromptForContentSuggestions } ) => {
	return <div className="yst-px-4 yst-pt-4">
		<Yoast className="yst-w-14" />
		<p className="yst-text-slate-600 yst-mb-0 yst-mt-3">
			{ withPromptForContentSuggestions ? __( "Optimize your content for discovery or get new content suggestions.", "wordpress-seo" )
				: __( "Optimize your content for discovery.", "wordpress-seo" ) }
		</p>
	</div>;
};
