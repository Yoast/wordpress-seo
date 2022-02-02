/* External dependencies */
import {Modal} from '@wordpress/components';
import {Fragment, useCallback} from '@wordpress/element';
import {__, sprintf} from '@wordpress/i18n';

/* Yoast dependencies */
import {NewButton as Button} from '@yoast/components';

/* Internal dependencies */
import {ReactComponent as WordProofConnectedImage} from '../../../../images/succes_marieke_bubble_optm.svg';
import {ReactComponent as YoastIcon} from '../../../../images/Yoast_icon_kader.svg';
import PropTypes from 'prop-types';

/**
 * The WordProof authentication modal.
 *
 * @param {Object} props Component props
 * @returns {JSX.Element} Returns the authentication modal.
 * @constructor
 */
const WordProofAuthenticationModal = ( props ) => {
	const {
		isOpen,
		setIsOpen,
		isAuthenticated,
		postTypeName,
	} = props;

	const closeModal = useCallback( () => setIsOpen( false ), [] );
	const StyledYoastIcon = <YoastIcon
		style={{width: '20px', marginRight: '10px', fill: '#a4296a'}}/>;

	return (
		<Fragment>
			{ isOpen && isAuthenticated &&
			<Modal
				onRequestClose={closeModal}
				title={__( 'Connected to WordProof', 'wordpress-seo' )}
				className="wordproof__authentication"
				icon={StyledYoastIcon}
			>
				<div className="wordproof__authentication_outcome">
					<div>

						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								marginBlock: '40px'
							}}
						>
							<WordProofConnectedImage style={{width: '175px'}}/>
						</div>

						<p>
							{sprintf(
								/* Translators: %s expands to WordProof */
								__( 'You have successfully connected to %s!',
									'wordpress-seo' ),
								'WordProof',
							)}
							<br/>
							{sprintf(
								/* Translators: %s translates to the Post type in singular form */
								__( 'This %s will be timestamped as soon as you update it.',
									'wordpress-seo' ),
								postTypeName.toLowerCase(),
							)}
						</p>
					</div>
					<br/>
					<Button
						variant={'secondary'}
						onClick={closeModal}
						className="yoast__wordproof__close-modal"
					>
						{__( 'Continue', 'wordpress-seo' )}
					</Button>
				</div>
			</Modal>
			}
		</Fragment>
	);
};

WordProofAuthenticationModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	postTypeName: PropTypes.string.isRequired,
};

export default WordProofAuthenticationModal;
