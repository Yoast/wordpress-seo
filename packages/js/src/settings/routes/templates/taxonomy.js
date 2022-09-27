import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Link, ToggleField } from "@yoast/ui-library";
import { useFormikContext } from "formik";
import { map } from "lodash";
import PropTypes from "prop-types";
import {
	FieldsetLayout,
	FormikFlippedToggleField,
	FormikMediaSelectField,
	FormikReplacementVariableEditorField,
	FormikValueChangeField,
	FormLayout,
	OpenGraphDisabledAlert,
	PremiumUpsellFeature,
} from "../../components";
import { withFormikDummyField } from "../../hocs";
import { useSelectSettings } from "../../hooks";

const FormikMediaSelectFieldWithDummy = withFormikDummyField( FormikMediaSelectField );
const FormikReplacementVariableEditorFieldWithDummy = withFormikDummyField( FormikReplacementVariableEditorField );

/**
 * @param {string} name The taxonomy name.
 * @param {string} label The taxonomy label (plural).
 * @param {string} singularLabel The taxonomy label (singular).
 * @param {string[]} postTypes The connected post types.
 * @returns {JSX.Element} The taxonomy element.
 */
const Taxonomy = ( { name, label, singularLabel, postTypes: postTypeNames } ) => {
	const postTypes = useSelectSettings( "selectPostTypes", [ postTypeNames ], postTypeNames );
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [ name ], name, "term-in-custom-taxonomy" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [ name ], name, "term-in-custom-taxonomy" );
	const noIndexInfoLink = useSelectSettings( "selectLink", [], "https://yoa.st/show-x" );
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
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
			"1200x630px"
		),
		{
			strong: <strong className="yst-font-semibold" />,
		}
	), [] );
	const stripCategoryBaseDescription = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %s expands to <code>/category/</code> */
			__( "Category URLs in WordPress contain a prefix, usually %s. This enables that prefix, for categories only.", "wordpress-seo" ),
			"<code />"
		),
		{
			code: <code>/category/</code>,
		}
	), [] );

	const { values } = useFormikContext();
	const { opengraph } = values.wpseo_social;

	return (
		<FormLayout
			title={ <div className="yst-flex yst-items-center yst-gap-1.5">
				<span>{ label }</span>
				{ map(
					postTypes,
					( { name: postTypeName, label: postTypeLabel } ) => <Badge key={ postTypeName } variant="plain">{ postTypeLabel }</Badge>
				) }
			</div> }
			description={ sprintf(
				/* translators: %1$s expands to the taxonomy plural, e.g. Categories. */
				__( "Choose how your %1$s should look in search engines and on social media.", "wordpress-seo" ),
				label
			) }
		>
			<FieldsetLayout
				title={ __( "Search appearance", "wordpress-seo" ) }
				description={ sprintf(
					// translators: %1$s expands to the taxonomy plural, e.g. Categories. %2$s expands to the taxonomy singular, e.g. Category.
					__( "Choose how your %1$s should look in search engines. You can always customize this per individual %2$s.", "wordpress-seo" ),
					label,
					singularLabel
				) }
			>
				<FormikFlippedToggleField
					name={ `wpseo_titles.noindex-tax-${ name }` }
					data-id={ `input-wpseo_titles-noindex-tax-${ name }` }
					label={ sprintf(
						// translators: %1$s expands to the taxonomy plural, e.g. Categories.
						__( "Show %1$s in search results", "wordpress-seo" ),
						label
					) }
					description={ <>
						{ sprintf(
							// translators: %1$s expands to the taxonomy plural, e.g. Categories.
							__( "Disabling this means that %1$s will not be indexed by search engines and will be excluded from XML sitemaps.", "wordpress-seo" ),
							label
						) }
						<br />
						<Link href={ noIndexInfoLink } target="_blank" rel="noreferrer">
							{ __( "Read more about the search results settings", "wordpress-seo" ) }
						</Link>
						.
					</> }
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
					<span>{ __( "Social appearance", "wordpress-seo" ) }</span>
					{ isPremium && <Badge variant="upsell">Premium</Badge> }
				</div> }
				description={ sprintf(
					// translators: %1$s expands to the taxonomy plural, e.g. Categories. %2$s expands to the taxonomy singular, e.g. Category.
					__( "Choose how your %1$s should look on social media by default. You can always customize this per individual %2$s.", "wordpress-seo" ),
					label,
					singularLabel
				) }
			>
				<PremiumUpsellFeature variant="card" premiumLink={ socialAppearancePremiumLink }>
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
					<FormikReplacementVariableEditorField
						type="title"
						name={ `wpseo_titles.social-title-tax-${ name }` }
						fieldId={ `input-wpseo_titles-social-title-tax-${ name }` }
						label={ __( "Social title", "wordpress-seo" ) }
						replacementVariables={ replacementVariables }
						recommendedReplacementVariables={ recommendedReplacementVariables }
						isDisabled={ ! opengraph }
						isDummy={ ! isPremium }
					/>
					<FormikReplacementVariableEditorField
						type="description"
						name={ `wpseo_titles.social-description-tax-${ name }` }
						fieldId={ `input-wpseo_titles-social-description-tax-${ name }` }
						label={ __( "Social description", "wordpress-seo" ) }
						replacementVariables={ replacementVariables }
						recommendedReplacementVariables={ recommendedReplacementVariables }
						className="yst-replacevar--description"
						isDisabled={ ! opengraph }
						isDummy={ ! isPremium }
					/>
				</PremiumUpsellFeature>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Additional settings", "wordpress-seo" ) }
			>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name={ `wpseo_titles.display-metabox-tax-${ name }` }
					data-id={ `input-wpseo_titles-display-metabox-tax-${ name }` }
					label={ __( "Enable SEO controls and assessments", "wordpress-seo" ) }
					description={ __( "Show or hide our tools and controls in the content editor.", "wordpress-seo" ) }
				/>
				{ name === "category" && <FormikFlippedToggleField
					name="wpseo_titles.stripcategorybase"
					data-id="input-wpseo_titles-stripcategorybase"
					label={ __( "Keep the categories prefix in the slug", "wordpress-seo" ) }
					description={ stripCategoryBaseDescription }
				/> }
			</FieldsetLayout>
		</FormLayout>
	);
};

Taxonomy.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	singularLabel: PropTypes.string.isRequired,
	postTypes: PropTypes.arrayOf( PropTypes.string ).isRequired,
};

export default Taxonomy;
