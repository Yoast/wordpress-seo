import { ScoreIcon } from "@yoast/ui-library";
import DOMPurify from "dompurify";

/**
 * The TaskAnalyzer component displays the analysis results for a task, such as SEO or readability analysis.
 *
 * @param {string} type The type of the analyzer result, e.g. "seo", "readability".
 * @param {string} title The title for the analyzer result, e.g. "SEO Analysis".
 * @param {string} result The analyzer result, e.g. "good", "bad", "ok".
 * @param {string} resultLabel The label for the analyzer result, e.g. "Good".
 * @param {string} resultDescription The description of the analyzer result.
 * @returns {JSX.Element} The TaskAnalyzer component.
 */
export const TaskAnalyzer = ( { type, title, result, resultLabel, resultDescription } ) => {
	const sanitizedDescription = DOMPurify.sanitize( resultDescription );

	const renderIcon = () => {
		switch ( type ) {
			case "score":
				return <ScoreIcon score={ result } className="yst-mt-0.5" />;
			default:
				return null;
		}
	};

	return <div className="yst-flex yst-bg-slate-50 yst-border yst-border-slate-200 yst-rounded-md yst-w-full yst-p-4 yst-gap-4 yst-justify-between yst-mb-5">
		{ renderIcon() }
		<div className="yst-flex-grow">
			<div className="yst-text-black yst-mb-2">
				<span>{ title }</span>: <span className="yst-font-semibold">{ resultLabel }</span>
			</div>
			<div className="yst-text-slate-600" dangerouslySetInnerHTML={ { __html: sanitizedDescription } } />
		</div>
	</div>;
};
