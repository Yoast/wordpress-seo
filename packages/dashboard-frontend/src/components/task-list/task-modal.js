import { Button, Modal, useSvgAria, Title } from "@yoast/ui-library";
import { __, _x } from "@wordpress/i18n";
import YoastIcon from "../../icons/YoastIcon.js";
import { ClockIcon, ChevronDoubleUpIcon, ChevronDoubleDownIcon, MenuAlt4Icon } from "@heroicons/react/outline";

/**
 * TaskDetails type definition.
 *
 * @typedef {Object} TaskDetails
 * @property {React.Component} Icon       Icon component to display.
 * @property {string}          title      Title of the detail.
 * @property {string}          description Description of the detail.
 */

/**
 * A modal component to display task details.
 *
 * @param {boolean}  isOpen        Whether the modal is open.
 * @param {Function} onClose       Function to call when closing the modal.
 * @param {Object}   callToAction  Call to action button details.
 * @param {string}   title         Title of the modal.
 * @param {number}   duration      Estimated duration to complete the task.
 * @param {string}   priority      Priority of the task: 'low', 'medium', 'high'.
 * @param {TaskDetails[]}    detailsList   List of details to display in the modal.
 *
 * @returns {JSX.Element} The TaskModal component.
 */
export const TaskModal = ( { isOpen, onClose, callToAction, title, duration, priority, detailsList } ) => {
	const svgAriaProps = useSvgAria();
	const priorities = {
		low: {
			label: __( "Low", "wordpress-seo" ),
			icon: <ChevronDoubleDownIcon className="yst-w-4 yst-text-slate-400" />,
		},
		medium: {
			label: __( "Medium", "wordpress-seo" ),
			icon: <MenuAlt4Icon className="yst-w-4 yst-text-amber-500" />,
		},
		high: {
			label: __( "High", "wordpress-seo" ),
			icon: <ChevronDoubleUpIcon className="yst-w-4 yst-text-red-600" />,
		},
	};
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
						{ detailsList.map( ( detail, index ) => (
							<li key={ index } className="yst-flex yst-flex-col  yst-py-4 yst-items-start last:yst-border-b-0 yst-border-b yst--border-slate-200">
								<div className="yst-flex yst-gap-1 yst-items-center yst-mb-1">
									{ detail.Icon && <detail.Icon
										{ ...svgAriaProps }
										className="yst-w-4 yst-text-slate-400 yst-flex-shrink-0"
									/> }
									<Title as="h4" className="yst-text-sm yst-font-medium yst-text-slate-800">{ detail.title }</Title>

								</div>
								<p className="yst-text-xs yst-text-slate-600">{ detail.description }</p>
							</li>
						) ) }
					</ul>
				</Modal.Container.Content>
				<Modal.Container.Footer className="yst-flex yst-justify-end yst-gap-2 yst-p-6 yst-border-t yst-border-slate-200">
					<Button variant="secondary" onClick={ onClose }>
						{ __( "Close", "wordpress-seo" ) }
					</Button>
					<Button variant="primary" { ...callToAction }>
						{ callToAction.children }
					</Button>
				</Modal.Container.Footer>
			</Modal.Container>
		</Modal.Panel>
	</Modal>;
};
