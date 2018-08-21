import React from "react";
import ModalIntl from "./modals/Modal";
import IntlProvider from "./IntlProvider";

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

export default ModalButtonContainer;
