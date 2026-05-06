import { Slot } from "@wordpress/components";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { useCallback, useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { LocationContext } from "@yoast/externals/contexts";
import classNames from "classnames";
import PropTypes from "prop-types";
import SEMrushModal from "../../containers/SEMrushRelatedKeyphrasesModal";
import MetaboxCollapsible from "../MetaboxCollapsible";
import SidebarCollapsible from "../SidebarCollapsible";
import SynonymSlot from "../slots/SynonymSlot";
import { KeywordInput } from "./KeywordInput";

/**
 * Gets the Collapsible component based on location.
 *
 * @param {string} location The current location context.
 * @returns {Function} The appropriate Collapsible component.
 */
const getCollapsible = ( location ) => location === "metabox" ? MetaboxCollapsible : SidebarCollapsible;

/**
 * Gets the slot name for the keyphrase input.
 *
 * @param {string} location The current location context.
 * @returns {string} The slot name.
 */
const getSlotName = ( location ) => `YoastAfterKeywordInput${ location.charAt( 0 ).toUpperCase() + location.slice( 1 ) }`;

/**
 * Builds the validation errors for the current keyphrase value.
 *
 * @param {Object}   options                                       The options.
 * @param {string[]} options.errors                                Existing errors from the store.
 * @param {string}   options.keyword                               The current keyphrase.
 * @param {boolean}  options.displayNoKeyphraseMessage             Whether to add the "no keyphrase" message for getting the related keyphrases.
 * @param {boolean}  options.displayNoKeyphrasForTrackingMessage   Whether to add the "no keyphrase" message for keyphrase tracking.
 *
 * @returns {string[]} The detected errors.
 */
const validateKeyword = ( { errors, keyword, displayNoKeyphraseMessage, displayNoKeyphrasForTrackingMessage } ) => {
	const isEmpty = keyword.trim().length === 0;

	const validationRules = [
		{
			condition: isEmpty && displayNoKeyphraseMessage,
			message: __( "Please enter a focus keyphrase first to get related keyphrases", "wordpress-seo" ),
		},
		{
			condition: isEmpty && displayNoKeyphrasForTrackingMessage,
			message: __( "Please enter a focus keyphrase first to track keyphrase performance", "wordpress-seo" ),
		},
		{
			condition: keyword.includes( "," ),
			message: __( "Are you trying to use multiple keyphrases? You should add them separately below.", "wordpress-seo" ),
		},
		{
			condition: keyword.length > 191,
			message: __( "Your keyphrase is too long. It can be a maximum of 191 characters.", "wordpress-seo" ),
		},
	];

	return [
		...errors,
		...validationRules.filter( ( { condition } ) => condition ).map( ( { message } ) => message ),
	];
};

/**
 * Gets the potential validation errors.
 *
 * @param {string[]} errors The errors from the store.
 * @param {string} keyword The focus keyphrase.
 * @param {boolean} displayNoKeyphraseMessage Whether to add the "no keyphrase" message for getting the related keyphrases.
 * @param {boolean} displayNoKeyphrasForTrackingMessage Whether to add the "no keyphrase" message for keyphrase tracking.
 * @returns {{variant: string, message: JSX.IntrinsicElements[]}|null} The validation errors.
 */
const getTextInputValidationErrors = ( errors, keyword, displayNoKeyphraseMessage, displayNoKeyphrasForTrackingMessage ) => {
	const validationErrors = validateKeyword( {
		errors,
		keyword,
		displayNoKeyphraseMessage,
		displayNoKeyphrasForTrackingMessage,
	} );
	return validationErrors.length > 0
		? {
			variant: "error",
			message: validationErrors.map( ( error, index ) => (
				<span key={ index } role="alert" className="yst-block">
					{ error }
				</span>
			) ),
		}
		: null;
};

/**
 * Renders the SEMrush modal if the integration is active.
 *
 * @param {boolean} isActive Whether the SEMrush integration is active.
 * @param {string} location The current location context.
 * @param {string} keyphrase The current keyphrase.
 * @returns {JSX.Element|null} The SEMrush modal or null.
 */
const renderSEMrushModal = ( isActive, location, keyphrase ) => {
	if ( ! isActive ) {
		return null;
	}
	return <SEMrushModal location={ location } keyphrase={ keyphrase } />;
};

/**
 * Gets the wrapper className.
 *
 * @param {boolean} isSEMrushIntegrationActive Whether the SEMrush integration is active.
 * @returns {string} The wrapper className.
 */
const getWrapperClassName = ( isSEMrushIntegrationActive ) =>
	classNames( "yst-root", isSEMrushIntegrationActive && "yst-flex yst-flex-col yst-gap-4" );

/**
 * Renders the topic input fields inside a collapsible that defaults to open.
 *
 * @param {Object} props The props.
 * @param {string} [props.keyword=""] The focus keyphrase.
 * @param {Function} props.onFocusKeywordChange Function to handle focus keyphrase change.
 * @param {Function} props.onFocusKeyword Function to handle focus event on the keyphrase input.
 * @param {Function} props.onBlurKeyword Function to handle blur event on the keyphrase input.
 * @param {boolean} [props.isSEMrushIntegrationActive=false] Whether the SEMrush integration is active.
 * @param {boolean} [props.displayNoKeyphraseMessage=false] Whether to add the "no keyphrase" message for getting the related keyphrases.
 * @param {boolean} [props.displayNoKeyphrasForTrackingMessage=false] Whether to add the "no keyphrase" message for keyphrase tracking.
 * @param {Array} [props.errors=[]] The errors from the store.
 *
 * @returns {JSX.Element} The collapsible of topic fields.
 */
const TopicInputs = ( {
	keyword = "",
	onFocusKeywordChange,
	onFocusKeyword,
	onBlurKeyword,
	isSEMrushIntegrationActive = false,
	displayNoKeyphraseMessage = false,
	displayNoKeyphrasForTrackingMessage = false,
	errors = [],
} ) => {
	const location = useContext( LocationContext );
	const Collapsible = getCollapsible( location );
	const handleChange = useCallback( ( event ) => onFocusKeywordChange( event.target.value ), [ onFocusKeywordChange ] );
	const validation = getTextInputValidationErrors( errors, keyword, displayNoKeyphraseMessage, displayNoKeyphrasForTrackingMessage );

	return (
		<Collapsible
			id={ `yoast-focus-keyphrase-collapsible-${ location }` }
			title={ __( "Focus keyphrase", "wordpress-seo" ) }
			initialIsOpen={ true }
		>
			<div className={ getWrapperClassName( isSEMrushIntegrationActive ) }>
				<KeywordInput
					location={ location }
					keyword={ keyword }
					handleChange={ handleChange }
					onFocusKeyword={ onFocusKeyword }
					onBlurKeyword={ onBlurKeyword }
					validation={ validation }
				/>
				<SynonymSlot location={ location } />
				{ renderSEMrushModal( isSEMrushIntegrationActive, location, keyword ) }
			</div>
			<Slot name={ getSlotName( location ) } />
		</Collapsible>
	);
};

TopicInputs.propTypes = {
	keyword: PropTypes.string,
	onFocusKeywordChange: PropTypes.func.isRequired,
	onFocusKeyword: PropTypes.func.isRequired,
	onBlurKeyword: PropTypes.func.isRequired,
	isSEMrushIntegrationActive: PropTypes.bool,
	displayNoKeyphraseMessage: PropTypes.bool,
	displayNoKeyphrasForTrackingMessage: PropTypes.bool,
	errors: PropTypes.arrayOf( PropTypes.string ),
};

export { TopicInputs };

export default compose( [
	withSelect( ( select ) => {
		const { getFocusKeyphrase, getSEMrushNoKeyphraseMessage, hasWincherNoKeyphrase, getFocusKeyphraseErrors } = select( "yoast-seo/editor" );
		return {
			keyword: getFocusKeyphrase(),
			displayNoKeyphraseMessage: getSEMrushNoKeyphraseMessage(),
			displayNoKeyphrasForTrackingMessage: hasWincherNoKeyphrase(),
			errors: getFocusKeyphraseErrors(),
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
] )( TopicInputs );
