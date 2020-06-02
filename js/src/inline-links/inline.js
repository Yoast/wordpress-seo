import PropTypes from "prop-types";
import {
	ToggleControl,
	withSpokenMessages,
} from "@wordpress/components";
import { getRectangleFromRange } from "@wordpress/dom";
import { Component, createRef, useMemo, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { LEFT, RIGHT, UP, DOWN, BACKSPACE, ENTER, ESCAPE } from "@wordpress/keycodes";
import { prependHTTP } from "@wordpress/url";
import {
	create,
	insert,
	isCollapsed,
	applyFormat,
	getTextContent,
	slice,
} from "@wordpress/rich-text";
import { URLPopover } from "@wordpress/block-editor";

/**
 * Internal dependencies
 */
import { createLinkFormat, isValidHref } from "./utils";
import PositionedAtSelection from "./positioned-at-selection";
import LinkEditor from "./link-editor";
import LinkViewer from "./link-viewer";

/**
 * Stop key propagation.
 *
 * @param {object} event a DOM event.
 * @returns {void}
 */
const stopKeyPropagation = ( event ) => event.stopPropagation();

/**
 * Util to check if the Inline Link UI is showing input.
 *
 * @param {object} props the props
 * @param {object} state the state
 * @returns {boolean} True or false.
 */
function isShowingInput( props, state ) {
	return props.addingLink || state.editLink;
}

/**
 * Renders a URL popover element if the selection is clear.
 *
 * @param {boolean}  isActive     If the popover is active.
 * @param {boolean}  addingLink   If a link is being added.
 * @param {object}   value        The value object.
 * @param {function} resetOnMount Reset function.
 * @param {object}   props        The props.
 *
 * @returns {null|wp.Element} The component or null.
 */
const URLPopoverAtLink = ( { isActive, addingLink, value, resetOnMount, ...props } ) => {
	const anchorRect = useMemo( () => {
		const selection = window.getSelection();
		const range = selection.rangeCount > 0 ? selection.getRangeAt( 0 ) : null;
		if ( ! range ) {
			return;
		}

		if ( addingLink ) {
			return getRectangleFromRange( range );
		}

		let element = range.startContainer;

		// If the caret is right before the element, select the next element.
		element = element.nextElementSibling || element;

		while ( element.nodeType !== window.Node.ELEMENT_NODE ) {
			element = element.parentNode;
		}

		const closest = element.closest( "a" );
		if ( closest ) {
			return closest.getBoundingClientRect();
		}
	}, [ isActive, addingLink, value.start, value.end ] );

	if ( ! anchorRect ) {
		return null;
	}

	resetOnMount( anchorRect );

	return <URLPopover anchorRect={ anchorRect } { ...props } />;
};

URLPopoverAtLink.propTypes = {
	resetOnMount: PropTypes.func.isRequired,
	isActive: PropTypes.bool.isRequired,
	addingLink: PropTypes.bool.isRequired,
	value: PropTypes.object.isRequired,
};

class InlineLinkUI extends Component {
	constructor() {
		super( ...arguments );

		this.editLink = this.editLink.bind( this );
		this.submitLink = this.submitLink.bind( this );
		this.onKeyDown = this.onKeyDown.bind( this );
		this.onChangeInputValue = this.onChangeInputValue.bind( this );
		this.setLinkTarget = this.setLinkTarget.bind( this );
		this.setNoFollow = this.setNoFollow.bind( this );
		this.setSponsored = this.setSponsored.bind( this );
		this.onFocusOutside = this.onFocusOutside.bind( this );
		this.resetState = this.resetState.bind( this );
		this.autocompleteRef = createRef();
		this.resetOnMount = this.resetOnMount.bind( this );

		this.state = {
			opensInNewWindow: false,
			noFollow: false,
			sponsored: false,
			inputValue: "",
			anchorRect: false,
		};
	}

	static getDerivedStateFromProps( props, state ) {
		const { activeAttributes: { url, target, rel } } = props;
		const opensInNewWindow = target === "_blank";

		if ( ! isShowingInput( props, state ) ) {
			if ( url !== state.inputValue ) {
				return { inputValue: url };
			}

			if ( opensInNewWindow !== state.opensInNewWindow ) {
				return { opensInNewWindow };
			}

			if ( typeof rel === "string" ) {
				const noFollow = rel.split( " " ).includes( "nofollow" );
				const sponsored = rel.split( " " ).includes( "sponsored" );

				if ( noFollow !== state.noFollow ) {
					return { noFollow };
				}

				if ( sponsored !== state.sponsored ) {
					return { sponsored };
				}
			}
		}

		return null;
	}

	onKeyDown( event ) {
		if ( [ LEFT, DOWN, RIGHT, UP, BACKSPACE, ENTER ].indexOf( event.keyCode ) > -1 ) {
			// Stop the key event from propagating up to ObserveTyping.startTypingInTextField.
			event.stopPropagation();
		}

		if ( [ ESCAPE ].indexOf( event.keyCode ) > -1 ) {
			this.resetState();
		}
	}

	onChangeInputValue( inputValue ) {
		this.setState( { inputValue } );
	}

	setLinkTarget( opensInNewWindow ) {
		const { activeAttributes: { url = "" }, value, onChange } = this.props;

		this.setState( { opensInNewWindow } );

		// Apply now if URL is not being edited.
		if ( ! isShowingInput( this.props, this.state ) ) {
			const selectedText = getTextContent( slice( value ) );

			onChange( applyFormat( value, createLinkFormat( {
				url,
				opensInNewWindow,
				noFollow: this.state.noFollow,
				sponsored: this.state.sponsored,
				text: selectedText,
			} ) ) );
		}
	}

	setNoFollow( noFollow ) {
		const { activeAttributes: { url = "" }, value, onChange } = this.props;

		this.setState( { noFollow } );

		// Apply now if URL is not being edited.
		if ( ! isShowingInput( this.props, this.state ) ) {
			const selectedText = getTextContent( slice( value ) );

			onChange( applyFormat( value, createLinkFormat( {
				url,
				opensInNewWindow: this.state.opensInNewWindow,
				noFollow,
				sponsored: this.state.sponsored,
				text: selectedText,
			} ) ) );
		}
	}

	setSponsored( sponsored ) {
		const { activeAttributes: { url = "" }, value, onChange } = this.props;

		this.setState( { sponsored } );

		// Apply now if URL is not being edited.
		if ( ! isShowingInput( this.props, this.state ) ) {
			const selectedText = getTextContent( slice( value ) );

			onChange( applyFormat( value, createLinkFormat( {
				url,
				opensInNewWindow: this.state.opensInNewWindow,
				noFollow: this.state.noFollow,
				sponsored,
				text: selectedText,
			} ) ) );
		}
	}

	editLink( event ) {
		this.setState( { editLink: true } );
		event.preventDefault();
	}

	submitLink( event ) {
		const { isActive, value, onChange, speak } = this.props;
		const { inputValue, opensInNewWindow, noFollow, sponsored } = this.state;
		const url = prependHTTP( inputValue );
		const selectedText = getTextContent( slice( value ) );
		const format = createLinkFormat( {
			url,
			opensInNewWindow,
			noFollow,
			sponsored,
			text: selectedText,
		} );

		event.preventDefault();

		if ( isCollapsed( value ) && ! isActive ) {
			const toInsert = applyFormat( create( { text: url } ), format, 0, url.length );
			onChange( insert( value, toInsert ) );
		} else {
			onChange( applyFormat( value, format ) );
		}

		this.resetState();

		if ( ! isValidHref( url ) ) {
			speak( __( "Warning: the link has been inserted but could have errors. Please test it.", "wordpress-seo" ), "assertive" );
		} else if ( isActive ) {
			speak( __( "Link edited.", "wordpress-seo" ), "assertive" );
		} else {
			speak( __( "Link inserted.", "wordpress-seo" ), "assertive" );
		}
	}

	onFocusOutside() {
		/**
		 * The autocomplete suggestions list renders in a separate popover (in a portal),
		 * so onClickOutside fails to detect that a click on a suggestion occured in the
		 * LinkContainer. Detect clicks on autocomplete suggestions using a ref here, and
		 * return to avoid the popover being closed.
		 */
		const autocompleteElement = this.autocompleteRef.current;
		if ( autocompleteElement && autocompleteElement.contains( event.target ) ) {
			return;
		}

		this.resetState();
	}

	resetState() {
		this.props.stopAddingLink();
		this.setState( { editLink: false } );
	}

	resetOnMount( anchorRect ) {
		if ( this.state.anchorRect !== anchorRect ) {
			this.setState( { opensInNewWindow: false, noFollow: false, sponsored: false, anchorRect: anchorRect } );
		}
	}

	render() {
		const { isActive, activeAttributes: { url, target, rel }, addingLink, value } = this.props;

		if ( ! isActive && ! addingLink ) {
			return null;
		}

		const { inputValue, opensInNewWindow, noFollow, sponsored } = this.state;
		const showInput = isShowingInput( this.props, this.state );

		if ( ! opensInNewWindow && target === "_blank" ) {
			this.setState( { opensInNewWindow: true } );
		}

		if ( typeof rel === "string" ) {
			const relNoFollow = rel.split( " " ).includes( "nofollow" );
			const relSponsored = rel.split( " " ).includes( "sponsored" );

			if ( relNoFollow !== noFollow ) {
				this.setState( { noFollow: relNoFollow } );
			}

			if ( relSponsored !== sponsored ) {
				this.setState( { sponsored: relSponsored } );
			}
		}

		return (
			<PositionedAtSelection
				// Used to force rerender on selection change.
				key={ `${ value.start }${ value.end }` }
			>
				<URLPopoverAtLink
					resetOnMount={ this.resetOnMount }
					value={ value }
					isActive={ isActive }
					addingLink={ addingLink }
					onFocusOutside={ this.onFocusOutside }
					onClose={ () => {
						if ( ! inputValue ) {
							this.resetState();
						}
					} }
					focusOnMount={ showInput ? "firstElement" : false }
					renderSettings={ () => (
						<Fragment>
							<ToggleControl
								label={ __( "Open in New Tab", "wordpress-seo" ) }
								checked={ opensInNewWindow }
								onChange={ this.setLinkTarget }
							/>
							<ToggleControl
								label={ __( "Add 'nofollow' to link", "wordpress-seo" ) }
								checked={ noFollow }
								onChange={ this.setNoFollow }
							/>
							<ToggleControl
								label={ __( "Add 'sponsored' to link", "wordpress-seo" ) }
								checked={ sponsored }
								onChange={ this.setSponsored }
							/>
						</Fragment>
					) }
				>
					{ showInput ? (
						<LinkEditor
							className="editor-format-toolbar__link-container-content block-editor-format-toolbar__link-container-content"
							value={ inputValue }
							onChangeInputValue={ this.onChangeInputValue }
							onKeyDown={ this.onKeyDown }
							onKeyPress={ stopKeyPropagation }
							onSubmit={ this.submitLink }
							autocompleteRef={ this.autocompleteRef }
						/>
					) : (
						<LinkViewer
							className="editor-format-toolbar__link-container-content block-editor-format-toolbar__link-container-content"
							onKeyPress={ stopKeyPropagation }
							url={ url }
							onEditLinkClick={ this.editLink }
							linkClassName={
								/* eslint-disable no-undefined */
								isValidHref( prependHTTP( url ) ) ? undefined : "has-invalid-link"
								/* eslint-enable no-undefined */
							}
						/>
					) }

				</URLPopoverAtLink>
			</PositionedAtSelection>
		);
	}
}

InlineLinkUI.propTypes = {
	isActive: PropTypes.bool.isRequired,
	addingLink: PropTypes.bool.isRequired,
	value: PropTypes.object.isRequired,
	activeAttributes: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	speak: PropTypes.func.isRequired,
	stopAddingLink: PropTypes.func.isRequired,
};

export default withSpokenMessages( InlineLinkUI );
