/* External dependencies */
import React from "react";
import styled from "styled-components";
import { injectIntl, FormattedMessage } from "react-intl";
import PropTypes from "prop-types";

/* Internal dependencies */
import SnippetPreview, { MODE_DESKTOP, MODE_MOBILE, MODES } from "../../SnippetPreview/components/SnippetPreview";
import SnippetEditorFields from "./SnippetEditorFields";
import { Button } from "../../Shared/components/Button";
import SvgIcon from "../../Shared/components/SvgIcon";
import ScreenReaderText from "../../../../a11y/ScreenReaderText";
import colors from "../../../../style-guide/colors.json";

const SwitcherButton = Button.extend`
	border: none;
	border-bottom: 4px solid transparent;
	
	width: 31px;
	height: 31px;
	
	border-color: ${ ( props ) => props.isActive ? colors.$color_snippet_active : "transparent" };
	color: ${ colors.$color_snippet_active };
	
	transition: 0.15s color ease-in-out,0.15s background-color ease-in-out,0.15s border-color ease-in-out;
	transition-property: border-color;
	
	&:hover, &:focus {
		border: none;
		border-bottom: 4px solid transparent;
		border-color: ${ colors.$color_snippet_focus };
		color: ${ colors.$color_snippet_focus };
	}
`;

const MobileButton = SwitcherButton.extend`
	border-radius: 3px 0 0 3px;
`;

const DesktopButton = SwitcherButton.extend`
	border-radius: 0 3px 3px 0;
`;

const ModeSwitcher = styled.div`
	display: inline-block;
	margin-top: 10px;
	margin-left: 20px;
	border: 1px solid #dbdbdb;
	border-radius: 4px;
	background-color: #f7f7f7;
	vertical-align: top;
`;

const EditSnippetButton = Button.extend`
	margin: 10px 0 0 9px;
	
	& svg {
		margin-right: 7px;
	}
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
	/**
	 * Constructs the snippet editor.
	 *
	 * @param {Object} props The props for the snippet editor.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isOpen: false,
			activeField: null,
			hoveredField: null,
		};

		this.setFieldFocus = this.setFieldFocus.bind( this );
		this.onClick = this.onClick.bind( this );
		this.onMouseOver = this.onMouseOver.bind( this );
		this.onMouseLeave = this.onMouseLeave.bind( this );
		this.open = this.open.bind( this );
		this.close = this.close.bind( this );
	}

	/**
	 * Renders the editor fields if the editor is open.
	 *
	 * @returns {ReactElement} The rendered react element.
	 */
	renderEditorFields() {
		const { data, onChange } = this.props;
		const { activeField, hoveredField, isOpen } = this.state;

		if ( ! isOpen ) {
			return null;
		}

		return <React.Fragment>
			<SnippetEditorFields
				data={ data }
				activeField={ activeField === "url" ? "slug" : activeField }
				hoveredField={ hoveredField === "url" ? "slug" : hoveredField }
				onChange={ onChange }
				onFocus={ this.setFieldFocus }
				replacementVariables={replaceVars}
				ref={ this.setEditorFieldsRef }
			/>
			<Button onClick={ this.close }>
				<FormattedMessage
					id="snippet-editor.close-editor"
					defaultMessage="Close snippet editor"
				/>
			</Button>
		</React.Fragment>;
	}

	/**
	 * Focuses the preview on the given field.
	 *
	 * @param {String} field the name of the field to focus
	 *
	 * @returns {void}
	 */
	setFieldFocus( field ) {
		if ( field === "url" ) {
			field = "slug";
		}

		this.setState( {
			activeField: field,
		} );
	}

	/**
	 * Activates a certain field in the editor.
	 *
	 * @param {string} field The field to activate.
	 *
	 * @returns {void}
	 */
	activateField( field ) {
		this.setState( {
			activeField: field,
		} );
	}

	/**
	 * Handles click event on a certain field in the snippet preview.
	 *
	 * @param {string} field The field that was clicked on.
	 *
	 * @returns {void}
	 */
	onClick( field ) {
		/*
		 * We have to wait for the form to be mounted before we can actually focus
		 * the correct input field.
		 */
		this.open()
			.then( this.activateField.bind( this, field ) );
	}

	/**
	 * Sets the hovered field on mouse over.
	 *
	 * @param {string} field The field that was moused over.
	 *
	 * @returns {void}
	 */
	onMouseOver( field ) {
		this.setState( {
			hoveredField: field,
		} );
	}

	/**
	 * Sets the hovered field on mouse leave.
	 *
	 * @param {string} field The field that was the mouse left.
	 *
	 * @returns {void}
	 */
	onMouseLeave( field ) {
		if ( field && this.state.hoveredField !== field ) {
			return;
		}

		this.setState( {
			hoveredField: null,
		} );
	}

	/**
	 * Opens the snippet editor form.
	 *
	 * @returns {Promise} Resolves when the form is opened and rendered.
	 */
	open() {
		return new Promise( ( resolve ) => {
			this.setState( {
				isOpen: true,
			}, resolve );
		} );
	}

	/**
	 * Closes the snippet editor form.
	 *
	 * @returns {void}
	 */
	close() {
		this.setState( {
			isOpen: false,
			activeField: null,
		} );
	}

	/**
	 * Renders the snippet editor.
	 *
	 * @returns {ReactElement} The snippet editor element.
	 */
	render() {
		const {
			onChange,
			data,
			mode,
		} = this.props;

		const {
			activeField,
			hoveredField,
			isOpen,
		} = this.state;

		const props = {
			title: data.title,
			description: data.description,
			url: data.url,
			mode: this.props.mode,
			activeField,
			hoveredField,
			onMouseOver: this.onMouseOver,
			onMouseLeave: this.onMouseLeave,
			onClick: this.onClick,
		};

		return (
			<div>
				<SnippetPreview { ...props } />

				<ModeSwitcher>
					<MobileButton onClick={ () => onChange( "mode", MODE_MOBILE ) } isActive={ mode === MODE_MOBILE }>
						<SvgIcon icon="mobile" size="22px" color="currentColor" />
						<ScreenReaderText>
							<FormattedMessage
								id="snippetEditor.desktopPreview"
								defaultMessage="Mobile preview"
							/>
						</ScreenReaderText>
					</MobileButton>

					<DesktopButton onClick={ () => onChange( "mode", MODE_DESKTOP ) } isActive={ mode === MODE_DESKTOP }>
						<SvgIcon icon="desktop" size="18px" color="currentColor" />
						<ScreenReaderText>
							<FormattedMessage
								id="snippetEditor.desktopPreview"
								defaultMessage="Desktop preview"
							/>
						</ScreenReaderText>
					</DesktopButton>
				</ModeSwitcher>

				<EditSnippetButton onClick={ isOpen ? this.close : this.open }>
					<SvgIcon icon="edit" />
					<FormattedMessage
						id="snippetEditor.editSnippet"
						defaultMessage="Edit snippet"
					/>
				</EditSnippetButton>

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
	mode: PropTypes.oneOf( MODES ),
	onChange: PropTypes.func,
};

SnippetEditor.defaultProps = {
	onChange: () => {},
	isEditorOpen: false,
	mode: MODE_MOBILE,
};

export default SnippetEditor;
