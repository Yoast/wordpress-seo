import { createInterpolateElement, Fragment, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Section } from "@yoast/admin-ui-toolkit/components";
import PropTypes from "prop-types";
import { withHideForOptions } from "../../../helpers";
import { ContentTypePropTypes } from "../../../prop-types";
import ImageSelect from "../../image-select";
import ReplacementVariableEditors from "../../replacement-variable-editors";
import Switch from "../../switch";
import TextInput from "../../text-input";
import SchemaSettings, { PAGE } from "./schema-settings";

const HideForOptionsSection = withHideForOptions()( Section );

/**
 *
 * @param {Object} props Props object.
 * @param {ContentTypeOptions} props.options Options for content type.
 * @param {string} props.contentTypeKey Key of content type in content types object in Redux store.
 * @returns {JSX.Element} Single Page Settings component.
 */
const SingleSettings = ( { options, contentTypeKey } ) => {
	const {
		label,
		hasCustomFields,
		hasSocialAppearance,
		customFieldsAnalysisInfoLink,
		singleSupportedVariables,
	} = options;

	const customFieldsAnalysisInfoLinkElement = useMemo( () => createInterpolateElement(
		// translators: %1$s is replaced by an opening anchor tag. %2$s is replaced by a closing anchor tag.
		sprintf( __( "You can add multiple custom fields in a comma-separated list. %1$sRead more about our custom field analysis%2$s.", "admin-ui" ), "<a>", "</a>" ),
		{
			/* eslint-disable-next-line jsx-a11y/anchor-has-content */
			a: <a href={ customFieldsAnalysisInfoLink } target="_blank" rel="noopener noreferrer" />,
		},
	), [ customFieldsAnalysisInfoLink ] );

	return (
		<Fragment>
			<section className="yst-m-8 yst-pb-8 yst-border-b">
				<h2 className="yst-text-lg yst-mb-3">{
					// translators: %s is replaced by the plural content type label.
					sprintf( __( "Single %s", "admin-ui" ), label )
				}</h2>
				<p className="yst-text-tiny">{
					// translators: %s is replaced by the plural content type label.
					sprintf( __( "These settings are specifically for setting up defaults for your single %s.", "admin-ui" ), label )
				}</p>
			</section>
			<Section
				title={ __( "Search appearance", "admin-ui" ) }
				// translators: %1$s is replaced by the plural content type label.
				description={ sprintf( __( "Choose how your %1$s should look in search engines by default. You can always customize this for individual %1$s.", "admin-ui" ), label ) }
			>
				<Switch
					optionPath={ `contentTypes.${ contentTypeKey }.hasSinglePage` }
					dataPath={ `contentTypes.${ contentTypeKey }.showSingleInSearchResults` }
					// translators: %s is replaced by the plural content type label.
					label={ sprintf( __( "Show %s in search results", "admin-ui" ), label ) }
					// translators: %s is replaced by the plural content type label.
					description={ sprintf( __( "Be aware that disabling this toggle has serious consequences: %s will not be indexed by search engines and will be excluded from XML sitemaps.", "admin-ui" ), label ) }
				/>
				<hr className="yst-my-8" />
				<ReplacementVariableEditors
					dataPath={ `contentTypes.${ contentTypeKey }.templates.seo.single` }
					fieldIds={ {
						title: "yst-single-templates-seo-title",
						description: "yst-single-templates-seo-description",
					} }
					labels={ {
						title: __( "SEO title", "admin-ui" ),
						description: __( "Meta description", "admin-ui" ),
					} }
					scope={ contentTypeKey }
					supportedVariables={ singleSupportedVariables }
				/>
			</Section>
			{ hasSocialAppearance && <Section
				title={ __( "Social Appearance", "admin-ui" ) }
				// translators: %1$s is replaced by the plural content type label.
				description={ sprintf( __( "Choose how your %1$s should look on social media by default. You can always customize this per individual %1$s.", "admin-ui" ), label ) }
			>
				<ImageSelect
					dataPath={ `contentTypes.${ contentTypeKey }.templates.social.single.image` }
					label={ __( "Social image", "admin-ui" ) }
					id="single-social-image"
					className="yst-mb-8"
				/>
				<ReplacementVariableEditors
					dataPath={ `contentTypes.${ contentTypeKey }.templates.social.single` }
					fieldIds={ {
						title: "yst-single-templates-social-title",
						description: "yst-single-templates-social-description",
					} }
					labels={ {
						title: __( "Social title", "admin-ui" ),
						description: __( "Social description", "admin-ui" ),
					} }
					scope={ contentTypeKey }
					supportedVariables={ singleSupportedVariables }
				/>
			</Section> }
			<SchemaSettings contentTypeKey={ contentTypeKey } singleOrArchive={ PAGE.SINGLE } />

			<HideForOptionsSection
				title={ __( "Additional settings", "admin-ui" ) }
				optionPath={ [ `contentTypes.${ contentTypeKey }.showSEOSettings`, `contentTypes.${ contentTypeKey }.hasCustomFields` ] }
			>
				<Switch
					dataPath={ `contentTypes.${ contentTypeKey }.showSEOSettings` }
					// translators: %s is replaced by the plural content type label.
					label={ sprintf( __( "Enable Yoast SEO for %s", "admin-ui" ), label ) }
					// translators: %s is replaced by the plural content type label.
					description={ sprintf( __( "This enables SEO metadata editing and our SEO and Readability analyses for individual %s.", "admin-ui" ), label ) }
				/>
				{ hasCustomFields && <>
					<TextInput
						dataPath={ `contentTypes.${ contentTypeKey }.customFields` }
						label={ __( "Add custom fields to page analysis", "admin-ui" ) }
					/>
					{ customFieldsAnalysisInfoLink && <p className="yst-mt-2">{ customFieldsAnalysisInfoLinkElement }</p> }
				</> }
			</HideForOptionsSection>
		</Fragment>
	);
};

SingleSettings.propTypes = {
	options: ContentTypePropTypes.options.isRequired,
	contentTypeKey: PropTypes.string.isRequired,
};

export default SingleSettings;
