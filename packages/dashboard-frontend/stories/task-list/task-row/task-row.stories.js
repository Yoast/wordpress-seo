import { TaskRow } from "../../../src/task-list/components/task-row";
import { Table } from "@yoast/ui-library";
import { noop } from "lodash";
import documentation from "./documentation.md";

export default {
	title: "Task List/Task Row",
	component: TaskRow,
	parameters: {
		docs: {
			description: {
				component: documentation,
			},
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-bg-white">
				<Table>
					<Table.Head>
						<Table.Row>
							<Table.Header>Task</Table.Header>
							<Table.Header>Est. duration</Table.Header>
							<Table.Header>Priority</Table.Header>
						</Table.Row>
					</Table.Head>
					<Table.Body>
						<Story />
					</Table.Body>
				</Table>
			</div>
		),
	],
};

export const Factory = {
	render: ( args ) => (
		<>
			<TaskRow
				{ ...args }
			/>
			<TaskRow
				taskId="task-2"
				title="Completed Task"
				duration={ 5 }
				priority="low"
				isCompleted={ true }
			/>
			<TaskRow
				taskId="task-3"
				title="Completed Task with Premium Badge"
				duration={ 5 }
				priority="high"
				isCompleted={ true }
				badge="premium"
			/>
			<TaskRow
				taskId="task-4"
				title="Uncompleted Task with Woo Badge"
				duration={ 10 }
				priority="medium"
				isCompleted={ false }
				badge="woo"
			/>
			<TaskRow
				taskId="task-5"
				title="Uncompleted Task with AI Badge"
				duration={ 20 }
				priority="high"
				isCompleted={ false }
				badge="ai"
			/>
		</>
	),
	argTypes: {
		onClick: {
			description: "Function to call when the row is clicked.",
			control: false,
		},
		title: {
			description: "Title of the task.",
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
			description: "Whether the task is completed.",
		},
		badge: {
			description: "An optional badge to display next to the task title. Can be `premium`, `woo`, `ai`.",
			control: {
				type: "select",
			},
			options: [ "", "premium", "woo", "ai" ],
			type: { name: "string" },
		},
		children: {
			description: "Optional children elements for the task modal.",
		},
	},
	args: {
		title: "Uncompleted Task",
		duration: 15,
		priority: "high",
		taskId: "task-1",
		isCompleted: false,
		onClick: noop,
	},

};

export const TaskRowLoading = {
	component: TaskRow.Loading,
	render: ( args ) => <TaskRow.Loading { ...args } />,
	args: {
		titleClassName: "yst-w-96",
	},
	argTypes: {
		titleClassName: {
			description: "Class name for the title skeleton element.",
			control: {
				type: "select",
			},
			options: [ "yst-w-8", "yst-w-12", "yst-w-20", "yst-w-36", "yst-w-40", "yst-w-60", "yst-w-72", "yst-w-80", "yst-w-96" ],
		},
	},
};
