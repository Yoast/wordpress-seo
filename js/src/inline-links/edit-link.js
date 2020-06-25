/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { Component, Fragment } from "@wordpress/element";
import { withSpokenMessages } from "@wordpress/components";
import {
	getTextContent,
	applyFormat,
	removeFormat,
	slice,
	isCollapsed,
} from "@wordpress/rich-text";
import { isURL, isEmail } from "@wordpress/url";
import {
	RichTextToolbarButton,
	RichTextShortcut,
} from "@wordpress/block-editor";
import { decodeEntities } from "@wordpress/html-entities";

/**
 * Internal dependencies
 */
import InlineLinkUI from "./inline";

const name = "yoast-seo/link";
const title = __( "Link", "wordpress-seo" );

export const link = {
	name,
	title,
	tagName: "a",
	className: "yoast-seo-link",
	attributes: {
		url: "href",
		type: "data-type",
		target: "target",
	},
	replaces: "core/link",
	__unstablePasteRule( value, { html, plainText } ) {
		if ( isCollapsed( value ) ) {
			return value;
		}

		const pastedText = ( html || plainText )
			.replace( /<[^>]+>/g, "" )
			.trim();

		// A URL was pasted, turn the selection into a link
		if ( ! isURL( pastedText ) ) {
			return value;
		}

		// Allows us to ask for this information when we get a report.
		window.console.log( "Created link:\n\n", pastedText );

		return applyFormat( value, {
			type: name,
			attributes: {
				url: decodeEntities( pastedText ),
			},
		} );
	},
	edit: withSpokenMessages(
		class LinkEdit extends Component {
			constructor() {
				super( ...arguments );

				this.addLink = this.addLink.bind( this );
				this.stopAddingLink = this.stopAddingLink.bind( this );
				this.onRemoveFormat = this.onRemoveFormat.bind( this );
				this.state = {
					addingLink: false,
				};
			}

			addLink() {
				const { value, onChange } = this.props;
				const text = getTextContent( slice( value ) );

				if ( text && isURL( text ) ) {
					onChange(
						applyFormat( value, {
							type: name,
							attributes: { url: text },
						} )
					);
				} else if ( text && isEmail( text ) ) {
					onChange(
						applyFormat( value, {
							type: name,
							attributes: { url: `mailto:${ text }` },
						} )
					);
				} else {
					this.setState( { addingLink: true } );
				}
			}

			stopAddingLink() {
				this.setState( { addingLink: false } );
				this.props.onFocus();
			}

			onRemoveFormat() {
				const { value, onChange, speak } = this.props;

				onChange( removeFormat( value, name ) );
				speak( __( "Link removed.", "wordpress-seo" ), "assertive" );
			}

			render() {
				const {
					isActive,
					activeAttributes,
					value,
					onChange,
				} = this.props;

				return (
					<Fragment>
						<RichTextShortcut
							type="primary"
							character="k"
							onUse={ this.addLink }
						/>
						<RichTextShortcut
							type="primaryShift"
							character="k"
							onUse={ this.onRemoveFormat }
						/>
						{ isActive && (
							<RichTextToolbarButton
								name="link"
								icon="editor-unlink"
								title={ __( "Unlink", "wordpress-seo" ) }
								onClick={ this.onRemoveFormat }
								isActive={ isActive }
								shortcutType="primaryShift"
								shortcutCharacter="k"
							/>
						) }
						{ ! isActive && (
							<RichTextToolbarButton
								name="link"
								icon="admin-links"
								title={ title }
								onClick={ this.addLink }
								isActive={ isActive }
								shortcutType="primary"
								shortcutCharacter="k"
							/>
						) }
						{ ( this.state.addingLink || isActive ) && (
							<InlineLinkUI
								addingLink={ this.state.addingLink }
								stopAddingLink={ this.stopAddingLink }
								isActive={ isActive }
								activeAttributes={ activeAttributes }
								value={ value }
								onChange={ onChange }
							/>
						) }
					</Fragment>
				);
			}
		}
	),
};
