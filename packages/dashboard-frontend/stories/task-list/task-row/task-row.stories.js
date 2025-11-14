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
		badge: {
			description: "An optional badge to display next to the task title. Can be `premium`, `woo`, `ai`.",
			control: {
				type: "select",
			},
			options: [ "", "premium", "woo", "ai" ],
		},
	},
	args: {
		title: "Complete the First-time configuration",
		duration: 15,
		priority: "high",
		badge: "premium",
		taskId: "task-1",
		isCompleted: false,
		onClick: noop,
	},
};

export const Factory = {
	render: ( args ) => ( <Table>
		<Table.Head>
			<Table.Row>
				<Table.Header>Task</Table.Header>
				<Table.Header>Est. duration</Table.Header>
				<Table.Header>Priority</Table.Header>
				<Table.Header />
			</Table.Row>
		</Table.Head>
		<Table.Body>
			<TaskRow
				{ ...args }
			/>
		</Table.Body>
	</Table>
	),

};
