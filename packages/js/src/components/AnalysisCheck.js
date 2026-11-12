import { SvgIcon } from "@yoast/components";
import { getIconForScore } from "./contentAnalysis/mapResults";

/**
 * Renders a pre-publish score in the from of an icon, label
 * and the score value written out.
 *
 * @param {Object} props Component props.
 * @param {("good"|"ok"|"bad"|"loading")} props.score The score, as a string.
 * @param {string} props.label The score's label, for example "SEO Analysis".
 * @param {string} [props.scoreValue=""] The score's value, written out for screen readers, for example "Needs improvement".
 *
 * @constructor
 */
export default function AnalysisCheck( { score, label, scoreValue = "" } ) {
	return <div className="yoast-analysis-check">
		<SvgIcon { ...getIconForScore( score ) } />
		<span> { label } { scoreValue && <strong>{ scoreValue }</strong> }</span>
	</div>;
}
