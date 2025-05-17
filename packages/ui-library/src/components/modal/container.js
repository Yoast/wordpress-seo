import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";

/**
 * @param {JSX.node} children The content.
 * @param {string} [className] Extra class.
 * @returns {JSX.Element} The element.
 */
const Header = forwardRef( ( { children, className }, ref ) => (
	<div ref={ ref } className={ classNames( "yst-modal__container-header", className ) }>
		{ children }
	</div>
) );
Header.displayName = "Modal.Container.Header";
Header.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
Header.defaultProps = {
	className: "",
};

/**
 * @param {JSX.node} children The content.
 * @param {string} [className] Extra class.
 * @returns {JSX.Element} The element.
 */
const Content = forwardRef( ( { children, className }, ref ) => (
	<div ref={ ref } className={ classNames( "yst-modal__container-content", className ) }>
		{ children }
	</div>
) );
Content.displayName = "Modal.Container.Content";
Content.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
Content.defaultProps = {
	className: "",
};

/**
 * @param {JSX.node} children The content.
 * @param {string} [className] Extra class.
 * @returns {JSX.Element} The element.
 */
const Footer = forwardRef( ( { children, className }, ref ) => (
	<div ref={ ref } className={ classNames( "yst-modal__container-footer", className ) }>
		{ children }
	</div>
) );
Footer.displayName = "Modal.Container.Footer";
Footer.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
Footer.defaultProps = {
	className: "",
};

/**
 * @param {JSX.node} children The content.
 * @param {string} [className] Extra class.
 * @returns {JSX.Element} The element.
 */
export const Container = forwardRef( ( { children, className }, ref ) => (
	<div ref={ ref } className={ classNames( "yst-modal__container", className ) }>
		{ children }
	</div>
) );
Container.displayName = "Modal.Container";
Container.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
Container.defaultProps = {
	className: "",
};

Container.Header = Header;
Container.Content = Content;
Container.Footer = Footer;
