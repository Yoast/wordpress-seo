import React, { Component } from "react";
import { LinkSuggestions as LinkSuggestionsElement } from "yoast-premium-components";
import Loader from "yoast-components/composites/basic/Loader";

/**
 * Link suggestions metabox component.
 */
export default class Metabox extends Component {
	/**
	 * Constructs a metabox component for the link suggestions.
	 *
	 * @param {Object} props The properties for this components.
	 * @param {boolean} props.isLoading Whether this component should start of showing a loader.
	 * @param {Array} props.suggestionsn The suggestions to render initially.
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			loading: this.props.isLoading,
			suggestions: this.props.suggestions,
		};

		this.retrievedLinkSuggestions = this.retrievedLinkSuggestions.bind( this );

		this.props.linkSuggestions.on( "retrievedLinkSuggestions", this.retrievedLinkSuggestions );
	}

	/**
	 * Updates the link suggestions in the state.
	 *
	 * @param {Array} suggestions The link suggestions to set in the state.
	 * @returns {void}
	 */
	retrievedLinkSuggestions( suggestions ) {
		this.setState( {
			suggestions,
			loading: false,
		} );
	}

	/**
	 * Renders this component.
	 *
	 * @returns {React.Element} The rendered element.
	 */
	render() {
		if ( this.state.loading ) {
			return <div className="yoast-link-suggestions yoast-link-suggestions--loading"><Loader /></div>;
		}

		return <div className="yoast-link-suggestions"><LinkSuggestionsElement suggestions={this.state.suggestions} /></div>;
	}
}

Metabox.propTypes = {
	linkSuggestions: React.PropTypes.object.isRequired,
	suggestions: React.PropTypes.array.isRequired,
	isLoading: React.PropTypes.bool.isRequired,
};
