import { Title } from "@yoast/ui-library";
import PropTypes from "prop-types";
import classNames from "classnames";

/**
 *
 * @param {string} title The title of the card.
 * @param {number} counts The count of the card.
 * @param {string} Icon The icon of the card.
 * @param {string} iconColor The color of the icon.
 *
 * @returns {JSX.Element} The card title component.
 */
export const BoxTitle = ( {
	title = "",
	counts = 0,
	Icon = "",
	iconColor = "red",
} ) => {
	const colors = {
		red: "yst-text-red-500",
		blue: "yst-text-blue-500",
	};
	return (
		<div className="yst-flex yst-justify-between yst-gap-2 yst-items-center">
			<Icon className={ classNames( "yst-w-6 yst-h-6", colors[ iconColor ] ) } />
			<Title className="yst-grow" as="h3" size="2">{ title } { counts > 0 && `(${counts})` } </Title>
		</div>
	);
};

BoxTitle.propTypes = {
	title: PropTypes.string,
	counts: PropTypes.number,
	Icon: PropTypes.elementType,
	iconColor: PropTypes.string,
};
