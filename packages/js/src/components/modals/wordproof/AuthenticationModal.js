/* External dependencies */
import { Modal } from "@wordpress/components";
import { Fragment, useCallback, useEffect, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";

/* Yoast dependencies */
import { NewButton as Button } from "@yoast/components";

/* Internal dependencies */
import { fetchIsAuthenticated } from "../../../helpers/wordproof";
import { ReactComponent as WordProofConnectedImage } from "../../../../images/motivated_bubble_woman_1_optim.svg";
import { ReactComponent as YoastLoadingSpinnerImage } from "../../../../images/yoast_loading_spinner.svg";
import { ReactComponent as YoastIcon } from "../../../../images/Yoast_icon_kader.svg";
import PropTypes from "prop-types";

/**
 * The WordProof authentication modal.
 *
 * @param {Object} props Component props
 * @returns {JSX.Element} Returns the authentication modal.
 * @constructor
 */
const WordProofAuthenticationModal = ( props ) => {
	const { isOpen, setIsOpen, isAuthenticated, setIsAuthenticated, postTypeName, openAuthentication } = props;
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		/**
		 * Sends isAuthenticated request with two seconds in between till
		 * isAuthenticated returns true.
		 *
		 * @returns {Promise<*>} Return boolean or promise.
		 */
		const authenticate = async() => {
			setIsLoading( true );
			const isAuthenticatedResponse = await fetchIsAuthenticated();

			if ( isAuthenticatedResponse ) {
				setIsLoading( false );
				return setIsAuthenticated( true );
			}

			await new Promise( r => setTimeout( r, 2000 ) );
			return authenticate();
		};

		if ( isOpen && ! isAuthenticated ) {
			authenticate();
		}
	}, [ isOpen, isAuthenticated, isLoading ] );

	const closeModal = useCallback( () => setIsOpen( false ), [] );
	const StyledYoastIcon = <YoastIcon style={ { width: "20px", marginRight: "10px", fill: "#a4296a" } } />;

	return (
		<Fragment>
			{ isOpen && isLoading &&
			<Modal
				onRequestClose={ closeModal }
				title={ __( "Connecting with WordProof", "wordpress-seo" ) }
				className="wordproof__authentication"
				icon={ StyledYoastIcon }
			>
				<div style={ { display: "flex", flexDirection: "column", alignItems: "center" } }>
					<YoastLoadingSpinnerImage
						viewBox={ "0 0 98 98" }
						style={ { width: "100px", animation: "yoast-spin infinite 1s linear" } }
					/>

					<p style={ { maxWidth: "350px", textAlign: "center", paddingBottom: "40px", paddingTop: "10px;" } }>{ sprintf(
						/* Translators: %s expands to WordProof */
						__( "Using the pop-up, please create or login to your %s account.", "wordpress-seo" ),
						"WordProof"
					) }</p>

					<Button variant="primary" onClick={ openAuthentication }>
						{ __( "Open new Pop-up", "wordpress-seo" ) }
					</Button>

					<p>
						{ __( "Not working?", "wordpress-seo" ) }
						<span> </span>
						<a target={ "_blank" } rel={ "noreferrer" } href={ "https://help.wordproof.com/en/" }>
							{ sprintf(
								/* Translators: %s expands to WordProof */
								__( "Contact %s support!", "wordpress-seo" ),
								"WordProof"
							) }
						</a>
					</p>
				</div>
			</Modal>
			}

			{ isOpen && ! isLoading &&
			<Modal
				onRequestClose={ closeModal }
				title={ __( "Connected to WordProof", "wordpress-seo" ) }
				className="wordproof__authentication"
				icon={ StyledYoastIcon }
			>
				<div className="wordproof__authentication_outcome">
					<div>
						<p>
							{ sprintf(
							/* Translators: %s expands to WordProof */
								__( "You have successfully connected to %s!", "wordpress-seo" ),
								"WordProof"
							) }
							<br />
							{ sprintf(
								/* Translators: %s translates to the Post type in singular form */
								__( "This %s will be timestamped as soon as you update it.", "wordpress-seo" ),
								postTypeName.toLowerCase()
							) }
						</p>

						<div
							style={ {
								display: "flex",
								justifyContent: "center",
							} }
						>
							<WordProofConnectedImage style={ { width: "100px" } } />
						</div>
					</div>
					<br />
					<Button
						variant={ "secondary" }
						onClick={ closeModal }
						className="yoast__wordproof__close-modal"
					>
						{ __( "Continue", "wordpress-seo" ) }
					</Button>
				</div>
			</Modal>
			}
		</Fragment>
	);
};
// Const { isOpen, setIsOpen, isAuthenticated, setIsAuthenticated, postTypeName, openAuthentication } = props;

WordProofAuthenticationModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	setIsAuthenticated: PropTypes.func.isRequired,
	postTypeName: PropTypes.string.isRequired,
	openAuthentication: PropTypes.func.isRequired,
};

export default WordProofAuthenticationModal;
