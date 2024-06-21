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

		// Mock Math.random to return a constant value for the gradient id.
		jest.spyOn(global.Math, 'random').mockReturnValue("000kdmaht");

		const { container } = render( <SparklesIcon pressed={ pressed } /> );

		expect( container ).toMatchSnapshot();

		// Clean up the mock to ensure tests are completely isolated.
		global.Math.random.mockRestore();
	} );
} );
