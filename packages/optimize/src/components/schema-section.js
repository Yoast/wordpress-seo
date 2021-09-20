import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { AutomaticSchemaAlert } from "@yoast/admin-ui-toolkit/components";
import { getSchemaArticleTypes, getSchemaPageTypes } from "@yoast/admin-ui-toolkit/helpers";
import classNames from "classnames";
import PropTypes from "prop-types";
import { OPTIMIZE_STORE_KEY } from "../constants";
import { Placeholder } from "./placeholders";
import Select from "./select";

/**
 * A Collapsible with the Schema section.
 *
 * @param {Object} props The props.
 * @param {Object} props.contentType The content type state.
 * @param {boolean} props.isLoading Wether or not the editor should be in a loading state.
 *
 * @returns {JSX.Element|null} The SchemaSection component.
 */
const SchemaSection = ( { contentType, isLoading } ) => {
	// Return nothing if there is no schema to set.
	if ( ! ( contentType.hasSchemaPageTypes || contentType.hasSchemaArticleTypes || contentType.hasAutomaticSchemaTypes ) ) {
		return null;
	}

	const defaultSettings = useSelect( select => select( OPTIMIZE_STORE_KEY ).getSetting( `contentTypes.${ contentType.slug }.schema` ), [] );
	const contentTypeSchemaInfoLink = useSelect( select => select( OPTIMIZE_STORE_KEY ).getOption( "contentTypeSchemaInfoLink" ), [] );

	const pageTypeChoices = useMemo( () => ( {
		...getSchemaPageTypes(),
		"": sprintf( __( "Default for %1$s (%2$s)", "admin-ui" ), contentType.label, defaultSettings.pageType ),
	} ), [ contentType.slug ] );
	const articleTypeChoices = useMemo( () => ( {
		...getSchemaArticleTypes(),
		"": sprintf( __( "Default for %1$s (%2$s)", "admin-ui" ), contentType.label, defaultSettings.articleType ),
	} ), [ contentType.slug ] );

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
									{ __( "Schema", "admin-ui" ) }
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
						<>
							<p>{ __( "Yoast SEO automatically describes your pages using Schema.org. this helps search engines understand your website and your content.", "admin-ui" ) }</p>
							{ contentType.hasAutomaticSchemaTypes && <AutomaticSchemaAlert
								defaultSettings={ defaultSettings }
								contentTypeLabel={ contentType.label }
								contentTypeSchemaInfoLink={ contentTypeSchemaInfoLink }
							/> }
							{ ! contentType.hasAutomaticSchemaTypes && <>
								{ contentType.hasSchemaPageTypes && <div>
									<Select
										dataPath="schema.pageType"
										label={ __( "Page type", "admin-ui" ) }
										choicesMap={ pageTypeChoices }
									/>
								</div> }
								{ contentType.hasSchemaArticleTypes && <div>
									<Select
										dataPath="schema.articleType"
										label={ __( "Article type", "admin-ui" ) }
										choicesMap={ articleTypeChoices }
									/>
								</div> }
							</> }
						</>
					</Disclosure.Panel>
				</>
			) }
		</Disclosure>
	);
};

SchemaSection.propTypes = {
	contentType: PropTypes.object.isRequired,
	isLoading: PropTypes.bool,
};

SchemaSection.defaultProps = {
	isLoading: false,
};

export default SchemaSection;
