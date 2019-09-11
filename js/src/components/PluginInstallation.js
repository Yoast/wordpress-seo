import { connect } from "react-redux";
import { Component } from "@wordpress/element";
import * as actions from "../install-plugin/actions";
import { MultiStepProgress, Modal } from "@yoast/components";

class PluginInstallation extends Component {
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

	getSteps() {
		return this.props.pluginInstallation.tasks.map( task => {
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

export default connect( ( state ) => {
	return state;
}, {
	...actions,
} )( PluginInstallation );
