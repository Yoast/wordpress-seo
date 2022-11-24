import { getInitialState } from "./helper";
import { PluginIntegration } from "./plugin-integration";
import { ReactComponent as TECLogo } from "../../images/tec-logo.svg";

const integrations = [
	{
		name: "The Events Calendar",
		claim: "TBD",
		learnMoreLink: "https://yoa.st/integrations-about-tec",
		logoLink: "https://yoa.st/integrations-logo-tec",
		slug: "tec",
		description: "TBD",
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
