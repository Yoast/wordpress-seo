import React, { useCallback } from "react";
import { useArgs } from "@storybook/addons";
import { CountrySelector } from ".";
import { component } from "./docs";
import { noop } from "lodash";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		countryCode: "us",
		activeCountryCode: "us",
		onChange: noop,
		onClick: noop,
	},
};

export default {
	title: "1) Components/CountrySelector",
	component: CountrySelector,
	parameters: {
		docs: {
			description: { component },
		},
	},
	render: ( { userLocale, countryCode, activeCountryCode } ) => {
		const [ { value = countryCode, activeValue = activeCountryCode }, updateArgs ] = useArgs();
		const handleChange = useCallback( newValue => updateArgs( { countryCode: newValue } ), [ updateArgs ] );
		const handleClick = useCallback( () => updateArgs( { activeCountryCode: countryCode } ), [ updateArgs, countryCode ] );

		return <CountrySelector
			onClick={ handleClick }
			onChange={ handleChange }
			countryCode={ value }
			activeCountryCode={ activeValue }
			userLocale={ userLocale }
		/>;
	},
	decorators: [
		( Story ) => (
			// Min height to make room for options dropdown.
			<div className="yst-min-h-[300px] yst-w-2/3">
				<Story />
			</div>
		),
	],
};
