import {Component} from '@wordpress/element';
import PropTypes from "prop-types";
import styled from "styled-components";
import { Toggle, FieldGroup } from '@yoast/components';
import { __ } from "@wordpress/i18n";
import popupWindow from '../helpers/popupWindow';
import {AuthenticationModal} from './modals/wordproof/AuthenticationModal';
import {handleAPIResponse} from '../helpers/api';
import {getSettings} from '../helpers/wordproofEndpoints';
import { get } from "lodash";

const WordProofTimestamp = styled.div`
	display: flex;
	margin-top: 8px;
`;

function SettingsLink(props) {
	if (!props.isAuthenticated)
		return( "" );

	return (
		<a href={props.settingsUrl} onClick={( e ) => {
			e.preventDefault();
			props.openSettings();
		}}
		>{__( 'Manage WordProof settings', 'wordpress-seo' )}</a>
	);

}

function ToggleWrapper(props) {
	return(
		<div onClick={ () => { (!props.isAuthenticated) ? props.openAuthentication() : '' }}>
			{ props.children }
		</div>
	);
}

const retrieveSettings = async() => {

	return await handleAPIResponse(
		getSettings,
		( response ) => {
			return response;
		},
		( response ) => {
			return false;
		},
	);
};

/**
 * The WordProofTimestampToggle Component.
 */
class WordProofTimestampToggle extends Component {
	constructor(props) {
		super(props);

		this.setIsOpen = this.setIsOpen.bind(this);
		this.setIsAuthenticated = this.setIsAuthenticated.bind(this);
		this.openSettings = this.openSettings.bind(this);
		this.openAuthentication = this.openAuthentication.bind(this);

		const data = get( window, "wordproofSdk.data", {} );

		this.state = {
			isOpen: false,
			isAuthenticated: data.is_authenticated,
			isDisabled: data.timestamp_current_post_type,
			settingsUrl: data.popup_redirect_settings_url,
			authenticationUrl: data.popup_redirect_authentication_url,
		};
	}

	updateStateFromSettings(settings) {

		if (!settings)
			return;

		this.setState({
			isDisabled: settings.timestamp_current_post_type
		})
	}

	setIsOpen(value) {
		this.setState({isOpen: value})
	}

	setIsAuthenticated(bool) {
		this.setState({isAuthenticated: bool})
	}

	openSettings() {
		window.addEventListener("focus", async (e) => {

			const settingsResponse = await retrieveSettings();
			this.updateStateFromSettings(settingsResponse)

		}, { once: true });

		popupWindow( window, this.state.settingsUrl )
	}

	openAuthentication() {
		if (this.state.isAuthenticated)
			return this.openSettings();

		this.setIsOpen(true);
		popupWindow(window, this.state.authenticationUrl);
	}

	/**
	 * Renders the WordProofTimestampToggle component.
	 *
	 * @returns {wp.Element} the WordProofTimestampToggle component.
	 */
	render() {
		return (
			<WordProofTimestamp>
				<FieldGroup
					linkText={ __("Learn more about timestamping", "wordpress-seo") }
					linkTo={ "https://yoa.st/wordproof-integration" }
					htmlFor={ this.props.id  }
					label={ __( "Timestamp with WordProof", "wordpress-seo" ) }
					hasNewBadge={ true } >
					<ToggleWrapper isAuthenticated={ this.state.isAuthenticated } openAuthentication={ this.openAuthentication }>
						<Toggle className={"yoast-field-group__radiobutton"}
								id={ this.props.id }
								labelText={ __( "Timestamp this page", "wordpress-seo" ) }
								isEnabled={ this.props.isEnabled }
								onSetToggleState={ this.props.onToggle }
								disable={ this.state.isDisabled }
						/>
					</ToggleWrapper>
					<SettingsLink isAuthenticated={ this.state.isAuthenticated } openSettings={ this.openSettings } settingsUrl={ this.state.settingsUrl }/>
				</FieldGroup>

				<AuthenticationModal isOpen={ this.state.isOpen } setIsOpen={ this.setIsOpen }
									 isAuthenticated={ this.state.isAuthenticated } setIsAuthenticated={ this.setIsAuthenticated }/>
			</WordProofTimestamp>
		);
	}
}

WordProofTimestampToggle.propTypes = {
	id: PropTypes.string,
	isEnabled: PropTypes.bool,
	onToggle: PropTypes.func
};

WordProofTimestampToggle.defaultProps = {
	id: "timestamp-toggle",
	isEnabled: true,
	onToggle: () => {}
};

export default WordProofTimestampToggle;
