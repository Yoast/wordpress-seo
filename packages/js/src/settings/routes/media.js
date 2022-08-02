import { Transition } from "@headlessui/react";
import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Badge, SelectField, ToggleField } from "@yoast/ui-library";
import classNames from "classnames";
import { useFormikContext } from "formik";
import {
	FieldsetLayout,
	FormikFlippedToggleField,
	FormikMediaSelectField,
	FormikReplacementVariableEditorField,
	FormikValueChangeField,
	FormLayout,
	OpenGraphDisabledAlert,
} from "../components";
import { useSelectSettings } from "../store";

/**
 * @returns {JSX.Element} The media route.
 */
const Media = () => {
	const name = "attachment";
	const label = __( "Media pages", "wordpress-seo" );
	const singularLabel = __( "Media page", "wordpress-seo" );
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [ name ], name, "custom_post_type" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [ name ], name, "custom_post_type" );
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
	const { "disable-attachment": disableAttachment } = values.wpseo_titles;

	return (
		<FormLayout title={ label }>
			<fieldset className="yst-space-y-8">
				<Alert variant="info">{ __( "We recommend that you enable the setting below.", "wordpress-seo" ) }</Alert>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name={ `wpseo_titles.disable-${ name }` }
					data-id={ `input-wpseo_titles-disable-${ name }` }
					label={ __( "Redirect Media pages to the media itself", "wordpress-seo" ) }
					description={ __( "When you upload media (e.g. an image or video), WordPress automatically creates a Media page for it. These pages are quite empty and if you don't use these it's better to disable them, and redirect them to the media item itself.", "wordpress-seo" ) }
				/>
			</fieldset>
			<hr className="yst-my-8" />
			<div className="yst-relative">
				<Transition
					show={ ! disableAttachment }
					enter="yst-transition yst-ease-out yst-duration-300 yst-delay-300"
					enterFrom="yst-transform yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-90"
					enterTo="yst-transform yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
					leave="yst-transition yst-absolute yst-top-0 yst-left-0 yst-ease-out yst-duration-300"
					leaveFrom="yst-transform yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
					leaveTo="yst-transform yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-90"
				>
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
							description={ __( "Disabling this means that Media pages created by WordPress will not be indexed by search engines and will be excluded from XML sitemaps.", "wordpress-seo" ) }
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
				</Transition>
			</div>
		</FormLayout>
	);
};

export default Media;
