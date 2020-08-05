/**
 * External dependencies
 */
import { uniqueId } from "lodash";

/**
 * WordPress dependencies
 */
import { useMemo, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { withSpokenMessages, Popover } from "@wordpress/components";
import { prependHTTP } from "@wordpress/url";
import { create, insert, isCollapsed, applyFormat } from "@wordpress/rich-text";

/**
 * Internal dependencies
 */
import { createLinkFormat, isValidHref } from "./utils";
import HelpLink from "../components/contentAnalysis/HelpLink";
import createInterpolateElement from "../helpers/createInterpolateElement";

function InlineLinkUI( {
	isActive,
	activeAttributes,
	addingLink,
	value,
	onChange,
	speak,
	stopAddingLink,
} ) {
	/**
	 * A unique key is generated when switching between editing and not editing
	 * a link, based on:
	 *
	 * - This component may be rendered _either_ when a link is active _or_
	 *   when adding or editing a link.
	 * - It's only desirable to shift focus into the Popover when explicitly
	 *   adding or editing a link, not when in the inline boundary of a link.
	 * - Focus behavior can only be controlled on a Popover at the time it
	 *   mounts, so a new instance of the component must be mounted to
	 *   programmatically enact the focusOnMount behavior.
	 *
	 * @type {string}
	 */
	const mountingKey = useMemo( uniqueId, [ addingLink ] );

	/**
	 * Pending settings to be applied to the next link. When inserting a new
	 * link, toggle values cannot be applied immediately, because there is not
	 * yet a link for them to apply to. Thus, they are maintained in a state
	 * value until the time that the link can be inserted or edited.
	 *
	 * @type {[Object|undefined,Function]}
	 */
	const [ nextLinkValue, setNextLinkValue ] = useState();

	const anchorRef = useMemo( () => {
		const selection = window.getSelection();

		if ( ! selection.rangeCount ) {
			return;
		}

		const range = selection.getRangeAt( 0 );

		if ( addingLink && ! isActive ) {
			return range;
		}

		let element = range.startContainer;

		// If the caret is right before the element, select the next element.
		element = element.nextElementSibling || element;

		while ( element.nodeType !== window.Node.ELEMENT_NODE ) {
			element = element.parentNode;
		}

		return element.closest( "a" );
	}, [ addingLink, value.start, value.end ] );

	const linkValue = {
		url: activeAttributes.url,
		type: activeAttributes.type,
		id: activeAttributes.id,
		opensInNewTab: activeAttributes.target === "_blank",
		noFollow: activeAttributes.rel && activeAttributes.rel.split( " " ).includes( "nofollow" ),
		sponsored: activeAttributes.rel && activeAttributes.rel.split( " " ).includes( "sponsored" ),
		...nextLinkValue,
	};

	function onChangeLink( nextValue ) {
		/*
		 * Merge with values from state, both for the purpose of assigning the next state value, and for use in constructing the new link format if
		 * the link is ready to be applied.
 		 */
		nextValue = {
			...nextLinkValue,
			...nextValue,
		};

		/* LinkControl calls `onChange` immediately upon the toggling a setting. */
		const didToggleSetting =
			linkValue.url === nextValue.url &&
			linkValue.opensInNewTab !== nextValue.opensInNewTab ||
			linkValue.noFollow !== nextValue.noFollow ||
			linkValue.sponsored !== nextValue.sponsored;

		/*
		 * A link rel can only be one of three combinations:
		 * - only nofollow
		 * - both nofollow and sponsored
		 * - neither nofollow or sponsored
		 * On first toggle there is no linkValue. We need to compare with what it should be instead of what it is.
		 */
		if ( didToggleSetting && nextValue.sponsored === true && linkValue.sponsored !== true ) {
			nextValue.noFollow = true;
		}
		if ( didToggleSetting && nextValue.noFollow === false && linkValue.noFollow !== false ) {
			nextValue.sponsored = false;
		}

		/*
		 * If change handler was called as a result of a settings change during link insertion, it must be held in state until the link is ready to
		 * be applied.
 		 */
		const didToggleSettingForNewLink =
			didToggleSetting && nextValue.url === undefined;

		/* If link will be assigned, the state value can be considered flushed. Otherwise, persist the pending changes. */
		setNextLinkValue( didToggleSettingForNewLink ? nextValue : undefined );

		if ( didToggleSettingForNewLink ) {
			return;
		}

		const newUrl = prependHTTP( nextValue.url );

		const format = createLinkFormat( {
			url: newUrl,
			type: nextValue.type,
			id:
				nextValue.id !== undefined && nextValue.id !== null
					? String( nextValue.id )
					: undefined,
			opensInNewWindow: nextValue.opensInNewTab,
			noFollow: nextValue.noFollow,
			sponsored: nextValue.sponsored,
		} );

		if ( isCollapsed( value ) && ! isActive ) {
			const newText = nextValue.title || newUrl;
			const toInsert = applyFormat(
				create( { text: newText } ),
				format,
				0,
				newText.length
			);
			onChange( insert( value, toInsert ) );
		} else {
			const newValue = applyFormat( value, format );
			newValue.start = newValue.end;
			newValue.activeFormats = [];
			onChange( newValue );
		}

		/* Focus should only be shifted back to the formatted segment when the URL is submitted. */
		if ( ! didToggleSetting ) {
			stopAddingLink();
		}

		if ( ! isValidHref( newUrl ) ) {
			speak(
				__(
					"Warning: the link has been inserted but may have errors. Please test it."
				),
				"assertive"
			);
		} else if ( isActive ) {
			speak( __( "Link edited.", "wordpress-seo" ), "assertive" );
		} else {
			speak( __( "Link inserted.", "wordpress-seo" ), "assertive" );
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

	const noFollowLabel = createInterpolateElement(
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

	const sponsoredLabel = createInterpolateElement(
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

	const settings = [
		{
			id: "opensInNewTab",
			title: __( "Open in new tab", "wordpress-seo" ),
		},
		{
			id: "noFollow",
			title: noFollowLabel,
		},
		{
			id: "sponsored",
			title: sponsoredLabel,
		},
	];

	/*
	 * We need to import this right here, since we can only know for sure
	 * that we are in the block editor when rendering this component.
	 *
	 * We can't tell WordPress that "wp-block-editor" script is a dependency
	 * when loading this JavaScript, since we cannot tell if the edit
	 * page is using the classic or block editor.
	 */
	const { __experimentalLinkControl: LinkControl } = window.wp.blockEditor;

	return (
		<Popover
			key={ mountingKey }
			anchorRef={ anchorRef }
			focusOnMount={ addingLink ? "firstElement" : false }
			onClose={ stopAddingLink }
			position="bottom center"
		>
			<LinkControl
				value={ linkValue }
				onChange={ onChangeLink }
				forceIsEditingLink={ addingLink }
				settings={ settings }
			/>
		</Popover>
	);
}

export default withSpokenMessages( InlineLinkUI );
