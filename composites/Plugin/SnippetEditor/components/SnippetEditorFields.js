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

const colorCaret = "#5b9dd9";
const colorCaretHover = "#bfbfbf";

const angleRight = ( color ) => "data:image/svg+xml;charset=utf8," + encodeURI(
	'<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">' +
	'<path fill="' + color + '" d="M1152 896q0 26-19 45l-448 448q-19 19-45 19t-45-19-19-45v-896q0-26 19-45t45-19 45 19l448 448q19 19 19 45z" />' +
	"</svg>"
);

/**
 * Returns the color of the caret for an InputContainer based on the props.
 *
 * @param {Object} props The props for this InputContainer.
 * @returns {string} The color the caret should have.
 */
function getCaretColor( props ) {
	switch ( true ) {
		case props.isActive:
			return colorCaret;

		case props.isHovered:
			return colorCaretHover;

		default:
			return "transparent";
	}
}

/*
 * The caret is defined in this CSS because we cannot mount/unmount DraftJS.
 *
 * For some reason if you wrap the InputContainer with `.extend` or `styled()`
 * the ReplaceVarEditor in the children will unmount and mount on every focus.
 * This means that DraftJS cannot keep track of the browser selection. Which
 * breaks the editor completely. We circumvent this by settings the caret styles
 * conditionally.
 */
const InputContainer = styled.div.attrs( {
} )`
	padding: 5px;
	border: 1px solid ${ ( props ) => props.isActive ? "#5b9dd9" : "#ddd" };
	box-shadow: ${ ( props ) => props.isActive ? "0 0 2px rgba(30,140,190,.8);" : "inset 0 1px 2px rgba(0,0,0,.07)" };
	background-color: #fff;
	color: #32373c;
	outline: 0;
	transition: 50ms border-color ease-in-out;
	position: relative;
	
	&::before {
		display: block;
		position: absolute;
		top: 4px;
		left: -25px;
		width: 24px;
		height: 24px;
		background-image: url( ${ ( props ) => angleRight( getCaretColor( props ) ) });
		background-size: 25px;
		content: "";
	}
`;

const FormSection = styled.div`
	margin: 1em 0;
`;

const StyledEditor = styled.section`
	padding: 0 20px;
`;

class SnippetEditorFields extends React.Component {
	/**
	 * Constructs the snippet editor fields.
	 *
	 * @param {Object} props The props for the editor fields.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.elements = {
			title: null,
			slug: null,
			description: null,
		};

		this.setRef = this.setRef.bind( this );
	}

	/**
	 * Sets ref for field editor.
	 *
	 * @param {string} field The field for this ref.
	 * @param {Object} ref The DraftJS react element.
	 *
	 * @returns {void}
	 */
	setRef( field, ref ) {
		this.elements[ field ] = ref;
	}

	/**
	 * Makes sure the focus is correct after mounting the editor fields.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.focusOnActiveFieldChange( null );
	}

	/**
	 * Makes sure the focus is correct after updating the editor fields.
	 *
	 * @param {Object} prevProps The previously received props.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps ) {
		this.focusOnActiveFieldChange( prevProps.activeField );
	}

	/**
	 * Focuses the currently active field if it wasn't previously active.
	 *
	 * @param {string} prevActiveField The previously active field.
	 *
	 * @returns {void}
	 */
	focusOnActiveFieldChange( prevActiveField ) {
		const { activeField } = this.props;

		if ( activeField !== prevActiveField ) {
			const activeElement = this.elements[ activeField ];

			activeElement.focus();
		}
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
			onFocus,
			data,
			activeField,
			hoveredField,
		} = this.props;

		const { title, slug, description } = data;

		return (
			<StyledEditor>
				<FormSection>
					<label>{ intl.formatMessage( messages.seoTitle ) }</label>
					<InputContainer isActive={ activeField === "title" } isHovered={ hoveredField === "title" }>
						<ReplaceVarEditor
							content={ title }
							onChange={ content => onChange( "title", content ) }
							onFocus={ () => onFocus( "title" ) }
							replacementVariables={ replacementVariables }
							ref={ ( ref ) => this.setRef( "title", ref ) }
						/>
					</InputContainer>
				</FormSection>
				<FormSection>
					<label>{ intl.formatMessage( messages.slug ) }</label>
					<InputContainer isActive={ activeField === "slug" } isHovered={ hoveredField === "slug" }>
						<ReplaceVarEditor
							content={ slug }
							onChange={ content => onChange( "slug", content ) }
							onFocus={ () => onFocus( "slug" ) }
							replacementVariables={ [] }
							ref={ ref => this.setRef( "slug", ref ) }
						/>
					</InputContainer>
				</FormSection>
				<FormSection>
					<label>{ intl.formatMessage( messages.metaDescription ) }</label>
					<InputContainer isActive={ activeField === "description" } isHovered={ hoveredField === "description" }>
						<ReplaceVarEditor
							content={ description }
							onChange={ content => onChange( "description", content ) }
							onFocus={ () => onFocus( "description" ) }
							replacementVariables={ replacementVariables }
							ref={ ref => this.setRef( "description", ref ) }
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
	onFocus: PropTypes.func,
	data: PropTypes.shape( {
		title: PropTypes.string,
		slug: PropTypes.string,
		description: PropTypes.string,
	} ),
	activeField: PropTypes.oneOf( [ "title", "slug", "description" ] ),
	hoveredField: PropTypes.oneOf( [ "title", "slug", "description" ] ),
	intl: intlShape.isRequired,
};

SnippetEditorFields.defaultProps = {
	onChange: () => {},
};

export default injectIntl( SnippetEditorFields );
