import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Link, SelectField, ToggleField } from "@yoast/ui-library";
import { useFormikContext } from "formik";
import {
	FieldsetLayout,
	FormikFlippedToggleField,
	FormikReplacementVariableEditorField,
	FormikValueChangeField,
	FormLayout,
	NewsSeoAlert,
	RouteLayout,
} from "../components";
import { safeToLocaleLower } from "../helpers";
import { useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The media pages route.
 */
const MediaPages = () => {
	const { name, label, hasSchemaArticleType } = useSelectSettings( "selectPostType", [], "attachment" );
	const userLocale = useSelectSettings( "selectPreference", [], "userLocale" );
	const labelLower = useMemo( () => safeToLocaleLower( label, userLocale ), [ label, userLocale ] );

	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [ name ], name, "custom_post_type" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [ name ], name, "custom_post_type" );
	const articleTypes = useSelectSettings( "selectArticleTypeValuesFor", [ name ], name );
	const pageTypes = useSelectSettings( "selectPageTypeValuesFor", [ name ], name );
	const thinContentProblemsInfoLink = useSelectSettings( "selectLink", [], "https://yoa.st/media-pages-thin-content" );
	const noIndexInfoLink = useSelectSettings( "selectLink", [], "https://yoa.st/show-x" );

	const { values } = useFormikContext();
	const {
		"disable-attachment": isAttachmentPagesDisabled,
		"noindex-attachment": isAttachmentPagesNoIndex,
	} = values.wpseo_titles;

	const description = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s and %2$s are replaced by opening and closing <a> tags.
			 * %3$s expands to "media".
			 * %4$s expand to "Yoast SEO".
			 * %5$s expand to "WordPress".
			 */
			__( "When you upload media (e.g. an image or video), %5$s automatically creates a %3$s page (attachment URL) for it. These pages are quite empty and could cause %1$sthin content problems and lead to excess pages on your site%2$s. Therefore, %4$s disables them by default (and redirects the attachment URL to the media itself).", "wordpress-seo" ),
			"<a>",
			"</a>",
			labelLower,
			"Yoast SEO",
			"WordPress"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ thinContentProblemsInfoLink } target="_blank" rel="noopener noreferrer" />,
		}
	) );

	return (
		<RouteLayout
			title={ sprintf(
				// translators: %1$s expands to "Media".
				__( "%1$s pages", "wordpress-seo" ),
				label
			) }
			description={ description }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<fieldset className="yst-min-width-0 yst-space-y-8">
						<FormikFlippedToggleField
							name={ `wpseo_titles.disable-${ name }` }
							id={ `input-wpseo_titles-disable-${ name }` }
							label={ sprintf(
								// translators: %1$s expands to "media".
								__( "Enable %1$s pages", "wordpress-seo" ),
								labelLower
							) }
							description={ sprintf(
								// translators: %1$s expands to "media".
								__( "We recommend keeping %1$s pages disabled. This will cause all attachment URLs to be redirected to the media itself.", "wordpress-seo" ),
								labelLower
							) }
							className="yst-max-w-sm"
						/>
					</fieldset>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ __( "Search appearance", "wordpress-seo" ) }
						description={ sprintf(
							// translators: %1$s expands to "media". %3$s expands to "Yoast SEO".
							__( "Determine how your %1$s pages should look in search engines. You can always customize the settings for individual %1$s pages in the %2$s metabox.", "wordpress-seo" ),
							labelLower,
							"Yoast SEO"
						) }
					>
						<FormikFlippedToggleField
							name={ `wpseo_titles.noindex-${ name }` }
							id={ `input-wpseo_titles-noindex-${ name }` }
							label={ sprintf(
								// translators: %1$s expands to "media".
								__( "Show %1$s pages in search results", "wordpress-seo" ),
								labelLower
							) }
							description={ <>
								{ sprintf(
									// translators: %1$s expands to "media".
									__( "Disabling this means that %1$s pages created by WordPress will not be indexed by search engines and will be excluded from XML sitemaps.", "wordpress-seo" ),
									labelLower
								) }
								<br />
								<Link href={ noIndexInfoLink } target="_blank" rel="noopener">
									{ __( "Read more about the search results settings", "wordpress-seo" ) }
								</Link>
								.
							</> }
							disabled={ isAttachmentPagesDisabled }
							/* If the archive is disabled then show as disabled. Otherwise, use the actual value (but flipped). */
							checked={ isAttachmentPagesDisabled ? false : ! isAttachmentPagesNoIndex }
							className="yst-max-w-sm"
						/>
						<FormikReplacementVariableEditorField
							type="title"
							name={ `wpseo_titles.title-${ name }` }
							fieldId={ `input-wpseo_titles-title-${ name }` }
							label={ __( "SEO title", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
							disabled={ isAttachmentPagesDisabled }
						/>
						<FormikReplacementVariableEditorField
							type="description"
							name={ `wpseo_titles.metadesc-${ name }` }
							fieldId={ `input-wpseo_titles-metadesc-${ name }` }
							label={ __( "Meta description", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
							disabled={ isAttachmentPagesDisabled }
							className="yst-replacevar--description"
						/>
					</FieldsetLayout>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ __( "Schema", "wordpress-seo" ) }
						description={ sprintf(
							// translators: %1$s expands to "media". %3$s expands to "Yoast SEO".
							__( "Determine how your %1$s pages should be described by default in your site's Schema.org markup. You can always customize the settings for individual %1$s pages in the %2$s metabox.", "wordpress-seo" ),
							labelLower,
							"Yoast SEO"
						) }
					>
						<FormikValueChangeField
							as={ SelectField }
							type="select"
							name={ `wpseo_titles.schema-page-type-${ name }` }
							id={ `input-wpseo_titles-schema-page-type-${ name }` }
							label={ __( "Page type", "wordpress-seo" ) }
							options={ pageTypes }
							disabled={ isAttachmentPagesDisabled }
							className="yst-max-w-sm"
						/>
						{ hasSchemaArticleType && (
							<div>
								<FormikValueChangeField
									as={ SelectField }
									type="select"
									name={ `wpseo_titles.schema-article-type-${ name }` }
									id={ `input-wpseo_titles-schema-article-type-${ name }` }
									label={ __( "Article type", "wordpress-seo" ) }
									options={ articleTypes }
									disabled={ isAttachmentPagesDisabled }
									className="yst-max-w-sm"
								/>
								<NewsSeoAlert name={ name } disabled={ isAttachmentPagesDisabled } />
							</div>
						) }
					</FieldsetLayout>
					<hr className="yst-my-8" />
					<FieldsetLayout title={ __( "Additional settings", "wordpress-seo" ) }>
						<FormikValueChangeField
							as={ ToggleField }
							type="checkbox"
							name={ `wpseo_titles.display-metabox-pt-${ name }` }
							id={ `input-wpseo_titles-display-metabox-pt-${ name }` }
							label={ __( "Enable SEO controls and assessments", "wordpress-seo" ) }
							description={ __( "Show or hide our tools and controls in the attachment editor.", "wordpress-seo" ) }
							disabled={ isAttachmentPagesDisabled }
							className="yst-max-w-sm"
						/>
					</FieldsetLayout>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default MediaPages;
