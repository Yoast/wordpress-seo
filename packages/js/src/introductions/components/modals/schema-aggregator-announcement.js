import { ArrowNarrowRightIcon } from "@heroicons/react/solid";
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, useModalContext } from "@yoast/ui-library";
import { safeCreateInterpolateElement } from "../../../helpers/i18n";
import { STORE_NAME_INTRODUCTIONS } from "../../constants";
import { Modal } from "../modal";


/**
 * @returns {JSX.Element} The element.
 */

const SchemaAggregatorAnnouncementContent = ( {
	thumbnail,
	buttonLink,
	description,
} ) => {
	const { onClose, initialFocus } = useModalContext();

	return (
		<>
			<div className="yst-px-10 yst-pt-10 yst-introduction-gradient yst-text-center">
				<img
					className="yst-w-full yst-h-auto yst-rounded-md yst-shadow-md"
					alt="Thumbnail for Yoast SEO Google Docs Add-On"
					loading="lazy"
					decoding="async"
					{ ...thumbnail }
				/>
				<div className="yst-mt-6 yst-text-xs yst-font-medium yst-flex yst-flex-col yst-items-center">
					<span className="yst-introduction-modal-uppercase yst-flex yst-gap-2 yst-items-center">
						<span className="yst-logo-icon" />
						Yoast SEO
					</span>
				</div>
			</div>
			<div className="yst-px-10 yst-pb-4 yst-flex yst-flex-col yst-items-center">
				<div className="yst-mt-4 yst-mx-1.5 yst-text-center">
					<h3 className="yst-text-slate-900 yst-text-lg yst-font-medium">
						{
							__( "New: Prepare your site for AI powered discovery! ✨", "wordpress-seo" )
						}
					</h3>
					<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
						<p>{ description }</p>
					</div>
				</div>
				<div className="yst-w-full yst-flex yst-mt-6">
					<Button
						as="a"
						className="yst-grow"
						size="extra-large"
						variant="primary"
						href={ buttonLink }
						target="_blank"
						ref={ initialFocus }
					>
						{ __( "Enable Schema aggregation endpoint", "wordpress-seo" ) }
						<span className="yst-sr-only">
							{
							/* translators: Hidden accessibility text. */
								__( "(Opens in a new browser tab)", "wordpress-seo" )
							}
						</span>
					</Button>
				</div>
				<Button
					as="a"
					className="yst-mt-4"
					variant="tertiary"
					onClick={ onClose }
				>
					{ __( "Close", "wordpress-seo" ) }
				</Button>
			</div>
		</>
	);
};

/**
 * @returns {JSX.Element} The element.
 */
export const SchemaAggregatorAnnouncement = () => {
	const imageLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectImageLink( "schema-aggregator-thumbnail.png" ), [] );
	const buttonLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectLink( "?page=wpseo_page_settings#/site-features#card-wpseo-enable_schema_aggregation_endpoint" ), [] );
	const learnMoreLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectLink( "https://yoa.st/schema-aggregation-activation/" ), [] );

	const thumbnail = useMemo( () => ( {
		src: imageLink,
		width: "432",
		height: "243",
	} ), [ imageLink ] );

	const LearnMoreButton = 		() =>				<Button
		as="a"
		href={ learnMoreLink }
		variant="tertiary"
		className="yst-p-0 yst-no-underline yst-font-medium yst-inline-flex yst-items-center yst-gap-1"
		target="_blank"
		rel="noopener"
	>
		{ __( "Learn more", "wordpress-seo" ) }
		<ArrowNarrowRightIcon className="yst-w-3 yst-h-3 yst-flex-shrink-0 rtl:yst-rotate-180" />
		<span className="yst-sr-only">
			{
				/* translators: Hidden accessibility text. */
				__( "(Opens in a new browser tab)", "wordpress-seo" )
			}
		</span>
	</Button>;

	const description = useMemo( () => safeCreateInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening anchor tag; %2$s expands to the arrow icon   ; %3$s expands to a closing anchor tag.
			 */
			__( "Enable the Schema aggregation endpoint to make your Schema readable by AI systems. %1$s", "wordpress-seo" ),
			"<LearnMoreButton />"
		),
		{
			LearnMoreButton: <LearnMoreButton />,
		}
	), [] );

	return (
		<Modal>
			<SchemaAggregatorAnnouncementContent
				buttonLink={ buttonLink }
				thumbnail={ thumbnail }
				description={ description }
			/>
		</Modal>
	);
};
