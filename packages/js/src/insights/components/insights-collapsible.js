import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { get } from "lodash";
import PropTypes from "prop-types";
import MetaboxCollapsible from "../../components/MetaboxCollapsible";
import EstimatedReadingTime from "./estimated-reading-time";
import FleschReadingEase from "./flesch-reading-ease";
import ProminentWords from "./prominent-words";
import WordCount from "./word-count";

/**
 * Insights collapsible component.
 * @param {string} location The location of this modal.
 * @returns {JSX.Element} The element.
 */
const InsightsCollapsible = ( { location } ) => {
	const isPost = useMemo( () => get( window, "wpseoScriptData.isPost", false ), [] );

	return (
		<MetaboxCollapsible
			title={ __( "Insights", "wordpress-seo" ) }
			id={ `yoast-insights-collapsible-${ location }` }
			className="yoast-insights"
		>
			<ProminentWords location={ location } />
			{ isPost && <div>
				<div className="yoast-insights-row">
					<FleschReadingEase />
				</div>
				<div className="yoast-insights-row yoast-insights-row--columns">
					<EstimatedReadingTime />
					<WordCount />
				</div>
			</div> }
		</MetaboxCollapsible>
	);
};

InsightsCollapsible.propTypes = {
	location: PropTypes.string,
};

InsightsCollapsible.defaultProps = {
	location: "metabox",
};

export default InsightsCollapsible;
