import { TasksProgressBadge } from "../../../src/task-list/components/tasks-progress-badge";
import documentation from "./documentation.md";

export default {
	title: "Task List/Tasks Progress badge",
	component: TasksProgressBadge,
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
		label: {
			description: "Optional label.",
		},
	},
	args: {
		completedTasks: 3,
		totalTasks: 10,
		label: "Set social appearance templates",
	},
};

export const Factory = {
	render: ( args ) => <TasksProgressBadge { ...args } />,
};
