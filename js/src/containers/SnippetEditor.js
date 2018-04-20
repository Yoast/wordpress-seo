import {connect} from "react-redux";
import {SnippetEditor} from "yoast-components";
import {
	switchMode,
	updateData
} from "../redux/actions/snippetEditor";

function mapStateToProps( { snippetEditor } ) {
	const data = snippetEditor.data;

	return {
		data: data,
		mode: snippetEditor.mode,
		replacementVariables: [
			{
				name: "title",
				value: "Title!",
			},
			{
				name: "excerpt",
				value: "Excerpt!",
			},
		],
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		onChange: ( key, value ) => {
			if ( key === "mode" ) {
				dispatch( switchMode( value ) );
			}

			dispatch( updateData( {
				[ key ]: value,
			} ) );

			console.log( key, value );
		},
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( SnippetEditor );
