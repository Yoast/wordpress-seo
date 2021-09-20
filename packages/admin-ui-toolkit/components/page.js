import { __, sprintf } from "@wordpress/i18n";
import { useEffect, useRef } from "@wordpress/element";
import { PropTypes } from "prop-types";
import classNames from "classnames";
import { speak } from "@wordpress/a11y";

/**
 * The Page Header Component.
 *
 * @param {String} title The title of the page.
 * @param {JSX.Node} description The description of the page.
 * @returns {JSX.Element} The Page Header Component.
 */
function Header( { title, description } ) {
	useEffect( () => {
		document.title = title;
	}, [ title ] );

	return (
		<>
			{ /* translators: %s is replaced by the page title. */ }
			{ speak( sprintf( __( "Navigated to: %s", "admin-ui" ), title ), "assertive" ) }
			<div className="max-w-screen-sm yst-border-b yst-border-gray-200 yst-p-8">
				<h1 className={ classNames( "yst-text-2xl", { "yst-mb-3": description } ) }>{ title }</h1>
				{ description && <p className="yst-max-w-screen-sm yst-text-tiny">{ description }</p> }
			</div>
		</>
	);
}

Header.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.node,
};

Header.defaultProps = {
	description: "",
};

/**
 * The Page Component.
 *
 * @param {*} children The content of the page.
 *
 * @returns { Component } The Page Component.
 */
export default function Page( { children } ) {
	const main = useRef( null );

	useEffect( () => {
		main.current.focus();
	}, [ main ] );

	return (
		<>
			<main
				className="yst-mt-16 lg:yst-mt-0 yst-flex-grow yst-bg-white yst-shadow yst-rounded-lg yst-flex yst-flex-col"
				ref={ main }
				tabIndex="-1"
			>
				{ children }
			</main>
		</>
	);
}

Page.propTypes = {
	children: PropTypes.node.isRequired,
};

Page.Header = Header;
