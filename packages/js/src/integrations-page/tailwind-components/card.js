import { PropTypes } from "prop-types";

/**
 * The header.
 *
 * @param {JSX.node} children The children.
 *
 * @returns {JSX.Element} The header.
 */
const Header = ( { children } ) => {
	return (
		<header className="yst-relative yst-flex yst-items-center yst-justify-center yst-h-24 yst-bg-gray-100 yst--mx-6 yst--mt-6 yst-py-6">
			{ children }
		</header>
	);
};

Header.propTypes = {
	children: PropTypes.node,
};

/**
 * The content.
 *
 * @param {JSX.node} children The children.
 *
 * @returns {JSX.Element} The content.
 */
const Content = ( { children } ) => {
	return (
		<div className="yst-flex-grow">
			{ children }
		</div>
	);
};

Content.propTypes = {
	children: PropTypes.node,
};


/**
 * The footer.
 *
 * @param {JSX.node} children The children.
 *
 * @returns  {JSX.Element} The footer.
 */
const Footer = ( { children } ) => {
	return (
		<footer className="yst-border-t yst-border-gray-200 yst-pt-6">
			{ children }
		</footer>
	);
};

Footer.propTypes = {
	children: PropTypes.node,
};

/**
 * The card.
 *
 * @param {JSX.node} children The children.
 *
 * @returns  {JSX.Element} The footer.
 */
export function Card( { children } ) {
	return (
		<div className="yst-relative yst-flex yst-flex-col yst-bg-white yst-rounded-lg yst-border yst-p-6 yst-space-y-6 yst-overflow-hidden yst-transition-transform yst-ease-in-out yst-duration-200">
			{ children }
		</div>
	);
}

Card.propTypes = {

	children: PropTypes.node,
};

Card.Header = Header;
Card.Content = Content;
Card.Footer = Footer;
