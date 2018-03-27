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

class SnippetEditorFields extends React.Component {
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
			data,
		} = this.props;

		const { title, slug, description } = data;

		return (
			<StyledEditor>
				<FormSection>
					<label>{ intl.formatMessage( messages.seoTitle ) }</label>
					<InputContainer>
						<ReplaceVarEditor
							content={ title }
							onChange={ ( content ) => {
								onChange( "title", content );
							} }
							replacementVariables={ replacementVariables }
						/>
					</InputContainer>
				</FormSection>
				<FormSection>
					<label>{ intl.formatMessage( messages.slug ) }</label>
					<InputContainer>
						<ReplaceVarEditor
							content={ slug }
							onChange={ ( content ) => {
								onChange( "slug", content );
							} }
							replacementVariables={ [] }
						/>
					</InputContainer>
				</FormSection>
				<FormSection>
					<label>{ intl.formatMessage( messages.metaDescription ) }</label>
					<InputContainer>
						<ReplaceVarEditor
							content={ description }
							onChange={ ( content ) => {
								onChange( "description", content );
							} }
							replacementVariables={ replacementVariables }
						/>
					</InputContainer>
				</FormSection>
			</StyledEditor>
		);
	}
}

SnippetEditorFields.propTypes = {
	replacementVariables: PropTypes.arrayOf( PropTypes.shape( {
		name: PropTypes.string,
		description: PropTypes.string,
	} ) ),
	onChange: PropTypes.func,
	data: PropTypes.shape( {
		title: PropTypes.string,
		slug: PropTypes.string,
		description: PropTypes.string,
	} ),
	intl: intlShape.isRequired,
};

SnippetEditorFields.defaultProps = {
	onChange: () => {},
};

export default injectIntl( SnippetEditorFields );
