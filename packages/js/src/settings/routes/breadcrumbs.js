import { __, sprintf } from "@wordpress/i18n";
import { SelectField, TextField, ToggleField, Code } from "@yoast/ui-library";
import { Field } from "formik";
import { map } from "lodash";
import { addLinkToString } from "../../helpers/stringHelpers";
import { FieldsetLayout, FormikValueChangeField, FormLayout, RouteLayout } from "../components";
import { useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The breadcrumbs route.
 */
const Breadcrumbs = () => {
	const headerBreadcrumbsLink = useSelectSettings( "selectLink", [], "https://yoa.st/header-breadcrumbs" );
	const breadcrumbsLink = useSelectSettings( "selectLink", [], "https://yoa.st/breadcrumbs" );
	const breadcrumbsForPostTypes = useSelectSettings( "selectBreadcrumbsForPostTypes" );
	const breadcrumbsForTaxonomies = useSelectSettings( "selectBreadcrumbsForTaxonomies" );
	const hasPageForPosts = useSelectSettings( "selectHasPageForPosts" );

	return (
		<RouteLayout
			title={ __( "Breadcrumbs", "wordpress-seo" ) }
			description={ addLinkToString(
				sprintf(
				// translators: %1$s and %2$s are replaced by opening and closing <a> tags.
					__( "Configure the appearance and behavior of %1$syour breadcrumbs%2$s.", "wordpress-seo" ),
					"<a>",
					"</a>"
				),
				headerBreadcrumbsLink,
				"link-header-breadcrumbs"
			) }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<FieldsetLayout
						title={ __( "Breadcrumb appearance", "wordpress-seo" ) }
						description={ __( "Choose the general appearance of your breadcrumbs.", "wordpress-seo" ) }
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
							label={ __( "Prefix for archive breadcrumbs", "wordpress-seo" ) }
							placeholder={ __( "Add prefix", "wordpress-seo" ) }
						/>
						<Field
							as={ TextField }
							type="text"
							name="wpseo_titles.breadcrumbs-searchprefix"
							id="input-wpseo_titles-breadcrumbs-searchprefix"
							label={ __( "Prefix for search page breadcrumbs", "wordpress-seo" ) }
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
						{ hasPageForPosts && <FormikValueChangeField
							as={ ToggleField }
							type="checkbox"
							name="wpseo_titles.breadcrumbs-display-blog-page"
							id="input-wpseo_titles-breadcrumbs-display-blog-page"
							label={ __( "Show blog page in breadcrumbs", "wordpress-seo" ) }
							className="yst-max-w-sm"
						/> }
						<FormikValueChangeField
							as={ ToggleField }
							type="checkbox"
							name="wpseo_titles.breadcrumbs-boldlast"
							id="input-wpseo_titles-breadcrumbs-boldlast"
							label={ __( "Bold the last page", "wordpress-seo" ) }
							className="yst-max-w-sm"
						/>
					</FieldsetLayout>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ __( "Breadcrumbs for post types", "wordpress-seo" ) }
						description={ __( "Choose which Taxonomy you wish to show in the breadcrumbs for Post types.", "wordpress-seo" ) }
					>
						{ map( breadcrumbsForPostTypes, ( postType, postTypeName ) => <FormikValueChangeField
							key={ postTypeName }
							as={ SelectField }
							name={ `wpseo_titles.post_types-${ postTypeName }-maintax` }
							id={ `input-wpseo_titles-post_types-${ postTypeName }-maintax` }
							label={ postType.label }
							labelSuffix={ <Code className="yst-ml-2 rtl:yst-mr-2">{ postTypeName }</Code> }
							options={ postType.options }
							className="yst-max-w-sm"
						/> ) }

					</FieldsetLayout>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ __( "Breadcrumbs for taxonomies", "wordpress-seo" ) }
						description={ __( "Choose which Post type you wish to show in the breadcrumbs for Taxonomies.", "wordpress-seo" ) }
					>
						{ map( breadcrumbsForTaxonomies, ( taxonomy ) => (
							<FormikValueChangeField
								key={ taxonomy.name }
								as={ SelectField }
								name={ `wpseo_titles.taxonomy-${ taxonomy.name }-ptparent` }
								id={ `input-wpseo_titles-taxonomy-${ taxonomy.name }-ptparent` }
								label={ taxonomy.label }
								options={ taxonomy.options }
								className="yst-max-w-sm"
								labelSuffix={ <Code className="yst-ml-2 rtl:yst-mr-2">{ taxonomy.name }</Code> }
							/>
						) ) }
					</FieldsetLayout>
					<hr className="yst-my-8" />
					<FieldsetLayout title={ __( "How to insert breadcrumbs in your theme", "wordpress-seo" ) }>
						<p>
							{ addLinkToString(
								sprintf(
								// translators: %1$s and %2$s are replaced by opening and closing <a> tags. %3$s expands to "Yoast SEO".
									__( "Not sure how to implement the %3$s breadcrumbs on your site? Read %1$sour help article on breadcrumbs implementation%2$s.", "wordpress-seo" ),
									"<a>",
									"</a>",
									"Yoast SEO"
								),
								breadcrumbsLink,
								"link-breadcrumbs-help-article"
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
							className="yst-max-w-sm"
						/>
					</FieldsetLayout>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default Breadcrumbs;
