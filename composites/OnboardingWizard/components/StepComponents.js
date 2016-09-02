import Choice from "./Choice";
import Input from "../../../forms/composites/Textfield";
import ConditionalInput from "../../../forms/composites/ConditionalTextField";
import HTML from "./Html";
import MailchimpSignup from "./custom_components/MailchimpSignup";
import PublishingEntity from "./custom_components/PublishingEntity";
import PostTypeVisibility from "./custom_components/PostTypeVisibility";

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
	Input,
	ConditionalInput,
	HTML,
	MailchimpSignup,
	PostTypeVisibility,
	PublishingEntity,
};

export default Components;
