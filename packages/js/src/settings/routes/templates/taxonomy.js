import { createInterpolateElement, useMemo, useCallback, useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Code, FeatureUpsell, Link, ToggleField } from "@yoast/ui-library";
import { useFormikContext } from "formik";
import { initial, last, map, values, isEmpty } from "lodash";
import PropTypes from "prop-types";
import {
	FieldsetLayout,
	FormikFlippedToggleField,
	FormikMediaSelectField,
	FormikReplacementVariableEditorField,
	FormikValueChangeField,
	FormLayout,
	OpenGraphDisabledAlert,
	RouteLayout,
} from "../../components";
import { safeToLocaleLower } from "../../helpers";
import { withFormikDummyField } from "../../hocs";
import { useSelectSettings, useDispatchSettings } from "../../hooks";

const FormikReplacementVariableEditorFieldWithDummy = withFormikDummyField( FormikReplacementVariableEditorField );

/**
 * @param {string} name The taxonomy name.
 * @param {string} label The taxonomy label (plural).
 * @param {string[]} postTypes The connected post types.
 * @param {boolean} showUi Whether the taxonomy has a UI.
 * @param {boolean} isNew Whether the taxonomy is new.
 * @returns {JSX.Element} The taxonomy element.
 */
const Taxonomy = ( { name, label, postTypes: postTypeNames, showUi, isNew } ) => {
	const postTypes = useSelectSettings( "selectPostTypes", [ postTypeNames ], postTypeNames );
	const premiumUpsellConfig = useSelectSettings( "selectUpsellSettingsAsProps" );
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [ name ], name, "term-in-custom-taxonomy" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [ name ], name, "term-in-custom-taxonomy" );
	const noIndexInfoLink = useSelectSettings( "selectLink", [], "https://yoa.st/show-x" );
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const userLocale = useSelectSettings( "selectPreference", [], "userLocale" );
	const editTaxonomyUrl = useSelectSettings( "selectPreference", [], "editTaxonomyUrl" );

	const socialAppearancePremiumLink = useSelectSettings( "selectLink", [], "https://yoa.st/4e0" );

	const labelLower = useMemo( () => safeToLocaleLower( label, userLocale ), [ label, userLocale ] );
	const postTypeValues = useMemo( () => values( postTypes ), [ postTypes ] );
	const initialPostTypeValues = useMemo( () => initial( postTypeValues ), [ postTypeValues ] );
	const lastPostTypeValue = useMemo( () => last( postTypeValues ), [ postTypeValues ] );
	const { updateTaxonomyReviewStatus } = useDispatchSettings();

	useEffect( () => {
		if ( isNew ) {
			updateTaxonomyReviewStatus( name );
		}
	}, [ name, updateTaxonomyReviewStatus ] );

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

	const stripCategoryBaseDescription = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %s expands to <code>/category/</code> */
			__( "Category URLs in WordPress contain a prefix, usually %s. Show or hide that prefix in category URLs.", "wordpress-seo" ),
			"<code />"
		),
		{
			code: <Code>/category/</Code>,
		}
	), [] );

	const taxonomyMultiplePostTypesMessage = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s and %2$s expand to post type plurals in code blocks, e.g. Posts Pages and Custom Post Type.
			 */
			__( "This taxonomy is used for %1$s and %2$s.", "wordpress-seo" ),
			"<code1 />",
			"<code2 />"
		), {
			code1: <>
				{ map( initialPostTypeValues, ( postType, index ) => (
					<>
						<Code key={ postType?.name }>{ postType?.label }</Code>
						{ index < initialPostTypeValues.length - 1 && " " }
					</>
				) ) }
			</>,
			code2: <Code>{ lastPostTypeValue?.label }</Code>,
		}
	), [ label, initialPostTypeValues, lastPostTypeValue ] );

	const taxonomySinglePostTypeMessage = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to the post type plural in code block, e.g. Posts.
			 */
			__( "This taxonomy is used for %2$s.", "wordpress-seo" ),
			label,
			"<code />"
		), {
			code: <Code>{ lastPostTypeValue?.label }</Code>,
		}
	), [ label, lastPostTypeValue ] );

	const { values: formValues } = useFormikContext();
	const { opengraph } = formValues.wpseo_social;

	const taxonomyMessage = useMemo( () => {
		return initialPostTypeValues.length > 1 ? taxonomyMultiplePostTypesMessage : taxonomySinglePostTypeMessage;
	}, [ initialPostTypeValues, taxonomyMultiplePostTypesMessage, taxonomySinglePostTypeMessage ] );

	const enableSeoControl = useCallback( () => {
		return showUi && <FormikValueChangeField
			as={ ToggleField }
			type="checkbox"
			name={ `wpseo_titles.display-metabox-tax-${ name }` }
			id={ `input-wpseo_titles-display-metabox-tax-${ name }` }
			label={ __( "Enable SEO controls and assessments", "wordpress-seo" ) }
			description={ __( "Show or hide our tools and controls in the content editor.", "wordpress-seo" ) }
			className="yst-max-w-sm"
		/>;
	}, [ showUi, name ] );

	const stripCategoryBase = useCallback( () => {
		return name === "category" && <FormikFlippedToggleField
			name="wpseo_titles.stripcategorybase"
			id="input-wpseo_titles-stripcategorybase"
			label={ __( "Show the categories prefix in the slug", "wordpress-seo" ) }
			description={ stripCategoryBaseDescription }
			className="yst-max-w-sm"
		/>;
	}, [ name, stripCategoryBaseDescription ] );

	const taxonomyNameMessage = useMemo( () => {
		return createInterpolateElement(
			sprintf(
				/**
				 * translators: %1$s expands to the name of the taxonomy.
				 */
				__( "The name of this category is %1$s.", "wordpress-seo" ),
				"<link />"
			), {
				link: <Link href={ `${ editTaxonomyUrl }?taxonomy=${ name }` }>
					{ name }
				</Link>,
			}
		);
	}, [ name ] );

	return (
		<RouteLayout
			title={ label }
			description={ <>
				{ sprintf(
					/* translators: %1$s expands to the taxonomy plural, e.g. categories. */
					__( "Determine how your %1$s should look in search engines and on social media.", "wordpress-seo" ),
					labelLower
				) }
				<br />
				{ isEmpty( postTypeValues ) ? taxonomyNameMessage : taxonomyMessage }
			</> }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<FieldsetLayout
						title={ __( "Search appearance", "wordpress-seo" ) }
						description={ sprintf(
							// translators: %1$s expands to the post type plural, e.g. Posts. %2$s expands to "Yoast SEO".
							__( "Determine what your %1$s should look like in the search results by default. You can always customize the settings for individual %1$s in the %2$s metabox.", "wordpress-seo" ),
							labelLower,
							"Yoast SEO"
						) }
					>
						<FormikFlippedToggleField
							name={ `wpseo_titles.noindex-tax-${ name }` }
							id={ `input-wpseo_titles-noindex-tax-${ name }` }
							label={ sprintf(
							// translators: %1$s expands to the taxonomy plural, e.g. Categories.
								__( "Show %1$s in search results", "wordpress-seo" ),
								labelLower
							) }
							description={ <>
								{ sprintf(
								// translators: %1$s expands to the taxonomy plural, e.g. Categories.
									__( "Disabling this means that archive pages for %1$s will not be indexed by search engines and will be excluded from XML sitemaps.", "wordpress-seo" ),
									labelLower
								) }
								&nbsp;
								<Link href={ noIndexInfoLink } target="_blank" rel="noopener">
									{ __( "Read more about the search results settings", "wordpress-seo" ) }
								</Link>
								.
							</> }
							className="yst-max-w-sm"
						/>
						<hr className="yst-my-8" />
						<FormikReplacementVariableEditorField
							type="title"
							name={ `wpseo_titles.title-tax-${ name }` }
							fieldId={ `input-wpseo_titles-title-tax-${ name }` }
							label={ __( "SEO title", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
						/>
						<FormikReplacementVariableEditorField
							type="description"
							name={ `wpseo_titles.metadesc-tax-${ name }` }
							fieldId={ `input-wpseo_titles-metadesc-tax-${ name }` }
							label={ __( "Meta description", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
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
						// translators: %1$s expands to the taxonomy plural, e.g. Categories. %2$s expand to Yoast SEO.
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
								disabled={ ! opengraph }
								isDummy={ ! isPremium }
							/>
							<FormikReplacementVariableEditorFieldWithDummy
								type="title"
								name={ `wpseo_titles.social-title-tax-${ name }` }
								fieldId={ `input-wpseo_titles-social-title-tax-${ name }` }
								label={ __( "Social title", "wordpress-seo" ) }
								replacementVariables={ replacementVariables }
								recommendedReplacementVariables={ recommendedReplacementVariables }
								disabled={ ! opengraph }
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
								disabled={ ! opengraph }
								isDummy={ ! isPremium }
							/>
						</FeatureUpsell>
					</FieldsetLayout>

					{ ( showUi || name === "category" ) &&
					<>
						<hr className="yst-my-8" />
						<FieldsetLayout
							title={ __( "Additional settings", "wordpress-seo" ) }
						>
							{ enableSeoControl() }
							{ stripCategoryBase() }
						</FieldsetLayout>
					</> }
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

Taxonomy.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	postTypes: PropTypes.arrayOf( PropTypes.string ).isRequired,
	showUi: PropTypes.bool.isRequired,
	isNew: PropTypes.bool.isRequired,
};

export default Taxonomy;
