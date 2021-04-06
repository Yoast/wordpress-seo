import "../../../matchMedia.mock";

import { select } from "@wordpress/data";
import { BlockInstance } from "@wordpress/blocks";
import recurseOverBlocks from "../../blocks/recurseOverBlocks";
import { removeBlock } from "../../BlockHelper";
import { getBlocksByBlockName } from "../../blocks/getBlocksByBlockName";
import { WarningBlockAttributes } from "../../../blocks/warning-block";


jest.mock( "@wordpress/data", () => ( {
	dispatch: jest.fn( () => ( {
		insertBlock: jest.fn(),
	} ) ),
} ) );

describe( "The removeObsoleteWarnings function", () => {
	it( "removes any warnings that no longer apply", () => {

	} );
} );
