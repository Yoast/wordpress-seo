import { IntentBadge } from "./intent-badge";
import { useCallback } from "@wordpress/element";
import { SkeletonLoader } from "@yoast/ui-library";

/**
 * @typedef {import( "../constants" ).Suggestion} Suggestion
 */

/**
 * Suggestion button component.
 *
 * @param {object} props The component props.
 * @param {Suggestion} props.suggestion The full suggestion object.
 * @param {Function} props.onClick The function to call when the suggestion button is clicked.
 *
 * @returns {JSX.Element} The SuggestionButton component.
 */
export const SuggestionButton = ( { suggestion, onClick } ) => {
	const { intent, title, explanation } = suggestion;
	const handleClick = useCallback( () => onClick( suggestion ), [ onClick, suggestion ] );
	return (
		<button
			type="button"
			onClick={ handleClick }
			className="hover:yst-bg-slate-50 yst-group yst-text-start yst-w-full yst-rounded-md yst-border yst-border-slate-200 yst-mb-4 yst-p-4 yst-shadow-sm focus:yst-outline focus:yst-outline-2 focus:yst-outline-offset-2 focus:yst-outline-primary-500"
		>
			<IntentBadge intent={ intent } className="yst-mb-2" />
			<div className="yst-font-medium yst-text-sm yst-mb-2 yst-text-slate-800 group-hover:yst-text-slate-900">
				<span className="group-hover:yst-border group-hover:yst-border-b group-hover:yst-border-slate-900">{ title }</span>
			</div>
			<p className="yst-text-slate-600">{ explanation }</p>
		</button>
	);
};

/**
 * Loading skeleton for the SuggestionButton component.
 *
 * @returns {JSX.Element} The LoadingSuggestionButton component.
 */
export const LoadingSuggestionButton = () => (
	<div className="yst-w-full yst-rounded-md yst-border yst-border-slate-200 yst-mb-4 yst-p-4 yst-shadow-sm">
		<div className="yst-px-2 yst-py-1 yst-bg-white yst-inline-flex yst-gap-1 yst-items-center yst-justify-start yst-mb-2 yst-rounded-3xl yst-border yst-border-slate-300">
			<SkeletonLoader className="yst-w-2 yst-h-2 yst-rounded-full" />
			<SkeletonLoader className="yst-w-20 yst-h-3 yst-rounded" />
		</div>
		<SkeletonLoader className="yst-w-64 yst-h-[18px] yst-rounded yst-mb-3" />
		<SkeletonLoader className="yst-w-full yst-h-[13px] yst-rounded yst-mb-2" />
		<SkeletonLoader className="yst-w-2/3 yst-h-[13px] yst-rounded" />
	</div>
);
