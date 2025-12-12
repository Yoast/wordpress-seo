import { TaskModal } from "../../../src/task-list/components/task-modal";
import { Button, useToggleState } from "@yoast/ui-library";
import { noop } from "lodash";
import documentation from "./documentation.md";

export default {
	title: "Task List/Task Modal",
	component: TaskModal,
	parameters: {
		docs: {
			description: {
				component: documentation,
			},
		},
	},
	argTypes: {
		isOpen: {
			description: "Whether the modal is open.",
			control: false,
		},
		onClose: {
			description: "Function to call when closing the modal.",
			control: false,
			type: { name: "function" },
		},
		callToAction: {
			description: "An object containing the CTA button type (add/delete/link/default), label, href, disabled, isLoading and a callback function that takes the taskId as an argument.",
		},
		title: {
			description: "Title of the modal.",
			control: "text",
		},
		duration: {
			description: "Estimated duration to complete the task.",
			control: "number",
		},
		priority: {
			description: "Priority of the task: 'low', 'medium', 'high'.",
			control: {
				type: "select",
			},
			options: [ "low", "medium", "high" ],
		},
		isCompleted: {
			description: "Whether the task is completed. If true, the call to action button will be disabled.",
		},
		errorMessage: {
			description: "Error message to display in the modal.",
			control: "text",
		},
		isError: {
			description: "Whether there was an error loading the task.",
			control: "boolean",
		},
	},
	args: {
		isOpen: false,
		title: "Complete the First-time configuration",
		duration: 15,
		priority: "high",
		why: "Helping us understand your site will enable us to provide better SEO suggestions tailored to your needs.",
		how: "Answer a few questions about your website's type, audience, and content focus to set up the plugin effectively.",
		callToAction: {
			label: "Start configuration",
			href: null,
			type: "link",
			onClick: noop,
		},
		taskId: "task-1",
		isCompleted: false,
		isLoading: false,
		errorMessage: "",
		isError: false,
	},
};

export const Factory = {
	render: ( args ) => {
		const [ isOpen, toggle ] = useToggleState( false );

		return <>
			Click on the button to open the task modal
			<br /><br />
			<Button onClick={ toggle }>Task button</Button>
			<TaskModal
				{ ...args }
				isOpen={ isOpen }
				onClose={ toggle }
			/>
		</>;
	},
};

export const CompletedTask = {
	render: ( args ) => {
		const [ isOpen, toggle ] = useToggleState( false );

		return <>
			Click on the button to open the completed task modal
			<br /><br />
			<Button onClick={ toggle }>Task button</Button>
			<TaskModal
				{ ...args }
				isOpen={ isOpen }
				onClose={ toggle }
				isCompleted={ true }
			/>
		</>;
	},
};

export const ErrorState = {
	render: ( args ) => {
		const [ isOpen, toggle ] = useToggleState( false );

		return <>
			Click on the button to open the task modal in error state
			<br /><br />
			<Button onClick={ toggle }>Task button</Button>
			<TaskModal
				{ ...args }
				isOpen={ isOpen }
				onClose={ toggle }
				isError={ true }
				errorMessage="Failed to load task details."
			/>
		</>;
	},
};
