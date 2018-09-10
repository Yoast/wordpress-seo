import Choice from "./Choice";
import Input from "../../../forms/composites/Textfield";
import HTML from "./Html";

/**
 * Contains the components that are rendered in the steps for the onboarding wizard.
 * This file is used to translate/cast the string components from the config to the actual components that can be rendered.
 *
 * @type {{
 *          Choice: ((p1:Object)),
 *          Input: Textfield,
 *          HTML: ((p1:Object))
 * }}
 */
const Components = {
	Choice,
	Input,
	HTML,
};

export default Components;
