import React from "react";
import styled from "styled-components";
import { injectIntl, intlShape, defineMessages } from "react-intl";
import ReplaceVarEditor from "./ReplaceVarEditor";
import PropTypes from "prop-types";
import SnippetPreview from "../../SnippetPreview/components/SnippetPreview";
import SnippetEditorFields from "./SnippetEditorFields";


const InputContainer = styled.div`
	padding: 5px;
	border: 1px solid #ddd;
	box-shadow: inset 0 1px 2px rgba(0,0,0,.07);
	background-color: #fff;
	color: #32373c;
	outline: 0;
	transition: 50ms border-color ease-in-out;
`;

const FormSection = styled.div`
	margin: 1em 0;
`;

const StyledEditor = styled.section`
	padding: 0 20px;
`;

const replaceVars = [
	{
		name: "title",
		description: "The title of your post.",
	},
	{
		name: "post_type",
		description: "The post type of your post.",
	},
	{
		name: "snippet",
		description: "The snippet of your post.",
	},
	{
		name: "snippet_manual",
		description: "The manual snippet of your post.",
	},
];

class SnippetEditor extends React.Component {

	renderEditorFields() {
		const { data, onChange, onCloseEditor, isEditorOpen } = this.props;

		if ( ! isEditorOpen ) {
			return null;
		}

		return <React.Fragment>
			<SnippetEditorFields data={ data } onChange={ onChange }
		                     replacementVariables={replaceVars}/>
			{ onCloseEditor && <button type="button" onClick={ onCloseEditor }>Close snippet editor</button> }
		</React.Fragment>;
	}

	/**
	 * Renders the snippet editor.
	 *
	 * @returns {ReactElement} The snippet editor element.
	 */
	render() {
		const {
			intl,
			replacementVariables,
			onChange,
			onOpenEditor,
			data,
		} = this.props;

		const onClick = () => {};

		const props = {
			onClick,
			title: data.title,
			description: data.description,
			url: data.url,
			mode: this.props.mode,
		};

		return (
			<div>
				<SnippetPreview { ...props } />

				<button type="button" onClick={ () => { onChange( "mode", "mobile" ) } }>Mobile</button>
				<button type="button" onClick={ () => { onChange( "mode", "desktop" ) } }>Desktop</button>
				{ onOpenEditor && <button type="button" onClick={ onOpenEditor }>Edit snippet</button> }

				{ this.renderEditorFields() }
			</div>
		);
	}
}

SnippetEditor.propTypes = {
	replacementVariables: PropTypes.arrayOf( PropTypes.shape( {
		name: PropTypes.string,
		description: PropTypes.string,
	} ) ),
	data: PropTypes.shape( {
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	} ),
	mode: PropTypes.string,
	isEditorOpen: PropTypes.bool,
	onChange: PropTypes.func,
	onOpenEditor: PropTypes.func,
	onCloseEditor: PropTypes.func,
	intl: intlShape.isRequired,
};

SnippetEditor.defaultProps = {
	onChange: () => {},
	isEditorOpen: false,
	mode: "mobile",
};

export default injectIntl( SnippetEditor );
