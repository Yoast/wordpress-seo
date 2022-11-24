import { getInitialState } from "./helper";
import { PluginIntegration } from "./plugin-integration";
import { ReactComponent as TECLogo } from "../../images/tec-logo.svg";

const integrations = [
	{
		name: "The Events Calendar",
		claim: "The Events Calendar Schema",
		learnMoreLink: "https://yoa.st/integrations-about-tec",
		logoLink: "https://yoa.st/integrations-logo-tec",
		slug: "tec",
		description: "The Events Calendar adds Schema for your events to the Yoast SEO Schema graph.",
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: TECLogo,
	},
];

export const schemaAPIIntegrations = [
	integrations.map( ( integration, index ) => {
		return (
			<PluginIntegration
				key={ index }
				integration={ integration }
				isActive={ getInitialState( integration ) }
			/>
		);
	} ),
];
