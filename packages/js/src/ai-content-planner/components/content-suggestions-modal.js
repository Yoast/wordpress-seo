import { Badge, Modal, SkeletonLoader, useSvgAria } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { ReactComponent as Yoast } from "../../../images/yoast.svg";
import { UsageCounter } from "@yoast/ai-frontend";
import { BookOpenIcon, StarIcon, MapIcon } from "@heroicons/react/outline";
import { noop } from "lodash";
import classNames from "classnames";
import { Fragment, useRef, useEffect } from "@wordpress/element";
import { Transition } from "@headlessui/react";

const intentBadge = {
	informational: {
		classes: "yst-bg-blue-200 yst-text-blue-900",
		Icon: BookOpenIcon,
		label: __( "Informational", "wordpress-seo" ),
	},
	navigational: {
		classes: "yst-bg-violet-200 yst-text-violet-900",
		Icon: MapIcon,
		label: __( "Navigational", "wordpress-seo" ),
	},
	commercial: {
		classes: "yst-bg-yellow-200 yst-text-yellow-900",
		Icon: StarIcon,
		label: __( "Commercial", "wordpress-seo" ),
	},
};

/**
 * Suggestion button component.
 *
 * @param {object} props The component props.
 * @param {string} props.intent The intent of the suggestion.
 * @param {string} props.title The title of the suggestion.
 * @param {string} props.description The description of the suggestion.
 * @param {Function} props.onClick The function to call when the suggestion button is clicked.
 *
 * @returns {JSX.Element} The SuggestionButton component.
 */
const SuggestionButton = ( { intent, title, description, onClick } ) => {
	const svgAriaProps = useSvgAria();
	const Icon = intentBadge[ intent ] ? intentBadge[ intent ].Icon : BookOpenIcon;
	return (
		<button type="button" onClick={ onClick } className="yst-text-start yst-w-full yst-rounded-md yst-border yst-border-slate-200 yst-mb-4 yst-p-4 yst-shadow-sm focus:yst-outline focus:yst-outline-2 focus:yst-outline-offset-2 focus:yst-outline-primary-500">
			{ intentBadge[ intent ] ? (
				<Badge className={ classNames( "yst-flex yst-items-center yst-gap-1 yst-w-fit yst-mb-2 yst-text-xs", intentBadge[ intent ].classes ) }>
					<Icon className={ classNames( "yst-w-3 ", intentBadge[ intent ].classes ) } { ...svgAriaProps } /> { intentBadge[ intent ].label }
				</Badge>
			) : (
				<Badge>{ intent }</Badge>
			) }
			<div className="yst-font-medium yst-text-sm yst-mb-2 yst-text-slate-800">{ title }</div>
			<p className="yst-text-slate-600">{ description }</p>
		</button>
	);
};

/**
 * Loading skeleton for the SuggestionButton component.
 *
 * @returns {JSX.Element} The SuggestionButtonSkeleton component.
 */
const SuggestionButtonSkeleton = () => (
	<div className="yst-w-full yst-rounded-md yst-border yst-border-slate-200 yst-mb-4 yst-p-4 yst-shadow-sm">
		<div className="yst-px-2 yst-py-1 yst-bg-white yst-inline-flex yst-gap-1 yst-items-center yst-justify-start yst-mb-2 yst-rounded-3xl yst-border yst-border-slate-300">
			<SkeletonLoader className="yst-w-2 yst-h-2 yst-rounded-full" />
			<SkeletonLoader className="yst-w-20 yst-h-3 yst-rounded" />
		</div>
		<SkeletonLoader className="yst-w-64 yst-h-[18px] yst-rounded yst-mb-3" />
		<SkeletonLoader className="yst-w-full yst-h-[13px] yst-rounded yst-mb-2" />
		<SkeletonLoader className="yst-w-2/3 yst-h-[13px] yst-rounded" />
	</div>
);

/**
 * The loading content for the ContentSuggestionsModal.
 *
 * @returns {JSX.Element} The loading content for the ContentSuggestionsModal.
 */
const LoadingModalContent = () => {
	const svgAriaProps = useSvgAria();
	return (
		<>
			<div className="yst-flex yst-flex-col yst-items-center yst-pb-8">
				<Yoast className="yst-w-24 yst-text-primary-300 yst-mb-2" { ...svgAriaProps } />
				<Modal.Description className="yst-italic yst-text-slate-500">
					<span className="yst-sr-only"> Yoast </span>
					{ __( "Analyzing your site content…", "wordpress-seo" ) }</Modal.Description>
			</div>
			<div className="yst-relative">
				{ [ ...Array( 5 ) ].map( ( _, index ) => <SuggestionButtonSkeleton key={ index } /> ) }
				{ /* gradient overlay to create a fade effect at the bottom of the modal content */ }
				<div
					className="yst-absolute yst-inset-0 yst-bg-gradient-to-t yst-from-white yst-to-transparent yst-transition-opacity"
					aria-hidden="true"
				/>
			</div>
		</>
	);
};

/**
 * @typedef {Object} Suggestion
 * @property {string} intent The intent of the suggestion (e.g. "informational", "navigational", "commercial").
 * @property {string} title The title of the suggestion.
 * @property {string} description The description of the suggestion.
 */

/**
 * ContentSuggestionsModal component.
 *
 * @param {Object} props The component props.
 * @param {boolean} props.isOpen Whether the modal is open or not.
 * @param {boolean} props.isPremium Whether the user has a premium add-on is activated or not.
 *
 * @returns {JSX.Element} The ContentSuggestionsModal component.
 */
export const ContentSuggestionsModal = ( { status, isPremium } ) => {
	const svgAriaProps = useSvgAria();
	const closeButtonRef = useRef( null );

	useEffect( () => {
		if ( status === "content-suggestions-loading" ) {
			closeButtonRef.current?.focus();
		}
	}, [ status ] );
	const suggestions = [
		{
			intent: "informational",
			title: "How to train your dog",
			description: "Tips and tricks on how to train your dog effectively.",
		},
		{
			intent: "navigational",
			title: "Best dog training schools in New York",
			description: "A list of the best dog training schools in New York.",
		},
		{
			intent: "commercial",
			title: "Top 10 dog training tools",
			description: "A review of the top 10 dog training tools on the market.",
		},
		{
			intent: "informational",
			title: "How to groom your dog",
			description: "Step-by-step guide on how to groom your dog at home.",
		},
		{
			intent: "navigational",
			title: "Dog parks in Los Angeles",
			description: "Find the best dog parks in Los Angeles for your furry friend.",
		},
		{
			intent: "commercial",
			title: "Best dog food brands",
			description: "An overview of the best dog food brands for a healthy diet.",
		},
	];

	return (
		<Modal.Panel
			className="yst-p-0 yst-max-w-2xl"
			hasCloseButton={ false }
		>
			<Modal.CloseButton ref={ closeButtonRef } screenReaderText={ __( "Close content suggestions modal", "wordpress-seo" ) } />
			<Modal.Container>
				<Modal.Container.Header className="yst-flex yst-items-center yst-gap-2 yst-pe-12 yst-py-6 yst-ps-6 yst-border-b yst-border-slate-200">
					<YoastIcon className="yst-fill-primary-500 yst-w-4" { ...svgAriaProps } />
					<Modal.Title size="2" className="yst-flex-grow">{ __( "Content suggestions", "wordpress-seo" ) }</Modal.Title>
					<Badge size="small"> { __( "Beta", "wordpress-seo" ) }</Badge>
					<UsageCounter
						limit={ 10 }
						requests={ 1 }
						mentionBetaInTooltip={ isPremium }
						mentionResetInTooltip={ isPremium }
					/>
				</Modal.Container.Header>
				<Modal.Container.Content className="yst-overflow-y-auto yst-p-6 yst-m-0">
					{ /* yst-relative enables absolute positioning of the leaving element to prevent layout stacking during cross-fade. */ }
					<div className="yst-relative" aria-live="polite" aria-atomic="true">
						<Transition
							as={ Fragment }
							show={ status === "content-suggestions-loading" }
							enter="yst-transition-opacity yst-duration-300"
							enterFrom="yst-opacity-0"
							enterTo="yst-opacity-100"
							leave="yst-transition-opacity yst-duration-300 yst-absolute yst-top-0 yst-left-0 yst-right-0"
							leaveFrom="yst-opacity-100"
							leaveTo="yst-opacity-0"
						>
							<div><LoadingModalContent /></div>
						</Transition>
						<Transition
							as={ Fragment }
							show={ status === "content-suggestions-success" }
							enter="yst-transition-opacity yst-duration-300 yst-delay-300"
							enterFrom="yst-opacity-0"
							enterTo="yst-opacity-100"
							leave="yst-transition-opacity yst-duration-300"
							leaveFrom="yst-opacity-100"
							leaveTo="yst-opacity-0"
						>
							<div>
								<Modal.Description className="yst-mb-4">{ __( "Select a suggestion to generate a structured outline for your post.", "wordpress-seo" ) }</Modal.Description>
								{ suggestions.map( ( suggestion, index ) => (
									<SuggestionButton
										key={ index }
										{ ...suggestion }
										onClick={ noop }
									/>
								) ) }
							</div>
						</Transition>
					</div>
				</Modal.Container.Content>
			</Modal.Container>
		</Modal.Panel>
	);
};
