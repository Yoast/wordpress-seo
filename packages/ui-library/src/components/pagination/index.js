import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { parseInt } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { useSvgAria } from "../../hooks";
import Button from "./button";
import DisplayButtons from "./display-buttons";
import DisplayText from "./display-text";

const VARIANT = {
	display: {
		buttons: "buttons",
		text: "text",
	},
};

/**
 * @param {string} [className] Extra class.
 * @param {number} current The current page. Start at 1.
 * @param {number} total The total pages.
 * @param {function} onNavigate Callback for requested page navigation.
 * @param {string} [variant] Display variant. Defaults to buttons. See const "VARIANT.display" for options.
 * @param {number} [maxPageButtons] For variant buttons: the maximum number of buttons to show.
 * @param {boolean} [disabled] Whether the buttons are disabled.
 * @param {string} screenReaderTextPrevious The screen reader text for the previous button.
 * @param {string} screenReaderTextNext The screen reader text for the next button.
 * @param {Object} props Extra props.
 * @returns {JSX.Element} The element.
 */
const Pagination = ( {
	className,
	current,
	total,
	onNavigate,
	variant,
	maxPageButtons,
	disabled,
	screenReaderTextPrevious,
	screenReaderTextNext,
	...props
} ) => {
	const svgAriaProps = useSvgAria();
	const handleNavigate = useCallback( ( { target } ) => onNavigate( parseInt( target.dataset.page ) ), [ onNavigate ] );

	return (
		<nav className={ classNames( "yst-pagination", className ) } { ...props }>
			<Button className="yst-rounded-s-md" onClick={ handleNavigate } data-page={ current - 1 } disabled={ disabled || current - 1 < 1 }>
				<span className="yst-pointer-events-none yst-sr-only">{ screenReaderTextPrevious }</span>
				<ChevronLeftIcon className="yst-pointer-events-none yst-h-5 yst-w-5" { ...svgAriaProps } />
			</Button>
			{ variant === VARIANT.display.text && (
				<DisplayText current={ current } total={ total } />
			) }
			{ variant === VARIANT.display.buttons && (
				<DisplayButtons
					current={ current }
					total={ total }
					maxPageButtons={ maxPageButtons }
					onNavigate={ handleNavigate }
					disabled={ disabled }
				/>
			) }
			<Button className="yst-rounded-e-md" onClick={ handleNavigate } data-page={ current + 1 } disabled={ disabled || current + 1 > total }>
				<span className="yst-pointer-events-none yst-sr-only">{ screenReaderTextNext }</span>
				<ChevronRightIcon className="yst-pointer-events-none yst-h-5 yst-w-5" { ...svgAriaProps } />
			</Button>
		</nav>
	);
};
Pagination.propTypes = {
	className: PropTypes.string,
	current: PropTypes.number.isRequired,
	total: PropTypes.number.isRequired,
	onNavigate: PropTypes.func.isRequired,
	variant: PropTypes.oneOf( Object.keys( VARIANT.display ) ),
	maxPageButtons: PropTypes.number,
	disabled: PropTypes.bool,
	screenReaderTextPrevious: PropTypes.string.isRequired,
	screenReaderTextNext: PropTypes.string.isRequired,
};
Pagination.defaultProps = {
	className: "",
	variant: VARIANT.display.buttons,
	maxPageButtons: 6,
	disabled: false,
};

export default Pagination;
