import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Link, Paper, Title } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 * @param {string} link The link.
 * @returns {JSX.Element} The element.
 */
export const AcademyUpsellCard = ( { link } ) => {
	const academy = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %1$s expands to "Yoast SEO" academy, which is a clickable link. */
			__( "Want to learn SEO from Team Yoast? Check out our %1$s!", "wordpress-seo" ),
			"<link/>"
		),
		{
			// eslint-disable-next-line react/jsx-no-target-blank
			link: <a href={ link } target="_blank" rel="noopener">Yoast SEO academy</a>,
		}
	), [] );

	return (
		<Paper as="div" className="yst-p-6 yst-space-y-3">
			<Title as="h2" size="4" className="yst-text-base yst-text-primary-500">{ __( "Learn SEO", "wordpress-seo" ) }</Title>
			<p>
				{ academy }
				<br />
				{ __( "We have both free and premium online courses to learn everything you need to know about SEO.", "wordpress-seo" ) }
			</p>
			<Link href={ link } className="yst-block" target="_blank" rel="noopener">
				{ sprintf(
					/* translators: %1$s expands to "Yoast SEO academy". */
					__( "Check out %1$s", "wordpress-seo" ),
					"Yoast SEO academy"
				) }
			</Link>
		</Paper>
	);
};

AcademyUpsellCard.propTypes = {
	link: PropTypes.string.isRequired,
};
