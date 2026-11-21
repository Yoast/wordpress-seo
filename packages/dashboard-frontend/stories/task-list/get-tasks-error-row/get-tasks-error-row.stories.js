import { GetTasksErrorRow } from "../../../src/task-list/components/get-tasks-error-row";
import { Table } from "@yoast/ui-library";
import documentation from "./documentation.md";

export default {
	title: "Task List/Get Tasks Error Row",
	component: GetTasksErrorRow,
	parameters: {
		docs: {
			description: {
				component: documentation,
			},
		},
	},
	argTypes: {
		message: {
			description: "Error message to display in the console.",
			control: "text",
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
	render: ( args ) => <GetTasksErrorRow { ...args } />,
};
