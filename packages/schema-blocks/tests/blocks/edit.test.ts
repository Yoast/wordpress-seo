import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import { removeBlock, restoreBlock } from "../../src/functions/BlockHelper";
import { edit } from "../../src/blocks/warning-block/edit";
import { RenderEditProps } from "../../src/core/blocks/BlockDefinition";

jest.mock( "../../src/functions/BlockHelper", () => {
	return {
		removeBlock: jest.fn(),
		restoreBlock: jest.fn(),
	};
} );

describe( "The edit function", () => {

	const defaultProps: RenderEditProps = {
		clientId: "1234-abcd",
		className: "some-class",
		isSelected: false,
		setAttributes: jest.fn(),
		attributes: {
			removedBlock: "yoast/recipe",
			removedAttributes: {
				className: "yoast-recipe",
			},
			warningText: "Are you sure you want to remove this block?",
			isRequired: true,
		},
	};

	it( "should render the warning block.", () => {
		const tree = renderer
			.create( edit( defaultProps ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "should render the warning block when the removed block was not required.", () => {
		const props = Object.assign( {}, defaultProps );
		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore -- We overwrite the attributes for testing purposes.
		props.attributes.isRequired = false;

		const tree = renderer
			.create( edit( props ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "should call the `removeBlock` function if the 'yes' button is clicked.", () => {
		const tree = shallow( edit( defaultProps ) );

		const yesButton = tree.find( "button" ).first();

		yesButton.simulate( "click" );

		expect( removeBlock ).toHaveBeenCalled();
	} );

	it( "should call the `restoreBlock` function if the 'no' button is clicked.", () => {
		const tree = shallow( edit( defaultProps ) );

		const noButton = tree.find( "button" ).at( 1 );

		noButton.simulate( "click" );

		expect( restoreBlock ).toHaveBeenCalled();
	} );
} );
