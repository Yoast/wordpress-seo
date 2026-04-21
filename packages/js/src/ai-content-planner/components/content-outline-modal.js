import { Badge, Link, Modal, useSvgAria } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { UsageCounter } from "@yoast/ai-frontend";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { useRef, useEffect } from "@wordpress/element";
import { ContentOutlineModalContent } from "./content-outline-modal-content";

/**
 * @typedef {import( "../constants" ).Suggestion} Suggestion
 */

/**
 * Content Outline Modal panel component.
 * Renders inside a parent Modal (managed by FeatureModal).
 *
 * @param {string}             status              The loading status of the content outline suggestion.
 * @param {boolean}            isPremium           Whether the user has a premium subscription (used for usage counter tooltip messaging).
 * @param {Function}           onBackToSuggestions The function to call to go back to content suggestions.
 * @param {Function}           onApplyOutline      The function to call to add the outline to the post.
 * @param {Suggestion}         suggestion          The content outline suggestion to display.
 * @param {number}             sparksLimit         Optional. If provided, show the UsageCounter.
 * @param {number}             sparksUsage         Optional. Current sparks usage count.
 * @param {boolean}            isActive            Whether this panel is currently visible (used for focus management).
 * @param {Object|null}        error               The error object if the content outline failed to load, or null if there is no error.
 * @param {string}             modalHelpLink       The URL for the AI help link in the modal header.
 *
 * @returns {JSX.Element} The ContentOutlineModal component.
 */
export const ContentOutlineModal = ( {
	status,
	isPremium,
	onBackToSuggestions,
	onApplyOutline,
	suggestion,
	sparksLimit,
	sparksUsage,
	isActive,
	error,
	modalHelpLink,
} ) => {
	const svgAriaProps = useSvgAria();
	const closeButtonRef = useRef( null );

	// Focus the close button when the panel becomes active so screen readers announce the dialog context.
	useEffect( () => {
		if ( isActive ) {
			closeButtonRef.current?.focus();
		}
	}, [ isActive ] );

	return (
		<Modal.Panel className="yst-p-0 yst-max-w-2xl" hasCloseButton={ false }>
			<Modal.CloseButton ref={ closeButtonRef } screenReaderText={ __( "Close content outline", "wordpress-seo" ) } />
			<Modal.Container>
				<Modal.Container.Header className="yst-flex yst-items-center yst-gap-2 yst-pe-12 yst-py-6 yst-ps-6 yst-border-b yst-border-slate-200">
					<YoastIcon className="yst-fill-primary-500 yst-w-4" { ...svgAriaProps } />
					<Modal.Title size="2"> { __( "Content outline", "wordpress-seo" ) } </Modal.Title>
					<Link
						href={ modalHelpLink }
						variant="primary"
						className="yst-no-underline"
						target="_blank"
						rel="noopener noreferrer"
						aria-label={ __( "Learn more about AI (Opens in a new browser tab)", "wordpress-seo" ) }
					>
						<QuestionMarkCircleIcon { ...svgAriaProps } className="yst-w-4 yst-h-4 yst-text-slate-500 yst-shrink-0" />
					</Link>
					<Badge size="small">{ __( "Beta", "wordpress-seo" ) }</Badge>
					<span className="yst-flex-grow" />
					{ ! error && sparksLimit && (
						<UsageCounter
							limit={ sparksLimit }
							requests={ sparksUsage }
							mentionBetaInTooltip={ isPremium }
							mentionResetInTooltip={ isPremium }
						/>
					) }
				</Modal.Container.Header>
				<ContentOutlineModalContent
					status={ status }
					error={ error }
					suggestion={ suggestion }
					onBackToSuggestions={ onBackToSuggestions }
					onApplyOutline={ onApplyOutline }
				/>
			</Modal.Container>
		</Modal.Panel>
	);
};
