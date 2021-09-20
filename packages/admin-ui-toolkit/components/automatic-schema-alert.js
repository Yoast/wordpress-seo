import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { Alert } from "./index";

/**
 * An alert to notify the user what the schema types will be.
 *
 * @param {Object} props The props.
 * @param {Object} props.defaultSettings The default schema settings.
 * @param {string} props.contentTypeLabel The content type label.
 * @param {string} props.contentTypeSchemaInfoLink The info link.
 *
 * @returns {JSX.Element} The automatic schema type alert.
 */
export default function AutomaticSchemaAlert( { defaultSettings, contentTypeLabel, contentTypeSchemaInfoLink } ) {
	const defaultString = useMemo(
		() => [ defaultSettings?.pageType, defaultSettings?.articleType ].filter( Boolean ).join( ", " ),
		[ defaultSettings?.pageType, defaultSettings?.articleType ],
	);

	const alertText = useMemo( () => createInterpolateElement(
		sprintf(
			/*
			 translators: %1$s is replaced by the content type label (plural), %2$s is an <em> opening tag,
			 %3$s is/are the schema type(s) e.g. WebPage, Article and %4$s is an <em> closing tag.
			 */
			__( "For %1$s we automatically output %2$s%3$s%4$s Schema.", "admin-ui" ),
			contentTypeLabel,
			"<em>",
			defaultString,
			"</em>",
		),
		{ em: <em /> },
	), [ contentTypeLabel, defaultString ] );

	const alertLink = useMemo( () => createInterpolateElement(
		sprintf(
			// translators: %1$s is replaced by an opening anchor tag. %2$s is replaced by a closing anchor tag.
			__( "%1$sLearn more about our Schema output for content types.%2$s", "admin-ui" ),
			"<a>",
			"</a>",
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ contentTypeSchemaInfoLink } target="_blank" rel="noopener noreferrer" className="yst-font-medium" />,
		},
	), [ contentTypeSchemaInfoLink ] );

	return <Alert type="info" className="yst-mb-8">
		<p>
			{ alertText }
			{ contentTypeSchemaInfoLink && <>
				&nbsp;
				{ alertLink }
			</> }
		</p>
	</Alert>;
}

AutomaticSchemaAlert.propTypes = {
	defaultSettings: PropTypes.object.isRequired,
	contentTypeLabel: PropTypes.string.isRequired,
	contentTypeSchemaInfoLink: PropTypes.string.isRequired,
};
