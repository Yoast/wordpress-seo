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
	/**
	 * Sets the plugin installation tasks.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.props.setQueue( [
			{
				type: "INSTALL_PLUGIN",
				plugin: "yoast-seo-video",
			},
			{
				type: "ACTIVATE_PLUGIN",
				plugin: "yoast-seo-video",
			},
			{
				type: "INSTALL_PLUGIN",
				plugin: "yoast-seo-wordpress-premium",
			},
			{
				type: "ACTIVATE_PLUGIN",
				plugin: "yoast-seo-wordpress-premium",
			},
		] );
	}

	/**
	 * Renders the PluginInstallation component.
	 *
	 * @returns {React.Element} The rendered PluginInstallation.
	 */
	render() {
		return (
			<div>
				<Modal title="Installing your products" isOpen={ true }>
					<button onClick={ this.props.startInstallation }>Start installation</button>
					<MultiStepProgress
						steps={ this.getSteps() }
					/>
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
					text = `Installing ${ task.plugin }...`; break;
				case "ACTIVATE_PLUGIN":
					text = `Activating ${ task.plugin }...`; break;
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
	startInstallation: PropTypes.func.isRequired,
	setQueue: PropTypes.func.isRequired,
};

export default connect( ( state ) => {
	return {
		tasks: state.pluginInstallation.tasks,
	};
}, {
	startInstallation: actions.startInstallation,
	setQueue: actions.setQueue,
} )( PluginInstallation );
