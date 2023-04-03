import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useSvgAria } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 * @param {boolean} isShowLess Whether button represents show less.
 * @param {function} onToggle Toggle callback.
 * @param {Object} ariaProps The aria props for the button.
 * @returns {JSX.Element} The Button.
 */
const MoreOrLessButton = ( { isShowLess, onToggle, ariaProps } ) => {
	const ChevronIcon = useMemo( () => isShowLess ? ChevronUpIcon : ChevronDownIcon, [ isShowLess ] );
	const svgAriaProps = useSvgAria();

	return (
		<div className="yst-relative">
			<hr className="yst-absolute yst-inset-x-0 yst-top-1/2 yst-bg-slate-200" />
			<button
				className="yst-relative yst-flex yst-items-center yst-gap-1.5 yst-px-2.5 yst-py-1 yst-mx-auto yst-text-xs yst-font-medium yst-text-slate-700 yst-bg-slate-50 yst-rounded-full yst-border yst-border-slate-300 hover:yst-bg-white hover:yst-text-slate-800 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-primary-500 focus:yst-ring-offset-2"
				onClick={ onToggle }
				{ ...ariaProps }
			>
				{ isShowLess ? __( "Show less", "wordpress-seo" ) : __( "Show more", "wordpress-seo" ) }
				<ChevronIcon
					className="yst-h-4 yst-w-4 yst-flex-shrink-0 yst-text-slate-400 group-hover:yst-text-slate-500 yst-stroke-3"
					{ ...svgAriaProps }
				/>
			</button>
		</div>
	);
};

MoreOrLessButton.propTypes = {
	isShowLess: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	ariaProps: PropTypes.object.isRequired,
};

export default MoreOrLessButton;
