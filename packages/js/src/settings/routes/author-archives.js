/* eslint-disable complexity */
import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Code, FeatureUpsell, Link } from "@yoast/ui-library";
import { useFormikContext } from "formik";
import {
	FieldsetLayout,
	FormikFlippedToggleField,
	FormikMediaSelectField,
	FormikReplacementVariableEditorField,
	FormLayout,
	OpenGraphDisabledAlert,
	RouteLayout,
} from "../components";
import { safeToLocaleLower } from "../helpers";
import { withFormikDummyField } from "../hocs";
import { useSelectSettings } from "../hooks";

const FormikReplacementVariableEditorFieldWithDummy = withFormikDummyField( FormikReplacementVariableEditorField );

/**
 * @returns {JSX.Element} The author archives route.
 */
const AuthorArchives = () => {
	const label = __( "Author archives", "wordpress-seo" );
	const singularLabel = __( "Author archive", "wordpress-seo" );
	const userLocale = useSelectSettings( "selectPreference", [], "userLocale" );
	const labelLower = useMemo( () => safeToLocaleLower( label, userLocale ), [ label, userLocale ] );
	const singularLabelLower = useMemo( () => safeToLocaleLower( singularLabel, userLocale ), [ singularLabel, userLocale ] );

	const premiumUpsellConfig = useSelectSettings( "selectUpsellSettingsAsProps" );
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [], "author_archives", "custom-post-type_archive" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [], "author_archives", "custom-post-type_archive" );
	const duplicateContentInfoLink = useSelectSettings( "selectLink", [], "https://yoa.st/duplicate-content" );
	const noIndexInfoLink = useSelectSettings( "selectLink", [], "https://yoa.st/show-x" );
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const exampleUrl = useSelectSettings( "selectExampleUrl", [], "/author/example/" );
	const socialAppearancePremiumLink = useSelectSettings( "selectLink", [], "https://yoa.st/4e0" );

	const recommendedSize = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening strong tag.
			 * %2$s expands to a closing strong tag.
			 * %3$s expands to the recommended image size.
			 */
			__( "Recommended size for this image is %1$s%3$s%2$s", "wordpress-seo" ),
			"<strong>",
			"</strong>",
			"1200x675px"
		),
		{
			strong: <strong className="yst-font-semibold" />,
		}
	), [] );
	const description = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to "author archive".
			 * %2$s expands to an example URL, e.g. https://example.com/author/example/.
			 * %3$s and %4$s expand to opening and closing <a> tags.
			 */
			__( "If you're running a one author blog, the %1$s (e.g. %2$s) will be exactly the same as your homepage. This is what's called a %3$sduplicate content problem%4$s. If this is the case on your site, you can choose to either disable it (which makes it redirect to the homepage), or prevent it from showing up in search results.", "wordpress-seo" ),
			singularLabelLower,
			"<exampleUrl />",
			"<a>",
			"</a>"
		),
		{
			exampleUrl: <Code>{ exampleUrl }</Code>,
			// eslint-disable-next-line jsx-a11y/anchor-has-content, react/jsx-no-target-blank
			a: <a href={ duplicateContentInfoLink } target="_blank" rel="noopener" />,
		}
	), [] );

	const { values } = useFormikContext();
	const { opengraph } = values.wpseo_social;
	const {
		"disable-author": isAuthorArchivesDisabled,
		"noindex-author-wpseo": isAuthorNoIndex,
		"noindex-author-noposts-wpseo": isAuthorNoIndexNoPosts,
	} = values.wpseo_titles;

	return (
		<RouteLayout
			title={ label }
			description={ description }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<FormikFlippedToggleField
						name={ "wpseo_titles.disable-author" }
						id={ "input-wpseo_titles-disable-author" }
						label={ sprintf(
							// translators: %1$s expands to "author archives".
							__( "Enable %1$s", "wordpress-seo" ),
							labelLower
						) }
						description={ sprintf(
							// translators: %1$s expands to "author archive".
							__( "Disabling this will redirect the %1$s to your site's homepage.", "wordpress-seo" ),
							singularLabelLower
						) }
						className="yst-max-w-sm"
					/>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ __( "Search appearance", "wordpress-seo" ) }
						description={ sprintf(
							// translators: %1$s expands to "author archives".
							__( "Determine how your %1$s should look in search engines.", "wordpress-seo" ),
							labelLower
						) }
					>
						<FormikFlippedToggleField
							name="wpseo_titles.noindex-author-wpseo"
							id="input-wpseo_titles-noindex-author-wpseo"
							label={ sprintf(
								// translators: %1$s expands to "author archives".
								__( "Show %1$s in search results", "wordpress-seo" ),
								labelLower
							) }
							description={ <>
								{ sprintf(
									// translators: %1$s expands to "author archives".
									__( "Disabling this means that %1$s will not be indexed by search engines and will be excluded from XML sitemaps.", "wordpress-seo" ),
									labelLower
								) }
								&nbsp;
								<Link href={ noIndexInfoLink } target="_blank" rel="noopener">
									{ __( "Read more about the search results settings", "wordpress-seo" ) }
								</Link>
								.
							</> }
							disabled={ isAuthorArchivesDisabled }
							/* If the archive is disabled then show as disabled. Otherwise, use the actual value (but flipped). */
							checked={ isAuthorArchivesDisabled ? false : ! isAuthorNoIndex }
							className="yst-max-w-sm"
						/>
						<FormikFlippedToggleField
							name="wpseo_titles.noindex-author-noposts-wpseo"
							id="input-wpseo_titles-noindex-author-noposts-wpseo"
							label={ sprintf(
								// translators: %1$s expands to "author archives".
								__( "Show %1$s without posts in search results", "wordpress-seo" ),
								labelLower
							) }
							description={ sprintf(
								// translators: %1$s expands to "author archives".
								__( "Disabling this means that %1$s without any posts will not be indexed by search engines and will be excluded from XML sitemaps.", "wordpress-seo" ),
								labelLower
							) }
							checked={ isAuthorArchivesDisabled ? false : ! isAuthorNoIndex && ! isAuthorNoIndexNoPosts }
							disabled={ isAuthorArchivesDisabled || isAuthorNoIndex }
							className="yst-max-w-sm"
						/>
						<FormikReplacementVariableEditorField
							type="title"
							name="wpseo_titles.title-author-wpseo"
							fieldId="input-wpseo_titles-title-author-wpseo"
							label={ __( "SEO title", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
							disabled={ isAuthorArchivesDisabled }
						/>
						<FormikReplacementVariableEditorField
							type="description"
							name="wpseo_titles.metadesc-author-wpseo"
							fieldId="input-wpseo_titles-metadesc-author-wpseo"
							label={ __( "Meta description", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
							disabled={ isAuthorArchivesDisabled }
							className="yst-replacevar--description"
						/>
					</FieldsetLayout>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ <div className="yst-flex yst-items-center yst-gap-1.5">
							<span>{ __( "Social media appearance", "wordpress-seo" ) }</span>
							{ isPremium && <Badge variant="upsell">Premium</Badge> }
						</div> }
						description={ sprintf(
							// translators: %1$s expands to "author archives".
							__( "Determine how your %1$s should look on social media.", "wordpress-seo" ),
							labelLower
						) }
					>
						<FeatureUpsell
							shouldUpsell={ ! isPremium }
							variant="card"
							cardLink={ socialAppearancePremiumLink }
							cardText={ sprintf(
								/* translators: %1$s expands to Premium. */
								__( "Unlock with %1$s", "wordpress-seo" ),
								"Premium"
							) }
							{ ...premiumUpsellConfig }
						>
							<OpenGraphDisabledAlert isEnabled={ ! isPremium || opengraph } />
							<FormikMediaSelectField
								id="wpseo_titles-social-image-author-wpseo"
								label={ __( "Social image", "wordpress-seo" ) }
								previewLabel={ recommendedSize }
								mediaUrlName="wpseo_titles.social-image-url-author-wpseo"
								mediaIdName="wpseo_titles.social-image-id-author-wpseo"
								disabled={ isAuthorArchivesDisabled || ! opengraph }
								isDummy={ ! isPremium }
							/>
							<FormikReplacementVariableEditorFieldWithDummy
								type="title"
								name="wpseo_titles.social-title-author-wpseo"
								fieldId="input-wpseo_titles-social-title-author-wpseo"
								label={ __( "Social title", "wordpress-seo" ) }
								replacementVariables={ replacementVariables }
								recommendedReplacementVariables={ recommendedReplacementVariables }
								disabled={ isAuthorArchivesDisabled || ! opengraph }
								isDummy={ ! isPremium }
							/>
							<FormikReplacementVariableEditorFieldWithDummy
								type="description"
								name="wpseo_titles.social-description-author-wpseo"
								fieldId="input-wpseo_titles-social-description-author-wpseo"
								label={ __( "Social description", "wordpress-seo" ) }
								replacementVariables={ replacementVariables }
								recommendedReplacementVariables={ recommendedReplacementVariables }
								className="yst-replacevar--description"
								disabled={ isAuthorArchivesDisabled || ! opengraph }
								isDummy={ ! isPremium }
							/>
						</FeatureUpsell>
					</FieldsetLayout>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default AuthorArchives;
