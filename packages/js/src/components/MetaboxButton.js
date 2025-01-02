import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * Text for in the MetaboxButton.
 *
 * @param {string} [className] Extra classes.
 * @param {Object} [props] Extra props.
 *
 * @returns {JSX.Element} The element.
 */
const MetaboxButtonText = ( { className, ...props } ) => (
	<span
		className={ classNames(
			"yst-grow yst-overflow-hidden yst-overflow-ellipsis yst-whitespace-nowrap yst-font-wp",
			"yst-text-[#555] yst-text-base yst-leading-[normal] yst-subpixel-antialiased yst-text-start",
			className
		) }
		{ ...props }
	/>
);
MetaboxButtonText.displayName = "MetaboxButton.Text";
MetaboxButtonText.propTypes = {
	className: PropTypes.string,
};
MetaboxButtonText.defaultProps = {
	className: "",
};

/**
 * Lookalike for a simple (un-collapsible) version of the @yoast/components Collapsible in Tailwind style.
 *
 * Expects a `yst-root` parent and the Tailwind stylesheet loaded in.
 *
 * @param {string} [className] Extra classes.
 * @param {Object} [props] Extra props.
 *
 * @returns {JSX.Element} The element.
 */
export const MetaboxButton = ( { className, ...props } ) => (
	<button
		type="button"
		className={ classNames(
			"yst-flex yst-items-center yst-w-full yst-pt-4 yst-pb-4 yst-pe-4 yst-ps-6 yst-space-x-2 rtl:yst-space-x-reverse",
			"yst-border-t yst-border-t-[rgb(0,0,0,0.2)] yst-rounded-none yst-transition-all hover:yst-bg-[#f0f0f0]",
			"focus:yst-outline focus:yst-outline-[1px] focus:yst-outline-[color:#0066cd] focus:-yst-outline-offset-1 focus:yst-shadow-[0_0_3px_rgba(8,74,103,0.8)]",
			className
		) }
		{ ...props }
	/>
);
MetaboxButton.propTypes = {
	className: PropTypes.string,
};
MetaboxButton.defaultProps = {
	className: "",
};

MetaboxButton.Text = MetaboxButtonText;
