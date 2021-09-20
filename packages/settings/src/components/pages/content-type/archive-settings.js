import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Section } from "@yoast/admin-ui-toolkit/components";
import PropTypes from "prop-types";
import { ContentTypePropTypes } from "../../../prop-types";
import ImageSelect from "../../image-select";
import ReplacementVariableEditors from "../../replacement-variable-editors";
import Switch from "../../switch";
import TextInput from "../../text-input";
import SchemaSettings, { PAGE } from "./schema-settings";

/**
 *
 * @param {Object} props Props object.
 * @param {ContentTypeOptions} props.options Options for content type.
 * @param {string} props.contentTypeKey Index of content type in content types array in Redux store.
 * @returns {JSX.Element} Archive Settings component.
 */
const ArchiveSettings = ( { options, contentTypeKey } ) => {
	const {
		label,
		hasBreadcrumbs,
		hasSocialAppearance,
		archiveSupportedVariables,
	} = options;

	return (
		<Fragment>
			<section className="yst-m-8 yst-mt-16 yst-pb-8 yst-border-b">
				<h2 className="yst-text-lg yst-mb-3">{
					// translators: %s is replaced by the plural content type label.
					sprintf( __( "%s archive", "admin-ui" ), label )
				}</h2>
				<p className="yst-text-tiny">{
					// translators: %s is replaced by the plural content type label.
					sprintf( __( "These settings are specifically for optimizing your %s archive.", "admin-ui" ), label )
				}</p>
			</section>
			<Section
				title={ __( "Search appearance", "admin-ui" ) }
				// translators: %s is replaced by the plural content type label.
				description={ sprintf( __( "Choose how your %s archive should look in search engines.", "admin-ui" ), label ) }
			>
				<Switch
					optionPath={ `contentTypes.${ contentTypeKey }.hasArchive` }
					dataPath={ `contentTypes.${ contentTypeKey }.showArchiveInSearchResults` }
					// translators: %s is replaced by the plural content type label.
					label={ sprintf( __( "Show the archive for %s in search results", "admin-ui" ), label ) }
					// translators: %s is replaced by the plural content type label.
					description={ sprintf( __( "Be aware that disabling this toggle has serious consequences: %s will not be indexed by search engines and will be excluded from XML sitemaps.", "admin-ui" ), label ) }
				/>
				<hr className="yst-my-8" />
				<ReplacementVariableEditors
					dataPath={ `contentTypes.${ contentTypeKey }.templates.seo.archive` }
					fieldIds={ {
						title: "yst-archive-templates-seo-title",
						description: "yst-archive-templates-seo-description",
					} }
					labels={ {
						title: __( "SEO title", "admin-ui" ),
						description: __( "Meta description", "admin-ui" ),
					} }
					scope={ contentTypeKey }
					supportedVariables={ archiveSupportedVariables }
				/>
			</Section>
			{ hasSocialAppearance && <Section
				title={ __( "Social Appearance", "admin-ui" ) }
				// translators: %s is replaced by the plural content type label.
				description={ sprintf( __( "Choose how your %s archive should look on social media.", "admin-ui" ), label, label ) }
			>
				<ImageSelect
					dataPath={ `contentTypes.${ contentTypeKey }.templates.social.archive.image` }
					label={ __( "Social image", "admin-ui" ) }
					id="archive-social-image"
					className="yst-mb-8"
				/>
				<ReplacementVariableEditors
					dataPath={ `contentTypes.${ contentTypeKey }.templates.social.archive` }
					fieldIds={ {
						title: "yst-archive-templates-social-title",
						description: "yst-archive-templates-social-description",
					} }
					labels={ {
						title: __( "Social title", "admin-ui" ),
						description: __( "Social description", "admin-ui" ),
					} }
					scope={ contentTypeKey }
					supportedVariables={ archiveSupportedVariables }
				/>
			</Section> }
			<SchemaSettings contentTypeKey={ contentTypeKey } singleOrArchive={ PAGE.ARCHIVE } />
			{ hasBreadcrumbs && (
				<Section
					title={ __( "Additional settings", "admin-ui" ) }
				>
					<TextInput
						dataPath={ `contentTypes.${ contentTypeKey }.breadcrumbsTitle` }
						label={ __( "Breadcrumbs Title", "admin-ui" ) }
					/>
				</Section>
			) }
		</Fragment>
	);
};

ArchiveSettings.propTypes = {
	options: ContentTypePropTypes.options.isRequired,
	contentTypeKey: PropTypes.string.isRequired,
};

export default ArchiveSettings;
