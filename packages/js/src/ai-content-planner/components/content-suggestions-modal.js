import { Badge, Modal, useSvgAria, Notifications } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { UsageCounter } from "@yoast/ai-frontend";
import { noop } from "lodash";
import { useRef, useEffect } from "@wordpress/element";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { SparksLimitNotification } from "../../ai-generator/components/sparks-limit-notification";
import { SuggestionsModalContent } from "./suggestions-modal-content";

/**
 * @typedef {import( "../constants" ).Suggestion} Suggestion
 */

/**
 * ContentSuggestionsModal component.
 *
 * @param {Object} props The component props.
 * @param {string} props.status The current status of the modal ("content-suggestions-loading" or "content-suggestions-success").
 * @param {boolean} props.isPremium Whether the user has a premium add-on activated or not.
 * @param {Function} props.onSuggestionClick The function to call when a suggestion is clicked.
 * @param {Suggestion[]} props.suggestions The list of content suggestions to display.
 * @param {boolean} props.skipTransitions Whether to skip transition animations.
 * @param {number} props.usageCount The number of times the user has used the content suggestions feature.
 * @param {number} props.usageCountLimit The maximum number of times the user can use the content suggestions feature before hitting a limit.
 *
 * @returns {JSX.Element} The ContentSuggestionsModal component.
 */
export const ContentSuggestionsModal = ( {
	status,
	isPremium,
	onSuggestionClick = noop,
	suggestions,
	skipTransitions = false,
	usageCount,
	usageCountLimit,
} ) => {
	const svgAriaProps = useSvgAria();
	const closeButtonRef = useRef( null );

	useEffect( () => {
		closeButtonRef.current?.focus();
	}, [ status ] );

	return (
		<>
			<Modal.Panel
				className="yst-p-0 yst-max-w-2xl"
				hasCloseButton={ false }
			>
				<Modal.CloseButton ref={ closeButtonRef } screenReaderText={ __( "Close content suggestions modal", "wordpress-seo" ) } />
				<Modal.Container>
					<Modal.Container.Header className="yst-flex yst-items-center yst-gap-2 yst-pe-12 yst-py-6 yst-ps-6 yst-border-b yst-border-slate-200">
						<YoastIcon className="yst-fill-primary-500 yst-w-4" { ...svgAriaProps } />
						<Modal.Title size="2" className="yst-flex-grow">{ __( "Content suggestions", "wordpress-seo" ) }</Modal.Title>
						<Badge size="small">{ __( "Beta", "wordpress-seo" ) }</Badge>
						<UsageCounter
							limit={ usageCountLimit }
							requests={ usageCount }
							mentionBetaInTooltip={ isPremium }
							mentionResetInTooltip={ isPremium }
						/>
					</Modal.Container.Header>
					<Modal.Container.Content className="yst-overflow-y-auto yst-p-6 yst-m-0">
						<SuggestionsModalContent
							status={ status }
							suggestions={ suggestions }
							onSuggestionClick={ onSuggestionClick }
							skipTransitions={ skipTransitions }
						/>
					</Modal.Container.Content>
				</Modal.Container>
			</Modal.Panel>
			<Notifications
				className={
				// Margin tricks to break out of the container. Transition to prevent sudden location jumps when loading new suggestions.
					"yst-mx-[calc(50%-50vw)] yst-transition-all"
				}
				position="bottom-left"
			>
				{ status !== ASYNC_ACTION_STATUS.loading && (
					<SparksLimitNotification className="yst-mx-[calc(50%-50vw)] yst-transition-all" />
				) }
			</Notifications>
		</>
	);
};
