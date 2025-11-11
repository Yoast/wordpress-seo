import { TaskModal } from "../../../src/components/task-list/task-modal";
import { Button, useToggleState } from "@yoast/ui-library";
import { QuestionMarkCircleIcon } from "@heroicons/react/outline";
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
		},
		callToAction: {
			description: "An object containing the button props and content for the call to action button.",
			control: false,
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
		detailsList: {
			description: "List of details to display in the modal.",
			control: false,
		},
	},
	args: {
		isOpen: false,
		title: "Complete the First-time configuration",
		duration: 15,
		priority: "high",
		detailsList: [
			{ Icon: QuestionMarkCircleIcon, title: "Why this matters", description: "Helping us understand your site will enable us to provide better SEO suggestions tailored to your needs." },
			{ Icon: QuestionMarkCircleIcon, title: "Set your site goals", description: "Defining clear goals for your site will help us provide more targeted recommendations." },
			{ Icon: QuestionMarkCircleIcon, title: "Specify your site type", description: "Letting us know the type of site you have will improve the relevance of our suggestions." },
		],
		callToAction: {
			content: "Start configuration",
			props: {
				onClick: noop,
			},
		},
		onClose: noop,
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
