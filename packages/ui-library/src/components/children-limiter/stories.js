import { useCallback } from "@wordpress/element";
import { range } from "lodash";
import ChildrenLimiter from ".";
import { Button } from "../../";

export default {
	title: "2. Components/Children Limiter",
	component: ChildrenLimiter,
	parameters: {
		docs: {
			description: {
				component: "A simple component to limit the amount of children rendered. Handy within menus.",
			},
		},
	},
	args: {
		limit: 5,
		children: range( 10 ),
	},
};

const Template = args => {
	const renderMoreOrLessButton = useCallback( ( { show, toggle } ) => {
		return <Button className="yst-mx-1.5" onClick={ toggle }>{ show ? "Less" : "More" }</Button>;
	}, [] );

	return <ChildrenLimiter { ...args } renderButton={ renderMoreOrLessButton } />;
};

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
	docs: {
		transformSource: ( args ) => (
			"const renderMoreOrLessButton = useCallback( ( { show, toggle } ) => {\n" +
			"\treturn <Button className=\"yst-mx-1.5\" onClick={ toggle }>{ show ? \"Less\" : \"More\" }</Button>;\n" +
			"}, [] );\n" +
			"\n" +
			`return ${ args.replace( "renderButton={() => {}}", "renderButton={ renderMoreOrLessButton }" ) };`
		),
	},
};
