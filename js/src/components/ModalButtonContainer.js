import ModalIntl from "./modals/Modal";
import IntlProvider from "./IntlProvider";
import PropTypes from "prop-types";

const ModalButtonContainer = ( props ) => {
	return (
		<IntlProvider messages={ props.intl }>
			<ModalIntl
				appElement={ props.appElement }
				openButtonIcon={ props.openButtonIcon }
				labels={ props.intl }
				classes={ props.classes }
				modalContent={ props.content }
			/>
		</IntlProvider>
	);
};

ModalButtonContainer.propTypes = {
	classes: PropTypes.shape( {
		openButton: PropTypes.string,
		closeIconButton: PropTypes.string,
		closeButton: PropTypes.string,
	} ),
	intl: PropTypes.shape( {
		open: PropTypes.string,
		modalAriaLabel: PropTypes.string.isRequired,
		heading: PropTypes.string,
		closeIconButton: PropTypes.string,
		closeButton: PropTypes.string,
	} ).isRequired,
	appElement: PropTypes.string,
};

ModalButtonContainer.defaultProps = {
	appElement: "#wpwrap",
	classes: {},
};

export default ModalButtonContainer;
