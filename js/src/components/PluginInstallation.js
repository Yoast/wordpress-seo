/* global wpseoPluginInstallationL10n */

// External dependencies.
import { connect } from "react-redux";
import { Component } from "@wordpress/element";
import { MultiStepProgress, Modal, Alert } from "@yoast/components";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import styled from "styled-components";

// Internal dependencies.
import {
	queueMultiplePluginInstallations,
	startInstallation,
} from "../install-plugin/actions";

const CloseButton = styled.a`
	float: right;
	cursor: pointer;
`;

const AlertWithMarginTop = styled( Alert )`
	margin-top: 16px;
`;

/**
 * Plugin installation modal.
 */
class PluginInstallation extends Component {
	/**
	 * PluginInstallation constructor.
	 *
	 * @param {Object} props The component's props.
	 */
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
		this.registerPopUpListeners();
		this.registerMessageListener();
		this.checkUrlForInstallation();
	}

	/**
	 * Add onClick listeners for the "I've already bought ***" links, rendered in admin/views/licenses.php.
	 *
	 * @returns {void}
	 */
	registerPopUpListeners() {
		const pluginSlugs = Object.keys( wpseoPluginInstallationL10n.pluginNames );
		const target      = wpseoPluginInstallationL10n.target;

		for ( let i = 0; i < pluginSlugs.length; i++ ) {
			const linkElement = document.getElementById( `wpseo-already-bought-${ pluginSlugs[ i ] }` );

			if ( ! linkElement ) {
				continue;
			}

			linkElement.onclick = () => {
				window.open(
					target.domain + target.path + pluginSlugs[ i ],
					"myyoast",
					"height=700,width=500,menubar=no"
				);
			};
		}
	}

	/**
	 * Listen for messages from the popup, that is triggered by registerPopUpListeners.
	 *
	 * @returns {void}
	 */
	registerMessageListener() {
		window.addEventListener( "message", event => {
			if ( event.origin !== wpseoPluginInstallationL10n.target.domain ) {
				return;
			}

			if ( event.data.plugin ) {
				this.props.queueMultiplePluginInstallations( [ event.data.plugin ] );
			} else if ( event.data.plugins ) {
				this.props.queueMultiplePluginInstallations( event.data.plugins );
			} else {
				return;
			}

			this.setState( {
				modalOpen: true,
			} );

			this.props.startInstallation();
		} );
	}

	/**
	 * Check for for the install_plugins URL parameter, and trigger the installation accordingly.
	 *
	 * @returns {void}
	 */
	checkUrlForInstallation() {
		const urlParams = new URLSearchParams( window.location.search );

		if ( ! urlParams.has( "install_plugins" ) ) {
			return;
		}

		const plugins = urlParams.get( "install_plugins" ).split( "," );

		this.props.queueMultiplePluginInstallations( plugins );

		this.setState( {
			modalOpen: true,
		} );

		this.props.startInstallation();
	}

	/**
	 * Check whether the modal is open.
	 *
	 * @returns {boolean} Whether the modal is open.
	 */
	isModalOpen() {
		return ( this.state.modalOpen && this.props.tasks.length );
	}

	/**
	 * Closes the modal when no installation is in progress.
	 *
	 * @returns {void}
	 */
	closeModal() {
		if ( this.props.installing ) {
			return;
		}

		this.setState( { modalOpen: false } );
	}

	/**
	 * Get the name if the single plugin being installed.
	 *
	 * @returns {string} The plugin name.
	 */
	getPluginName() {
		if ( this.props.single !== false ) {
			return wpseoPluginInstallationL10n.pluginNames[ this.props.single ];
		}

		return "";
	}

	/**
	 * Check whether the installation has successfully finished.
	 *
	 * @returns {boolean} Whether the installation was successfull.
	 */
	isInstallationFinished() {
		if ( this.props.tasks.length < 1 ) {
			return false;
		}

		return this.props.tasks[ this.props.tasks.length - 1 ].status === "finished";
	}

	/**
	 * Render the finished message.
	 *
	 * @returns {React.Element} The finished installation alert.
	 */
	renderFinishedMessage() {
		if ( ! this.isInstallationFinished() ) {
			return null;
		}

		return (
			<AlertWithMarginTop
				type="success"
			>
				{
					this.props.single
						? sprintf(
							// translators 1: Name of the plugin that is installed.
							__( "Congratulations! %s is successfully installed on your site!", "wordpress-seo" ),
							this.getPluginName()
						)
						: __( "Congratulations! Your products are successfully installed on your website!", "wordpress-seo" )
				}
			</AlertWithMarginTop>
		);
	}

	/**
	 * Render the close button.
	 *
	 * @returns {React.Element} The close button.
	 */
	renderCloseButton() {
		if ( ! this.isInstallationFinished() ) {
			return null;
		}

		return (
			<CloseButton
				onClick={ this.closeModal }
			>
				{ __( "Close this modal", "wordpress-seo" ) }
			</CloseButton>
		);
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
					isOpen={ this.isModalOpen() }
					heading={ this.props.single
						? sprintf(
							// translators 1: Name of the plugin to be installed.
							__( "%s installation", "wordpress-seo" ),
							this.getPluginName()
						)
						: __( "Installing your products", "wordpress-seo" )
					}
					closeIconButton={ __( "Close", "wordpress-seo" ) }
				>
					<p>
						{
							this.props.single
								? sprintf(
									// translators 1: Name of the plugin to be installed.
									__( "Please wait while %s is being installed on your site.", "wordpress-seo" ),
									this.getPluginName()
								)
								: __( "Please wait while your products are being installed on your site.", "wordpress-seo" )
						}
					</p>
					<MultiStepProgress
						steps={ this.getSteps() }
					/>
					{ this.renderFinishedMessage() }
					{ this.renderCloseButton() }
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
	single: PropTypes.oneOfType( [
		PropTypes.bool,
		PropTypes.string,
	] ).isRequired,
	startInstallation: PropTypes.func.isRequired,
	queueMultiplePluginInstallations: PropTypes.func.isRequired,
};

export default connect( ( state ) => {
	return {
		tasks: state.pluginInstallation.tasks,
		installing: state.pluginInstallation.installing,
		single: state.pluginInstallation.singlePluginInstallation,
	};
}, {
	startInstallation,
	queueMultiplePluginInstallations,
} )( PluginInstallation );
