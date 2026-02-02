import { TasksProgressBar } from "../../../src/task-list/components/tasks-progressbar";
import documentation from "./documentation.md";

export default {
	title: "Task List/Tasks Progress bar",
	component: TasksProgressBar,
	parameters: {
		docs: {
			description: {
				component: documentation,
			},
		},
	},
	argTypes: {
		completedTasks: {
			description: "Number of completed tasks.",
			control: "number",
		},
		totalTasks: {
			description: "Total number of tasks.",
			control: "number",
		},
		isLoading: {
			description: "Whether the tasks are loading.",
			control: "boolean",
		},
		className: {
			description: "Additional class names for the wrapper.",
			control: "text",
		},
	},
	args: {
		completedTasks: 3,
		totalTasks: 10,
		isLoading: false,
		className: "yst-max-w-screen-sm",
	},
};

export const Factory = {
	render: ( args ) => <TasksProgressBar { ...args } />,
};

export const LoadingState = {
	render: ( args ) => <TasksProgressBar { ...args } />,
	args: {
		isLoading: true,
		className: "yst-max-w-screen-sm",
	},
};

export const ErrorState = {
	render: ( args ) => <TasksProgressBar { ...args } />,
	args: {
		completedTasks: null,
		totalTasks: null,
		isLoading: false,
		className: "yst-max-w-screen-sm",
	},
};

