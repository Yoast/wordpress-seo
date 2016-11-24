import React, { Component } from "react";
import { LinkSuggestions as LinkSuggestionsElement } from "yoast-premium-components";
import Loader from "yoast-components/composites/basic/Loader";

export default class Metabox extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			loading: this.props.isLoading,
			suggestions: this.props.suggestions,
		};

		this.retrievedLinkSuggestions = this.retrievedLinkSuggestions.bind( this );

		this.props.linkSuggestions.on( "retrievedLinkSuggestions", this.retrievedLinkSuggestions );
	}

	retrievedLinkSuggestions( suggestions ) {
		this.setState( {
			suggestions,
			loading: false,
		} );
	}

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
