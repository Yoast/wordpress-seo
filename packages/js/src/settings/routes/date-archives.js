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
 * @returns {JSX.Element} The date archives route.
 */
const DateArchives = () => {
	const label = __( "Date archives", "wordpress-seo" );
	const userLocale = useSelectSettings( "selectPreference", [], "userLocale" );
	const labelLower = useMemo( () => safeToLocaleLower( label, userLocale ), [ label, userLocale ] );

	const premiumUpsellConfig = useSelectSettings( "selectUpsellSettingsAsProps" );
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [], "date_archive", "custom-post-type_archive" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [], "date_archive", "custom-post-type_archive" );
	const noIndexInfoLink = useSelectSettings( "selectLink", [], "https://yoa.st/show-x" );
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const socialAppearancePremiumLink = useSelectSettings( "selectLink", [], "https://yoa.st/4e0" );
	const exampleUrl = useSelectSettings( "selectExampleUrl", [], "/2020/" );

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
			 * translators: %1$s expands to "Date archives".
			 * %2$s expands to an example URL, e.g. https://example.com/author/example/.
			 * %3$s expands to "date archives".
			 */
			__( "%1$s (e.g. %2$s) are based on publication dates. From an SEO perspective, the posts in these archives have no real relation to the other posts except for their publication dates, which doesn’t say much about the content. They could also lead to duplicate content issues. This is why we recommend you to disable %3$s.", "wordpress-seo" ),
			label,
			"<exampleUrl />",
			labelLower
		),
		{
			exampleUrl: <Code>{ exampleUrl }</Code>,
		}
	) );

	const { values } = useFormikContext();
	const { opengraph } = values.wpseo_social;
	const {
		"disable-date": isDateArchivesDisabled,
		"noindex-archive-wpseo": isDateArchivesNoIndex,
	} = values.wpseo_titles;

	return (
		<RouteLayout
			title={ label }
			description={ description }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<fieldset className="yst-min-width-0 yst-space-y-8">
						<FormikFlippedToggleField
							name={ "wpseo_titles.disable-date" }
							id={ "input-wpseo_titles-disable-date" }
							label={ sprintf(
								// translators: %1$s expands to "date archives".
								__( "Enable %1$s", "wordpress-seo" ),
								labelLower
							) }
							description={ sprintf(
								// translators: %1$s expands to "Date archives".
								__( "%1$s can cause duplicate content issues. For most sites, we recommend that you disable this setting.", "wordpress-seo" ),
								label
							) }
							className="yst-max-w-sm"
						/>
					</fieldset>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ __( "Search appearance", "wordpress-seo" ) }
						description={ sprintf(
							// translators: %1$s expands to "date archives".
							__( "Determine how your %1$s should look in search engines.", "wordpress-seo" ),
							labelLower
						) }
					>
						<FormikFlippedToggleField
							name="wpseo_titles.noindex-archive-wpseo"
							id="input-wpseo_titles-noindex-archive-wpseo"
							label={ sprintf(
								// translators: %1$s expands to "date archives".
								__( "Show %1$s in search results", "wordpress-seo" ),
								labelLower
							) }
							description={ <>
								{ sprintf(
									// translators: %1$s expands to "date archives".
									__( "Disabling this means that %1$s will not be indexed by search engines and will be excluded from XML sitemaps. We recommend that you disable this setting.", "wordpress-seo" ),
									labelLower
								) }
								&nbsp;
								<Link href={ noIndexInfoLink } target="_blank" rel="noopener">
									{ __( "Read more about the search results settings", "wordpress-seo" ) }
								</Link>
								.
							</> }
							disabled={ isDateArchivesDisabled }
							/* If the archive is disabled then show as disabled. Otherwise, use the actual value (but flipped). */
							checked={ isDateArchivesDisabled ? false : ! isDateArchivesNoIndex }
							className="yst-max-w-sm"
						/>
						<FormikReplacementVariableEditorField
							type="title"
							name="wpseo_titles.title-archive-wpseo"
							fieldId="input-wpseo_titles-title-archive-wpseo"
							label={ __( "SEO title", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
							disabled={ isDateArchivesDisabled }
						/>
						<FormikReplacementVariableEditorField
							type="description"
							name="wpseo_titles.metadesc-archive-wpseo"
							fieldId="input-wpseo_titles-metadesc-archive-wpseo"
							label={ __( "Meta description", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
							disabled={ isDateArchivesDisabled }
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
							// translators: %1$s expands to "date archives".
							__( "Determine how your %1$s should look on social media by default.", "wordpress-seo" ),
							labelLower
						) }
					>
						<FeatureUpsell
							shouldUpsell={ ! isPremium }
							variant="card"
							cardLink={ socialAppearancePremiumLink }
							cardText={ sprintf(
								// translators: %1$s expands to Premium.
								__( "Unlock with %1$s", "wordpress-seo" ),
								"Premium"
							) }
							{ ...premiumUpsellConfig }
						>
							<OpenGraphDisabledAlert isEnabled={ ! isPremium || opengraph } />
							<FormikMediaSelectField
								id="wpseo_titles-social-image-archive-wpseo"
								label={ __( "Social image", "wordpress-seo" ) }
								previewLabel={ recommendedSize }
								mediaUrlName="wpseo_titles.social-image-url-archive-wpseo"
								mediaIdName="wpseo_titles.social-image-id-archive-wpseo"
								disabled={ isDateArchivesDisabled || ! opengraph }
								isDummy={ ! isPremium }
							/>
							<FormikReplacementVariableEditorFieldWithDummy
								type="title"
								name="wpseo_titles.social-title-archive-wpseo"
								fieldId="input-wpseo_titles-social-title-archive-wpseo"
								label={ __( "Social title", "wordpress-seo" ) }
								replacementVariables={ replacementVariables }
								recommendedReplacementVariables={ recommendedReplacementVariables }
								disabled={ isDateArchivesDisabled || ! opengraph }
								isDummy={ ! isPremium }
							/>
							<FormikReplacementVariableEditorFieldWithDummy
								type="description"
								name="wpseo_titles.social-description-archive-wpseo"
								fieldId="input-wpseo_titles-social-description-archive-wpseo"
								label={ __( "Social description", "wordpress-seo" ) }
								replacementVariables={ replacementVariables }
								recommendedReplacementVariables={ recommendedReplacementVariables }
								className="yst-replacevar--description"
								disabled={ isDateArchivesDisabled || ! opengraph }
								isDummy={ ! isPremium }
							/>
						</FeatureUpsell>
					</FieldsetLayout>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default DateArchives;
