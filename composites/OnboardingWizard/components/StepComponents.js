import Choice from "./Choice";
import TextField from "../../../forms/composites/Textfield";
import ConditionalTextField from "../../../forms/composites/ConditionalTextField";
import HTML from "./Html";
import MailchimpSignup from "./custom_components/MailchimpSignup";
import PublishingEntity from "./custom_components/PublishingEntity";
import PostTypeVisibility from "./custom_components/PostTypeVisibility";
import ConnectGoogleSearchConsole from "./custom_components/ConnectGoogleSearchConsole";

/**
 * Contains the components that are rendered in the steps for the onboarding wizard.
 * This file is used to translate/cast the string components from the config to the actual components that can be rendered.
 *
 * @type {{
 *          Choice: ((p1:Object)),
 *          Input: Textfield,
 *          ConditionalTextField,
 *          HTML: ((p1:Object)),
 *          MailchimpSignup: ((p1:Object)),
 *          PostTypeVisibility: ((p1:Object)),
 *          ConnectGoogleSearchConsole: ((p1:Object)),
 *          PublishingEntity: ((p1:Object))
 * }}
 */
let Components = {
	Choice,
	"Input": TextField,
	ConditionalTextField,
	HTML,
	MailchimpSignup,
	PostTypeVisibility,
	ConnectGoogleSearchConsole,
	PublishingEntity,
};

export default Components;
