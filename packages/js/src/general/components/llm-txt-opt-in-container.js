import { LlmTxtOptInNotification } from "./llm-txt-opt-in-notification";
import { useSelectGeneralPage } from "../hooks";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../routes";

export const LlmTxtOptInContainer = () => {
	const llmTxtNotificationSeen = useSelectGeneralPage( "selectIsOptInNotificationSeen", [], "wpseo_seen_llm_txt_opt_in_notification" );
	const llmTxtEnabled = useSelectGeneralPage( "selectPreference", [], "llmTxtEnabled" );
	const { pathname } = useLocation();

	if ( pathname === ROUTES.firstTimeConfiguration || llmTxtEnabled || llmTxtNotificationSeen || sessionStorage === null ) {
		return null;
	}
	return (
		<div>
			<LlmTxtOptInNotification />
		</div>
	);
};
