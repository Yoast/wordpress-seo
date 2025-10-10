import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import { applyFilters } from "@wordpress/hooks";
import { Slot } from "@wordpress/components";

/**
 * Renders the AI Generate checklist.
 *
 * @param {Object} props The component props.
 * @param {boolean} props.showAiGenerateCheck Whether to show the AI generate check.
 *
 * @returns {wp.Element} The AI Generate checklist.
 */
export default function AiGenerateChecklist( {
    showAiGenerateCheck,
} ) {
    if ( ! showAiGenerateCheck ) {
        return null;
    }

	const titleButtons = applyFilters( "yoast.replacementVariableEditor.additionalButtons", [], { fieldId: 'yoast-google-preview-pre-publish', type: 'title' } );
	const descButtons = applyFilters( "yoast.replacementVariableEditor.additionalButtons", [], { fieldId: 'yoast-google-preview-pre-publish', type: 'description' } );

    return <Fragment>
        <h4>{ __( "AI Generate Suggestions", "wordpress-seo" ) }</h4>
        <p>{ __( "Your recent posts are using default SEO data. Consider adding a custom SEO title and meta description in this one. You can use AI Generate for quicker results.", "wordpress-seo" ) }</p>
		<Slot name={ `yoast.replacementVariableEditor.additionalButtons.yoast-google-preview-pre-publish` } />
		{ titleButtons.map( ( button, index ) => (
			<Fragment key={ `additional-button-pre-publish-sidebar-title-${ index }` }>
				{ button }
			</Fragment>
		) ) }
		{ descButtons.map( ( button, index ) => (
			<Fragment key={ `additional-button-pre-publish-sidebar-description-${ index }` }>
				{ button }
			</Fragment>
		) ) }
    </Fragment>;
}

AiGenerateChecklist.propTypes = {
    showAiGenerateCheck: PropTypes.bool.isRequired,
};