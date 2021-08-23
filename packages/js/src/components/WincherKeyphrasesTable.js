/* External dependencies */
import PropTypes from "prop-types";
import { Fragment, Component } from "@wordpress/element";
import { __, sprintf, _n } from "@wordpress/i18n";
import { isEmpty } from "lodash-es";

/* Yoast dependencies */
import { Toggle } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";

/* Internal dependencies */
import AreaChart from "../AreaChart";

const GetMoreInsightsLink = makeOutboundLink();
const ViewLink = makeOutboundLink();

/**
 * The WincherKeyphrasesTable component.
 */
class WincherKeyphrasesTable extends Component {
	/**
	 * Constructs the Related Keyphrases table.
	 *
	 * @param {Object} props The props for the Related Keyphrases table.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.transformTrendDataToChartPoints   = this.transformTrendDataToChartPoints.bind( this );
		this.getAreaChartDataTableHeaderLabels = this.getAreaChartDataTableHeaderLabels.bind( this );
		this.mapAreaChartDataToTableData       = this.mapAreaChartDataToTableData.bind( this );
		this.getToggleState                    = this.getToggleState.bind( this );
		this.onLoginOpen                       = this.onLoginOpen.bind( this );
		this.listenToMessages                  = this.listenToMessages.bind( this );
	}

	/**
	 * Opens the popup window.
	 *
	 * @param {event} e The click event.
	 *
	 * @returns {void}
	 */
	onLoginOpen( e ) {
		e.preventDefault();

		const url    = "https://auth.wincher.com/connect/authorize?client_id=yoast&response_type=code&redirect_uri=https%3A%2F%2Fauth.wincher.com%2Fyoast%2Fsetup&scope=api%20offline_access";
		const height = "570";
		const width  = "340";
		const top    = window.top.outerHeight / 2 + window.top.screenY - ( height / 2 );
		const left   = window.top.outerWidth / 2 + window.top.screenX - ( width / 2 );

		const features = [
			"top=" + top,
			"left=" + left,
			"width=" + width,
			"height=" + height,
			"resizable=1",
			"scrollbars=1",
			"status=0",
		];

		if ( ! this.popup || this.popup.closed ) {
			this.popup = window.open( url, "Wincher_login", features.join( "," ) );
		}
		if ( this.popup ) {
			this.popup.focus();
		}
		window.addEventListener( "message", this.listenToMessages, false );
	}

	/**
	 * Listens to message events from the SEMrush popup.
	 *
	 * @param {event} event The message event.
	 *
	 * @returns {void}
	 */
	async listenToMessages( event ) {
		const { data, source, origin } = event;

		// Check that the message comes from the expected origin.
		if ( origin !== "https://auth.wincher.com" || this.popup !== source ) {
			return;
		}

		if ( data.type === "wincher:oauth:success" ) {
			this.popup.close();
			// Stop listening to messages, since the popup is closed.
			window.removeEventListener( "message", this.listenToMessages, false );
			await this.performAuthenticationRequest( data );
		}

		if ( data.type === "wincher:oauth:error" ) {
			this.popup.close();
			// Stop listening to messages, since the popup is closed.
			window.removeEventListener( "message", this.listenToMessages, false );
			this.props.onAuthentication( false );
		}
	}

	/**
	 * Get the tokens using the provided code after user has granted authorization.
	 *
	 * @param {object} data The message data.
	 *
	 * @returns {void}
	 */
	async performAuthenticationRequest( data ) {
		try {
			const { code, websiteId } = data;

			// const response = await apiFetch( {
			// 	path: "yoast/v1/wincher/authenticate",
			// 	method: "POST",
			// 	data: { code, websiteId },
			// } );
			//
			// if ( response.status === 200 ) {
			// 	this.props.onAuthentication( true );
			// 	this.onModalOpen();
			// 	// Close the popup if it's been opened again by mistake.
			// 	this.popup.close();
			// } else {
			// 	console.error( response.error );
			// }
		} catch ( e ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( e.message );
		}
	}

	/**
	 * Transforms the Wincher Position data to x/y points for the SVG area chart.
	 *
	 * @param {Object} trend Comma separated list of position values for a single keyphrase.
	 *
	 * @returns {Array} An array of x/y coordinates objects.
	 */
	transformTrendDataToChartPoints( trend ) {
		const trendArray = trend.split( "," );

		return trendArray.map( ( value, index ) => ( { x: index, y: parseFloat( value ) } ) );
	}

	/**
	 * Gets the labels for the data table headers.
	 *
	 * @returns {Array} The data table header labels.
	 */
	getAreaChartDataTableHeaderLabels() {
		return Array.from( { length: 90 }, ( _, i ) => i + 1 ).map( ( i ) => {
			/* translators: %d expands to the amount of days */
			return sprintf( _n( "%d day", "%d days", i, "wordpress-seo" ), i );
		} );
	}

	/**
	 * Adapts the chart y axis data to a more meaningful format for the alternative representation in the data table.
	 *
	 * @param {number} y The raw y axis data of the chart.
	 *
	 * @returns {number} The formatted y axis data.
	 */
	mapAreaChartDataToTableData( y ) {
		return Math.round( y * 100 );
	}

	/**
	 * Gets the toggles state of the keyphrase.
	 *
	 * @param {string} keyphrase The toggle's associated keyphrase.
	 * @param {boolean} isEnabled Whether or not the toggle is enabled.
	 *
	 * @returns {wp.Element} The toggle component.
	 */
	getToggleState( keyphrase, isEnabled ) {
		return (
			<Toggle
				id={ `toggle-keyphrase-tracking-${keyphrase}` }
				className="wincher-toggle"
				isEnabled={ isEnabled }
				onSetToggleState={ () => {
					this.props.toggleAction( keyphrase );
				} }
				showToggleStateLabel={ false }
			/>
		);
	}

	/**
	 *  Generates a chart based on the passed data.
	 *
	 * @param {Object} entry The data entry to check for data points.
	 *
	 * @returns {wp.Element} The chart containing the positions over time.
	 */
	generatePositionOverTimeChart( entry ) {
		const areaChartDataTableHeaderLabels = this.getAreaChartDataTableHeaderLabels();
		const chartPoints = this.transformTrendDataToChartPoints( entry );

		return <AreaChart
			width={ 66 }
			height={ 24 }
			data={ chartPoints }
			strokeWidth={ 1.8 }
			strokeColor="#498afc"
			fillColor="#ade3fc"
			className="yoast-related-keyphrases-modal__chart"
			mapChartDataToTableData={ this.mapAreaChartDataToTableData }
			dataTableCaption={
				__( "Keyphrase position in the last 90 days on a scale from 0 to 100.", "wordpress-seo" )
			}
			dataTableHeaderLabels={ areaChartDataTableHeaderLabels }
		/>;
	}

	/**
	 * Renders the table.
	 *
	 * @returns {React.Element} The table.
	 */
	render() {
		const { keyphrases, data, trackedKeyphrases, allowToggling, isTrackingAll } = this.props;

		return (
			data && ! isEmpty( data.results ) && <Fragment>
				<table className="yoast yoast-table">
					<thead>
						<tr>
							{ allowToggling && <th
								scope="col"
								abbr={ __( "Tracking", "wordpress-seo" ) }
							>
								{ __( "Tracking", "wordpress-seo" ) }
							</th> }
							<th
								scope="col"
								abbr={ __( "Keyphrase", "wordpress-seo" ) }
							>
								{ __( "Keyphrase", "wordpress-seo" ) }
							</th>
							<th
								scope="col"
								abbr={ __( "Position", "wordpress-seo" ) }
							>
								{ __( "Position", "wordpress-seo" ) }
							</th>
							<th
								scope="col"
								abbr={ __( "Position over time", "wordpress-seo" ) }
							>
								{ __( "Position over time", "wordpress-seo" ) }
							</th>
							<td className="yoast-table--nobreak" />
						</tr>
					</thead>
					<tbody>
						{
							data.results.rows.map( ( row, index ) => {
								const trackableKeyphrase = row[ 1 ];
								const isTracked          = trackedKeyphrases.includes( trackableKeyphrase );





								return <tr key={ `trackable-keyphrase-${index}` }>
									{ allowToggling &&  <td>{ this.getToggleState( trackableKeyphrase, isTracked ) }</td> }
									<td>{ trackableKeyphrase }</td>
									<td>{ isTracked ? row[ 2 ] : "?" }</td>
									<td className="yoast-table--nopadding">{ isTracked ? this.generatePositionOverTimeChart( row[ 3 ] ) : "?" }</td>
									<td className="yoast-table--nobreak">
										{
											<ViewLink href={ `https://google.com?q=${trackableKeyphrase}` }>
												{ __( "View", "wordpress-seo" ) }
											</ViewLink>
										}
									</td>
								</tr>;
							} )
						}
					</tbody>
				</table>
				<p style={ { marginBottom: 0 } }>
					<GetMoreInsightsLink href={ "https://google.com" }>
						{ sprintf(
							/* translators: %s expands to Wincher */
							__( "Get more insights over at %s", "wordpress-seo" ),
							"Wincher"
						) }
					</GetMoreInsightsLink>
				</p>
			</Fragment>
		);
	}
}

WincherKeyphrasesTable.propTypes = {
	data: PropTypes.object,
	keyphrases: PropTypes.array,
	trackedKeyphrases: PropTypes.array,
	toggleAction: PropTypes.func,
	allowToggling: PropTypes.bool,
	isTrackingAll: PropTypes.bool,
};

WincherKeyphrasesTable.defaultProps = {
	data: {},
	keyphrases: [],
	trackedKeyphrases: [],
	toggleAction: null,
	allowToggling: true,
	isTrackingAll: false,
};

export default WincherKeyphrasesTable;
