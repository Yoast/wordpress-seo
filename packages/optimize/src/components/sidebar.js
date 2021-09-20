import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import propTypes from "prop-types";
import AdvancedSection from "./advanced-section";
import Cornerstone from "./cornerstone";
import GooglePreview from "./google-preview";
import { InfoLink } from "./info-link";
import { Placeholder, PlaceholderInput } from "./placeholders";
import ReadabilityAnalysis from "./readability-analysis";
import RelatedKeyphrases from "./related-keyphrases";
import SchemaSection from "./schema-section";
import SeoAnalysis from "./seo-analysis";
import SocialPreview from "./social-preview";
import TextInput from "./text-input";

/**
 * The sidebar.
 *
 * @param {Object} props The props object.
 * @param {Object} props.contentType The content type state.
 * @param {boolean} props.isLoading Wether or not the editor should be in a loading state.
 *
 * @returns {*} The sidebar.
 */
export default function Sidebar( { contentType, isLoading } ) {
	return (
		<aside className="yst-col-span-2 yoast">
			<div className="yst-w-full yst-bg-white yst-rounded-md yst-shadow yst-divide-y yst-divide-gray-200">
				<section className="yst-p-8">
					{
						isLoading
							? <PlaceholderInput label={ __( "Focus keyphrase", "admin-ui" ) } />
							: <div>
								<TextInput
									id="focus-keyprase"
									label={ __( "Focus keyphrase", "admin-ui" ) }
									dataPath="keyphrases.focus"
								/>
								<InfoLink linkText={ __( "Read more about choosing the right focus keyphrase", "admin-ui" ) } optionPath="focusKeyphraseInfoLink" />
							</div>
					}
				</section>
				<ReadabilityAnalysis contentType={ contentType.slug } isLoading={ isLoading } />
				<SeoAnalysis contentType={ contentType.slug } isLoading={ isLoading } />
				<RelatedKeyphrases contentType={ contentType.slug } isLoading={ isLoading } />
				<GooglePreview contentType={ contentType.slug } isLoading={ isLoading } />
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
											{ __( "Facebook preview", "admin-ui" ) }
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
								<SocialPreview
									dataPath="opengraph"
									socialMediumName="Facebook"
									isPremium={ true }
									contentType={ contentType.slug }
								/>
							</Disclosure.Panel>
						</>
					) }
				</Disclosure>
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
											{ __( "Twitter preview", "admin-ui" ) }
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
								<SocialPreview
									dataPath="twitter"
									socialMediumName="Twitter"
									isPremium={ true }
									contentType={ contentType.slug }
								/>
							</Disclosure.Panel>
						</>
					) }
				</Disclosure>
				<SchemaSection contentType={ contentType } isLoading={ isLoading } />
				<AdvancedSection contentType={ contentType } isLoading={ isLoading } />
				<Cornerstone contentType={ contentType.slug } isLoading={ isLoading } />
			</div>
		</aside>
	);
}

Sidebar.propTypes = {
	contentType: propTypes.shape(
		{
			columns: propTypes.array,
			hasAutomaticSchemaTypes: propTypes.bool,
			hasSchemaArticleTypes: propTypes.bool,
			hasSchemaPageTypes: propTypes.bool,
			label: propTypes.string,
			slug: propTypes.string,
		},
	).isRequired,
	isLoading: propTypes.bool,
};

Sidebar.defaultProps = {
	isLoading: false,
};
