import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Code, Link } from "@yoast/ui-library";
import FeatureUpsell from "@yoast/ui-library/src/components/feature-upsell";
import { useFormikContext } from "formik";
import AnimateHeight from "react-animate-height";
import { toLower } from "lodash";
import {
	FieldsetLayout,
	FormikFlippedToggleField,
	FormikMediaSelectField,
	FormikReplacementVariableEditorField,
	FormLayout,
	OpenGraphDisabledAlert,
	RouteLayout,
} from "../components";
import { withFormikDummyField } from "../hocs";
import { useSelectSettings } from "../hooks";

const FormikReplacementVariableEditorFieldWithDummy = withFormikDummyField( FormikReplacementVariableEditorField );

/**
 * @returns {JSX.Element} The author archives route.
 */
const AuthorArchives = () => {
	const label = __( "Author archives", "wordpress-seo" );
	const singularLabel = __( "Author archive", "wordpress-seo" );
	const labelLower = useMemo( ()=> toLower( label ), [ label ] );
	const singularLabelLower = useMemo( ()=> toLower( singularLabel ), [ singularLabel ] );

	const getPremiumUpsellConfig =  useSelectSettings( "selectUpsellSetting", [] );
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
	) );

	const { values } = useFormikContext();
	const { opengraph } = values.wpseo_social;
	const { "disable-author": isAuthorDisabled, "noindex-author-wpseo": isAuthorNoIndex } = values.wpseo_titles;

	return (
		<RouteLayout
			title={ label }
			description={ description }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<FormikFlippedToggleField
						name={ "wpseo_titles.disable-author" }
						data-id={ "input-wpseo_titles-disable-author" }
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
					/>
					<hr className="yst-my-8" />
					<div className="yst-relative">
						<AnimateHeight
							easing="ease-in-out"
							duration={ 300 }
							height={ isAuthorDisabled ? 0 : "auto" }
							animateOpacity={ true }
						>
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
									data-id="input-wpseo_titles-noindex-author-wpseo"
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
										<br />
										<Link href={ noIndexInfoLink } target="_blank" rel="noopener">
											{ __( "Read more about the search results settings", "wordpress-seo" ) }
										</Link>
										.
									</> }
								/>
								{ ! isAuthorNoIndex && <FormikFlippedToggleField
									name="wpseo_titles.noindex-author-noposts-wpseo"
									data-id="input-wpseo_titles-noindex-author-noposts-wpseo"
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
								/> }
								<FormikReplacementVariableEditorField
									type="title"
									name="wpseo_titles.title-author-wpseo"
									fieldId="input-wpseo_titles-title-author-wpseo"
									label={ __( "SEO title", "wordpress-seo" ) }
									replacementVariables={ replacementVariables }
									recommendedReplacementVariables={ recommendedReplacementVariables }
								/>
								<FormikReplacementVariableEditorField
									type="description"
									name="wpseo_titles.metadesc-author-wpseo"
									fieldId="input-wpseo_titles-metadesc-author-wpseo"
									label={ __( "Meta description", "wordpress-seo" ) }
									replacementVariables={ replacementVariables }
									recommendedReplacementVariables={ recommendedReplacementVariables }
									className="yst-replacevar--description"
								/>
							</FieldsetLayout>
							<hr className="yst-my-8" />
							<FieldsetLayout
								title={ <div className="yst-flex yst-items-center yst-gap-1.5">
									<span>{ __( "Social appearance", "wordpress-seo" ) }</span>
									{ isPremium && <Badge variant="upsell">Premium</Badge> }
								</div> }
								description={ sprintf(
									// translators: %1$s expands to "author archives".
									__( "Determine how your %1$s should look on social media by default.", "wordpress-seo" ),
									labelLower
								) }
							>
								<FeatureUpsell
									shouldUpsell={ ! isPremium }
									variant="card"
									cardLink={ socialAppearancePremiumLink }
									upsellButtonAction={ getPremiumUpsellConfig.actionId }
									upsellButtonCtbId={ getPremiumUpsellConfig.premiumCtbId }
									cardText={ sprintf(
										/* translators: %1$s expands to Premium. */
										__( "Unlock with %1$s", "wordpress-seo" ),
										"Premium"
									) }
								>
									<OpenGraphDisabledAlert isEnabled={ ! isPremium || opengraph } />
									<FormikMediaSelectField
										id="wpseo_titles-social-image-author-wpseo"
										label={ __( "Social image", "wordpress-seo" ) }
										previewLabel={ recommendedSize }
										mediaUrlName="wpseo_titles.social-image-url-author-wpseo"
										mediaIdName="wpseo_titles.social-image-id-author-wpseo"
										disabled={ ! opengraph }
										isDummy={ ! isPremium }
									/>
									<FormikReplacementVariableEditorFieldWithDummy
										type="title"
										name="wpseo_titles.social-title-author-wpseo"
										fieldId="input-wpseo_titles-social-title-author-wpseo"
										label={ __( "Social title", "wordpress-seo" ) }
										replacementVariables={ replacementVariables }
										recommendedReplacementVariables={ recommendedReplacementVariables }
										isDisabled={ ! opengraph }
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
										isDisabled={ ! opengraph }
										isDummy={ ! isPremium }
									/>
								</FeatureUpsell>
							</FieldsetLayout>
						</AnimateHeight>
					</div>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default AuthorArchives;
