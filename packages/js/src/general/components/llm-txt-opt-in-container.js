import { LlmTxtOptInNotification } from "./llm-txt-opt-in-notification";
import { useSelectGeneralPage } from "../hooks";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../routes";

export const LlmTxtOptInContainer = () => {
	const llmTxtNotificationSeen = useSelectGeneralPage( "selectIsOptInNotificationSeen", [] );
	const llmTxtEnabled = useSelectGeneralPage( "selectPreference", [], "llmTxtEnabled" );
	const { pathname } = useLocation();
	// Early return after all hooks are called
	if ( pathname === ROUTES.firstTimeConfiguration || llmTxtEnabled || llmTxtNotificationSeen || sessionStorage === null ) {
		return null;
	}
	return (
		<div>
			<LlmTxtOptInNotification />
		</div>
	);
};
