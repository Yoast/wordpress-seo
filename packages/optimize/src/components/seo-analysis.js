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
import TextInput from "./text-input";

/**
 * The SEO analysis report within a collapsible.
 *
 * @param {string} contentType The content type.
 * @param {boolean} isLoading Whether the details are being loaded.
 *
 * @returns {?JSX.Element} The SEO analysis element or null.
 */
const SeoAnalysis = ( { contentType, isLoading } ) => {
	const hasSeoAnalysis = useSelect( select => select( OPTIMIZE_STORE_KEY )
		.getOption( `contentTypes.${ contentType }.hasSeoAnalysis` ), [] );
	if ( ! hasSeoAnalysis ) {
		return null;
	}

	const focusKeyphrase = useSelect( select => select( OPTIMIZE_STORE_KEY ).getData( "keyphrases.focus" ), [] );
	const seoResults = useSelect( select => select( OPTIMIZE_STORE_KEY ).getSeoResults(), [] );
	const seoScore = useSelect( select => select( OPTIMIZE_STORE_KEY ).getSeoScore(), [] );

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
									<ScoreIcon score={ seoScore } />
									{ __( "SEO analysis", "admin-ui" ) }
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
							<TextInput
								id="yoast-synonyms-input"
								label={ __( "Keyphrase synonyms", "admin-ui" ) }
								dataPath="keyphrases.synonyms.focus"
							/>
							<InfoLink linkText={ __( "Read more about synonyms", "admin-ui" ) } optionPath="keyphraseSynonymsInfoLink" />
						</div>
						<ContentAnalysis
							{ ...seoResults }
							headingLevel={ 2 }
							keywordKey={ focusKeyphrase }
							marksButtonClassName="yoast-mark-button"
							activeMarker={ markerId }
							onMarkButtonClick={ handleMarkClick }
						/>
					</Disclosure.Panel>
				</>
			) }
		</Disclosure>
	);
};

SeoAnalysis.propTypes = {
	contentType: propTypes.string.isRequired,
	isLoading: propTypes.bool,
};

SeoAnalysis.defaultProps = {
	isLoading: false,
};

export default SeoAnalysis;
