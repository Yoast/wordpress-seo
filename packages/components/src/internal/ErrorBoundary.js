import React from "react";
import PropTypes from "prop-types";

/**
 * ErrorBoundary to handle errors within a component.
 *
 * This ErrorBoundary should only be used for displaying errors to developers that are trying to implement one of the components from this package.
 */
export default class ErrorBoundary extends React.Component {
	/**
	 * Constructor for the ErrorBoundary.
	 * @param {object} props The class properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
		this.state = { error: false, url: null };
	}

	/**
	 * Handles the error.
	 *
	 * Has an additional check to check whether the URL field is set. This can be used to provide additional context to the developer.
	 *
	 * @param {Error|ErrorWithUrl} error The error that was caught.
	 *
	 * @returns {object} The new state derived from the error.
	 */
	static getDerivedStateFromError( error ) {
		// This error boundary only handles our internal errors on which we set the type YoastError.
		if ( error.type !== "YoastError" ) {
			throw error;
		}

		// Special case for an ErrorWithUrl.
		if ( error.name === "ErrorWithUrl" ) {
			return { error: error.message, url: error.url };
		}

		return { error: error.message };
	}

	/**
	 * Renders the component.
	 *
	 * Displays the error message and a help URL if an error is caught.
	 *
	 * @returns {React.Component} The ErrorBoundary.
	 */
	render() {
		if ( this.state.error ) {
			return (
				<div>
					<p>{ this.state.error }</p>
					{ this.state.url && <a href={ this.state.url } rel="noopener noreferrer">{ this.state.url }</a> }
				</div>
			);
		}
		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ).isRequired,
};
