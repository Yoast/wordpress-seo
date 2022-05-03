import React from "react";
import JsonViewer from "react-json-view";
import { connect } from "react-redux";

function TreeView( { tree } ) {
	return <JsonViewer src={ tree } />;
}

export default connect(
	state => ( { tree: state.results.tree } ),
)( TreeView );
