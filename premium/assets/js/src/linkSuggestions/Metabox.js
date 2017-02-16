import React, { Component } from "react";
import { LinkSuggestions as LinkSuggestionsElement } from "yoast-premium-components";
import Loader from "yoast-components/composites/basic/Loader";
import interpolateComponents from "interpolate-components";
import { localize } from "yoast-components/utils/i18n";

/**
 * Link suggestions metabox component.
 */
class Metabox extends Component {
	/**
	 * Constructs a metabox component for the link suggestions.
	 *
	 * @param {Object} props The properties for this components.
	 * @param {boolean} props.isLoading Whether this component should start of showing a loader.
	 * @param {Array} props.suggestions The suggestions to render initially.
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			loading: this.props.isLoading,
			suggestions: this.props.suggestions,
			usedLinks: this.props.usedLinks,
		};


		this.retrievedLinkSuggestions = this.retrievedLinkSuggestions.bind( this );
		this.props.linkSuggestions.on( "retrievedLinkSuggestions", this.retrievedLinkSuggestions );
	}

	/**
	 * Updates the link suggestions in the state.
	 *
	 * @param {Array} suggestions The link suggestions to set in the state.
	 * @param {bool} isLoading The loading state of the link suggestions.
	 * @returns {void}
	 */
	retrievedLinkSuggestions( suggestions, isLoading ) {
		this.setState( {
			suggestions,
			loading: isLoading || false,
		} );
	}

	/**
	 * Starts prominent word analysis in a new tab.
	 *
	 * @returns {void}
	 */
	static startAnalyzing() {
		window.open( "admin.php?page=wpseo_dashboard#open-internal-links-calculation", "yoastSeoAnalyzeProminentWords" );
	}

	/**
	 * Generates a warning about the site not having been properly indexed.
	 *
	 * @returns {React.Element} The message or no element.
	 */
	getUnindexedWarning() {
		if ( ! this.props.showUnindexedWarning ) {
			return null;
		}

		/* translators: 1: link to yoast.com post about internal linking suggestion. 2: is anchor closing.
		3: button to the recalculation option. 4: closing button */
		let message = this.props.translate( "You need to analyze your posts and/or pages in order to receive the best %1$slink suggestions%2$s." +
		              "\n\n" +
		              "%3$sAnalyze the content%4$s to generate the missing link suggestions." );

		message = message.replace( "%1$s", "{{a}}" );
		message = message.replace( "%2$s", "{{/a}}" );

		// These are here to keep the string the same as in the PHP
		message = message.replace( "%3$s", "{{startAnalysis}}" );
		message = message.replace( "%4$s", "{{/startAnalysis}}" );

		message = message.replace( "\n\n", "{{br /}}{{br /}}" );

		message = interpolateComponents( {
			mixedString: message,
			components: {
				a: <a href="https://yoa.st/notification-internal-link" />,
				startAnalysis: <button type="button" className="button" onClick={this.constructor.startAnalyzing} />,
				br: <br />,
			},
		} );

		return <div className="notice notice-error notice-alt wpseo-notice-breakout-inside"><p>{message}</p></div>;
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

		let unindexedWarning = this.getUnindexedWarning();

		return <div className="yoast-link-suggestions">
			{unindexedWarning}
			<LinkSuggestionsElement suggestions={this.state.suggestions} />
		</div>;
	}
}

Metabox.propTypes = {
	linkSuggestions: React.PropTypes.object.isRequired,
	suggestions: React.PropTypes.array.isRequired,
	isLoading: React.PropTypes.bool.isRequired,
	showUnindexedWarning: React.PropTypes.bool,
	translate: React.PropTypes.func,
};

Metabox.defaultProps = {
	showUnindexedWarning: false,
};

export default localize( Metabox );
