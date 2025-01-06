import { ArrowSmRightIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";
import { Card, Link, Title } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 * A card to be used in the additional resources fieldset.
 * @param {string} imageSrc The card header' image src.
 * @param {string} title The title text.
 * @param {string} description The description text.
 * @param {string} linkHref The link href.
 * @param {string} linkText The link text.
 * @returns {JSX.Element} The element.
 */
export const ResourceCard = ( { imageSrc, title, description, linkHref, linkText } ) => (
	<Card>
		<Card.Header className="yst-h-auto yst-p-0">
			<img
				className="yst-w-full yst-transition yst-duration-200"
				src={ imageSrc }
				alt=""
				width={ 500 }
				height={ 250 }
				loading="lazy"
				decoding="async"
			/>
		</Card.Header>
		<Card.Content className="yst-flex yst-flex-col yst-gap-3">
			<Title as="h3">{ title }</Title>
			{ description }
		</Card.Content>
		<Link
			href={ linkHref }
			className="yst-flex yst-items-center yst-mt-[18px] yst-no-underline yst-font-medium yst-text-primary-500"
			target="_blank"
		>
			{ linkText }
			<span className="yst-sr-only">
				{
					/* translators: Hidden accessibility text. */
					__( "(Opens in a new browser tab)", "wordpress-seo" )
				}
			</span>
			<ArrowSmRightIcon className="yst-h-4 yst-w-4 yst-ms-1 yst-icon-rtl" />
		</Link>
	</Card>
);

ResourceCard.propTypes = {
	imageSrc: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	linkHref: PropTypes.string.isRequired,
	linkText: PropTypes.string.isRequired,
};
