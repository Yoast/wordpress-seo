import Choice from "./Choice";
import TextField from "../../../forms/composites/Textfield";
import HTML from "./Html";
import MailchimpSignup from "./custom_components/MailchimpSignup";
import PublishingEntity from "./custom_components/PublishingEntity";
import PostTypeVisibility from "./custom_components/PostTypeVisibility";
import ConnectGoogleSearchConsole from "./custom_components/ConnectGoogleSearchConsole";

let Components = {
	Choice,
	"Input" : TextField,
	HTML,
	MailchimpSignup,
	PostTypeVisibility,
	ConnectGoogleSearchConsole,
	PublishingEntity,
};

export default Components;
