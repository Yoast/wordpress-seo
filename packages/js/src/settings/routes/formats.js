import { Transition } from "@headlessui/react";
import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge } from "@yoast/ui-library";
import classNames from "classnames";
import { useFormikContext } from "formik";
import {
	FieldsetLayout,
	FormikFlippedToggleField,
	FormikMediaSelectField,
	FormikReplacementVariableEditorField,
	FormLayout,
	OpenGraphDisabledAlert,
} from "../components";
import { useSelectSettings } from "../store";

/**
 * Presents the `post_format` taxonomy.
 *
 * Mostly a copy from the taxonomy template, differences:
 * - disable toggle at the top, that shows/hides the rest
 * - removed the other exceptions
 *
 * @returns {JSX.Element} The formats element.
 */
const Formats = () => {
	const { name, label, singularLabel } = useSelectSettings( "selectTaxonomy", [], "post_format" );
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [ name ], name, "term-in-custom-taxonomy" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [ name ], name, "term-in-custom-taxonomy" );

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
	const { "disable-post_format": disablePostFormat } = values.wpseo_titles;

	return (
		<FormLayout
			title={ <div className="yst-flex yst-items-center yst-gap-1.5">
				<span>{ label }</span>
				<Badge variant="plain">{ name }</Badge>
			</div> }
		>
			<fieldset className="yst-space-y-8">
				<FormikFlippedToggleField
					name={ "wpseo_titles.disable-post_format" }
					data-id={ "input-wpseo_titles-disable-post_format" }
					label={ __( "Enable format-based archives", "wordpress-seo" ) }
					className="yst-toggle-field--grid"
				/>
			</fieldset>
			<hr className="yst-my-8" />
			<div className="yst-relative">
				<Transition
					show={ ! disablePostFormat }
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
							// translators: %1$s expands to the post type plural, e.g. Categories. %2$s expands to the post type singular, e.g.
							// Category.
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
							description={ sprintf(
								// translators: %1$s expands to the taxonomy plural, e.g. Categories.
								__( "Disabling this means that %1$s will not be indexed by search engines and will be excluded from XML sitemaps.", "wordpress-seo" ),
								label
							) }
						/>
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
							<Badge variant="upsell">Premium</Badge>
						</div> }
						description={ sprintf(
							// translators: %1$s expands to the taxonomy plural, e.g. Categories. %2$s expands to the taxonomy singular, e.g.
							// Category.
							__( "Choose how your %1$s should look on social media by default. You can always customize this per individual %2$s.", "wordpress-seo" ),
							label,
							singularLabel
						) }
					>
						<OpenGraphDisabledAlert isEnabled={ opengraph } />
						<FormikMediaSelectField
							id={ `wpseo_titles-social-image-url-tax-${ name }` }
							label={ __( "Social image", "wordpress-seo" ) }
							previewLabel={ recommendedSize }
							mediaUrlName={ `wpseo_titles.social-image-url-tax-${ name }` }
							mediaIdName={ `wpseo_titles.social-image-id-tax-${ name }` }
							disabled={ ! opengraph }
						/>
						<FormikReplacementVariableEditorField
							type="title"
							name={ `wpseo_titles.social-title-tax-${ name }` }
							fieldId={ `input-wpseo_titles-social-title-tax-${ name }` }
							label={ __( "Social title", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
							className={ classNames( ! opengraph && "yst-opacity-50" ) }
							isDisabled={ ! opengraph }
						/>
						<FormikReplacementVariableEditorField
							type="description"
							name={ `wpseo_titles.social-description-tax-${ name }` }
							fieldId={ `input-wpseo_titles-social-description-tax-${ name }` }
							label={ __( "Social description", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
							className={ classNames( "yst-replacevar--description", ! opengraph && "yst-opacity-50" ) }
							isDisabled={ ! opengraph }
						/>
					</FieldsetLayout>
				</Transition>
			</div>
		</FormLayout>
	);
};

export default Formats;
