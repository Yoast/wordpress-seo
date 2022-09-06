import { CheckCircleIcon } from "@heroicons/react/solid";
import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, RadioGroup, TextField, useSvgAria } from "@yoast/ui-library";
import classNames from "classnames";
import { Field, useFormikContext } from "formik";
import { get, map } from "lodash";
import PropTypes from "prop-types";
import { FormikMediaSelectField, FormLayout, OpenGraphDisabledAlert } from "../components";
import { useSelectSettings } from "../store";

/**
 * UI library's inline-block variant Radio, but with a dangerously set inner HTML label.
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string} value Value.
 * @param {string} label Label.
 * @param {string} [screenReaderLabel] Screen reader label.
 * @param {string} [className] CSS class.
 * @param {Object} [props] Extra input props.
 * @returns {JSX.Element} Radio component.
 */
const Radio = ( { id, name, value, label, screenReaderLabel = "", className = "", ...props } ) => {
	const svgAriaProps = useSvgAria();

	return <div className={ classNames( "yst-radio", "yst-radio--inline-block", className ) }>
		<input
			type="radio"
			id={ id }
			name={ name }
			value={ value }
			className="yst-radio__input"
			aria-label={ screenReaderLabel }
			{ ...props }
		/>
		<span className="yst-radio__content">
			{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control -- incompatible with dangerouslySetInnerHTML */ }
			<label
				htmlFor={ id }
				className="yst-label yst-radio__label"
				dangerouslySetInnerHTML={ { __html: label } }
			/>
			<CheckCircleIcon className="yst-radio__check" { ...svgAriaProps } />
		</span>
	</div>;
};

Radio.propTypes = {
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	screenReaderLabel: PropTypes.string,
	className: PropTypes.string,
};

/**
 * @returns {JSX.Element} The site defaults route.
 */
const SiteDefaults = () => {
	const separators = useMemo( () => get( window, "wpseoScriptData.separators", {} ), [] );
	const generalSettingsUrl = useSelectSettings( "selectPreference", [], "generalSettingsUrl" );
	const siteDefaultsInfoAlertText = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %1$s expands to an opening emphasis tag. %2$s expands to a closing emphasis tag. */
			__( "You can use %1$sSite title%2$s, %1$sTagline%2$s and %1$sSeparator%2$s as variables when configuring the search appearance of your content.", "wordpress-seo" ),
			"<em>",
			"</em>"
		),
		{ em: <em /> }
	), [] );
	const siteImageRecommendedSize = useMemo( () => createInterpolateElement(
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
	const siteTitleDescription = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening anchor tag.
			 * %2$s expands to a closing anchor tag.
			 */
			__( "This field updates the %1$sSite title in your WordPress settings%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ `${ generalSettingsUrl }#blogname` } target="_blank" rel="noreferrer" />,
		}
	), [] );
	const taglineDescription = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening anchor tag.
			 * %2$s expands to a closing anchor tag.
			 */
			__( "This field updates the %1$sTagline in your WordPress settings%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ `${ generalSettingsUrl }#blogdescription` } target="_blank" rel="noreferrer" />,
		}
	), [] );

	const { values } = useFormikContext();
	const { opengraph } = values.wpseo_social;

	return (
		<FormLayout
			title={ __( "Site defaults", "wordpress-seo" ) }
			description={ __( "Configure the basics for your website.", "wordpress-seo" ) }
		>
			<div className="yst-max-w-screen-sm">
				<Alert variant="info" id="alert-site-defaults-variables">{ siteDefaultsInfoAlertText }</Alert>
				<hr className="yst-my-8" />
				<fieldset className="yst-min-width-0 yst-mt-8 lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
					<Field
						as={ TextField }
						type="text"
						name="blogname"
						id="input-blogname"
						label={ __( "Site title", "wordpress-seo" ) }
						description={ siteTitleDescription }
					/>
					<Field
						as={ TextField }
						type="text"
						name="blogdescription"
						id="input-blogdescription"
						label={ __( "Tagline", "wordpress-seo" ) }
						description={ taglineDescription }
					/>
				</fieldset>
				<hr className="yst-my-8" />
				<RadioGroup label={ __( "Title separator", "wordpress-seo" ) } variant="inline-block">
					{ map( separators, ( { label, aria_label: ariaLabel }, value ) => (
						<Field
							key={ value }
							as={ Radio }
							type="radio"
							name="wpseo_titles.separator"
							id={ `input-wpseo_titles-separator.${ value }` }
							label={ label }
							aria-label={ ariaLabel }
							value={ value }
						/>
					) ) }
				</RadioGroup>
				<hr className="yst-my-8" />
				<OpenGraphDisabledAlert
					isEnabled={ opengraph }
					text={
						/* translators: %1$s expands to an opening emphasis tag. %2$s expands to a closing emphasis tag. */
						__( "The %1$sSite image%2$s requires Open Graph data, which is currently disabled in the ‘Social sharing’ section in %3$sSite preferences%4$s.", "wordpress-seo" )
					}
				/>
				<FormikMediaSelectField
					id="wpseo_social-og_default_image"
					label={ __( "Site image", "wordpress-seo" ) }
					description={ __( "This image is used as a fallback for posts/pages that don't have any images set.", "wordpress-seo" ) }
					previewLabel={ siteImageRecommendedSize }
					mediaUrlName="wpseo_social.og_default_image"
					mediaIdName="wpseo_social.og_default_image_id"
					disabled={ ! opengraph }
				/>
			</div>
		</FormLayout>
	);
};

export default SiteDefaults;
