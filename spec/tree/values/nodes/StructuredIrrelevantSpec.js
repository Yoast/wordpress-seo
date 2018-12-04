import StructuredIrrelevant from "../../../../src/tree/values/nodes/StructuredIrrelevant";

describe( "StructuredIrrelevant", () => {
	it( "can make an StructuredIrrelevant node", () => {
		const nodeContents = "<script> console.log('hey!'); </script>";
		const structuredIrrelevantNode = new StructuredIrrelevant( nodeContents );
		expect( structuredIrrelevantNode.content ).toEqual( nodeContents );
	} );
} );
