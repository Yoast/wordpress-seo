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
		isLoading: {
			description: "Whether the task is loading.",
		},
	},
	args: {
		title: "Uncompleted Task",
		duration: 15,
		priority: "high",
		taskId: "task-1",
		isCompleted: false,
		onClick: noop,
		isLoading: false,
	},
};

export const Factory = {
	render: ( args ) => ( <Table>
		<Table.Head>
			<Table.Row>
				<Table.Header>Task</Table.Header>
				<Table.Header>Est. duration</Table.Header>
				<Table.Header>Priority</Table.Header>
				<Table.Header>{ "" }</Table.Header>
			</Table.Row>
		</Table.Head>
		<Table.Body>
			<TaskRow
				{ ...args }
			/>
			<TaskRow
				{ ...args }
				isCompleted={ true }
				title="Completed Task"
				priority="low"
			/>
			<TaskRow
				{ ...args }
				title="Woo SEO Task"
				badge="woo"
				priority="medium"
			/>
			<TaskRow
				{ ...args }
				title="AI+ Task"
				badge="ai"
			/>
			<TaskRow
				{ ...args }
				title="Premium Task"
				badge="premium"
			/>
		</Table.Body>
	</Table>
	),

};

export const TaskRowLoading = {
	render: () => ( <Table>
		<Table.Head>
			<Table.Row>
				<Table.Header>Task</Table.Header>
				<Table.Header>Est. duration</Table.Header>
				<Table.Header>Priority</Table.Header>
				<Table.Header>{ "" }</Table.Header>
			</Table.Row>
		</Table.Head>
		<Table.Body>
			<TaskRow
				title="Loading Task with long title..."
				isLoading={ true }
			/>
		</Table.Body>
	</Table>
	),

};
