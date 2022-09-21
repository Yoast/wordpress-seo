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
 * @returns {JSX.Element} The author archives route.
 */
const AuthorArchives = () => {
	const label = __( "Author archives", "wordpress-seo" );
	const singularLabel = __( "Author archive", "wordpress-seo" );
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [], "author_archives", "custom-post-type_archive" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [], "author_archives", "custom-post-type_archive" );
	const duplicateContentInfoLink = useSelectSettings( "selectLink", [], "https://yoa.st/duplicate-content" );
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
			/* translators: %1$s and %2$s are replaced by opening and closing <code> tags. */
			__( "(e.g., %1$shttps://www.example.com/author/example/%2$s)", "wordpress-seo" ),
			"<code>",
			"</code>"
		),
		{
			code: <code className="yst-text-xs" />,
		}
	) );
	const description = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s are replaced by opening and closing <a> tags. %3$s is replaced by the "Author archive" translation. */
			__( "If you're running a one author blog, the Author archive will be exactly the same as your homepage. This is what's called a %1$sduplicate content problem%2$s. If this is the case on your site, you can choose to either disable it (which makes it redirect to the homepage), or prevent it from showing up in search results.", "wordpress-seo" ),
			"<a>",
			"</a>",
			singularLabel
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ duplicateContentInfoLink } target="_blank" rel="noreferrer" />,
		}
	) );

	const { values } = useFormikContext();
	const { opengraph } = values.wpseo_social;
	const { "disable-author": isAuthorDisabled, "noindex-author-wpseo": isAuthorNoIndex } = values.wpseo_titles;

	return (
		<FormLayout
			title={ label }
			description={ <>
				<span className="yst-block">{ descriptionExample }</span>
				<span className="yst-block yst-mt-4">{ description }</span>
			</> }
		>
			<fieldset className="yst-min-width-0 yst-space-y-8">
				<FormikFlippedToggleField
					name={ "wpseo_titles.disable-author" }
					data-id={ "input-wpseo_titles-disable-author" }
					label={ label }
					description={ sprintf(
						/* translators: %1$s expands to the post type singular, e.g. Post. */
						__( "Disabling this will redirect the %1$s to your site's homepage.", "wordpress-seo" ),
						singularLabel
					) }
				/>
			</fieldset>
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
							// translators: %1$s expands to the post type plural, e.g. Posts.
							__( "Choose how your %1$s should look in search engines.", "wordpress-seo" ),
							label
						) }
					>
						<FormikFlippedToggleField
							name={ "wpseo_titles.noindex-author-wpseo" }
							data-id={ "input-wpseo_titles-noindex-author-wpseo" }
							label={ sprintf(
								// translators: %1$s expands to the post type plural, e.g. Posts.
								__( "Show %1$s in search results", "wordpress-seo" ),
								label
							) }
							description={ <>
								{ sprintf(
									// translators: %1$s expands to the post type plural, e.g. Posts.
									__( "Disabling this means that %1$s will not be indexed by search engines and will be excluded from XML sitemaps.",
										"wordpress-seo" ),
									label
								) }
								<br />
								<Link href={ noIndexInfoLink } target="_blank" rel="noreferrer">
									{ __( "Read more about the search results settings", "wordpress-seo" ) }
								</Link>
								.
							</> }
						/>
						{ ! isAuthorNoIndex && <FormikFlippedToggleField
							name={ "wpseo_titles.noindex-author-noposts-wpseo" }
							data-id={ "input-wpseo_titles-noindex-author-noposts-wpseo" }
							label={ __( "Show archives for authors without posts in search results", "wordpress-seo" ) }
							description={ __( "Disabling this means that archives for authors without any posts will not be indexed by search engines and will be excluded from XML sitemaps.", "wordpress-seo" ) }
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
							id="wpseo_titles-social-image-author-wpseo"
							label={ __( "Social image", "wordpress-seo" ) }
							previewLabel={ recommendedSize }
							mediaUrlName="wpseo_titles.social-image-url-author-wpseo"
							mediaIdName="wpseo_titles.social-image-id-author-wpseo"
							disabled={ ! opengraph }
						/>
						<FormikReplacementVariableEditorField
							type="title"
							name="wpseo_titles.social-title-author-wpseo"
							fieldId="input-wpseo_titles-social-title-author-wpseo"
							label={ __( "Social title", "wordpress-seo" ) }
							replacementVariables={ replacementVariables }
							recommendedReplacementVariables={ recommendedReplacementVariables }
							className={ classNames( ! opengraph && "yst-opacity-50" ) }
							isDisabled={ ! opengraph }
						/>
						<FormikReplacementVariableEditorField
							type="description"
							name="wpseo_titles.social-description-author-wpseo"
							fieldId="input-wpseo_titles-social-description-author-wpseo"
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

export default AuthorArchives;
