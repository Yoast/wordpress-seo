import classnames from "classnames";
import PropTypes from "prop-types";
import {
	ExternalLink,
	IconButton,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { safeDecodeURI, filterURLForDisplay } from "@wordpress/url";

/**
 * The link viewer url.
 *
 * @param {string} url       The url.
 * @param {string} urlLabel  The url content.
 * @param {string} className Custom class name for the link.
 *
 * @returns {wp.Element} The url.
 */
function LinkViewerUrl( { url, urlLabel, className } ) {
	const linkClassName = classnames(
		className,
		"block-editor-url-popover__link-viewer-url"
	);

	if ( ! url ) {
		return <span className={ linkClassName } />;
	}

	return (
		<ExternalLink
			className={ linkClassName }
			href={ url }
		>
			{ urlLabel || filterURLForDisplay( safeDecodeURI( url ) ) }
		</ExternalLink>
	);
}

LinkViewerUrl.propTypes = {
	url: PropTypes.string,
	urlLabel: PropTypes.string,
	className: PropTypes.string,
};

LinkViewerUrl.defaultProps = {
	url: "",
	urlLabel: "",
	className: "",
};

/**
 * Renders the link viewer.
 *
 * @param {string}   className       Custom class name for the container.
 * @param {string}   linkClassName   Custom class name for the link.
 * @param {function} onEditLinkClick Callback function when clicking the edit button.
 * @param {string}   url             The url.
 * @param {string}   urlLabel        The url content.
 * @param {object}   props           The props.
 *
 * @returns {wp.Element} The linkViewer.
 */
export default function LinkViewer( {
	className,
	linkClassName,
	onEditLinkClick,
	url,
	urlLabel,
	...props
} ) {
	return (
		<div
			className={ classnames(
				"block-editor-url-popover__link-viewer",
				className
			) }
			{ ...props }
		>
			<LinkViewerUrl url={ url } urlLabel={ urlLabel } className={ linkClassName } />
			{ onEditLinkClick && <IconButton icon="edit" label={ __( "Edit", "wordpress-seo" ) } onClick={ onEditLinkClick } /> }
		</div>
	);
}

LinkViewer.propTypes = {
	onEditLinkClick: PropTypes.func,
	className: PropTypes.string,
	linkClassName: PropTypes.string,
	url: PropTypes.string,
	urlLabel: PropTypes.string,
};

LinkViewer.defaultProps = {
	onEditLinkClick: null,
	className: "",
	linkClassName: "",
	url: "",
	urlLabel: "",
};
