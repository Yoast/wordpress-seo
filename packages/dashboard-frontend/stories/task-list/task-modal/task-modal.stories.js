import { TaskModal } from "../../../src/task-list/components/task-modal";
import { ChildTasks } from "../../../src/task-list/components/child-tasks";
import { TaskListProvider } from "../../../src/task-list/task-list-context";
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
		about: {
			description: "HTML string describing the task. Can contain HTML tags like <strong> and <p>.",
			control: "text",
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
		about: "<p>Skipping setup limits how much Yoast SEO can help you. </p><p><strong>Pro tip:</strong> Completing it makes sure the core settings are working in your favor.</p>",
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

const Template = ( args ) => {
	const [ isOpen, toggle ] = useToggleState( false );

	return <TaskListProvider locale="en-US">
		Click on the button to open the task modal
		<br /><br />
		<Button onClick={ toggle }>Task button</Button>
		<TaskModal
			{ ...args }
			isOpen={ isOpen }
			onClose={ toggle }
		/>
	</TaskListProvider>;
};

export const Factory = {
	render: ( args ) => <Template { ...args } />,
};

export const CompletedTask = {
	render: ( args ) => <Template { ...args } />,
	args: {
		isCompleted: true,
	},
};

export const ErrorState = {
	render: ( args ) => <Template { ...args } />,
	args: {
		isError: true,
		errorMessage: "Failed to load task details.",
	},
};

export const WithChildTasks = {
	render: ( args ) => <Template { ...args }>
		<ChildTasks tasks={ args.childTasks } />
	</Template>,
	args: {
		childTasks: [
			{ title: "Set up site type", duration: 5, priority: "medium", isCompleted: true, taskId: "child-task-1" },
			{ title: "Configure audience", duration: 7, priority: "high", isCompleted: false, taskId: "child-task-2" },
			{ title: "Define content focus", duration: 3, priority: "low", isCompleted: false, taskId: "child-task-3" },
			{ title: "Review settings", duration: 4, priority: "medium", isCompleted: false, taskId: "child-task-4" },
			{ title: "Finalize configuration", duration: 6, priority: "high", isCompleted: false, taskId: "child-task-5" },
			{ title: "Complete tutorial", duration: 8, priority: "low", isCompleted: false, taskId: "child-task-6" },
			{ title: "Optimize homepage", duration: 10, priority: "high", isCompleted: false, taskId: "child-task-7" },
			{ title: "Set up blog", duration: 12, priority: "medium", isCompleted: false, taskId: "child-task-8" },
		],
		callToAction: {},
		totalTasks: 3,
		completedTasks: 1,
	},
};

export const ChildTask = {
	render: ( args ) => <Template { ...args } />,
	args: {
		parentTaskTitle: "Complete the First-time configuration",
		totalTasks: 5,
		completedTasks: 2,
	},
};
