/* global wpseoAdminL10n */
import { Slot } from "@wordpress/components";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { Component } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import styled from "styled-components";
import { KeywordInput as KeywordInputComponent } from "yoast-components";
import SEMrushModal from "../../containers/SEMrushRelatedKeyphrasesModal";
import { LocationConsumer } from "../contexts/location";
import HelpLink from "../HelpLink";

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
	 * The constructor.
	 *
	 * @param {Object} props The props to use in the component.
	 */
	constructor( props ) {
		super( props );

		this.validate = this.validate.bind( this );
	}

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
	 * Validates the keyword input.
	 *
	 * @returns {array} The detected errors.
	 */
	validate() {
		const errors = [];

		if ( this.props.keyword.trim().length === 0 && this.props.displayNoKeyphraseMessage ) {
			errors.push( __( "Please enter a focus keyphrase first to get related keyphrases", "wordpress-seo" ) );
		}

		if ( this.props.keyword.trim().length === 0 && this.props.displayNoKeyphrasForTrackingMessage ) {
			errors.push( __( "Please enter a focus keyphrase first to track keyphrase performance", "wordpress-seo" ) );
		}

		if ( this.props.keyword.includes( "," ) ) {
			errors.push(  __( "Are you trying to use multiple keyphrases? You should add them separately below.", "wordpress-seo" )  );
		}

		if ( this.props.keyword.length > 191 ) {
			errors.push(  __( "Your keyphrase is too long. It can be a maximum of 191 characters.",	"wordpress-seo"	)  );
		}

		return errors;
	}

	/**
	 * Renders the component.
	 *
	 * @returns {JSX.Element} The component.
	 */
	render() {
		const errors = this.validate();

		return <LocationConsumer>
			{ context => (
				<div style={ context === "sidebar" ? {  borderBottom: "1px solid #f0f0f0" } : {} }>
					<KeywordInputContainer location={ context }>
						<KeywordInputComponent
							id={ `focus-keyword-input-${ context }` }
							onChange={ this.props.onFocusKeywordChange }
							keyword={ this.props.keyword }
							label={ __( "Focus keyphrase", "wordpress-seo" ) }
							helpLink={ KeywordInput.renderHelpLink() }
							onBlurKeyword={ this.props.onBlurKeyword }
							onFocusKeyword={ this.props.onFocusKeyword }
							hasError={ errors.length > 0 }
							errorMessages={ errors }
						/>
						{
							this.props.isSEMrushIntegrationActive &&
							<SEMrushModal
								location={ context }
								keyphrase={ this.props.keyword }
							/>
						}
					</KeywordInputContainer>
					<Slot name={ `YoastAfterKeywordInput${ context.charAt( 0 ).toUpperCase() + context.slice( 1 ) }` } />
				</div>
			) }
		</LocationConsumer>;
	}
}

KeywordInput.propTypes = {
	keyword: PropTypes.string,
	onFocusKeywordChange: PropTypes.func.isRequired,
	onFocusKeyword: PropTypes.func.isRequired,
	onBlurKeyword: PropTypes.func.isRequired,
	isSEMrushIntegrationActive: PropTypes.bool,
	displayNoKeyphraseMessage: PropTypes.bool,
	displayNoKeyphrasForTrackingMessage: PropTypes.bool,
};

KeywordInput.defaultProps = {
	keyword: "",
	isSEMrushIntegrationActive: false,
	displayNoKeyphraseMessage: false,
	displayNoKeyphrasForTrackingMessage: false,
};

export { KeywordInput };

export default compose( [
	withSelect( ( select ) => {
		const { getFocusKeyphrase, getSEMrushNoKeyphraseMessage, hasWincherNoKeyphrase } = select( "yoast-seo/editor" );
		return {
			keyword: getFocusKeyphrase(),
			displayNoKeyphraseMessage: getSEMrushNoKeyphraseMessage(),
			displayNoKeyphrasForTrackingMessage: hasWincherNoKeyphrase(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setFocusKeyword, setMarkerPauseStatus } = dispatch( "yoast-seo/editor" );
		return {
			onFocusKeywordChange: setFocusKeyword,
			onFocusKeyword: () => setMarkerPauseStatus( true ),
			onBlurKeyword: () => setMarkerPauseStatus( false ),
		};
	} ),
] )( KeywordInput );
