/* global wpseoDashboardWidgetL10n, wpseoApi */
// External dependencies.
import { Component, render } from "@wordpress/element";
import { ArticleList as WordpressFeed } from "@yoast/components";
import { colors } from "@yoast/style-guide";
import { SiteSEOReport as SeoAssessment } from "@yoast/analysis-report";
import { getPostFeed } from "@yoast/helpers";

// Internal dependencies.
import { setYoastComponentsL10n } from "./helpers/i18n";
import WincherPerformanceReport from "./components/WincherPerformanceReport";
import {authenticate, getKeyphrasesChartData, trackAllKeyphrases} from "./helpers/wincherEndpoints";
import LoginPopup from "./helpers/loginPopup";

/**
 * The Yoast dashboard widget component used on the WordPress admin dashboard.
 */
class DashboardWidget extends Component {
	/**
	 * Creates the components and initializes its state.
	 */
	constructor() {
		super();

		this.state = {
			statistics: null,
			feed: null,
			wincherData: null,
			wincherIsLoggedIn: wpseoDashboardWidgetL10n.wincher_is_logged_in,
			wincherLimits: {},
			isDataFetched: false,
		};

		this.onConnect = this.onConnect.bind( this );
		this.getWincherData = this.getWincherData.bind( this );
		this.performAuthenticationRequest = this.performAuthenticationRequest.bind( this );
		this.onTrackAll = this.onTrackAll.bind( this );
	}

	/**
	 * Watches whether the data for the widget should be fetched.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		const widgetCheckbox = jQuery( "#wpseo-dashboard-overview-hide" );

		// Only fetch the data if the Yoast SEO dashboard widget is checked in the Screen Options.
		if ( widgetCheckbox.is( ":checked" ) ) {
			this.fetchData();
		}

		// Whenever the checkbox gets clicked, fetch the data if needed.
		widgetCheckbox.on( "click", () => {
			this.fetchData();
		} );
	}

	/**
	 * Fetches the relevant data, if they haven't been fetched before.
	 *
	 * @returns {void}
	 */
	fetchData() {
		if ( this.state.isDataFetched ) {
			return;
		}

		this.getStatistics();
		this.getFeed();

		if ( this.state.wincherIsLoggedIn ) {
			this.getWincherData();
		}

		this.setState( {
			isDataFetched: true,
		} );
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
			const statistics = {};

			if ( ! response || ! response.seo_scores ) {
				return;
			}

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
	 * Fetches data from the yoast.com feed, parses it and sets it to the state.
	 *
	 * @returns {void}
	 */
	getFeed() {
		// Developer note: this link should -not- be converted to a shortlink.
		getPostFeed(
			"https://yoast.com/feed/widget/?wp_version=" + wpseoDashboardWidgetL10n.wp_version +
			"&php_version=" + wpseoDashboardWidgetL10n.php_version,
			2
		)
			.then( ( feed ) => {
				feed.items = feed.items.map( ( item ) => {
					item.description = jQuery( `<div>${ item.description }</div>` ).text();
					item.description = item.description.replace( `The post ${ item.title } appeared first on Yoast.`, "" ).trim();

					return item;
				} );

				this.setState( { feed } );
			} )
			/* eslint-disable-next-line no-console */
			.catch( error => console.log( error ) );
	}

	/**
	 * Fetches data from Wincher, parses it and sets it to the state.
	 *
	 * @returns {void}
	 */
	async getWincherData() {
		const keyphraseChartData = await getKeyphrasesChartData();

		if ( keyphraseChartData.status === 200 ) {
			const wincherData = Object.fromEntries(
				Object.entries( keyphraseChartData.results )
					.sort( this.sortWincherData )
					.splice( 0, 5 )
			);

			this.setState( { wincherData } );
		}
	}

	/**
	 * Sorts the Wincher results in ascending order based on the position value.
	 *
	 * @param {Object} a The first Wincher result.
	 * @param {Object} b The second Wincher result.
	 *
	 * @returns {number} The sorting order.
	 */
	sortWincherData( [ , a ], [ , b ] ) {
		if ( a.position.value > b.position.value ) {
			return 1;
		}

		if ( a.position.value < b.position.value ) {
			return -1;
		}

		return 0;
	}


	/**
	 * Returns the SEO Assessment sub-component.
	 *
	 * @returns {wp.Element} The SEO Assessment component.
	 */
	getSeoAssessment() {
		if ( this.state.statistics === null ) {
			return null;
		}

		return <SeoAssessment
			key="yoast-seo-posts-assessment"
			seoAssessmentText={ this.state.statistics.header }
			seoAssessmentItems={ this.state.statistics.seoScores }
		/>;
	}

	/**
	 * Returns the yoast.com feed sub-component.
	 *
	 * @returns {wp.Element} The yoast.com feed component.
	 */
	getYoastFeed() {
		if ( this.state.feed === null ) {
			return null;
		}

		return <WordpressFeed
			className="wordpress-feed"
			key="yoast-seo-blog-feed"
			title={ wpseoDashboardWidgetL10n.feed_header }
			feed={ this.state.feed }
			footerLinkText={ wpseoDashboardWidgetL10n.feed_footer }
		/>;
	}

	/**
	 * Get the tokens using the provided code after user has granted authorization.
	 *
	 * @param {Object} data The message data.
	 *
	 * @returns {void}
	 */
	async performAuthenticationRequest( data ) {
		const response = await authenticate( data );

		if ( response.status !== 200 ) {
			return;
		}

		this.setState( { wincherIsLoggedIn: true } );

		await this.getWincherData();

		const popup = this.loginPopup.getPopup();

		if ( popup ) {
			popup.close();
		}
	}

	/**
	 * The connect action when users aren't logged in to Wincher.
	 *
	 * @returns {void}
	 */
	onConnect() {
		const url = "https://auth.wincher.com/connect/authorize?client_id=yoast&response_type=code&" +
			"redirect_uri=https%3A%2F%2Fauth.wincher.com%2Fyoast%2Fsetup&scope=api%20offline_access";

		this.loginPopup = new LoginPopup(
			url,
			{
				success: {
					type: "wincher:oauth:success",
					callback: ( data ) => this.performAuthenticationRequest( data ),
				},
				error: {
					type: "wincher:oauth:error",
					callback: () => {},
				},
			},
			{
				title: "Wincher_login",
			}
		);

		this.loginPopup.createPopup();
	}

	/**
	 * Tracks all keyphrases.
	 *
	 * @returns {void}
	 */
	async onTrackAll() {
		const response = await trackAllKeyphrases();

		// If we hit the limit with this call, display the error message.
		if ( response.status === 400 ) {
			this.setState( {
				wincherLimits: response.results,
			} );
		}
	}

	/**
	 * Gets the Wincher SEO Performance entry.
	 *
	 * @returns {void|wp.Element} The Wincher performance entry.
	 */
	getWincherSEOPerformance() {
		if ( wpseoDashboardWidgetL10n.is_wincher_active === "0" ) {
			return;
		}

		return <WincherPerformanceReport
			data={ this.state.wincherData }
			websiteId={ wpseoDashboardWidgetL10n.wincher_website_id }
			isLoggedIn={ this.state.wincherIsLoggedIn }
			onConnectAction={ this.onConnect }
			onTrackAllAction={ this.onTrackAll }
			limits={ this.state.wincherLimits }
		/>;
	}

	/**
	 * Renders the component.
	 *
	 * @returns {wp.Element} The component.
	 */
	render() {
		const contents = [
			this.getSeoAssessment(),
			this.getWincherSEOPerformance(),
			this.getYoastFeed(),
		].filter( item => item !== null );

		if ( contents.length === 0 ) {
			return null;
		}

		return <div>{ contents }</div>;
	}
}

const element = document.getElementById( "yoast-seo-dashboard-widget" );

if ( element ) {
	setYoastComponentsL10n();

	render( <DashboardWidget />, element );
}
