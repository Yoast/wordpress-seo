import { PropTypes } from "prop-types";

/**
 * @param {Object} [children=null] The children.
 * @returns {JSX.Element} The header.
 */
const Header = ( { children = null } ) => (
	<header className="yst-relative yst-flex yst-items-center yst-justify-center yst-h-24 yst-bg-slate-100 yst--mx-6 yst--mt-6 yst-py-6">
		{ children }
	</header>
);
Header.propTypes = {
	children: PropTypes.node,
};

/**
 * @param {Object} [children=null] The children.
 * @returns {JSX.Element} The content.
 */
const Content = ( { children = null } ) => (
	<div className="yst-flex-grow">
		{ children }
	</div>
);
Content.propTypes = {
	children: PropTypes.node,
};

/**
 * @param {Object} [children=null] The children.
 * @returns  {JSX.Element} The footer.
 */
const Footer = ( { children = null } ) => (
	<footer className="yst-border-t yst-border-slate-200 yst-pt-6">
		{ children }
	</footer>
);
Footer.propTypes = {
	children: PropTypes.node,
};

/**
 * @param {Object} [children=null] The children.
 * @returns {JSX.Element} The card.
 */
export const Card = ( { children = null } ) => (
	<div
		className="yst-relative yst-flex yst-flex-col yst-bg-white yst-rounded-lg yst-border yst-p-6 yst-space-y-6 yst-overflow-hidden yst-transition-transform yst-ease-in-out yst-duration-200 yst-shadow-sm"
	>
		{ children }
	</div>
);
Card.propTypes = {
	children: PropTypes.node,
};

Card.Header = Header;
Card.Content = Content;
Card.Footer = Footer;
