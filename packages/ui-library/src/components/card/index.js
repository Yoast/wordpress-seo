import { PropTypes } from "prop-types";
import classNames from "classnames";
import { forwardRef } from "@wordpress/element";

/**
 * @param {string} as The element to render as.
 * @param {Object} children The children.
 * @param {string} className The className.
 * @returns {WPElement} The card header.
 */
const Header = ( { as: Component = "div", children, className = "", ...props } ) => (
	<Component { ...props } className={ classNames( "yst-card__header", className ) }>
		{ children }
	</Component>
);

Header.propTypes = {
	as: PropTypes.element,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 * @param {string} as The element to render as.
 * @param {Object} children The children.
 * @param {string} className The className.
 * @returns {WPElement} The card content.
 */
const Content = ( { as: Component = "div", children, className = "", ...props } ) => (
	<Component { ...props } className={ classNames( "yst-card__content", className ) }>
		{ children }
	</Component>
);

Content.propTypes = {
	as: PropTypes.element,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};


/**
 * @param {string} as The element to render as.
 * @param {Object} children The children.
 * @param {string} className The className.
 * @returns  {WPElement} The card footer.
 */
const Footer = ( { as: Component = "div", children, className = "", ...props } ) => (
	<Component { ...props } className={ classNames( "yst-card__footer", className ) }>
		{ children }
	</Component>
);

Footer.propTypes = {
	as: PropTypes.element,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 * @param {string} as The element to render as.
 * @param {Object} children The children.
 * @param {string} className The className.
 * @returns {JSX.Element} The card component.
 */
const Card = forwardRef( ( { as: Component, children, className, ...props }, ref ) => (
	<Component { ...props } className={ classNames( "yst-card", className ) } ref={ ref }>
		{ children }
	</Component>
) );

const propTypes = {
	as: PropTypes.elementType,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

Card.propTypes = propTypes;

Card.defaultProps = {
	as: "div",
	className: "",
};

Card.Header = Header;
Card.Header.displayName = "Card.Header";
Card.Content = Content;
Card.Content.displayName = "Card.Content";
Card.Footer = Footer;
Card.Footer.displayName = "Card.Footer";

// eslint-disable-next-line require-jsdoc
export const StoryComponent = props => <Card { ...props } />;
StoryComponent.propTypes = propTypes;
StoryComponent.defaultProps = Card.defaultProps;
StoryComponent.displayName = "Card";

export default Card;
