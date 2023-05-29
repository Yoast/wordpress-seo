/* global wpseoWincherDashboardWidgetL10n */
// External dependencies.
import { Component, render } from "@wordpress/element";

// Internal dependencies.
import WincherPerformanceReport from "./components/WincherPerformanceReport";
import { authenticate, getAuthorizationUrl, getKeyphrases } from "./helpers/wincherEndpoints";
import LoginPopup from "./helpers/loginPopup";
import { isEmpty, filter, sortBy } from "lodash";

/**
 * The Yoast dashboard widget component used on the WordPress admin dashboard.
 */
class WincherDashboardWidget extends Component {
	/**
	 * Creates the components and initializes its state.
	 */
	constructor() {
		super();

		this.state = {
			wincherData: {},
			wincherWebsiteId: wpseoWincherDashboardWidgetL10n.wincher_website_id,
			wincherIsLoggedIn: wpseoWincherDashboardWidgetL10n.wincher_is_logged_in === "1",
			isDataFetched: false,
			isConnectSuccess: false,
			isNetworkError: false,
		};

		this.onConnect = this.onConnect.bind( this );
		this.getWincherData = this.getWincherData.bind( this );
		this.performAuthenticationRequest = this.performAuthenticationRequest.bind( this );
		this.onConnectSuccess = this.onConnectSuccess.bind( this );
		this.onNetworkDisconnectionError = this.onNetworkDisconnectionError.bind( this );
	}

	/**
	 * Watches whether the data for the widget should be fetched.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		const widgetCheckbox = jQuery( "#wpseo-wincher-dashboard-overview-hide" );

		// Only fetch the data if the Wincher dashboard widget is checked in the Screen Options.
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

		if ( this.state.wincherIsLoggedIn ) {
			this.getWincherData();
		}

		this.setState( {
			isDataFetched: true,
		} );
	}

	/**
	 * Fetches data from Wincher, parses it and sets it to the state.
	 *
	 * @returns {void}
	 */
	async getWincherData() {
		const keyphraseChartData = await getKeyphrases();

		if ( keyphraseChartData.status === 200 ) {
			const filteredResults = filter( keyphraseChartData.results, ( entry ) => {
				return ! isEmpty( entry.position );
			} );

			const results = sortBy( filteredResults, ( entry ) => {
				return entry.position.value;
			} ).splice( 0, 5 );

			this.setState( {
				wincherData: {
					results,
					status: keyphraseChartData.status,
				},
			} );
		} else {
			this.setState( {
				wincherData: {
					results: [],
					status: keyphraseChartData.status,
				},
			} );
		}
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

		this.setState( {
			wincherIsLoggedIn: true,
			wincherWebsiteId: data.websiteId.toString(),
		} );

		await this.getWincherData();

		const popup = this.loginPopup.getPopup();

		if ( popup ) {
			popup.close();
		}
	}

	/**
	 * Get the tokens using the provided code after user has granted authorization.
	 *
	 * @param {Object} data The message data.
	 *
	 * @returns {void}
	 */
	async onConnectSuccess( data ) {
		this.setState( {
			isConnectSuccess: true,
			isNetworkError: false,
		} );

		await this.performAuthenticationRequest( data );
	}

	/**
	 * Handles network disconnection errors.
	 *
	 * @returns {void}
	 */
	async onNetworkDisconnectionError() {
		this.setState( {
			isConnectSuccess: false,
			isNetworkError: true,
		} );
	}

	/**
	 * The connect action when users aren't logged in to Wincher.
	 *
	 * @returns {void}
	 */
	async onConnect() {
		if ( this.loginPopup && ! this.loginPopup.isClosed() ) {
			this.loginPopup.focus();
			return;
		}

		const { url } = await getAuthorizationUrl();

		// eslint-disable-next-line no-undefined
		if ( ! url || ( url === undefined ) ) {
			this.onNetworkDisconnectionError();
			return;
		}

		this.loginPopup = new LoginPopup(
			url,
			{
				success: {
					type: "wincher:oauth:success",
					callback: ( data ) => this.onConnectSuccess( data ),
				},
				error: {
					type: "wincher:oauth:error",
					callback: () => {},
				},
			},
			{
				title: "Wincher_login",
				width: 500,
				height: 700,
			}
		);

		this.loginPopup.createPopup();
	}

	/**
	 * Renders the component.
	 *
	 * @returns {wp.Element} The component.
	 */
	render() {
		return <WincherPerformanceReport
			key="wincher-performance-report"
			data={ this.state.wincherData }
			websiteId={ this.state.wincherWebsiteId }
			isLoggedIn={ this.state.wincherIsLoggedIn }
			isConnectSuccess={ this.state.isConnectSuccess }
			isNetworkError={ this.state.isNetworkError }
			onConnectAction={ this.onConnect }
		/>;
	}
}

const element = document.getElementById( "yoast-seo-wincher-dashboard-widget" );

if ( element ) {
	render( <WincherDashboardWidget />, element );
}
