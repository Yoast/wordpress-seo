/* global yoastIndexingData */
import { Component, flushSync, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, NewButton, ProgressBar } from "@yoast/components";
import { colors } from "@yoast/style-guide";
import PropTypes from "prop-types";
import { addHistoryState, removeSearchParam } from "../helpers/urlHelpers";
import IndexingError from "./IndexingError";
import RequestError from "../errors/RequestError";
import ParseError from "../errors/ParseError";

const STATE = {
	IDLE: "idle",
	IN_PROGRESS: "in_progress",
	ERRORED: "errored",
	COMPLETED: "completed",
};

/**
 * Indexes the site and shows a progress bar indicating the indexing process' progress.
 */
class Indexation extends Component {
	constructor( props ) {
		super( props );

		this.settings = yoastIndexingData;

		this.state = {
			state: STATE.IDLE,
			processed: 0,
			error: null,
			amount: parseInt( this.settings.amount, 10 ),
			firstTime: ( this.settings.firstTime === "1" ),
		};

		this.startIndexing = this.startIndexing.bind( this );
		this.stopIndexing = this.stopIndexing.bind( this );
	}

	async doIndexingRequest( url, nonce ) {
		const response = await fetch( url, {
			method: "POST",
			headers: { "X-WP-Nonce": nonce },
		} );

		const responseText = await response.text();

		let data;
		try {
			data = JSON.parse( responseText );
		} catch ( error ) {
			throw new ParseError( "Error parsing the response to JSON.", responseText );
		}

		if ( ! response.ok ) {
			const stackTrace = data.data ? data.data.stackTrace : "";
			throw new RequestError( data.message, url, "POST", response.status, stackTrace );
		}

		return data;
	}

	async doPreIndexingAction( endpoint ) {
		if ( typeof this.props.preIndexingActions[ endpoint ] === "function" ) {
			await this.props.preIndexingActions[ endpoint ]( this.settings );
		}
	}

	async doPostIndexingAction( endpoint, response ) {
		if ( typeof this.props.indexingActions[ endpoint ] === "function" ) {
			await this.props.indexingActions[ endpoint ]( response.objects, this.settings );
		}
	}

	async doIndexing( endpoint ) {
		let url = this.settings.restApi.root + this.settings.restApi.indexing_endpoints[ endpoint ];

		while ( this.isState( STATE.IN_PROGRESS ) && url !== false ) {
			try {
				await this.doPreIndexingAction( endpoint );
				const response = await this.doIndexingRequest( url, this.settings.restApi.nonce );
				await this.doPostIndexingAction( endpoint, response );

				flushSync( () => {
					this.setState( prev => ( {
						processed: prev.processed + response.objects.length,
						firstTime: false,
					} ) );
				} );

				url = response.next_url;
			} catch ( error ) {
				flushSync( () => {
					this.setState( {
						state: STATE.ERRORED,
						error: error,
						firstTime: false,
					} );
				} );
			}
		}
	}

	async index() {
		for ( const endpoint of Object.keys( this.settings.restApi.indexing_endpoints ) ) {
			await this.doIndexing( endpoint );
		}

		if ( ! this.isState( STATE.ERRORED ) && ! this.isState( STATE.IDLE ) ) {
			this.completeIndexing();
		}
	}

	async startIndexing() {
		this.setState( { processed: 0, state: STATE.IN_PROGRESS }, this.index );
	}

	completeIndexing() {
		this.setState( { state: STATE.COMPLETED } );
	}

	stopIndexing() {
		this.setState( prev => ( {
			state: STATE.IDLE,
			processed: 0,
			amount: prev.amount - prev.processed,
		} ) );
	}

	componentDidMount() {
		if ( this.settings.disabled ) {
			return;
		}

		this.props.indexingStateCallback( this.state.amount === 0 ? "completed" : this.state.state );

		const shouldStart = new URLSearchParams( window.location.search ).get( "start-indexation" ) === "true";

		if ( shouldStart ) {
			const currentURL = removeSearchParam( window.location.href, "start-indexation" );
			addHistoryState( null, document.title, currentURL );
			this.startIndexing();
		}
	}

	componentDidUpdate( _prevProps, prevState ) {
		if ( this.state.state !== prevState.state ) {
			this.props.indexingStateCallback( this.state.state );
		}
	}

	isState( state ) {
		return this.state.state === state;
	}

	renderStartButton() {
		return <NewButton variant="primary" onClick={ this.startIndexing }>
			{ __( "Start SEO data optimization", "wordpress-seo" ) }
		</NewButton>;
	}

	renderStopButton() {
		return <NewButton variant="secondary" onClick={ this.stopIndexing }>
			{ __( "Stop SEO data optimization", "wordpress-seo" ) }
		</NewButton>;
	}

	renderDisabledTool() {
		return <Fragment>
			<p>
				<NewButton variant="secondary" disabled={ true }>
					{ __( "Start SEO data optimization", "wordpress-seo" ) }
				</NewButton>
			</p>
			<Alert type={ "info" }>
				{ __( "SEO data optimization is disabled for non-production environments.", "wordpress-seo" ) }
			</Alert>
		</Fragment>;
	}

	renderProgressBar() {
		return <Fragment>
			<ProgressBar
				style={ { height: "16px", margin: "8px 0" } }
				progressColor={ colors.$color_pink_dark }
				max={ parseInt( this.state.amount, 10 ) }
				value={ this.state.processed }
			/>
			<p style={ { color: colors.$palette_grey_text } }>
				{ __( "Optimizing SEO data… This may take a while.", "wordpress-seo" ) }
			</p>
		</Fragment>;
	}

	renderErrorAlert() {
		return <IndexingError
			message={ yoastIndexingData.errorMessage }
			error={ this.state.error }
		/>;
	}

	renderTool() {
		return (
			<Fragment>
				{ this.isState( STATE.IN_PROGRESS ) && this.renderProgressBar() }
				{ this.isState( STATE.ERRORED ) && this.renderErrorAlert() }
				{ this.isState( STATE.IN_PROGRESS )
					? this.renderStopButton()
					: this.renderStartButton()
				}
			</Fragment>
		);
	}

	render() {
		if ( this.settings.disabled ) {
			return this.renderDisabledTool();
		}

		if ( this.isState( STATE.COMPLETED ) || this.state.amount === 0 ) {
			return <Alert type={ "success" }>{ __( "SEO data optimization complete", "wordpress-seo" ) }</Alert>;
		}

		return this.renderTool();
	}
}

Indexation.propTypes = {
	indexingActions: PropTypes.object,
	preIndexingActions: PropTypes.object,
	indexingStateCallback: PropTypes.func,
};

Indexation.defaultProps = {
	indexingActions: {},
	preIndexingActions: {},
	indexingStateCallback: () => {},
};

export default Indexation;
