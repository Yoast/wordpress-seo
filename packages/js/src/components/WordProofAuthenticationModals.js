import {useState} from '@wordpress/element';

import AuthenticationModal from './modals/wordproof/AuthenticationModal';

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
const WordProofAuthenticationModals = () => {

	const {modal, setModal} = useState( null );
	const {isOpen, setIsOpen} = useState( true );

	window.addEventListener( 'wordproof:oauth:success', () => {
		setIsOpen( true );
		setModal( 'oauth:success' );
	}, false );

	window.addEventListener( 'wordproof:oauth:failed', () => {
		setIsOpen( true );
		setModal( 'oauth:failed' );
	}, false );

	window.addEventListener( 'wordproof:oauth:denied', () => {
		setIsOpen( true );
		setModal( 'oauth:denied' );
	}, false );

	window.addEventListener( 'wordproof:webhook:failed', () => {
		setIsOpen( true );
		setModal( 'webhook:failed' );
	}, false );

	return (
		<>
			{modal === 'oauth:success' &&
			<AuthenticationModal isOpen={true} isAuthenticated={true}
								 postTypeName={'hi'} setIsOpen={setIsOpen}/>
			}

			{modal === 'oauth:denied' &&
			<AuthenticationModal isOpen={true} isAuthenticated={true}
								 postTypeName={'hi'} setIsOpen={setIsOpen}/>
			}

			{modal === 'oauth:failed' &&
			<AuthenticationModal isOpen={true} isAuthenticated={true}
								 postTypeName={'hi'} setIsOpen={setIsOpen}/>
			}

			{modal === 'webhook:failed' &&
			<AuthenticationModal isOpen={true} isAuthenticated={true}
								 postTypeName={'hi'} setIsOpen={setIsOpen}/>
			}
		</>
	);
};

export default WordProofAuthenticationModals;
