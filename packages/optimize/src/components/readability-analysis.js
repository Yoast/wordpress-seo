import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { ContentAnalysis } from "@yoast/analysis-report";
import classNames from "classnames";
import propTypes from "prop-types";
import { OPTIMIZE_STORE_KEY } from "../constants";
import { useMarker } from "../hooks";
import { InfoLink } from "./info-link";
import { Placeholder } from "./placeholders";
import ScoreIcon from "./score-icon";

/**
 * The readability analysis report within a collapsible.
 *
 * @param {string} contentType The content type.
 * @param {boolean} isLoading Whether the details are being loaded.
 *
 * @returns {?JSX.Element} The readability analysis element or null.
 */
const ReadabilityAnalysis = ( { contentType, isLoading } ) => {
	const hasReadabilityAnalysis = useSelect(
		select => select( OPTIMIZE_STORE_KEY ).getOption( `contentTypes.${ contentType }.hasReadabilityAnalysis` ),
		[],
	);
	if ( ! hasReadabilityAnalysis ) {
		return null;
	}

	const focusKeyphrase = useSelect( select => select( OPTIMIZE_STORE_KEY ).getData( "keyphrases.focus" ), [] );
	const readabilityResults = useSelect( select => select( OPTIMIZE_STORE_KEY ).getReadabilityResults(), [] );
	const readabilityScore = useSelect( select => select( OPTIMIZE_STORE_KEY ).getReadabilityScore(), [] );

	const { markerId, handleMarkClick } = useMarker();

	return (
		<Disclosure as="section">
			{ ( { open } ) => (
				<>
					<Disclosure.Button
						className="yst-flex yst-w-full yst-items-center yst-justify-between yst-text-tiny yst-font-medium yst-text-gray-700 yst-rounded-md yst-px-8 yst-py-4 hover:yst-text-gray-800 hover:yst-bg-gray-50 focus:yst-outline-none focus:yst-ring-inset focus:yst-ring-2 focus:yst-ring-indigo-500"
					>
						{
							isLoading
								? <Placeholder />
								: <>
									<ScoreIcon score={ readabilityScore } />
									{ __( "Readability analysis", "admin-ui" ) }
									<ChevronDownIcon
										className={ classNames(
											open ? "yst-text-gray-400 yst-transform yst-rotate-180" : "yst-text-gray-300",
											"yst-ml-auto yst-w-5 yst-h-5 yst-text-gray-400 group-hover:yst-text-gray-500",
										) }
										aria-hidden="true"
									/>
								</>
						}
					</Disclosure.Button>
					<Disclosure.Panel className="yst-px-8 yst-pt-6 yst-pb-10 yst-border-t yst-border-gray-200 yst-space-y-6">
						<div>
							<ContentAnalysis
								{ ...readabilityResults }
								headingLevel={ 2 }
								keywordKey={ focusKeyphrase }
								marksButtonClassName="yoast-mark-button"
								activeMarker={ markerId }
								onMarkButtonClick={ handleMarkClick }
							/>
							<InfoLink linkText={ __( "Read more about our readability analysis", "admin-ui" ) } optionPath="readabilityAnalysisInfoLink" />
						</div>
					</Disclosure.Panel>
				</>
			) }
		</Disclosure>
	);
};

ReadabilityAnalysis.propTypes = {
	contentType: propTypes.string.isRequired,
	isLoading: propTypes.bool,
};

ReadabilityAnalysis.defaultProps = {
	isLoading: false,
};

export default ReadabilityAnalysis;
