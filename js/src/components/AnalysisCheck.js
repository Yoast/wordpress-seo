import { SvgIcon } from "@yoast/components";
import { getIconForScore } from "./contentAnalysis/mapResults";
import * as PropTypes from "prop-types";

/**
 * Renders a pre-publish score in the from of an icon, label
 * and the score value written out.
 *
 * @param {"good"|"ok"|"bad"|"loading"} score The score, as a string.
 * @param {string} label The score's label, for example "SEO Analysis".
 * @param {string} scoreValue? The score's value, written out for screen readers, for example "Needs improvement".
 *
 * @constructor
 */
export default function AnalysisCheck( { score, label, scoreValue } ) {
	return <div>
		<SvgIcon { ...getIconForScore( score ) } />
		<span> { label } { scoreValue && <strong>{ scoreValue }</strong> }</span>
	</div>;
}

AnalysisCheck.propTypes = {
	score: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	scoreValue: PropTypes.string,
};

AnalysisCheck.defaultProps = {
	scoreValue: "",
};
