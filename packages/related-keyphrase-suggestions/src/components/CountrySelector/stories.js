import React, { useState, useCallback } from "react";
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
	render: () => {
		const [ countryCode, setCountryCode ] = useState( "us" );
		const [ activeCountryCode, setActiveCountryCode ] = useState( "us" );
		const handleOnClick = useCallback( () => {
			setActiveCountryCode( countryCode );
		}, [ setActiveCountryCode, countryCode ] );

		return <CountrySelector
			onClick={ handleOnClick }
			onChange={ setCountryCode }
			countryCode={ countryCode }
			activeCountryCode={ activeCountryCode }
		/>;
	},
	decorators: [
		( Story ) => (
			// Min height to make room for options dropdown.
			<div className="yst-min-h-[300px]">
				<Story />
			</div>
		),
	],
};
