import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Link } from "@yoast/ui-library";
import classNames from "classnames";
import { useFormikContext } from "formik";
import AnimateHeight from "react-animate-height";
import {
	FieldsetLayout,
	FormikFlippedToggleField,
	FormikMediaSelectField,
	FormikReplacementVariableEditorField,
	FormLayout,
	OpenGraphDisabledAlert,
} from "../components";
import { useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The date archives route.
 */
const DateArchives = () => {
	const label = __( "Date archives", "wordpress-seo" );
	const singularLabel = __( "Date archive", "wordpress-seo" );
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [], "date_archive", "custom-post-type_archive" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [], "date_archive", "custom-post-type_archive" );
	const noIndexInfoLink = useSelectSettings( "selectLink", [], "https://yoa.st/show-x" );

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
	const descriptionExample = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
			__( "(e.g., %1$shttps://www.example.com/2020/%2$s)", "wordpress-seo" ),
			"<code>",
			"</code>"
		),
		{
			code: <code className="yst-text-xs" />,
		}
	) );

	const { values } = useFormikContext();
	const { opengraph } = values.wpseo_social;
	const { "disable-date": disableDate } = values.wpseo_titles;

	return (
		<FormLayout
			title={ label }
			description={ <>
				<span className="yst-block">{ descriptionExample }</span>
				<span className="yst-block yst-mt-4">{ sprintf(
					/* translators: %1$s is replaced by the "Date archives" translation. */
					__( "Date archives are based on publication dates. From an SEO perspective, the posts in these archives have no real relation to the other posts except for their publication dates, which doesn’t say much about the content. They could also lead to duplicate content issues. This is why we recommend you to disable date archives.", "wordpress-seo" ),
					"<a>",
					"</a>",
					singularLabel
				) }</span>
			</> }
		>
			<fieldset className="yst-min-width-0 yst-space-y-8">
				<FormikFlippedToggleField
					name={ "wpseo_titles.disable-date" }
					data-id={ "input-wpseo_titles-disable-date" }
					label={ label }
					description={ sprintf(
						/* translators: %1$s expands to "Date archives". */
						__( "%1$s can cause duplicate content issues. For most sites, we recommend that you disable this setting.", "wordpress-seo" ),
						label
					) }
				/>
			</fieldset>
			<hr className="yst-my-8" />
			<div className="yst-relative">
				<AnimateHeight
					easing="ease-in-out"
					duration={ 300 }
					height={ disableDate ? 0 : "auto" }
					animateOpacity={ true }
				>
					<FieldsetLayout
						title={ __( "Search appearance", "wordpress-seo" ) }
						description={ sprintf(
							// translators: %1$s expands to the post type plural, e.g. Posts.
							__( "Choose how your %1$s should look in search engines.", "wordpress-seo" ),
							label
						) }
					>
						<FormikFlippedToggleField
							name={ "wpseo_titles.noindex-archive-wpseo" }
							data-id={ "input-wpseo_titles-noindex-archive-wpseo" }
							label={ sprintf(
								// translators: %1$s expands to the post type plural, e.g. Posts.
								__( "Show %1$s in search results", "wordpress-seo" ),
								label
							) }
							description={ <>
								{ sprintf(
									// translators: %1$s expands to the post type plural, e.g. Posts.
									__( "Disabling this means that %1$s will not be indexed by search engines and will be excluded from XML sitemaps. We recommend that you disable this setting.", "wordpress-seo" ),
									label
								) }
								<br />
								<Link href={ noIndexInfoLink } target="_blank" rel="noreferrer">
									{ __( "Read more about the search results settings", "wordpress-seo" ) }
								</Link>
								.
							</> }
						/>
						<FormikReplacementVariableEditorField
							type="title"
							name="wpseo_titles.title-archive-wpseo"
							fieldId="input-wpseo_titles-title-archive-wpseo"
							label={ __( "SEO title", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
						/>
						<FormikReplacementVariableEditorField
							type="description"
							name="wpseo_titles.metadesc-archive-wpseo"
							fieldId="input-wpseo_titles-metadesc-archive-wpseo"
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
							// translators: %1$s expands to the post type plural, e.g. Posts.
							__( "Choose how your %1$s should look on social media by default.", "wordpress-seo" ),
							label
						) }
					>
						<OpenGraphDisabledAlert isEnabled={ opengraph } />
						<FormikMediaSelectField
							id="wpseo_titles-social-image-archive-wpseo"
							label={ __( "Social image", "wordpress-seo" ) }
							previewLabel={ recommendedSize }
							mediaUrlName="wpseo_titles.social-image-url-archive-wpseo"
							mediaIdName="wpseo_titles.social-image-id-archive-wpseo"
							disabled={ ! opengraph }
						/>
						<FormikReplacementVariableEditorField
							type="title"
							name="wpseo_titles.social-title-archive-wpseo"
							fieldId="input-wpseo_titles-social-title-archive-wpseo"
							label={ __( "Social title", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
							className={ classNames( ! opengraph && "yst-opacity-50" ) }
							isDisabled={ ! opengraph }
						/>
						<FormikReplacementVariableEditorField
							type="description"
							name="wpseo_titles.social-description-archive-wpseo"
							fieldId="input-wpseo_titles-social-description-archive-wpseo"
							label={ __( "Social description", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
							className={ classNames( "yst-replacevar--description", ! opengraph && "yst-opacity-50" ) }
							isDisabled={ ! opengraph }
						/>
					</FieldsetLayout>
				</AnimateHeight>
			</div>
		</FormLayout>
	);
};

export default DateArchives;
