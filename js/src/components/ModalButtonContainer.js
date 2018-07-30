import React from "react";
import ModalIntl from "./modals/Modal";
import modals from "./modals";
import IntlProvider from "./IntlProvider";

const ModalButtonContainer = ( props ) => {
	return (
		<IntlProvider messages={ props.intl }>
			<ModalIntl
				mountHook={ props.mountHook }
				appElement={ props.appElement }
				openButtonIcon={ props.openButtonIcon }
				labels={ props.intl }
				classes={ props.classes }
				modalContent={ modals[ props.content ] }
			/>
		</IntlProvider>
	);
};

export default ModalButtonContainer;
