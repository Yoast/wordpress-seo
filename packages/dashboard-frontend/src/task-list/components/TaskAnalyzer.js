import { ScoreIcon } from "@yoast/ui-library";

/**
 * The TaskAnalyzer component displays the analysis results for a task, such as SEO or readability analysis.
 *
 * @param {string} type The type of the analyzer result, e.g. "seo", "readability".
 * @param {string} label The label for the analyzer result, e.g. "SEO Analysis".
 * @param {string} score The score of the analyzer result, e.g. "good", "bad", "ok".
 * @param {string} scoreLabel The label for the score, e.g. "Good".
 * @param {string} details The details of the analyzer result.
 * @returns {JSX.Element} The TaskAnalyzer component.
 */
export const TaskAnalyzer = ( { type, label, score, scoreLabel, details } ) => {
	return <div className="yst-flex yst-bg-slate-50 yst-border yst-border-slate-200 yst-rounded-md yst-w-full yst-p-4 yst-gap-4 yst-justify-between yst-mb-5">
		{ type === "score" && <ScoreIcon score={ score } className="yst-mt-0.5" /> }
		<div className="yst-flex-grow">
			<div className="yst-text-black yst-mb-2">
				<span>{ label }</span>: <span className="yst-font-semibold">{ scoreLabel }</span>
			</div>
			<div className="yst-text-slate-600">{ details }</div>
		</div>
	</div>;
};
