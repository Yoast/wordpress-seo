import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { __, sprintf } from "@wordpress/i18n";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";

import { Placeholder } from "./placeholders";
import RadioButton from "./radio-button";
import Select from "./select";
import Checkbox from "./checkbox";
import { InfoLink } from "./info-link";
import TextInput from "./text-input";
import { OPTIMIZE_STORE_KEY } from "../constants";


/**
 * The Advanced section.
 *
 * @param {Object} props The props.
 * @param {Object} props.contentType The content type state.
 * @param {boolean} props.isLoading Wether or not the editor should be in a loading state.
 *
 * @returns {JSX.Element|null} The Advanced Section component.
 */
export default function AdvancedSection( { contentType, isLoading } ) {
	const contentTypeSettings = useSelect(
		( select ) => select( OPTIMIZE_STORE_KEY ).getSetting( `contentTypes.${ contentType.slug }` ),
		[ contentType.slug ],
	);
	const robotsNoIndexChoices = useMemo( () => ( {
		"false": __( "Yes", "admin-ui" ),
		"true": __( "No", "admin-ui" ),
	} ), [] );
	const robotsNoIndexChoicesWithDefault = useMemo( () => ( {
		...robotsNoIndexChoices,
		// If showSingleInSearchResults is true, isNoindex should be false and vice versa.
		"": sprintf( __( "Default for %1$s (%2$s)", "admin-ui" ), contentType.label, robotsNoIndexChoices[ ( ! contentTypeSettings.showSingleInSearchResults ).toString() ] ),
	} ), [ contentType.slug, contentTypeSettings.showSingleInSearchResults ] );

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
									{ __( "Advanced", "admin-ui" ) }
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
							<div>
								<Select
									id="search-engine-index"
									// translators: %s is replaced by the single content type label.
									label={ sprintf( __( "Allow search engines to show this %s in search results?", "admin-ui" ), contentType.labelSingular ) }
									dataPath="advanced.robots.isNoIndex"
									choicesMap={ robotsNoIndexChoicesWithDefault }
								/>
							</div>
							<InfoLink linkText={ __( "Learn more about the no-index setting on our help page", "admin-ui" ) } optionPath="noIndexInfoLink" />
						</div>
						<div>

							<p className="yst-text-gray-700 yst-font-semibold yst-mb-2">
								{ /* translators: %s is replaced by the single content type label. */ }
								{ sprintf( __( "Should search engines follow links on this %s?", "admin-ui" ), contentType.labelSingular ) }
							</p>
							<div className="yst-flex yst-items-center">
								<RadioButton
									id="search-engine-follow-links"
									name="search-engine-links"
									value="false"
									label={ __( "Yes", "admin-ui" ) }
									dataPath="advanced.robots.isNoFollow"
									className="yst-mr-4"
								/>
								<RadioButton
									id="search-engine-nofollow-links"
									name="search-engine-links"
									value="true"
									label={ __( "No", "admin-ui" ) }
									dataPath="advanced.robots.isNoFollow"
								/>
							</div>
							<InfoLink linkText={ __( "Learn more about the no-follow setting on our help page", "admin-ui" ) } optionPath="noFollowInfoLink" />
						</div>
						<div>
							<p className="yst-text-gray-700 yst-font-semibold yst-mb-2">{ __( "Meta robots advanced", "admin-ui" ) }</p>
							<Checkbox
								id="meta-robots-advanced-noimageindex"
								label={ __( "No image index", "admin-ui" ) }
								dataPath="advanced.robots.advanced"
								value="noimageindex"
								className="yst-mb-2"
							/>
							<Checkbox
								id="meta-robots-advanced-noarchive"
								label={ __( "No archive", "admin-ui" ) }
								dataPath="advanced.robots.advanced"
								value="noarchive"
								className="yst-mb-2"
							/>
							<Checkbox
								id="meta-robots-advanced-nosnippet"
								label={ __( "No snippet", "admin-ui" ) }
								dataPath="advanced.robots.advanced"
								value="nosnippet"
							/>
							<InfoLink linkText={ __( "Learn more about advanced meta robots settings on our help page", "admin-ui" ) } optionPath="metaRobotsInfoLink" />
						</div>
						<div>
							<TextInput
								id="canonical-url"
								label={ __( "Canonical URL", "admin-ui" ) }
								type="url"
								dataPath="advanced.canonicalUrl"
							/>
							<InfoLink linkText={ __( "Learn more about canonical URLs on our help page", "admin-ui" ) } optionPath="canonicalUrlInfoLink" />
						</div>
					</Disclosure.Panel>
				</>
			) }
		</Disclosure>
	);
}

AdvancedSection.propTypes = {
	contentType: PropTypes.object.isRequired,
	isLoading: PropTypes.bool,
};

AdvancedSection.defaultProps = {
	isLoading: false,
};
