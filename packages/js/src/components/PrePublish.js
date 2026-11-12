import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { LocationProvider } from "@yoast/externals/contexts";

import AnalysisChecklist from "./AnalysisChecklist";
import DefaultSeoDataAlert from "./DefaultSeoDataAlert";

/**
 * Renders the analysis checklist.
 *
 * @param {Object} props Component props.
 * @param {Array} props.checklist The analysis checks to render in the checklist.
 * @param {Function} props.onClick Callback for the "Improve your post" button.
 * @param {Object} props.isSeoDataDefault Whether SEO titles and meta descriptions are default.
 *
 * @returns {wp.Element} The PrePublish panel.
 */
export default function PrePublish( {
	checklist,
	onClick,
	isSeoDataDefault,
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
			<DefaultSeoDataAlert isSeoDataDefault={ isSeoDataDefault } />
		</LocationProvider>
	</Fragment>;
}
