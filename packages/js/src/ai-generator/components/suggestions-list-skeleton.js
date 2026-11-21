import { SkeletonLoader } from "@yoast/ui-library";
import PropTypes from "prop-types";

const DEFAULT_SUGGESTION_CLASSNAMES = [
	[ "yst-h-3 yst-w-full", "yst-mt-2.5 yst-h-3 yst-w-9/12" ],
	[ "yst-h-3 yst-w-full", "yst-mt-2.5 yst-h-3 yst-w-7/12" ],
	[ "yst-h-3 yst-w-full", "yst-mt-2.5 yst-h-3 yst-w-10/12" ],
	[ "yst-h-3 yst-w-full", "yst-mt-2.5 yst-h-3 yst-w-11/12" ],
	[ "yst-h-3 yst-w-full", "yst-mt-2.5 yst-h-3 yst-w-8/12" ],
];

/**
 * @param {string[][]} [suggestionClassNames] Extra classes for the Skeletons.
 * @returns {JSX.Element} The element.
 */
export const SuggestionsListSkeleton = ( { suggestionClassNames = DEFAULT_SUGGESTION_CLASSNAMES } ) => (
	<div className="yst-flex yst-flex-col yst--space-y-[1px]">
		{ suggestionClassNames.map( ( suggestions, index ) => (
			<div
				key={ `yst-ai-suggestion-radio-skeleton__${ index }` }
				className="yst-flex yst-p-4 yst-gap-x-3 yst-items-center yst-border first:yst-rounded-t-md last:yst-rounded-b-md"
			>
				<input type="radio" disabled={ true } className="yst-my-0.5" />
				<div className="yst-flex yst-flex-col yst-w-full">
					{ suggestions.map( ( suggestionClassName, i ) => (
						<SkeletonLoader
							key={ `yst-ai-suggestion-radio-skeleton-${ index }__${ i }` }
							className={ suggestionClassName }
						/>
					) ) }
				</div>
			</div>
		) ) }
	</div>
);
SuggestionsListSkeleton.propTypes = {
	suggestionClassNames: PropTypes.arrayOf( PropTypes.arrayOf( PropTypes.string ) ),
};
