import { __, sprintf } from "@wordpress/i18n";
import { SelectField, TextField, ToggleField } from "@yoast/ui-library";
import { Field } from "formik";
import { map } from "lodash";
import { PropTypes } from "prop-types";
import { addLinkToString } from "../../helpers/stringHelpers";
import { FieldsetLayout, FormikValueChangeField, FormLayout } from "../components";
import { useTaxonomyPostTypeBadges } from "../hooks";
import { useSelectSettings } from "../store";

/**
 * @param {string} taxonomyName The taxonomy to represent.
 * @param {string} label The select label.
 * @param {Object[]} options The label and values.
 * @returns {JSX.Element} The TaxonomySelect.
 */
const TaxonomySelect = ( { taxonomyName, label, options } ) => {
	const badges = useTaxonomyPostTypeBadges( taxonomyName );

	return <FormikValueChangeField
		key={ taxonomyName }
		as={ SelectField }
		name={ `wpseo_titles.taxonomy-${ taxonomyName }-ptparent` }
		id={ `input-wpseo_titles-taxonomy-${ taxonomyName }-ptparent` }
		label={ label }
		labelSuffix={ badges && <div className="yst-flex yst-flex-wrap yst-ml-1.5 yst-gap-1.5">{ badges }</div> }
		options={ options }
	/>;
};

TaxonomySelect.propTypes = {
	taxonomyName: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	options: PropTypes.arrayOf( PropTypes.shape( {
		label: PropTypes.string.isRequired,
		value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ).isRequired,
	} ) ).isRequired,
};

/**
 * @returns {JSX.Element} The breadcrumbs route.
 */
const Breadcrumbs = () => {
	const breadcrumbsLink = useSelectSettings( "selectLink", [], "https://yoa.st/breadcrumbs" );
	const breadcrumbsForPostTypes = useSelectSettings( "selectBreadcrumbsForPostTypes" );
	const breadcrumbsForTaxonomies = useSelectSettings( "selectBreadcrumbsForTaxonomies" );

	return (
		<FormLayout title={ __( "Breadcrumbs", "wordpress-seo" ) }>
			<FieldsetLayout
				title={ __( "Basic crawl settings", "wordpress-seo" ) }
				description={ __( "Remove links added by WordPress to the header and <head>.", "wordpress-seo" ) }
			>
				<Field
					as={ TextField }
					type="text"
					name="wpseo_titles.breadcrumbs-sep"
					id="input-wpseo_titles-breadcrumbs-sep"
					label={ __( "Separator between breadcrumbs", "wordpress-seo" ) }
					placeholder={ __( "Add separator", "wordpress-seo" ) }
				/>
				<Field
					as={ TextField }
					type="text"
					name="wpseo_titles.breadcrumbs-home"
					id="input-wpseo_titles-breadcrumbs-home"
					label={ __( "Anchor text for the Homepage", "wordpress-seo" ) }
					placeholder={ __( "Add anchor text", "wordpress-seo" ) }
				/>
				<Field
					as={ TextField }
					type="text"
					name="wpseo_titles.breadcrumbs-prefix"
					id="input-wpseo_titles-breadcrumbs-prefix"
					label={ __( "Prefix for the breadcrumb path", "wordpress-seo" ) }
					placeholder={ __( "Add prefix", "wordpress-seo" ) }
				/>
				<Field
					as={ TextField }
					type="text"
					name="wpseo_titles.breadcrumbs-archiveprefix"
					id="input-wpseo_titles-breadcrumbs-archiveprefix"
					label={ __( "Prefix for Archive breadcrumbs", "wordpress-seo" ) }
					placeholder={ __( "Add prefix", "wordpress-seo" ) }
				/>
				<Field
					as={ TextField }
					type="text"
					name="wpseo_titles.breadcrumbs-searchprefix"
					id="input-wpseo_titles-breadcrumbs-searchprefix"
					label={ __( "Prefix for Search page breadcrumbs", "wordpress-seo" ) }
					placeholder={ __( "Add prefix", "wordpress-seo" ) }
				/>
				<Field
					as={ TextField }
					type="text"
					name="wpseo_titles.breadcrumbs-404crumb"
					id="input-wpseo_titles-breadcrumbs-404crumb"
					label={ __( "Breadcrumb for 404 page", "wordpress-seo" ) }
					placeholder={ __( "Add separator", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo_titles.breadcrumbs-boldlast"
					data-id="input-wpseo_titles-breadcrumbs-boldlast"
					label={ __( "Bold the last page", "wordpress-seo" ) }
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Breadcrumbs for Post types", "wordpress-seo" ) }
				description={ __( "Choose which Taxonomy you wish to show in the breadcrumbs for Post types.", "wordpress-seo" ) }
			>
				{ map( breadcrumbsForPostTypes, ( postTypes, postTypeName ) => <FormikValueChangeField
					key={ postTypeName }
					as={ SelectField }
					name={ `wpseo_titles.post_types-${ postTypeName }-maintax` }
					id={ `input-wpseo_titles-post_types-${ postTypeName }-maintax` }
					label={ postTypes.label }
					options={ postTypes.options }
				/> ) }
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Breadcrumbs for Taxonomies", "wordpress-seo" ) }
				description={ __( "Choose which Post type you wish to show in the breadcrumbs for Taxonomies.", "wordpress-seo" ) }
			>
				{ map( breadcrumbsForTaxonomies, ( { label, options }, taxonomyName ) => <TaxonomySelect
					key={ `input-breadcrumbs-taxonomy-${ taxonomyName }` }
					taxonomyName={ taxonomyName }
					label={ label }
					options={ options }
				/> ) }
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout title={ __( "How to insert breadcrumbs in your theme", "wordpress-seo" ) }>
				<p>
					{ addLinkToString(
						sprintf(
							// translators: %1$s and %2$s are replaced by opening and closing <a> tags.
							__( "Usage of this breadcrumbs feature is explained in %1$sour knowledge-base article on breadcrumbs implementation%2$s.", "wordpress-seo" ),
							"<a>",
							"</a>"
						),
						breadcrumbsLink,
						"link-breadcrumbs-knowledge-base-article"
					) }
				</p>
				<p>
					{ __( "You can always choose to enable/disable them for your theme below. This setting will not apply to breadcrumbs inserted through a widget, a block or a shortcode.", "wordpress-seo" ) }
				</p>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo_titles.breadcrumbs-enable"
					id="input-wpseo_titles-breadcrumbs-enable"
					label={ __( "Enable breadcrumbs for your theme", "wordpress-seo" ) }
				/>
			</FieldsetLayout>
		</FormLayout>
	);
};

export default Breadcrumbs;
