/* global wpseoAdminL10n */

/* External dependencies */
import { Component, Fragment } from "@wordpress/element";
import { Slot } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { KeywordInput as KeywordInputComponent } from "yoast-components";
import styled from "styled-components";
import { Alert } from "@yoast/components";

/* Internal dependencies */
import { setFocusKeyword } from "../../redux/actions/focusKeyword";
import { setMarkerPauseStatus } from "../../redux/actions/markerPauseStatus";
import HelpLink from "./HelpLink";
import { LocationConsumer } from "../contexts/location";

const KeywordInputContainer = styled.div`
	padding: 16px;
	/* Necessary to compensate negative top margin of the collapsible after the keyword input. */
	border-bottom: 1px solid transparent;
`;

/**
 * Redux container for the keyword input.
 */
class KeywordInput extends Component {
	/**
	 * Renders a help link.
	 *
	 * @returns {wp.Element} The help link component.
	 */
	static renderHelpLink() {
		return (
			<HelpLink
				href={ wpseoAdminL10n[ "shortlinks.focus_keyword_info" ] }
				className="dashicons"
			>
				<span className="screen-reader-text">
					{ __( "Help on choosing the perfect focus keyphrase", "wordpress-seo" ) }
				</span>
			</HelpLink>
		);
	}

	/**
	 * Renders the component.
	 *
	 * @returns {wp.Element} The component.
	 */
	render() {
		return <Fragment>
			<LocationConsumer>
				{ context => (
					<KeywordInputContainer>
						<KeywordInputComponent
							id={ `focus-keyword-input-${ context }` }
							onChange={ this.props.onFocusKeywordChange }
							keyword={ this.props.keyword }
							label={ __( "Focus keyphrase", "wordpress-seo" ) }
							helpLink={ KeywordInput.renderHelpLink() }
							onBlurKeyword={ this.props.onBlurKeyword }
							onFocusKeyword={ this.props.onFocusKeyword }
						/>
						{
							this.props.keyword.length > 191 &&
							<Alert type="warning">
								{ __(
									"Your keyphrase is too long. It can be a maximum of 191 characters.",
									"wordpress-seo"
								) }
							</Alert>
						}
					</KeywordInputContainer>
				) }
			</LocationConsumer>
			<Slot name="YoastAfterKeyphraseInput" />
		</Fragment>;
	}
}

KeywordInput.propTypes = {
	keyword: PropTypes.string,
	onFocusKeywordChange: PropTypes.func.isRequired,
	onFocusKeyword: PropTypes.func.isRequired,
	onBlurKeyword: PropTypes.func.isRequired,
};

KeywordInput.defaultProps = {
	keyword: "",
};

/**
 * Maps redux state to SeoAnalysis props.
 *
 * @param {Object} state The redux state.
 *
 * @returns {Object} Props that should be passed to SeoAnalysis.
 */
function mapStateToProps( state ) {
	return {
		keyword: state.focusKeyword,
	};
}

/**
 * Maps the redux dispatch to KeywordInput props.
 *
 * @param {Function} dispatch The dispatch function that will dispatch a redux action.
 *
 * @returns {Object} Props for the `KeywordInput` component.
 */
function mapDispatchToProps( dispatch ) {
	return {
		onFocusKeywordChange: ( value ) => {
			dispatch( setFocusKeyword( value ) );
		},
		onFocusKeyword: () => {
			dispatch( setMarkerPauseStatus( true ) );
		},
		onBlurKeyword: () => {
			dispatch( setMarkerPauseStatus( false ) );
		},
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( KeywordInput );
