import { CheckCircleIcon } from "@heroicons/react/solid";
import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, RadioGroup, TextField, useSvgAria } from "@yoast/ui-library";
import classNames from "classnames";
import { Field } from "formik";
import { get, map } from "lodash";
import PropTypes from "prop-types";
import { FormLayout } from "../components";

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
	const alertText = useMemo( () => createInterpolateElement(
		__( "You can use <em>Site title</em>, <em>Tagline</em> and <em>Separator</em> as variables when configuring the search appearance of your content.", "wordpress-seo" ),
		{ em: <em /> },
	), [] );
	const separators = useMemo( () => get( window, "wpseoScriptData.separators", {} ), [] );

	return (
		<FormLayout
			title={ __( "Site defaults", "wordpress-seo" ) }
		>
			<div className="yst-max-w-screen-sm">
				<Alert variant="info">{ alertText }</Alert>
				<hr className="yst-my-8" />
				<fieldset className="yst-mt-8 lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
					<Field
						as={ TextField }
						type="text"
						name="blogname"
						id="input:blogname"
						label={ __( "Site title", "wordpress-seo" ) }
					/>
					<Field
						as={ TextField }
						type="text"
						name="blogdescription"
						id="input:blogdescription"
						label={ __( "Tagline", "wordpress-seo" ) }
					/>
				</fieldset>
				<hr className="yst-my-8" />
				<RadioGroup label={ __( "Title separator", "wordpress-seo" ) } variant="inline-block">
					{ map( separators, ( { label, aria_label }, value ) => (
						<Field
							key={ value }
							as={ Radio }
							type="radio"
							name="wpseo_titles.separator"
							id={ `input:wpseo_titles.separator.${ value }` }
							label={ label }
							aria-label={ aria_label }
							value={ value }
						/>
					) ) }
				</RadioGroup>
			</div>
		</FormLayout>
	);
};

export default SiteDefaults;
