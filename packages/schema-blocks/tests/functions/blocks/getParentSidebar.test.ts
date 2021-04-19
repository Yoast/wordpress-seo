import { BlockEditProps, BlockInstance } from "@wordpress/blocks";
import * as renderer from "react-test-renderer";
import getParentSidebar from "../../../src/functions/blocks/getParentSidebar";

jest.mock( "../../../src/functions/gutenberg/block", () => {
	return {
		getParentIdOfType: jest.fn( ( clientId )  => {
			if ( clientId === "404" ) {
				return [];
			}

			return [ clientId ];
		} ),
		createBlockEditProps: jest.fn( ( block, selected = false )  => {
			return {
				clientId: block.clientId,
				isSelected: selected,
			} as BlockEditProps<unknown>;
		} ),
	};
} );

jest.mock( "../../../src/functions/BlockHelper", () => {
	return {
		getBlockByClientId: jest.fn( ( clientId )  => {
			if ( clientId === "1337" ) {
				return {
					clientId: clientId,
					name: "yoast/block",
				} as BlockInstance;
			}

			return {
				clientId: clientId,
				name: "yoast/unknown-block",
			} as BlockInstance;
		} ),
	};
} );

jest.mock( "../../../src/core/blocks/BlockDefinitionRepository", () => {
	return {
		getBlockDefinition: jest.fn( ( blockName )  => {
			if ( blockName === "yoast/block" ) {
				return {
					clientId: "1337",
					sidebarElements: jest.fn( ( props: BlockEditProps<unknown> ) => {
						return [ props.clientId ];
					} ),
				};
			}

			return null;
		} ),
	};
} );

describe( "The getParentSidebar function", () => {
	it( "receives the parents argument as null", () => {
		const props: BlockEditProps<unknown> = {
			className: "",
			clientId: "1337",
			isSelected: false,
			setAttributes: null,
			attributes: null,
		};

		const tree = renderer
			.create( getParentSidebar( props, null ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );
	it(  "doesn't find parentIds for given parents", () => {
		const props: BlockEditProps<unknown> = {
			className: "",
			clientId: "404",
			isSelected: false,
			setAttributes: null,
			attributes: null,
		};

		const tree = renderer
			.create( getParentSidebar( props, [ "yoast/block" ] ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );
	it(  "receives finds a parent without any block definition", () => {
		const props: BlockEditProps<unknown> = {
			className: "",
			clientId: "107",
			isSelected: false,
			setAttributes: null,
			attributes: null,
		};

		const tree = renderer
			.create( getParentSidebar( props, [ "yoast/block" ] ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );
	it(  "receives finds a parent and retrieves its sidebar", () => {
		const props: BlockEditProps<unknown> = {
			className: "",
			clientId: "1337",
			isSelected: false,
			setAttributes: null,
			attributes: null,
		};

		const tree = renderer
			.create( getParentSidebar( props, [ "yoast/block" ] ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );
} );
