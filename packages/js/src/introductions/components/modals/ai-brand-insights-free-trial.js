import { useSelect } from "@wordpress/data";
import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { Button, Modal as UiModal, useSvgAria, useModalContext } from "@yoast/ui-library";
import { STORE_NAME_INTRODUCTIONS } from "../../constants";
import { Modal } from "../modal";

/**
 * @param {Object} thumbnail The thumbnail: img props.
 * @param {string} buttonLink The button link.
 * @returns {JSX.Element} The element.
 */
const AiBrandInsightsFreeTrialContent = ( {
	thumbnail,
	buttonLink,
} ) => {
	const { onClose, initialFocus } = useModalContext();
	const svgAriaProps = useSvgAria();

	return (
		<>
			<div className="yst-px-10 yst-pt-10 yst-introduction-gradient yst-text-center">
				<img
					className="yst-w-full yst-h-auto yst-rounded-md yst-drop-shadow-md"
					alt={ __( "Web chart showing aspects of brand visibility in AI responses", "wordpress-seo" ) }
					loading="lazy"
					decoding="async"
					{ ...thumbnail }
				/>
				<div className="yst-mt-6 yst-text-xs yst-font-medium yst-flex yst-flex-col yst-items-center">
					<span className="yst-introduction-modal-uppercase yst-flex yst-gap-2 yst-items-center">
						<span className="yst-ai-insights-icon" { ...svgAriaProps } />
						{ "Yoast AI Brand Insights" }
					</span>
				</div>
			</div>
			<div className="yst-px-10 yst-pb-4 yst-flex yst-flex-col yst-items-center">
				<div className="yst-mt-4 yst-mx-1.5 yst-text-center">
					<UiModal.Title as="h3" className="yst-text-slate-900 yst-text-lg yst-font-medium">
						{
							__( "Your first brand analysis is free!", "wordpress-seo" )
						}
					</UiModal.Title>
					<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
						<p>
							{ createInterpolateElement(
								__(
									"As a Yoast customer, you can run your first brand analysis for <strong>free</strong>. See how your brand shows up in AI responses.",
									"wordpress-seo"
								),
								{
									strong: <strong className="yst-font-semibold" />,
								}
							) }
						</p>
					</div>
				</div>
				<div className="yst-w-full yst-flex yst-mt-6">
					<Button
						as="a"
						className="yst-grow"
						size="extra-large"
						variant="ai-primary"
						href={ buttonLink }
						target="_blank"
						rel="noopener noreferrer"
						ref={ initialFocus }
					>
						{ __( "Start your free trial", "wordpress-seo" ) }
						<ExternalLinkIcon className="yst--me-1 yst-ms-1 yst-h-5 yst-w-5" { ...svgAriaProps } />
						<span className="yst-sr-only">
							{
								/* translators: Hidden accessibility text. */
								__( "(Opens in a new browser tab)", "wordpress-seo" )
							}
						</span>
					</Button>
				</div>
				<Button
					className="yst-mt-2"
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
export const AiBrandInsightsFreeTrial = () => {
	const imageLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectImageLink( "ai-brand-insights-pre-launch.png" ), [] );
	const buttonLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS )
		.selectLink( "https://yoa.st/aibi-introduction-free-trial" ), [] );
	const thumbnail = useMemo( () => ( {
		src: imageLink,
		width: "432",
		height: "243",
	} ), [ imageLink ] );

	return (
		<Modal>
			<AiBrandInsightsFreeTrialContent
				buttonLink={ buttonLink }
				thumbnail={ thumbnail }
			/>
		</Modal>
	);
};
