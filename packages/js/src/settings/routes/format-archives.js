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
 * Presents the `post_format` taxonomy.
 *
 * Mostly a copy from the taxonomy template, differences:
 * - disable toggle at the top, that shows/hides the rest
 * - removed the other exceptions
 *
 * @returns {JSX.Element} The format archives element.
 */
const FormatArchives = () => {
	const { name, label, singularLabel } = useSelectSettings( "selectTaxonomy", [], "post_format" );
	const userLocale = useSelectSettings( "selectPreference", [], "userLocale" );
	const labelLower = useMemo( () => safeToLocaleLower( label, userLocale ), [ label, userLocale ] );
	const singularLabelLower = useMemo( () => safeToLocaleLower( singularLabel, userLocale ), [ singularLabel, userLocale ] );

	const premiumUpsellConfig = useSelectSettings( "selectUpsellSettingsAsProps" );
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [ name ], name, "term-in-custom-taxonomy" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [ name ], name, "term-in-custom-taxonomy" );
	const noIndexInfoLink = useSelectSettings( "selectLink", [], "https://yoa.st/show-x" );
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const socialAppearancePremiumLink = useSelectSettings( "selectLink", [], "https://yoa.st/4e0" );
	const exampleUrl = useSelectSettings( "selectExampleUrl", [], "/format/example/" );

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
			/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
			__( "(e.g., %1$s)", "wordpress-seo" ),
			"<exampleUrl />"
		),
		{
			exampleUrl: <Code>{ exampleUrl }</Code>,
		}
	) );

	const { values } = useFormikContext();
	const { opengraph } = values.wpseo_social;
	const {
		"disable-post_format": isFormatArchivesDisabled,
		"noindex-tax-post_format": isFormatArchivesNoIndex,
	} = values.wpseo_titles;

	return (
		<RouteLayout
			title={ __( "Format archives", "wordpress-seo" ) }
			description={ description }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<FormikFlippedToggleField
						name="wpseo_titles.disable-post_format"
						id="input-wpseo_titles-disable-post_format"
						label={ __( "Enable format-based archives", "wordpress-seo" ) }
						description={ __( "Format-based archives can cause duplicate content issues. For most sites, we recommend that you disable this setting.", "wordpress-seo" ) }
						className="yst-max-w-sm"
					/>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ __( "Search appearance", "wordpress-seo" ) }
						description={ sprintf(
							// translators: %1$s expands to "formats". %2$s expands to "Yoast SEO".
							__( "Determine how your %1$s should look in search engines. You can always customize the settings for individual %1$s in the %2$s metabox.", "wordpress-seo" ),
							labelLower,
							"Yoast SEO"
						) }
					>
						<FormikFlippedToggleField
							name={ `wpseo_titles.noindex-tax-${ name }` }
							id={ `input-wpseo_titles-noindex-tax-${ name }` }
							label={ sprintf(
								// translators: %1$s expands to "format".
								__( "Show %1$s archives in search results", "wordpress-seo" ),
								singularLabelLower
							) }
							description={ <>
								{ sprintf(
									// translators: %1$s expands to "formats".
									__( "Disabling this means that %1$s will not be indexed by search engines and will be excluded from XML sitemaps. We recommend that you disable this setting.", "wordpress-seo" ),
									labelLower
								) }
								&nbsp;
								<Link href={ noIndexInfoLink } target="_blank" rel="noopener">
									{ __( "Read more about the search results settings", "wordpress-seo" ) }
								</Link>
								.
							</> }
							disabled={ isFormatArchivesDisabled }
							/* If the archive is disabled then show as disabled. Otherwise, use the actual value (but flipped). */
							checked={ isFormatArchivesDisabled ? false : ! isFormatArchivesNoIndex }
							className="yst-max-w-sm"
						/>
						<FormikReplacementVariableEditorField
							type="title"
							name={ `wpseo_titles.title-tax-${ name }` }
							fieldId={ `input-wpseo_titles-title-tax-${ name }` }
							label={ __( "SEO title", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
							disabled={ isFormatArchivesDisabled }
						/>
						<FormikReplacementVariableEditorField
							type="description"
							name={ `wpseo_titles.metadesc-tax-${ name }` }
							fieldId={ `input-wpseo_titles-metadesc-tax-${ name }` }
							label={ __( "Meta description", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
							disabled={ isFormatArchivesDisabled }
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
							// translators: %1$s expands to "formats". %2$s expands to "Yoast SEO".
							__( "Determine how your %1$s should look on social media by default. You can always customize the settings for individual %1$s in the %2$s metabox.", "wordpress-seo" ),
							labelLower,
							"Yoast SEO"
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
								id={ `wpseo_titles-social-image-tax-${ name }` }
								label={ __( "Social image", "wordpress-seo" ) }
								previewLabel={ recommendedSize }
								mediaUrlName={ `wpseo_titles.social-image-url-tax-${ name }` }
								mediaIdName={ `wpseo_titles.social-image-id-tax-${ name }` }
								disabled={ isFormatArchivesDisabled || ! opengraph }
								isDummy={ ! isPremium }
							/>
							<FormikReplacementVariableEditorFieldWithDummy
								type="title"
								name={ `wpseo_titles.social-title-tax-${ name }` }
								fieldId={ `input-wpseo_titles-social-title-tax-${ name }` }
								label={ __( "Social title", "wordpress-seo" ) }
								replacementVariables={ replacementVariables }
								recommendedReplacementVariables={ recommendedReplacementVariables }
								disabled={ isFormatArchivesDisabled || ! opengraph }
								isDummy={ ! isPremium }
							/>
							<FormikReplacementVariableEditorFieldWithDummy
								type="description"
								name={ `wpseo_titles.social-description-tax-${ name }` }
								fieldId={ `input-wpseo_titles-social-description-tax-${ name }` }
								label={ __( "Social description", "wordpress-seo" ) }
								replacementVariables={ replacementVariables }
								recommendedReplacementVariables={ recommendedReplacementVariables }
								className="yst-replacevar--description"
								disabled={ isFormatArchivesDisabled || ! opengraph }
								isDummy={ ! isPremium }
							/>
						</FeatureUpsell>
					</FieldsetLayout>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default FormatArchives;
