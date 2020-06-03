import PropTypes from "prop-types";
import {
	ToggleControl,
	withSpokenMessages,
} from "@wordpress/components";
import { getRectangleFromRange } from "@wordpress/dom";
import { Component, createRef, useMemo, Fragment, __experimentalCreateInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
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
import HelpLink from "../components/contentAnalysis/HelpLink";

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
	const anchorRect = useMemo(
		/**
		 * Returns the selection.
		 *
		 * @returns {ClientRect | DOMRect|*} The selection.
		 */
		() => {
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
		},
		[ isActive, addingLink, value.start, value.end ]
	);

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
	value: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.object,
	] ).isRequired,
};

/**
 * The InlineLinkUI component.
 */
class InlineLinkUI extends Component {
	/**
	 * Constructor.
	 */
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

	/**
	 * OnKeyDown callback.
	 *
	 * @param {object} event The event.
	 *
	 * @returns {void}
	 */
	onKeyDown( event ) {
		if ( [ LEFT, DOWN, RIGHT, UP, BACKSPACE, ENTER ].indexOf( event.keyCode ) > -1 ) {
			// Stop the key event from propagating up to ObserveTyping.startTypingInTextField.
			event.stopPropagation();
		}

		if ( [ ESCAPE ].indexOf( event.keyCode ) > -1 ) {
			this.resetState();
		}
	}

	/**
	 * OnChange handler.
	 *
	 * @param {string} inputValue The inputValue.
	 *
	 * @returns {void}
	 */
	onChangeInputValue( inputValue ) {
		this.setState( { inputValue } );
	}

	/**
	 * Sets the link target.
	 *
	 * @param {boolean} opensInNewWindow Should the link open in a new window.
	 *
	 * @returns {void}
	 */
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

	/**
	 * Sets nofollow.
	 *
	 * @param {boolean} noFollow Should rel 'nofollow' be added to the link.
	 *
	 * @returns {void}
	 */
	setNoFollow( noFollow ) {
		const { activeAttributes: { url = "" }, value, onChange } = this.props;
		let sponsored = this.state.sponsored;

		if ( noFollow === false && sponsored === true ) {
			sponsored = false;

			this.setState( {
				noFollow,
				sponsored,
			} );
		} else {
			this.setState( { noFollow } );
		}

		// Apply now if URL is not being edited.
		if ( ! isShowingInput( this.props, this.state ) ) {
			const selectedText = getTextContent( slice( value ) );

			onChange( applyFormat( value, createLinkFormat( {
				url,
				opensInNewWindow: this.state.opensInNewWindow,
				noFollow,
				sponsored,
				text: selectedText,
			} ) ) );
		}
	}

	/**
	 * Sets sponsored.
	 *
	 * @param {boolean} sponsored Should rel 'sponsored' be added to the link.
	 *
	 * @returns {void}
	 */
	setSponsored( sponsored ) {
		const { activeAttributes: { url = "" }, value, onChange } = this.props;
		let noFollow = this.state.noFollow;

		if ( sponsored === true && noFollow === false ) {
			noFollow = true;

			this.setState( {
				noFollow,
				sponsored,
			} );
		} else {
			this.setState( { sponsored } );
		}

		// Apply now if URL is not being edited.
		if ( ! isShowingInput( this.props, this.state ) ) {
			const selectedText = getTextContent( slice( value ) );

			onChange( applyFormat( value, createLinkFormat( {
				url,
				opensInNewWindow: this.state.opensInNewWindow,
				noFollow,
				sponsored,
				text: selectedText,
			} ) ) );
		}
	}

	/**
	 * Edit link callback.
	 *
	 * @param {object} event The event.
	 *
	 * @returns {void}
	 */
	editLink( event ) {
		this.setState( { editLink: true } );
		event.preventDefault();
	}

	/**
	 * Submit link callback.
	 *
	 * @param {object} event The event.
	 *
	 * @returns {void}
	 */
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

	/**
	 * On focus outside callback.
	 *
	 * @returns {void}
	 */
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

	/**
	 * Resets the state.
	 *
	 * @returns {void}
	 */
	resetState() {
		this.props.stopAddingLink();
		this.setState( { editLink: false } );
	}

	/**
	 * Resets the rectangle.
	 *
	 * @param {object} anchorRect The rectangle.
	 *
	 * @returns {void}
	 */
	resetOnMount( anchorRect ) {
		if ( this.state.anchorRect !== anchorRect ) {
			this.setState( { opensInNewWindow: false, noFollow: false, sponsored: false, anchorRect: anchorRect } );
		}
	}

	/**
	 * Render method.
	 *
	 * @returns {wp.Element} The component.
	 */
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

		const NoFollowHelpLink = <HelpLink
			href={ window.wpseoAdminL10n[ "shortlinks.nofollow_sponsored" ] }
			className="dashicons"
		>
			<span className="screen-reader-text">
				{ __( "Learn more about marking a link as nofollow or sponsored.", "wordpress-seo" ) }
			</span>
		</HelpLink>;

		const noFollowLabel = __experimentalCreateInterpolateElement(
			sprintf(
				__( "Search engines should ignore this link (mark as %1$snofollow%2$s)%3$s", "wordpress-seo" ),
				"<code>",
				"</code>",
				"<helplink />"
			),
			{
				code: <code />,
				helplink: NoFollowHelpLink,
			}
		);

		const sponsoredLabel = __experimentalCreateInterpolateElement(
			sprintf(
				__( "This is a sponsored link or advert (mark as %1$ssponsored%2$s)%3$s", "wordpress-seo" ),
				"<code>",
				"</code>",
				"<helplink />"
			),
			{
				code: <code />,
				helplink: NoFollowHelpLink,
			}
		);

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
								label={ __( "Open in new tab", "wordpress-seo" ) }
								checked={ opensInNewWindow }
								onChange={ this.setLinkTarget }
							/>
							<ToggleControl
								className="yoast-no-follow-toggle"
								label={ noFollowLabel }
								checked={ noFollow }
								onChange={ this.setNoFollow }
							/>
							<ToggleControl
								label={ sponsoredLabel }
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
	value: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.object,
	] ).isRequired,
	activeAttributes: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	speak: PropTypes.func.isRequired,
	stopAddingLink: PropTypes.func.isRequired,
};

export default withSpokenMessages( InlineLinkUI );
