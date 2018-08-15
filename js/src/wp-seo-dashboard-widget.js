/* global wpseoDashboardWidgetL10n, wpseoApi, jQuery */

import React from "react";
import ReactDOM from "react-dom";

import "./helpers/babel-polyfill";
import { SeoAssessment, ScoreAssessments, utils, WordpressFeed, colors } from "yoast-components";
import { setYoastComponentsL10n } from "./helpers/i18n";
const { getFeed } = utils;

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
	 * @param {string} score The score, expected to be 'na', 'bad', 'ok', 'good' or 'noindex'.
	 *
	 * @returns {string} The color to use for this score. Defaults to grey if no such color exists.
	 */
	static getColorFromScore( score ) {
		return colors[ `$color_${ score }` ] || colors.$color_grey;
	}

	/**
	 * Fetches data from the statistics endpoint, parses it and sets it to the state.
	 *
	 * @returns {void}
	 */
	getStatistics() {
		wpseoApi.get( "statistics", ( response ) => {
			let statistics = {};

			statistics.seoScores = response.seo_scores.map( ( score ) => ( {
				value: parseInt( score.count, 10 ),
				color: DashboardWidget.getColorFromScore( score.seo_rank ),
				html: `<a href="${ score.link }">${ score.label }</a>`,
			} ) );

			// Wrap in a div and get the text to HTML decode.
			statistics.header = jQuery( `<div>${ response.header }</div>` ).text();

			this.setState( { statistics } );
		} );
	}

	/**
	 * Fetches data from the Ryte endpoint, parses it and sets it to the state.
	 *
	 * @returns {void}
	 */
	getRyte() {
		wpseoApi.get( "ryte", ( response ) => {
			if ( ! response.ryte ) {
				return;
			}

			let ryte = {
				scores: [ {
					color: DashboardWidget.getColorFromScore( response.ryte.score ),
					html: response.ryte.label,
				} ],
				canFetch: response.ryte.can_fetch,
			};

			this.setState( { ryte } );
		} );
	}

	/**
	 * Fetches data from the yoast.com feed, parses it and sets it to the state.
	 *
	 * @returns {void}
	 */
	getFeed() {
		// Developer note: this link should -not- be converted to a shortlink.
		getFeed( "https://yoast.com/feed/widget/", 2 )
			.then( ( feed ) => {
				feed.items = feed.items.map( ( item ) => {
					item.description = jQuery( `<div>${ item.description }</div>` ).text();
					item.description = item.description.replace( `The post ${ item.title } appeared first on Yoast.`, "" ).trim();
					item.content = jQuery( `<div>${ item.content }</div>` ).text();

					return item;
				} );

				this.setState( { feed } );
			} )
			.catch( error => console.log( error ) );
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
			seoAssessmentItems={ this.state.statistics.seoScores }/>;
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
					{ this.state.ryte.canFetch &&
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
			footerHtml={ wpseoDashboardWidgetL10n.feed_footer } />;
	}

	/**
	 * Renders the component.
	 *
	 * @returns {ReactElement} The component.
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

		return <div>{ contents }</div>;
	}
}

const element = document.getElementById( "yoast-seo-dashboard-widget" );

if( element ) {
	setYoastComponentsL10n();

	ReactDOM.render( <DashboardWidget/>, element );
}
