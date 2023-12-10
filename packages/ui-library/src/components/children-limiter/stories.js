import { map, range } from "lodash";
import React, { useCallback } from "react";
import ChildrenLimiter from ".";
import { Button } from "../../";

export default {
	title: "2) Components/Children limiter",
	component: ChildrenLimiter,
	parameters: {
		docs: {
			description: {
				component: "A simple component to limit the amount of children rendered. Handy within menus.",
			},
		},
	},
	argTypes: {
		children: { control: "text" },
	},
	args: {
		limit: 5,
		children: map( range( 10 ), n => <p key={ n }>{ n }</p> ),
	},
};

const Template = args => {
	const renderMoreOrLessButton = useCallback( ( { show, toggle, ariaProps } ) => {
		return <Button className="yst-my-1.5" onClick={ toggle } { ...ariaProps }>{ show ? "Less" : "More" }</Button>;
	}, [] );

	return <ChildrenLimiter { ...args } renderButton={ renderMoreOrLessButton } />;
};

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
	docs: {
		transformSource: ( args ) => (
			"const renderMoreOrLessButton = useCallback( ( { show, toggle, ariaProps } ) => {\n" +
			"\treturn <Button className=\"yst-my-1.5\" onClick={ toggle } { ...ariaProps }>{ show ? \"Less\" : \"More\" }</Button>\n" +
			"}, [] );\n" +
			"\n" +
			`return ${ args.replace( "renderButton={() => {}}", "renderButton={ renderMoreOrLessButton }" ) };`
		),
	},
};
