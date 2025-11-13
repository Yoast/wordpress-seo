import { Button, Modal, useSvgAria, Title } from "@yoast/ui-library";
import { __, _x } from "@wordpress/i18n";
import { YoastIcon, HowIcon } from "../../icons";
import { ClockIcon, QuestionMarkCircleIcon } from "@heroicons/react/outline";
import { CallToActionButton } from "./call-to-action-button";
import { priorities } from "../priorities";

/**
 * The type of callToAction prop.
 *
 * @typedef {Object} CallToAction
 * @property {string} label The label for the call to action button.
 * @property {string} type The variant of the call to action button, can be 'link', 'create', 'delete'.
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
 * @param {string}   how           Details on how to complete the task.
 * @param {string}   taskId        The ID of the task associated with the modal.
 * @param {boolean}  isCompleted   Whether the task is completed.
 *
 * @returns {JSX.Element} The TaskModal component.
 */
export const TaskModal = ( { isOpen, onClose, callToAction, title, duration, priority, why, how, taskId, isCompleted } ) => {
	const svgAriaProps = useSvgAria();

	return <Modal isOpen={ isOpen } onClose={ onClose } position="center">
		<Modal.Panel className="yst-p-0">
			<Modal.Container>
				<Modal.Container.Header className="yst-p-6 yst-flex yst-gap-3 yst-border-b yst-border-slate-200 yst-items-start">
					<YoastIcon className="yst-w-4 yst-fill-primary-500 yst-pt-0.5" />
					<div>
						<Modal.Title as="h3" className="yst-mb-2 yst-text-lg">
							{ title }
						</Modal.Title>
						<div className="yst-flex yst-gap-1">
							<span className="yst-text-xs yst-text-slate-600 yst-flex yst-gap-0.5">
								<ClockIcon className="yst-w-4 yst-text-slate-400" />
								{ duration }
								{
									/* translators: This is a unit abbreviation for minutes. */
									_x( "m", "Abbreviation for minutes", "wordpress-seo" )
								}
							</span> · <span className="yst-text-xs yst-text-slate-600 yst-flex yst-gap-1">
								{ priorities[ priority ].icon }
								{ priorities[ priority ].label }</span>
						</div>
					</div>
				</Modal.Container.Header>
				<Modal.Container.Content className="yst-py-2 yst-px-12">
					<ul>
						<li className="yst-flex yst-flex-col  yst-py-4 yst-items-start last:yst-border-b-0 yst-border-b yst--border-slate-200">
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
						<li className="yst-flex yst-flex-col  yst-py-4 yst-items-start">
							<div className="yst-flex yst-gap-1 yst-items-center yst-mb-1">
								<HowIcon
									{ ...svgAriaProps }
									className="yst-w-4 yst-text-slate-400 yst-flex-shrink-0"
								/>
								<Title as="h4" className="yst-text-sm yst-font-medium yst-text-slate-800">
									{ __( "Why this matters", "wordpress-seo" ) }
								</Title>
							</div>
							<p className="yst-text-xs yst-text-slate-600">{ how }</p>
						</li>
					</ul>
				</Modal.Container.Content>
				<Modal.Container.Footer className="yst-flex yst-justify-end yst-gap-2 yst-p-6 yst-border-t yst-border-slate-200">
					<Button variant="secondary" onClick={ onClose }>
						{ __( "Close", "wordpress-seo" ) }
					</Button>
					<CallToActionButton { ...callToAction } taskId={ taskId } disabled={ isCompleted } />
				</Modal.Container.Footer>
			</Modal.Container>
		</Modal.Panel>
	</Modal>;
};
