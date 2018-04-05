import { shallow } from "enzyme";
import ReplacementVariableEditor from "../components/ReplacementVariableEditor";
import React from "react";

describe( "ReplacementVariableEditor", () => {
	it( "wraps a DraftJS editor instance", () => {
		const editor = shallow( <ReplacementVariableEditor content="Dummy content" /> );

		expect( editor ).toMatchSnapshot();
	} );
} );
