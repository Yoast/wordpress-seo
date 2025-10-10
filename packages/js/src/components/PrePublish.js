import PropTypes from "prop-types";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { LocationProvider } from "@yoast/externals/contexts";

import AnalysisChecklist from "./AnalysisChecklist";
import AiGenerateChecklist from "./AiGenerateChecklist";

/**
 * Renders the analysis checklist.
 *
 * @returns {wp.Element} The PrePublish panel.
 */
export default function PrePublish( {
    checklist,
    onClick,
    showAiGenerateCheck,
} ) {
    let intro;

    const perfectScore = checklist.every( item => item.score === "good" );

    if ( perfectScore ) {
        intro = __( "We've analyzed your post. Everything looks good. Well done!", "wordpress-seo" );
    } else {
        intro = __( "We've analyzed your post. There is still room for improvement!", "wordpress-seo" );
    }

    return <Fragment>
		<LocationProvider value="pre-publish">
            <p>{ intro }</p>
            <AnalysisChecklist checklist={ checklist } onClick={ onClick } />
            <AiGenerateChecklist showAiGenerateCheck={ showAiGenerateCheck } />
		</LocationProvider>
    </Fragment>;
}

PrePublish.propTypes = {
    checklist: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    showAiGenerateCheck: PropTypes.bool.isRequired,
};
