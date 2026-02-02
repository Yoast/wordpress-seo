
import { Alert, Button, Modal, Title } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { useMemo } from "@wordpress/element";
import DOMPurify from "dompurify";
import { CallToActionButton } from "./call-to-action-button";
import { Priority } from "./priority";
import { Duration } from "./duration";
import { TasksProgressBadge } from "./tasks-progress-badge";
import { ChildTasks } from "./child-tasks";
import { TaskStatusIcon } from "../../icons";

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
 * @param {string}   about           Details on why the task is important.
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
	about,
	taskId,
	isCompleted,
	isLoading = false,
	isError = false,
	errorMessage,
	totalTasks,
	completedTasks,
	parentTaskTitle,
	childTasks,
} ) => {
	// Sanitize the about content to prevent XSS attacks
	const sanitizedAbout = useMemo( () => DOMPurify.sanitize( about ), [ about ] );

	return <Modal isOpen={ isOpen } onClose={ onClose } position="center">
		<Modal.Panel className="yst-p-0">
			<Modal.Container>
				<Modal.Container.Header className="yst-p-6 yst-flex yst-gap-3 yst-border-b yst-border-slate-200 yst-items-start">
					<TaskStatusIcon isCompleted={ isCompleted } />
					<div>
						<Modal.Title as="h3" className={ `yst-mb-2 yst-text-lg yst-max-w-lg ${isCompleted ? "yst-text-slate-500" : ""}` }>
							{ title }
						</Modal.Title>
						<div className="yst-flex yst-gap-1 yst-items-center">
							{ totalTasks && <>
								<TasksProgressBadge completedTasks={ completedTasks } totalTasks={ totalTasks } label={ parentTaskTitle } />
								·
							</> }
							<Priority level={ priority } isCompleted={ isCompleted } />
							· <Duration minutes={ duration } isCompleted={ isCompleted } />
						</div>
					</div>
				</Modal.Container.Header>
				<Modal.Container.Content className="yst-py-6 yst-px-12">
					{ isError && <Alert
						role="alert"
						variant="error"
						className="yst-mb-3"
					>
						<p className="yst-font-medium yst-mb-2">{ __( "Oops! Something went wrong.", "wordpress-seo" ) }</p>

						<p>
							{ errorMessage ? errorMessage : __( "Please try again.", "wordpress-seo" ) }
							{ " " }
							{ __( "If the issue continues, our support team is here to help!", "wordpress-seo" ) }</p>
					</Alert> }

					<Title size="small" className="yst-mb-1">
						{ __( "About this task", "wordpress-seo" ) }
					</Title>
					<div dangerouslySetInnerHTML={ { __html: sanitizedAbout } } />
					{ childTasks && childTasks.length > 0 && <ChildTasks tasks={ childTasks } onClick={ callToAction.onClick } /> }
				</Modal.Container.Content>
				<Modal.Container.Footer className="yst-flex yst-justify-end yst-gap-2 yst-p-6 yst-border-t yst-border-slate-200">
					<Button variant="secondary" onClick={ onClose }>
						{ __( "Close", "wordpress-seo" ) }
					</Button>
					{ ! childTasks && <CallToActionButton { ...callToAction } taskId={ taskId } disabled={ isCompleted } isLoading={ isLoading } /> }
				</Modal.Container.Footer>
			</Modal.Container>
		</Modal.Panel>
	</Modal>;
};
