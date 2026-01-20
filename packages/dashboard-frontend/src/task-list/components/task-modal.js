import { Alert, Button, Modal, useSvgAria, Title } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { YoastIcon, HowIcon } from "../../icons";
import { QuestionMarkCircleIcon } from "@heroicons/react/outline";
import { CallToActionButton } from "./call-to-action-button";
import { Priority } from "./priority";
import { Duration } from "./duration";
import { CompleteStatus } from "./complete-status";

/**
 * The type of callToAction prop.
 *
 * @typedef {Object} CallToAction
 * @property {string} label The label for the call-to-action button.
 * @property {string} type The variant of the call-to-action button: it can be 'link', 'add', 'delete' or 'default'.
 * @property {string} [href] The URL to navigate to (for 'link' variant).
 * @property {Function} [onClick] The onClick handler for the button.
 * @property {boolean} [disabled] Whether the button is disabled.
 * @property {boolean} [isLoading] Whether the button is in a loading state.
 */

/**
 * A modal component to display task details.
 *
 * @param {boolean}  isOpen        Whether the modal is open.
 * @param {Function} onClose       Function to call when closing the modal.
 * @param {CallToAction}   callToAction  Call to action button details.
 * @param {string}   title         Title of the modal.
 * @param {number}   duration      Estimated duration to complete the task.
 * @param {string}   priority      Priority of the task: 'low', 'medium', 'high'.
 * @param {string}   why           Details on why the task is important.
 * @param {string}   [how]         Details on how to complete the task.
 * @param {string}   taskId        The ID of the task associated with the modal.
 * @param {boolean}  isCompleted   Whether the task is completed.
 * @param {boolean}	 isLoading	Whether the modal content is loading.
 * @param {boolean}  [isError=false]   Whether there was an error loading the task.
 * @param {string}   [errorMessage=""]  Error message to display in the modal.
 *
 * @returns {JSX.Element} The TaskModal component.
 */
export const TaskModal = ( {
	isOpen,
	onClose,
	callToAction,
	title,
	duration,
	priority,
	why,
	how,
	taskId,
	isCompleted,
	isLoading = false,
	isError = false,
	errorMessage,
} ) => {
	const svgAriaProps = useSvgAria();

	return <Modal isOpen={ isOpen } onClose={ onClose } position="center">
		<Modal.Panel className="yst-p-0">
			<Modal.Container>
				<Modal.Container.Header className="yst-p-6 yst-flex yst-gap-3 yst-border-b yst-border-slate-200 yst-items-start">
					<YoastIcon className="yst-w-4 yst-fill-primary-500 yst-pt-1 lg:yst-pt-0.5" { ...svgAriaProps } />
					<div>
						<Modal.Title as="h3" className={ `yst-mb-2 yst-text-lg yst-max-w-lg ${isCompleted ? "yst-text-slate-500" : ""}` }>
							{ title }
						</Modal.Title>
						<div className="yst-flex yst-gap-1">
							{ isCompleted && <>
								<CompleteStatus />
								·
							</> }
							<Duration minutes={ duration } />
							· <Priority level={ priority } />
						</div>
					</div>
				</Modal.Container.Header>
				<Modal.Container.Content className="yst-py-2 yst-px-12">
					{ isError && <Alert
						role="alert"
						variant="error"
						className="yst-mt-4 yst-mb-2"
					>
						<p className="yst-font-medium yst-mb-2">{ __( "Oops! Something went wrong.", "wordpress-seo" ) }</p>

						<p>
							{ errorMessage ? errorMessage : __( "Please try again.", "wordpress-seo" ) }
							{ " " }
							{ __( "If the issue continues, our support team is here to help!", "wordpress-seo" ) }</p>
					</Alert> }
					<ul>
						<li className="yst-flex yst-flex-col yst-py-4 yst-items-start last:yst-border-b-0 yst-border-b yst-border-slate-200">
							<div className="yst-flex yst-gap-1 yst-items-center yst-mb-1">
								<QuestionMarkCircleIcon
									{ ...svgAriaProps }
									className="yst-w-4 yst-text-slate-400 yst-flex-shrink-0"
								/>
								<Title as="h4" className="yst-text-sm yst-font-medium yst-text-slate-800">
									{ __( "Why this matters", "wordpress-seo" ) }
								</Title>
							</div>
							<p className="yst-text-xs yst-text-slate-600">{ why }</p>
						</li>
						{ how && <li className="yst-flex yst-flex-col yst-py-4 yst-items-start">
							<div className="yst-flex yst-gap-1 yst-items-center yst-mb-1">
								<HowIcon
									{ ...svgAriaProps }
									className="yst-w-4 yst-text-slate-400 yst-flex-shrink-0"
								/>
								<Title as="h4" className="yst-text-sm yst-font-medium yst-text-slate-800">
									{ __( "How to solve", "wordpress-seo" ) }
								</Title>
							</div>
							<p className="yst-text-xs yst-text-slate-600">{ how }</p>
						</li> }
					</ul>
				</Modal.Container.Content>
				<Modal.Container.Footer className="yst-flex yst-justify-end yst-gap-2 yst-p-6 yst-border-t yst-border-slate-200">
					<Button variant="secondary" onClick={ onClose }>
						{ __( "Close", "wordpress-seo" ) }
					</Button>
					<CallToActionButton { ...callToAction } taskId={ taskId } disabled={ isCompleted } isLoading={ isLoading } />
				</Modal.Container.Footer>
			</Modal.Container>
		</Modal.Panel>
	</Modal>;
};
