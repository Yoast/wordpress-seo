import { render } from "../../test-utils";

import { SparklesIcon } from "../../../src/ai-assessment-fixes/components/sparkles-icon";

const testCases = [
	{
		name: "pressed is false",
		pressed: false,
	},
	{
		name: "pressed is true",
		pressed: true,
	},
];

describe.each( testCases )( "SparklesIcon", ( { name, pressed } ) => {
	test( `should render the SparklesIcon component when ${name}`, () => {
		const { container } = render( <SparklesIcon pressed={ pressed } gradientId={ "gradient-0kdmaht" } /> );

		expect( container ).toMatchSnapshot();
	} );
} );
