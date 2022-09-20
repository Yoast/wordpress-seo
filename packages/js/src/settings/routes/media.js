import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Link, SelectField, ToggleField } from "@yoast/ui-library";
import { useFormikContext } from "formik";
import AnimateHeight from "react-animate-height";
import { FieldsetLayout, FormikFlippedToggleField, FormikReplacementVariableEditorField, FormikValueChangeField, FormLayout } from "../components";
import { useSelectSettings } from "../store";

/**
 * @returns {JSX.Element} The media route.
 */
const Media = () => {
	const { name, label, singularLabel, hasSchemaArticleType } = useSelectSettings( "selectPostType", [], "attachment" );
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [ name ], name, "custom_post_type" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [ name ], name, "custom_post_type" );
	const articleTypes = useSelectSettings( "selectArticleTypeValuesFor", [ name ], name );
	const pageTypes = useSelectSettings( "selectPageTypeValuesFor", [ name ], name );
	const thinContentProblemsInfoLink = useSelectSettings( "selectLink", [], "https://yoast.com/features/redirect-attachment-urls" );
	const noIndexInfoLink = useSelectSettings( "selectLink", [], "https://yoa.st/show-x" );

	const { values } = useFormikContext();
	const { "disable-attachment": disableAttachment } = values.wpseo_titles;

	const description = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s and %2$s are replaced by opening and closing <a> tags.
			 * %3$s expands to the post type singular, e.g. Post.
			 * %4$s expand to "Yoast SEO".
			 * %5$s expand to "WordPress".
			 */
			__( "When you upload media (e.g. an image or video), %5$s automatically creates a %3$s page (attachment URL) for it. These pages are quite empty and could cause %1$sthin content problems and lead to excess pages on your site%2$s. Therefore, %4$s disables them by default (and redirects the attachment URL to the media itself).", "wordpress-seo" ),
			"<a>",
			"</a>",
			singularLabel,
			"Yoast SEO",
			"WordPress"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ thinContentProblemsInfoLink } target="_blank" rel="noreferrer" />,
		}
	) );

	return (
		<FormLayout
			title={ sprintf(
				/* translators: %1$s expands to the post type plural, e.g. Posts. */
				__( "%1$s pages", "wordpress-seo" ),
				label
			) }
			description={ description }
		>
			<fieldset className="yst-min-width-0 yst-space-y-8">
				<FormikFlippedToggleField
					name={ `wpseo_titles.disable-${ name }` }
					data-id={ `input-wpseo_titles-disable-${ name }` }
					label={ sprintf(
						/* translators: %1$s expands to the post type plural, e.g. Posts. */
						__( "%1$s pages", "wordpress-seo" ),
						label
					) }
					description={ sprintf(
						/* translators: %1$s expands to the post type plural, e.g. Posts. */
						__( "We recommend disabling %1$s pages. Disabling %1$s pages will cause all attachment URLs to redirect to the media itself.", "wordpress-seo" ),
						label
					) }
				/>
			</fieldset>
			<hr className="yst-my-8" />
			<div className="yst-relative">
				<AnimateHeight
					easing="ease-in-out"
					duration={ 300 }
					height={ disableAttachment ? 0 : "auto" }
					animateOpacity={ true }
				>
					<FieldsetLayout
						title={ __( "Search appearance", "wordpress-seo" ) }
						description={ sprintf(
							// translators: %1$s expands to the post type plural, e.g. Posts. %2$s expands to the post type singular, e.g. Post.
							__( "Choose how your %1$s pages should look in search engines. You can always customize this per individual %2$s page.", "wordpress-seo" ),
							label,
							singularLabel
						) }
					>
						<FormikFlippedToggleField
							name={ `wpseo_titles.noindex-${ name }` }
							data-id={ `input-wpseo_titles-noindex-${ name }` }
							label={ sprintf(
								// translators: %1$s expands to the post type plural, e.g. Posts.
								__( "Show %1$s pages in search results", "wordpress-seo" ),
								label
							) }
							description={ <>
								{ sprintf(
									// translators: %1$s expands to the post type plural, e.g. Posts.
									__( "Disabling this means that %1$s pages created by WordPress will not be indexed by search engines and will be excluded from XML sitemaps.", "wordpress-seo" ),
									label
								) }
								<br />
								<Link href={ noIndexInfoLink } target="_blank" rel="noreferrer">
									{ __( "Read more about the search results settings", "wordpress-seo" ) }
								</Link>
								.
							</> }
						/>
						<FormikReplacementVariableEditorField
							type="title"
							name={ `wpseo_titles.title-${ name }` }
							fieldId={ `input-wpseo_titles-title-${ name }` }
							label={ __( "SEO title", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
						/>
						<FormikReplacementVariableEditorField
							type="description"
							name={ `wpseo_titles.metadesc-${ name }` }
							fieldId={ `input-wpseo_titles-metadesc-${ name }` }
							label={ __( "Meta description", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
							className="yst-replacevar--description"
						/>
					</FieldsetLayout>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ __( "Schema", "wordpress-seo" ) }
						description={ sprintf(
							// translators: %1$s expands to the post type plural, e.g. Posts. %2$s expands to the post type singular, e.g. Post.
							__( "Choose how your %1$s pages should be described by default in your site's Schema.org markup. You can change these setting per individual %2$s page.", "wordpress-seo" ),
							label,
							singularLabel
						) }
					>
						<FormikValueChangeField
							as={ SelectField }
							type="select"
							name={ `wpseo_titles.schema-page-type-${ name }` }
							id={ `input-wpseo_titles-schema-page-type-${ name }` }
							label={ __( "Page type", "wordpress-seo" ) }
							options={ pageTypes }
						/>
						{ hasSchemaArticleType && <FormikValueChangeField
							as={ SelectField }
							type="select"
							name={ `wpseo_titles.schema-article-type-${ name }` }
							id={ `input-wpseo_titles-schema-article-type-${ name }` }
							label={ __( "Article type", "wordpress-seo" ) }
							options={ articleTypes }
						/> }
					</FieldsetLayout>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ __( "Additional settings", "wordpress-seo" ) }
					>
						<FormikValueChangeField
							as={ ToggleField }
							type="checkbox"
							name={ `wpseo_titles.display-metabox-pt-${ name }` }
							data-id={ `input-wpseo_titles-display-metabox-pt-${ name }` }
							label={ sprintf(
								/* translators: %1$s expands to Yoast SEO. %2$s expands to the post type plural, e.g. Posts. */
								__( "Enable %1$s for %2$s pages", "wordpress-seo" ),
								"Yoast SEO",
								label
							) }
							description={ sprintf(
								/* translators: %1$s expands to the post type plural, e.g. Posts. */
								__( "This enables SEO metadata editing and our SEO - and Readability analysis for individual %1$s.", "wordpress-seo" ),
								label
							) }
						/>
					</FieldsetLayout>
				</AnimateHeight>
			</div>
		</FormLayout>
	);
};

export default Media;
