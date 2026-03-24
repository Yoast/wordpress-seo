import { Badge, Modal, Title, SkeletonLoader } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { ReactComponent as Yoast } from "../../../images/yoast.svg";
import { UsageCounter } from "@yoast/ai-frontend";
import { BookOpenIcon, StarIcon, MapIcon } from "@heroicons/react/outline";
import { noop } from "lodash";
import classNames from "classnames";

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
	const Icon = intentBadge[ intent ] ? intentBadge[ intent ].Icon : BookOpenIcon;
	return (
		<button type="button" onClick={ onClick } className="yst-text-start yst-w-full yst-rounded-md yst-border yst-border-slate-200 yst-mb-4 yst-p-4 yst-shadow-sm">
			{ intentBadge[ intent ] ? (
				<Badge className={ classNames( "yst-flex yst-items-center yst-gap-1 yst-w-fit yst-mb-2 yst-text-xs", intentBadge[ intent ].classes ) }>
					<Icon className={ classNames( "yst-w-3 ", intentBadge[ intent ].classes ) } /> { intentBadge[ intent ].label }
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
const LoadingModalContent = () => (
	<>
		<div className="yst-flex yst-flex-col yst-items-center yst-pb-8">
			<Yoast className="yst-w-24 yst-text-primary-300 yst-mb-2" />
			<div className="yst-italic yst-text-slate-500">{ __( "Analyzing your site content…", "wordpress-seo" ) }</div>
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
 * @param {Function} props.onClose The function to call when the modal should be closed.
 * @param {boolean} props.isLoading Whether the content suggestions are being generated.
 * @param {boolean} props.isPremium Whether the user has a premium add-on is activated or not.
 * @param {Suggestion[]} props.suggestions The content suggestions to display in the modal.
 *
 * @returns {JSX.Element} The ContentSuggestionsModal component.
 */
export const ContentSuggestionsModal = ( { isOpen, onClose, isLoading, suggestions, isPremium } ) => {
	return (
		<Modal
			isOpen={ isOpen }
			onClose={ onClose }
		>
			<Modal.Panel className="yst-p-0 yst-max-w-2xl">
				<Modal.Container>
					<Modal.Container.Header className="yst-flex yst-items-center yst-gap-2 yst-pe-12 yst-py-6 yst-ps-6 yst-border-b yst-border-slate-200">
						<YoastIcon className="yst-fill-primary-500 yst-w-4" />
						<Title size="2" className="yst-flex-grow">{ __( "Content suggestions", "wordpress-seo" ) } </Title>
						<Badge size="small"> { __( "Beta", "wordpress-seo" ) } </Badge>
						<UsageCounter
							limit={ 10 }
							requests={ 1 }
							mentionBetaInTooltip={ isPremium }
							mentionResetInTooltip={ isPremium }
						/>
					</Modal.Container.Header>
					<Modal.Container.Content className="yst-overflow-y-auto yst-p-6 yst-m-0">
						{ isLoading ? (
							<LoadingModalContent />
						) : (
							<>
								<p className="yst-mb-4">{ __( "Select a suggestion to generate a structured outline for your post.", "wordpress-seo" ) }</p>
								{ suggestions.map( ( suggestion, index ) => (
									<SuggestionButton
										key={ index }
										{ ...suggestion }
										onClick={ noop }
									/>
								) ) }
							</> ) }
					</Modal.Container.Content>
				</Modal.Container>
			</Modal.Panel>
		</Modal>
	);
};
