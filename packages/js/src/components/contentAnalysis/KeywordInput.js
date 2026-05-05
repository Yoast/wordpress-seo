/* global wpseoAdminL10n */
import { SearchIcon } from "@heroicons/react/outline";
import { Slot } from "@wordpress/components";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { useCallback, useContext } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { LocationContext } from "@yoast/externals/contexts";
import { TextField } from "@yoast/ui-library";
import PropTypes from "prop-types";
import SEMrushModal from "../../containers/SEMrushRelatedKeyphrasesModal";
import MetaboxCollapsible from "../MetaboxCollapsible";
import SidebarCollapsible from "../SidebarCollapsible";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { OutboundLink } from "../../shared-admin/components";

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
	const validationErrors = [ ...errors ];

	if ( keyword.trim().length === 0 && displayNoKeyphraseMessage ) {
		validationErrors.push( __( "Please enter a focus keyphrase first to get related keyphrases", "wordpress-seo" ) );
	}

	if ( keyword.trim().length === 0 && displayNoKeyphrasForTrackingMessage ) {
		validationErrors.push( __( "Please enter a focus keyphrase first to track keyphrase performance", "wordpress-seo" ) );
	}

	if ( keyword.includes( "," ) ) {
		validationErrors.push( __( "Are you trying to use multiple keyphrases? You should add them separately below.", "wordpress-seo" ) );
	}

	if ( keyword.length > 191 ) {
		validationErrors.push( __( "Your keyphrase is too long. It can be a maximum of 191 characters.", "wordpress-seo" ) );
	}

	return validationErrors;
};

/**
 * Gets the potential validation errors.
 *
 * @param {Array} errors The errors from the store.
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
 * Renders the focus keyphrase input inside a collapsible that defaults to open.
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
 * @returns {JSX.Element} The collapsible focus keyphrase field.
 */
const KeywordInput = ( {
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
	const Collapsible = location === "metabox" ? MetaboxCollapsible : SidebarCollapsible;

	const handleChange = useCallback( ( event ) => onFocusKeywordChange( event.target.value ), [ onFocusKeywordChange ] );

	const validation = getTextInputValidationErrors( errors, keyword, displayNoKeyphraseMessage, displayNoKeyphrasForTrackingMessage );
	const slotName = `YoastAfterKeywordInput${ location.charAt( 0 ).toUpperCase() + location.slice( 1 ) }`;
	const description = safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s is the arrow icon. */
			__( "Use the main word or phrase you want your content found for across search, AI, and beyond. %1$s", "wordpress-seo" ), "<OutboundLink />" ),
		{ OutboundLink: <OutboundLink href={ wpseoAdminL10n[ "shortlinks.focus_keyword_info" ] } variant={ "default" }>Learn more about best practices for keyphrases.</OutboundLink> }
	);
	const SEMrushButtonText = safeCreateInterpolateElement(
		sprintf(
			/* translators: %1$s is the search icon. */
			__( "%1$s Discover related keyphrases", "wordpress-seo" ), "<SearchIcon />" ),
		{ SearchIcon: <SearchIcon className="yst-me-1.5 yst-w-4 yst-h-4 yst-text-slate-400" /> }
	);

	return (
		<Collapsible
			id={ `yoast-focus-keyphrase-collapsible-${ location }` }
			title={ __( "Focus keyphrase", "wordpress-seo" ) }
			initialIsOpen={ true }
		>
			<div className="yst-root">
				<TextField
					id={ `focus-keyword-input-${ location }` }
					label={ __( "Focus keyphrase", "wordpress-seo" ) }
					value={ keyword }
					onChange={ handleChange }
					onFocus={ onFocusKeyword }
					onBlur={ onBlurKeyword }
					validation={ validation }
					autoComplete="off"
					placeholder="Type here"
					description={ description }
				/>
				{ isSEMrushIntegrationActive && (
					<SEMrushModal
						location={ location }
						keyphrase={ keyword }
						buttonText={ SEMrushButtonText }
					/>
				) }
			</div>
			<Slot name={ slotName } />
		</Collapsible>
	);
};

KeywordInput.propTypes = {
	keyword: PropTypes.string,
	onFocusKeywordChange: PropTypes.func.isRequired,
	onFocusKeyword: PropTypes.func.isRequired,
	onBlurKeyword: PropTypes.func.isRequired,
	isSEMrushIntegrationActive: PropTypes.bool,
	displayNoKeyphraseMessage: PropTypes.bool,
	displayNoKeyphrasForTrackingMessage: PropTypes.bool,
	errors: PropTypes.arrayOf( PropTypes.string ),
};

export { KeywordInput };

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
] )( KeywordInput );
