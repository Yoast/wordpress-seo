import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, SelectField, TextField, Title, ToggleField } from "@yoast/ui-library";
import classNames from "classnames";
import { Field, useFormikContext } from "formik";
import PropTypes from "prop-types";
import { addLinkToString } from "../../../helpers/stringHelpers";
import {
	FieldsetLayout,
	FormikFlippedToggleField,
	FormikMediaSelectField,
	FormikReplacementVariableEditorField,
	FormikValueChangeField,
	FormLayout,
	OpenGraphDisabledAlert,
} from "../../components";
import FormikTagField from "../../components/formik-tag-field";
import { useSelectSettings } from "../../store";

/**
 * @param {string} name The post type name.
 * @param {string} label The post type label (plural).
 * @param {string} singularLabel The post type label (singular).
 * @param {boolean} hasArchive Whether the post type has archive support.
 * @returns {JSX.Element} The post type element.
 */
const PostType = ( { name, label, singularLabel, hasArchive } ) => {
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [ name ], name, "custom_post_type" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [ name ], name, "custom_post_type" );
	const replacementVariablesArchives = useSelectSettings( "selectReplacementVariablesFor", [ name ], `${ name }_archive`, "custom-post-type_archive" );
	const recommendedReplacementVariablesArchives = useSelectSettings( "selectRecommendedReplacementVariablesFor", [ name ], `${ name }_archive`, "custom-post-type_archive" );
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const customFieldAnalysisLink = useSelectSettings( "selectLink", [], "https://yoa.st/4cr" );
	const articleTypes = useSelectSettings( "selectArticleTypeValuesFor", [ name ], name );
	const pageTypes = useSelectSettings( "selectPageTypeValuesFor", [ name ], name );

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

	const { values } = useFormikContext();
	const { opengraph } = values.wpseo_social;

	return (
		<FormLayout title={ label }>
			<FieldsetLayout
				title={ __( "Search appearance", "wordpress-seo" ) }
				description={ sprintf(
					// translators: %1$s expands to the post type plural, e.g. Posts. %2$s expands to the post type singular, e.g. Post.
					__( "Choose how your %1$s should look in search engines. You can always customize this per individual %2$s.", "wordpress-seo" ),
					label,
					singularLabel
				) }
			>
				<FormikFlippedToggleField
					name={ `wpseo_titles.noindex-${ name }` }
					data-id={ `input-wpseo_titles-noindex-${ name }` }
					label={ sprintf(
						// translators: %1$s expands to the post type plural, e.g. Posts.
						__( "Show %1$s in search results", "wordpress-seo" ),
						label
					) }
					description={ sprintf(
						// translators: %1$s expands to the post type plural, e.g. Posts.
						__( "Disabling this means that %1$s will not be indexed by search engines and will be excluded from XML sitemaps.", "wordpress-seo" ),
						label
					) }
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
				title={ <div className="yst-flex yst-items-center yst-gap-1.5">
					<span>{ __( "Social appearance", "wordpress-seo" ) }</span>
					<Badge variant="upsell">Premium</Badge>
				</div> }
				description={ sprintf(
					// translators: %1$s expands to the post type plural, e.g. Posts. %2$s expands to the post type singular, e.g. Post.
					__( "Choose how your %1$s should look on social media by default. You can always customize this per individual %2$s.", "wordpress-seo" ),
					label,
					singularLabel
				) }
			>
				<OpenGraphDisabledAlert isEnabled={ opengraph } />
				<FormikMediaSelectField
					id={ `wpseo_titles-social-image-url-${ name }` }
					label={ __( "Social image", "wordpress-seo" ) }
					previewLabel={ recommendedSize }
					mediaUrlName={ `wpseo_titles.social-image-url-${ name }` }
					mediaIdName={ `wpseo_titles.social-image-id-${ name }` }
					disabled={ ! opengraph }
				/>
				<FormikReplacementVariableEditorField
					type="title"
					name={ `wpseo_titles.social-title-${ name }` }
					fieldId={ `input-wpseo_titles-social-title-${ name }` }
					label={ __( "Social title", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					className={ classNames( ! opengraph && "yst-opacity-50" ) }
					isDisabled={ ! opengraph }
				/>
				<FormikReplacementVariableEditorField
					type="description"
					name={ `wpseo_titles.social-description-${ name }` }
					fieldId={ `input-wpseo_titles-social-description-${ name }` }
					label={ __( "Social description", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					className={ classNames( "yst-replacevar--description", ! opengraph && "yst-opacity-50" ) }
					isDisabled={ ! opengraph }
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Schema", "wordpress-seo" ) }
				description={ sprintf(
					// translators: %1$s expands to the post type plural, e.g. Posts. %2$s expands to the post type singular, e.g. Post.
					__( "Choose how your %1$s should be described by default in your site's Schema.org markup. You can change these setting per individual %2$s.", "wordpress-seo" ),
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
				<FormikValueChangeField
					as={ SelectField }
					type="select"
					name={ `wpseo_titles.schema-article-type-${ name }` }
					id={ `input-wpseo_titles-schema-article-type-${ name }` }
					label={ __( "Article type", "wordpress-seo" ) }
					options={ articleTypes }
				/>
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
						__( "Enable %1$s for %2$s", "wordpress-seo" ),
						"Yoast SEO",
						label
					) }
					description={ sprintf(
						/* translators: %1$s expands to the post type plural, e.g. Posts. */
						__( "This enables SEO metadata editing and our SEO - and Readability analysis for individual %1$s", "wordpress-seo" ),
						label
					) }
				/>
				{ isPremium && <FormikTagField
					name={ `wpseo_titles.page-analyse-extra-${ name }` }
					id={ `input-wpseo_titles-page-analyse-extra-${ name }` }
					label={ __( "Add custom fields to page analysis", "wordpress-seo" ) }
					labelSuffix={ <Badge className="yst-ml-1.5" variant="upsell">Premium</Badge> }
					description={ addLinkToString(
						sprintf(
							__( "You can add multiple custom fields. %1$sRead more about our custom field analysis%2$s.", "wordpress-seo" ),
							"<a>",
							"</a>"
						),
						customFieldAnalysisLink,
						`link-custom-fields-page-analysis-${ name }`
					) }
				/> }
			</FieldsetLayout>

			{ hasArchive && <>
				<hr className="yst-my-16" />
				<div className="yst-mb-8">
					<Title as="h2" className="yst-mb-2">
						{ sprintf(
							/* translators: %1$s expands to the post type plural, e.g. Posts. */
							__( "%1$s archive", "wordpress-seo" ),
							label
						) }
					</Title>
					<p className="yst-text-tiny">
						{ sprintf(
							/* translators: %1$s expands to the post type plural, e.g. Posts. */
							__( "These settings are specifically for optimizing your %1$s archive.", "wordpress-seo" ),
							label
						) }
					</p>
				</div>
				<hr className="yst-my-8" />
				<FieldsetLayout
					title={ __( "Search appearance", "wordpress-seo" ) }
					description={ sprintf(
						// translators: %1$s expands to the post type plural, e.g. Posts.
						__( "Choose how your %1$s archive should look in search engines.", "wordpress-seo" ),
						label
					) }
				>
					<FormikFlippedToggleField
						name={ `wpseo_titles.noindex-ptarchive-${ name }` }
						data-id={ `input-wpseo_titles-noindex-ptarchive-${ name }` }
						label={ sprintf(
							// translators: %1$s expands to the post type plural, e.g. Posts.
							__( "Show the archive for %1$s in search results", "wordpress-seo" ),
							label
						) }
						description={ sprintf(
							// translators: %1$s expands to the post type plural, e.g. Posts.
							__( "Disabling this means that the archive for %1$s will not be indexed by search engines and will be excluded from XML sitemaps.", "wordpress-seo" ),
							label
						) }
					/>
					<FormikReplacementVariableEditorField
						type="title"
						name={ `wpseo_titles.title-ptarchive-${ name }` }
						fieldId={ `input-wpseo_titles-title-ptarchive-${ name }` }
						label={ __( "SEO title", "wordpress-seo" ) }
						replacementVariables={ replacementVariablesArchives }
						recommendedReplacementVariables={ recommendedReplacementVariablesArchives }
					/>
					<FormikReplacementVariableEditorField
						type="description"
						name={ `wpseo_titles.metadesc-ptarchive-${ name }` }
						fieldId={ `input-wpseo_titles-metadesc-ptarchive-${ name }` }
						label={ __( "Meta description", "wordpress-seo" ) }
						replacementVariables={ replacementVariablesArchives }
						recommendedReplacementVariables={ recommendedReplacementVariablesArchives }
						className="yst-replacevar--description"
					/>
				</FieldsetLayout>
				<hr className="yst-my-8" />
				<FieldsetLayout
					title={ <div className="yst-flex yst-items-center yst-gap-1.5">
						<span>{ __( "Social appearance", "wordpress-seo" ) }</span>
						<Badge variant="upsell">Premium</Badge>
					</div> }
					description={ sprintf(
						// translators: %1$s expands to the post type plural, e.g. Posts.
						__( "Choose how your %1$s archive should look on social media.", "wordpress-seo" ),
						label,
						singularLabel
					) }
				>
					<FormikMediaSelectField
						id={ `wpseo_titles-social-image-url-ptarchive-${ name }` }
						label={ __( "Social image", "wordpress-seo" ) }
						previewLabel={ recommendedSize }
						mediaUrlName={ `wpseo_titles.social-image-url-ptarchive-${ name }` }
						mediaIdName={ `wpseo_titles.social-image-id-ptarchive-${ name }` }
					/>
					<FormikReplacementVariableEditorField
						type="title"
						name={ `wpseo_titles.social-title-ptarchive-${ name }` }
						fieldId={ `input-wpseo_titles-social-title-ptarchive-${ name }` }
						label={ __( "Social title", "wordpress-seo" ) }
						replacementVariables={ replacementVariablesArchives }
						recommendedReplacementVariables={ recommendedReplacementVariablesArchives }
					/>
					<FormikReplacementVariableEditorField
						type="description"
						name={ `wpseo_titles.social-description-ptarchive-${ name }` }
						fieldId={ `input-wpseo_titles-social-description-ptarchive-${ name }` }
						label={ __( "Social description", "wordpress-seo" ) }
						replacementVariables={ replacementVariablesArchives }
						recommendedReplacementVariables={ recommendedReplacementVariablesArchives }
						className="yst-replacevar--description"
					/>
				</FieldsetLayout>
				<hr className="yst-my-8" />
				<FieldsetLayout
					title={ __( "Additional settings", "wordpress-seo" ) }
				>
					<Field
						as={ TextField }
						type="text"
						name={ `wpseo_titles.bctitle-ptarchive-${ name }` }
						id={ `input-wpseo_titles-bctitle-ptarchive-${ name }` }
						label={ __( "Breadcrumbs title", "wordpress-seo" ) }
					/>
				</FieldsetLayout>
			</> }
		</FormLayout>
	);
};

PostType.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	singularLabel: PropTypes.string.isRequired,
	hasArchive: PropTypes.bool.isRequired,
};

export default PostType;
