/* global wpseoAdminL10n */

/* External dependencies */
import { Component } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { StyledContainerTopLevel } from "@yoast/components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { KeywordInput as KeywordInputComponent } from "yoast-components";
import styled from "styled-components";

/* Internal dependencies */
import { setFocusKeyword } from "../../redux/actions/focusKeyword";
import { setMarkerPauseStatus } from "../../redux/actions/markerPauseStatus";
import HelpLink from "./HelpLink";
import { LocationConsumer } from "../contexts/location";

const KeywordInputContainer = styled( StyledContainerTopLevel )`
	padding: 16px;
`;

/**
 * Redux container for the keyword input.
 */
class KeywordInput extends Component {
	/**
	 * Renders a help link.
	 *
	 * @returns {ReactElement} The help link component.
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
	 * @returns {ReactElement} The component.
	 */
	render() {
		return <LocationConsumer>
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
				</KeywordInputContainer>
			) }
		</LocationConsumer>;
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
