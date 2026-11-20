import classNames from "classnames";

/**
 * @param {Object} props Component props.
 * @param {import("react").ReactNode} [props.children=null] The children.
 *
 * @returns {JSX.Element} The header.
 */
const Header = ( { children = null } ) => (
	<header className="yst-relative yst-flex yst-items-center yst-justify-center yst-h-24 yst-bg-slate-100 yst--mx-6 yst--mt-6 yst-py-6">
		{ children }
	</header>
);

/**
 * @param {Object} props Component props.
 * @param {import("react").ReactNode} [props.children=null] The children.
 *
 * @returns {JSX.Element} The content.
 */
const Content = ( { children = null } ) => (
	<div className="yst-flex-grow">
		{ children }
	</div>
);

/**
 * @param {Object} props Component props.
 * @param {import("react").ReactNode} [props.children=null] The children.
 *
 * @returns  {JSX.Element} The footer.
 */
const Footer = ( { children = null } ) => (
	<footer className="yst-border-t yst-border-slate-200 yst-pt-6">
		{ children }
	</footer>
);

/**
 * @param {Object} props Component props.
 * @param {import("react").ReactNode} [props.children=null] The children.
 * @param {string} [props.className=""] Extra classes, appended so a consumer can override the defaults.
 *
 * @returns {JSX.Element} The card.
 */
export const Card = ( { children = null, className = "" } ) => (
	<div
		className={ classNames(
			"yst-relative yst-flex yst-flex-col yst-bg-white yst-rounded-lg yst-border yst-p-6 yst-space-y-6 yst-overflow-hidden yst-transition-transform yst-ease-in-out yst-duration-200 yst-shadow-sm",
			className
		) }
	>
		{ children }
	</div>
);

Card.Header = Header;
Card.Content = Content;
Card.Footer = Footer;
