/**
 * External dependencies
 */
import { uniqueId } from "lodash";
import PropTypes from "prop-types";

/**
 * WordPress dependencies
 */
import { useMemo, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { withSpokenMessages, Popover } from "@wordpress/components";
import { prependHTTP } from "@wordpress/url";
import { applyFormat, create, insert, isCollapsed, useAnchor } from "@wordpress/rich-text";

/**
 * Internal dependencies
 */
import { createLinkFormat, isValidHref } from "./utils";
import HelpLink from "../components/HelpLink";
import createInterpolateElement from "../helpers/createInterpolateElement";
import { link as linkSettings } from "./edit-link";

/**
 * Component to render the inline link UI.
 * This component is rendered when adding or editing a
 * link.
 *
 * @param {Object} props Component props.
 * @param {boolean} props.isActive Whether a link is active.
 * @param {Object} props.activeAttributes The attributes of the active link.
 * @param {boolean} props.addingLink Whether a link is being added or edited.
 * @param {object} props.value The current value of the rich text.
 * @param {Function} props.onChange The rich text change handler.
 * @param {Function} props.speak The speak function.
 * @param {Function} props.stopAddingLink The stop adding link handler.
 * @param {Object} props.contentRef The ref containing the current content element.
 *
 * @returns {WPElement} The inline link UI.
 */
function InlineLinkUI( {
	isActive,
	activeAttributes,
	addingLink,
	value,
	onChange,
	speak,
	stopAddingLink,
	contentRef,
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

	const anchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings: {
			...linkSettings,
			isActive,
		},
	} );

	const linkValue = {
		url: activeAttributes.url,
		type: activeAttributes.type,
		id: activeAttributes.id,
		opensInNewTab: activeAttributes.target === "_blank",
		noFollow: activeAttributes.rel && activeAttributes.rel.split( " " ).includes( "nofollow" ),
		sponsored: activeAttributes.rel && activeAttributes.rel.split( " " ).includes( "sponsored" ),
		...nextLinkValue,
	};

	/**
	 * LinkControl calls `onChange` immediately upon the toggling a setting.
	 *
	 * @param {object} nextValue The next link URL.
	 *
	 * @returns {boolean} Whether the link rel should be sponsored.
	 */
	const isToggleSetting = ( nextValue ) =>{
		return linkValue.url === nextValue.url &&
		linkValue.opensInNewTab !== nextValue.opensInNewTab ||
		linkValue.noFollow !== nextValue.noFollow ||
		linkValue.sponsored !== nextValue.sponsored;
	};

	/**
	 * Checks if link rel should be nofollow.
	 *
	 * @param {boolean} nextValue The next link URL.
	 * @returns {boolean} Whether the link rel should be nofollow.
	 */
	const isLinkNoFollow = ( nextValue ) => {
		return isToggleSetting( nextValue ) && nextValue.sponsored === true && linkValue.Sponsored !== true;
	};

	/**
	 * Checks if link rel should be sponsored.
	 * This handler is called when the user changes the link URL.
	 * LinkControl calls `onChange` immediately upon the toggling a setting.
	 * @param {boolean} nextValue The next link URL.
	 * @returns {boolean} Whether the link rel should be sponsored.
	 */
	const isSponsored = ( nextValue ) => {
		return isToggleSetting( nextValue ) && nextValue.noFollow === false && linkValue.noFollow !== false;
	};

	/**
	 * Checks if toggle setting for new link is valid.
	 * If change handler was called as a result of a settings change during link insertion,
	 * it must be held in state until the link is ready to be applied.
	 *
	 * @param {boolean} nextValue The next link URL.
	 * @returns {boolean} Whether the link rel should be sponsored.
	 */
	const didToggleSettingForNewLink = ( nextValue ) => {
		return isToggleSetting( nextValue ) && ! nextValue.url;
	};

	/**
	 * Speaks a message after a link is inserted or edited.
	 * @param {string} newUrl The new link URL.
	 * @returns {void}
	 */
	const actionCompleteMessage = ( newUrl ) => {
		if ( ! isValidHref( newUrl ) ) {
			speak(
				__(
					"Warning: the link has been inserted but may have errors. Please test it.",
					"wordpress-seo"
				),
				"assertive"
			);
		} else if ( isActive ) {
			speak( __( "Link edited.", "wordpress-seo" ), "assertive" );
		} else {
			speak( __( "Link inserted.", "wordpress-seo" ), "assertive" );
		}
	};

	/**
	 * Gets the new text for the link.
	 * @param {object} nextValue The next link URL.
	 * @param {string} newUrl The new link URL.
	 * @returns {string} The new text for the link.
	 */
	const getNewText = ( nextValue, newUrl ) =>{
		return nextValue.title ? nextValue.title : newUrl;
	};

	/**
	 * Should insert new link.
	 * @returns {boolean} Whether the link rel should be sponsored.
	 */
	const shouldInsertLink = () => {
		return isCollapsed( value ) && ! isActive;
	};

	/**
	 * Validates the link id is not null or undefined and cast it to string.
	 *
	 * @param {string} id The link id.
	 * @returns {string} The validated link id.
	 */
	const validateLinkId = ( id ) => {
		if ( typeof id === "number" || typeof id === "string" ) {
			return String( id );
		}
	};

	/**
	 * Handles the change of the link.
	 * @param {Object} nextValue The next link URL.
	 * @returns {void}
	 */
	const onChangeLink = ( nextValue ) => {
		/*
		 * Merge with values from state, both for the purpose of assigning the next state value, and for use in constructing the new link format if
		 * the link is ready to be applied.
 		 */
		nextValue = {
			...nextLinkValue,
			...nextValue,
		};

		/* LinkControl calls `onChange` immediately upon the toggling a setting. */
		const didToggleSetting = isToggleSetting( linkValue, nextValue );

		/*
		 * A link rel can only be one of three combinations:
		 * - only nofollow
		 * - both nofollow and sponsored
		 * - neither nofollow or sponsored
		 * On first toggle there is no linkValue. We need to compare with what it should be instead of what it is.
		 */
		if ( isLinkNoFollow( nextValue ) ) {
			nextValue.noFollow = true;
		}
		if ( isSponsored( nextValue ) ) {
			nextValue.sponsored = false;
		}

		if ( didToggleSettingForNewLink( nextValue ) ) {
			/* If link will be assigned, the state value can be considered flushed. Otherwise, persist the pending changes. */
			setNextLinkValue( nextValue );
			return;
		}

		const newUrl = prependHTTP( nextValue.url );

		const format = createLinkFormat( {
			url: newUrl,
			type: nextValue.type,
			id: validateLinkId( nextValue.id ),
			opensInNewWindow: nextValue.opensInNewTab,
			noFollow: nextValue.noFollow,
			sponsored: nextValue.sponsored,
		} );

		if ( shouldInsertLink() ) {
			const newText = getNewText( nextValue, newUrl );
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

		actionCompleteMessage( newUrl );
	};

	const NoFollowHelpLink = <HelpLink
		href={ window.wpseoAdminL10n[ "shortlinks.nofollow_sponsored" ] }
		className="dashicons"
	>
		<span className="screen-reader-text">
			{
				/* translators: Hidden accessibility text. */
				__( "Learn more about marking a link as nofollow or sponsored.", "wordpress-seo" )
			}
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
			anchor={ anchor }
			focusOnMount={ addingLink ? "firstElement" : false }
			onClose={ stopAddingLink }
			position="bottom center"
			placement="bottom"
			shift={ true }
		>
			<LinkControl
				value={ linkValue }
				// eslint-disable-next-line react/jsx-no-bind
				onChange={ onChangeLink }
				forceIsEditingLink={ addingLink }
				settings={ settings }
			/>
		</Popover>
	);
}

InlineLinkUI.propTypes = {
	isActive: PropTypes.bool,
	activeAttributes: PropTypes.object,
	addingLink: PropTypes.bool,
	value: PropTypes.object,
	onChange: PropTypes.func,
	speak: PropTypes.func.isRequired,
	stopAddingLink: PropTypes.func.isRequired,
	contentRef: PropTypes.object,
};

export default withSpokenMessages( InlineLinkUI );
