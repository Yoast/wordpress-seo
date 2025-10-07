import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";

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

    return <Fragment>
        <h4>{ __( "AI Generate Suggestions", "wordpress-seo" ) }</h4>
        <p>{ __( "Your post is using default SEO data. Consider using AI Generate to create custom titles and descriptions.", "wordpress-seo" ) }</p>
    </Fragment>;
}

AiGenerateChecklist.propTypes = {
    showAiGenerateCheck: PropTypes.bool.isRequired,
};