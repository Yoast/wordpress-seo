import React from "react";
import styled from "styled-components";
import { injectIntl, intlShape, defineMessages } from "react-intl";
import ReplaceVarEditor from "./ReplaceVarEditor";
import PropTypes from "prop-types";

const messages = defineMessages( {
	seoTitle: {
		id: "snippetEditor.seoTitle",
		defaultMessage: "SEO title",
	},
	slug: {
		id: "snippetEditor.slug",
		defaultMessage: "Slug",
	},
	metaDescription: {
		id: "snippetEditor.metaDescription",
		defaultMessage: "Meta description",
	},
} );

const EditorContainer = styled.div`
	padding: 5px;
	border: 1px solid #ddd;
	box-shadow: inset 0 1px 2px rgba(0,0,0,.07);
	background-color: #fff;
	color: #32373c;
	outline: 0;
	transition: 50ms border-color ease-in-out;
`;

class SnippetEditor extends React.Component {
	render() {
		const {
			intl,
			replacementVariables,
			onChange,
		} = this.props;

		return (
			<div>
				<div>
					<label>{ intl.formatMessage( messages.seoTitle ) }</label>
					<EditorContainer>
						<ReplaceVarEditor
							content="%%title%% %%post_type%% test123 fa"
							onChange={ ( content ) => {
								onChange( "title", content );
							} }
							replacementVariables={ replacementVariables }
						/>
					</EditorContainer>
					<label>{ intl.formatMessage( messages.slug ) }</label>
					<EditorContainer>
						<ReplaceVarEditor
							content="%%snippet%% test123 fa"
							onChange={ ( content ) => {
								onChange( "description", content );
							} }
							replacementVariables={ [] }
						/>
					</EditorContainer>
					<label>{ intl.formatMessage( messages.metaDescription ) }</label>
					<EditorContainer>
						<ReplaceVarEditor
							content="%%snippet%% test123 fa"
							onChange={ ( content ) => {
								onChange( "description", content );
							} }
							replacementVariables={ replacementVariables }
						/>
					</EditorContainer>
				</div>
			</div>
		);
	}
}

SnippetEditor.propTypes = {
	replacementVariables: PropTypes.arrayOf( PropTypes.shape( {
		name: PropTypes.string,
		description: PropTypes.string,
	} ) ),
	onChange: PropTypes.func,
	intl: intlShape.isRequired,
};

SnippetEditor.defaultProps = {
	onChange: () => {},
};

export default injectIntl( SnippetEditor );
