/* global wpseoPluginInstallationL10n */

// External dependencies.
import { connect } from "react-redux";
import { Component } from "@wordpress/element";
import { MultiStepProgress, Modal } from "@yoast/components";
import PropTypes from "prop-types";

// Internal dependencies.
import * as actions from "../install-plugin/actions";

/**
 * Plugin installation modal.
 */
class PluginInstallation extends Component {

	constructor( props ) {
		super( props );

		this.state = {
			modalOpen: false,
		};

		this.closeModal = this.closeModal.bind( this );
	}

	/**
	 * Sets the plugin installation tasks.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		const urlParams = new URLSearchParams( window.location.search );

		if ( ! urlParams.has( "install_plugins" ) ) {
			return;
		}

		const plugins = urlParams.get( "install_plugins" ).split( "," );

		const queue = [];

		for ( let i = 0; i < plugins.length; i++ ) {
			queue.push( {
				type: "INSTALL_PLUGIN",
				plugin: plugins[ i ],
			} );
			queue.push( {
				type: "ACTIVATE_PLUGIN",
				plugin: plugins[ i ],
			} );
		}

		this.props.setQueue( queue );

		this.setState( {
			modalOpen: true,
		} );
	}

	isModalOpen() {
		return ( this.state.modalOpen && this.props.tasks.length );
	}

	closeModal() {
		if ( this.props.installing ) {
			return;
		}

		this.setState( { modalOpen: false } );
	}

	/**
	 * Renders the PluginInstallation component.
	 *
	 * @returns {React.Element} The rendered PluginInstallation.
	 */
	render() {
		return (
			<div>
				<Modal
					appElement={ document.getElementById( "wpseo-app-element" ) }
					onClose={ this.closeModal }
					title="Installing your products"
					isOpen={ this.isModalOpen() }
				>
					<button onClick={ this.props.startInstallation }>Start installation</button>
					<MultiStepProgress
						steps={ this.getSteps() }
					/>
					<button onClick={ this.closeModal }>Close</button>
				</Modal>
			</div>
		);
	}

	/**
	 * Maps the plugin installation tasks to MultiStepProgress steps.
	 *
	 * @returns {Array} MultiStepProgress steps.
	 */
	getSteps() {
		return this.props.tasks.map( task => {
			let text = "";
			switch ( task.type ) {
				case "INSTALL_PLUGIN":
					text = `Installing ${ wpseoPluginInstallationL10n.pluginNames[ task.plugin ] }...`; break;
				case "ACTIVATE_PLUGIN":
					text = `Activating ${ wpseoPluginInstallationL10n.pluginNames[ task.plugin ] }...`; break;
			}

			return {
				text,
				status: task.status,
			};
		} );
	}
}

PluginInstallation.propTypes = {
	tasks: PropTypes.array.isRequired,
	installing: PropTypes.bool.isRequired,
	startInstallation: PropTypes.func.isRequired,
	setQueue: PropTypes.func.isRequired,
};

export default connect( ( state ) => {
	return {
		tasks: state.pluginInstallation.tasks,
		installing: state.pluginInstallation.installing,
	};
}, {
	startInstallation: actions.startInstallation,
	setQueue: actions.setQueue,
} )( PluginInstallation );
