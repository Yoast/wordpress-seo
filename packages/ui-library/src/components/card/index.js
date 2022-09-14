import { PropTypes } from "prop-types";
import classNames from 'classnames';

/**
 * @param {string} as The element to render as.
 * @param {Object} children The children.
 * @param {string} className The className.
 * @returns {WPElement} The card header.
 */
const Header = ( { as: Component = "header", children, className = "", ...props } ) => (
    <Component { ...props } className={ classNames( "yst-card__header", className ) }>
        { children }
    </Component>
);

Header.propTypes = {
	as: PropTypes.element,
	children: PropTypes.node.isRequired,
	className: PropTypes.node,
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
	className: PropTypes.node,
};


/**
 * @param {string} as The element to render as.
 * @param {Object} children The children.
 * @param {string} className The className.
 * @returns  {WPElement} The card footer.
 */
const Footer = ( { as: Component = "footer", children, className = "", ...props } ) => (
    <Component { ...props } className={ classNames( "yst-card__footer", className ) }>
        { children }
    </Component>
);

Footer.propTypes = {
	as: PropTypes.element,
	children: PropTypes.node.isRequired,
	className: PropTypes.node,
};

/**
 * @param {string} as The element to render as.
 * @param {Object} children The children.
 * @param {string} className The className.
 * @returns {JSX.Element} The card component.
 */
const Card = ( { as: Component = "div", children, className = "", ...props } ) => (
    <Component { ...props } className={ classNames( "yst-card", className ) }>
        { children }
    </Component>
);

Card.propTypes = {
    as: PropTypes.element,
	children: PropTypes.node.isRequired,
	className: PropTypes.node,
};

Card.Header = Header;
Card.Content = Content;
Card.Footer = Footer;

export default Card;
