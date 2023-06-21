import { addFilter } from "@wordpress/hooks";
import { select } from "@wordpress/data";
import { Fill } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Initializes the AI Generator upsell.
*
* @returns {void}
*/
const initializeAiGenerator = () => {
	const isPremium = select( "yoast-seo/editor" ).getIsPremium();
	addFilter(
		"yoast.replacementVariableEditor.additionalButtons",
		"yoast/yoast-seo-premium/AiGenerator",
		( buttons, { fieldId } ) => {
			if ( ! isPremium ) {
				buttons.push(
					<Fill name={ `yoast.replacementVariableEditor.additionalButtons.${ fieldId }` }>
						<button
							type="button"
							id={ `yst-replacevar__use-ai-button__${ fieldId }` }
							className="yst-replacevar__use-ai-button"
							onClick={ () => {} }
						>
							{ __( "Use AI", "wordpress-seo-premium" ) }
						</button>
					</Fill>
				);
			}

			return buttons;
		}
	);
};

export default initializeAiGenerator;
