import {Component, Fragment} from '@wordpress/element';
import PropTypes from "prop-types";
import { Toggle, FieldGroup } from '@yoast/components';
import {__, sprintf} from '@wordpress/i18n';
import popupWindow from '../helpers/popupWindow';
import {AuthenticationModal} from './modals/wordproof/AuthenticationModal';
import {handleAPIResponse} from '../helpers/api';
import {getSettings} from '../helpers/wordproofEndpoints';
import { get } from "lodash";


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
		this.handleToggle = this.handleToggle.bind(this);

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
		/**
		 * When WordPress window is re-focused after WordProof settings have been
		 * possibly updated in separate window, we should retrieve and update these settings
		 * in the local state of this component.
		 */
		window.addEventListener("focus", async (e) => {

			const settingsResponse = await retrieveSettings();
			this.updateStateFromSettings(settingsResponse)

		}, { once: true });

		popupWindow( window, this.state.settingsUrl )
	}

	openAuthentication() {
		this.setIsOpen(true);
		popupWindow(window, this.state.authenticationUrl);
	}

	handleToggle(value) {
		this.props.onToggle(value);

		if (!this.state.isAuthenticated) {
			this.openAuthentication();
		}
	}

	/**
	 * Renders the WordProofTimestampToggle component.
	 *
	 * @returns {wp.Element} the WordProofTimestampToggle component.
	 */
	render() {
		return (
			<Fragment>
				<FieldGroup
					style={ {display: 'flex', marginTop: '8px'} }
					linkText={ __("Learn more about timestamping", "wordpress-seo") }
					linkTo={ "https://yoa.st/wordproof-integration" }
					htmlFor={ this.props.id  }
					label={ __( "Timestamp with WordProof", "wordpress-seo" ) }
					hasNewBadge={ true } >
						<Toggle className={"yoast-field-group__radiobutton"}
								id={ this.props.id }
								labelText={ sprintf(
									/* Translators: %s translates to the Post type in singular form */
									__( "Timestamp this %s", "wordpress-seo" ),
									this.props.postTypeName
								) }
								isEnabled={ this.props.isEnabled }
								onSetToggleState={ this.handleToggle }
								disable={ this.state.isDisabled }
						/>
					<SettingsLink isAuthenticated={ this.state.isAuthenticated } openSettings={ this.openSettings } settingsUrl={ this.state.settingsUrl }/>
				</FieldGroup>

				<AuthenticationModal isOpen={ this.state.isOpen } setIsOpen={ this.setIsOpen }
									 isAuthenticated={ this.state.isAuthenticated } setIsAuthenticated={ this.setIsAuthenticated }
									 postTypeName={ this.props.postTypeName }
				/>
			</Fragment>
		);
	}
}

WordProofTimestampToggle.propTypes = {
	id: PropTypes.string,
	isEnabled: PropTypes.bool,
	onToggle: PropTypes.func,
	postTypeName: PropTypes.string
};

WordProofTimestampToggle.defaultProps = {
	id: "timestamp-toggle",
	isEnabled: true,
	onToggle: () => {},
	postTypeName: 'post'
};

export default WordProofTimestampToggle;
