import { __, sprintf } from "@wordpress/i18n";
import { Field } from "formik";
import { ToggleField, TextField, SelectField } from "@yoast/ui-library";
import { FormikValueChangeField, FormLayout, FieldsetLayout } from "../components";
import { addLinkToString } from "../../helpers/stringHelpers";

/**
 * @returns {JSX.Element} The breadcrumbs route.
 */
const Breadcrumbs = () => {
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
					id="input:wpseo_titles.breadcrumbs-sep"
					label={ __( "Separator between breadcrumbs", "wordpress-seo" ) }
					placeholder={ __( "Add separator", "wordpress-seo" ) }
				/>
				<Field
					as={ TextField }
					type="text"
					name="wpseo_titles.breadcrumbs-home"
					id="input:wpseo_titles.breadcrumbs-home"
					label={ __( "Anchor text for the Homepage", "wordpress-seo" ) }
					placeholder={ __( "Add anchor text", "wordpress-seo" ) }
				/>
				<Field
					as={ TextField }
					type="text"
					name="wpseo_titles.breadcrumbs-prefix"
					id="input:wpseo_titles.breadcrumbs-prefix"
					label={ __( "Prefix for the breadcrumb path", "wordpress-seo" ) }
					placeholder={ __( "Add prefix", "wordpress-seo" ) }
				/>
				<Field
					as={ TextField }
					type="text"
					name="wpseo_titles.breadcrumbs-archiveprefix"
					id="input:wpseo_titles.breadcrumbs-archiveprefix"
					label={ __( "Prefix for Archive breadcrumbs", "wordpress-seo" ) }
					placeholder={ __( "Add prefix", "wordpress-seo" ) }
				/>
				<Field
					as={ TextField }
					type="text"
					name="wpseo_titles.breadcrumbs-searchprefix"
					id="input:wpseo_titles.breadcrumbs-searchprefix"
					label={ __( "Prefix for Search page breadcrumbs", "wordpress-seo" ) }
					placeholder={ __( "Add prefix", "wordpress-seo" ) }
				/>
				<Field
					as={ TextField }
					type="text"
					name="wpseo_titles.breadcrumbs-404crumb"
					id="input:wpseo_titles.breadcrumbs-404crumb"
					label={ __( "Breadcrumb for 404 page", "wordpress-seo" ) }
					placeholder={ __( "Add separator", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo_titles.breadcrumbs-boldlast"
					data-id="input:wpseo_titles.breadcrumbs-boldlast"
					label={ __( "Bold the last page", "wordpress-seo" ) }
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Breadcrumbs for Post types", "wordpress-seo" ) }
				description={ __( "Choose which Taxonomy you wish to show in the breadcrumbs for Post types.", "wordpress-seo" ) }
			>
				<FormikValueChangeField
					as={ SelectField }
					name="wpseo_titles.post_types-post-maintax"
					id="input:wpseo_titles.post_types-post-maintax"
					label={ __( "Posts", "wordpress-seo" ) }
					options={ [ {
						value: "None",
						label: "None",
					}, {
						value: "Category",
						label: "Category",
					}, {
						value: "Tag",
						label: "Tag",
					}, {
						value: "Format",
						label: "Format",
					} ] }
				/>
				<p>Extra fields generated based on content types here?</p>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Breadcrumbs for Taxonomies", "wordpress-seo" ) }
				description={ __( "Choose which Post type you wish to show in the breadcrumbs for Taxonomies.", "wordpress-seo" ) }
			>
				<FormikValueChangeField
					as={ SelectField }
					name="wpseo_titles.taxonomy-category-ptparent"
					id="input:wpseo_titles.taxonomy-category-ptparent"
					label={ __( "Category", "wordpress-seo" ) }
					options={ [ {
						value: "None",
						label: "None",
					}, {
						value: "Posts",
						label: "Posts",
					} ] }
				/>
				<FormikValueChangeField
					as={ SelectField }
					name="wpseo_titles.taxonomy-post_tag-ptparent"
					id="input:wpseo_titles.taxonomy-post_tag-ptparent"
					label={ __( "Tag", "wordpress-seo" ) }
					options={ [ {
						value: "None",
						label: "None",
					}, {
						value: "Posts",
						label: "Posts",
					} ] }
				/>
				<p>Extra fields generated based on content types here?</p>
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
						"https://yoa.st/",
						"link:breadcrumbs-knowledge-base-article"
					) }
				</p>
				<p>
					{ __( "You can always choose to enable/disable them for your theme below. This setting will not apply to breadcrumbs inserted through a widget, a block or a shortcode.", "wordpress-seo" ) }
				</p>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo_titles.breadcrumbs-enable"
					id="input:wpseo_titles.breadcrumbs-enable"
					label={ __( "Enable breadcrumbs for your theme", "wordpress-seo" ) }
				/>
			</FieldsetLayout>
		</FormLayout>
	);
};

export default Breadcrumbs;
