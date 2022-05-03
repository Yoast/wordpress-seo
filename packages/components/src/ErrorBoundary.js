// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import { speak as a11ySpeak } from "@wordpress/a11y";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

const ErrorContainer = styled.p`
	text-align: center;
	margin: 0 0 16px;
	padding: 16px 16px 8px 16px;
	border-bottom: 4px solid ${ colors.$color_bad };
	background: ${ colors.$color_white };
`;

/**
 * The ErrorBoundary class, which renders a custom error message.
 */
export default class ErrorBoundary extends React.Component {
	/**
	 * Constructs the component.
	 *
	 * @param {Object} props The props for the component.
	 */
	constructor( props ) {
		super( props );

		this.state = { hasError: false };
	}

	/**
	 * Catches errors in a components tree.
	 *
	 * @returns {void}
	 */
	componentDidCatch() {
		this.setState( { hasError: true } );
	}

	/**
	 * Renders the Error Boundary.
	 *
	 * @returns {ReactElement} The Error Boundary or its children.
	 */
	render() {
		if ( this.state.hasError ) {
			// Render any custom fallback UI.
			const errorMessage = __( "Something went wrong. Please reload the page.", "wordpress-seo" );
			a11ySpeak( errorMessage, "assertive" );

			return <ErrorContainer>{ errorMessage }</ErrorContainer>;
		}

		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.any,
};
