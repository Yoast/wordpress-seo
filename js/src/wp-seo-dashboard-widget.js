import React from "react";
import ReactDOM from "react-dom";

import SeoAssessment from "yoast-components/composites/Plugin/DashboardWidget/components/SeoAssessment";
import ScoreAssessments from "yoast-components/composites/Plugin/Shared/components/ScoreAssessments";
import getFeed from "yoast-components/utils/getFeed";
import WordpressFeed from "yoast-components/composites/Plugin/DashboardWidget/components/WordpressFeed";
import Divider from "yoast-components/composites/Plugin/DashboardWidget/components/Divider";
import colors from "yoast-components/style-guide/colors.json";

class DashboardWidget extends React.Component {
	/**
	 * Creates the components and initializes its state.
	 */
	constructor() {
		super();

		this.state = {
			statistics: null,
			ryte: null,
			feed: null,
		};

		this.getStatistics();
		this.getRyte();
		this.getFeed();
	}

	/**
	 * Returns a color to be used for a given score.
	 *
	 * @param {string} score The score, expected to be 'na', 'bad', 'ok', 'good'.
	 *
	 * @returns {color} The color to use for this score. Defaults to grey if no such color exists.
	 */
	static getColorFromScore( score ) {
		return colors[ `$color_${ score }` ] || colors.$color_grey;
	}

	/**
	 * Fetches data from the statistics endpoint, parses it and sets it to the state.
	 */
	getStatistics() {
		let self = this;

		wpseoApi.get( 'statistics', function ( statistics ) {
			statistics.seo_scores = statistics.seo_scores.map( function ( score ) {
				return {
					value: parseInt( score.count ),
					color: DashboardWidget.getColorFromScore( score.seo_rank ),
					html: `<a href="${ score.link }">${ score.label }</a>`,
				};
			} );

			// Wrap in a div and get the text to HTML decode.
			statistics.header = jQuery( `<div>${ statistics.header }</div>` ).text();

			self.setState( { statistics } );
		} );
	}

	/**
	 * Fetches data from the ryte endpoint, parses it and sets it to the state.
	 */
	getRyte() {
		let self = this;

		wpseoApi.get( 'ryte', function ( raw ) {
			let ryte = {
				scores: [ {
					color: DashboardWidget.getColorFromScore( raw.onpage.score ),
					html:  raw.onpage.label,
				} ],
				can_fetch: raw.onpage.can_fetch,
			};

			self.setState( { ryte } );
		} );
	}

	/**
	 * Fetches data from the yoast.com feed, parses it and sets it to the state.
	 */
	getFeed() {
		let self = this;

		getFeed( "https://www.yoast.com/feed", 2 )
			.then( function ( feed ) {
				feed.items = feed.items.map( function ( item ) {
					item.description = jQuery( `<div>${ item.description }</div>` ).text();
					item.content = jQuery( `<div>${ item.content }</div>` ).text();

					return item;
				} );
				self.setState( { feed } );
			} )
			.catch( function () { /* Don't render the component. */ } );
	}

	/**
	 * Returns the SEO Assessment sub-component.
	 *
	 * @returns {ReactElement} The SEO Assessment component.
	 */
	getSeoAssessment() {
		if ( this.state.statistics === null ) {
			return null;
		}

		return <SeoAssessment key="yoast-seo-posts-assessment"
			seoAssessmentText={ this.state.statistics.header }
			seoAssessmentItems={ this.state.statistics.seo_scores }/>
	}

	/**
	 * Returns the Ryte Assessment sub-component.
	 *
	 * @returns {ReactElement} The Ryte Assessment component.
	 */
	getRyteAssessment() {
		if ( this.state.ryte === null ) {
			return null;
		}

		return (
			<div id="yoast-seo-ryte-assessment" key="yoast-seo-ryte-assessment">
				<h3>{ wpseoDashboardWidgetL10n.ryte_header }</h3>
				<ScoreAssessments items={ this.state.ryte.scores }/>
				<div>
					{ this.state.ryte.can_fetch &&
					  <a className="fetch-status button" href={ wpseoDashboardWidgetL10n.ryte_fetch_url }>
						  { wpseoDashboardWidgetL10n.ryte_fetch }
					  </a>
					}
					<a className="landing-page button" href={ wpseoDashboardWidgetL10n.ryte_landing_url } target="_blank">
						{ wpseoDashboardWidgetL10n.ryte_analyze }
					</a>
				</div>
			</div>
		);
	}

	/**
	 * Returns the yoast.com feed sub-component.
	 *
	 * @returns {ReactElement} The yoast.com feed component.
	 */
	getYoastFeed() {
		if ( this.state.feed === null ) {
			return null;
		}

		return <WordpressFeed
			key="yoast-seo-blog-feed"
			title={ wpseoDashboardWidgetL10n.feed_header }
			feed={ this.state.feed }
			footerHtml={ wpseoDashboardWidgetL10n.feed_footer }/>;
	}

	/**
	 * Renders the component.
	 *
	 * @returns {ReactElement} The coponent.
	 */
	render() {
		let contents = [
			this.getSeoAssessment(),
			this.getRyteAssessment(),
			this.getYoastFeed(),
		].filter( item => item !== null );

		if ( contents.length === 0 ) {
			return null;
		}

		return (
			<div>
				{ contents.reduce( function ( list, component, i ) {
					if ( list === null ) {
						return [ component ];
					}
					return [ ...list, <Divider key={ i }/>, component ];
				}, null ) }
			</div>
		);
	}
}

ReactDOM.render( <DashboardWidget/>, document.getElementById( "yoast-seo-dashboard-widget" ) );
