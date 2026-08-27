import React from "react";
import Table from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component, tableBody, tableCell, tableHead, tableHeader, tableRow, minimal } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: (
			<>
				<Table.Head>
					<Table.Row>
						<Table.Header>Header 1</Table.Header>
						<Table.Header>Header 2</Table.Header>
						<Table.Header>Header 3</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.Row>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
				</Table.Body>
			</>
		),
	},
};

export const TableHead = {
	name: "Table head",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: tableHead } },
	},
	args: {
		children: (
			<>
				<Table.Head>
					<Table.Row className="[&>*]:yst-bg-amber-200">
						<Table.Header>Header 1</Table.Header>
						<Table.Header>Header 2</Table.Header>
						<Table.Header>Header 3</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.Row>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
				</Table.Body>
			</>
		),
	},
};

export const TableRow = {
	name: "Table row",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: tableRow } },
	},
	args: {
		children: (
			<>
				<Table.Head>
					<Table.Row>
						<Table.Header>Header 1</Table.Header>
						<Table.Header>Header 2</Table.Header>
						<Table.Header>Header 3</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.Row className="yst-bg-amber-200">
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
				</Table.Body>
			</>
		),
	},
};

export const TableRowStriped = {
	name: "Table row striped",
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: (
			<>
				<Table.Head>
					<Table.Row>
						<Table.Header>Header 1</Table.Header>
						<Table.Header>Header 2</Table.Header>
						<Table.Header>Header 3</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.Row variant="striped">
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
					<Table.Row variant="striped">
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
					<Table.Row variant="striped">
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
				</Table.Body>
			</>
		),
	},
};

export const TableHeader = {
	name: "Table header",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: tableHeader } },
	},
	args: {
		children: (
			<>
				<Table.Head>
					<Table.Row>
						<Table.Header className="yst-bg-amber-200">Header 1</Table.Header>
						<Table.Header>Header 2</Table.Header>
						<Table.Header>Header 3</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.Row>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
				</Table.Body>
			</>
		),
	},
};

export const TableBody = {
	name: "Table body",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: tableBody } },
	},
	args: {
		children: (
			<>
				<Table.Head>
					<Table.Row>
						<Table.Header>Header 1</Table.Header>
						<Table.Header>Header 2</Table.Header>
						<Table.Header>Header 3</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body className="yst-bg-amber-200">
					<Table.Row>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
				</Table.Body>
			</>
		),
	},
};

export const TableCell = {
	name: "Table cell",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: tableCell } },
	},
	args: {
		children: (
			<>
				<Table.Head>
					<Table.Row>
						<Table.Header>Header 1</Table.Header>
						<Table.Header>Header 2</Table.Header>
						<Table.Header>Header 3</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.Row>
						<Table.Cell className="yst-bg-amber-200">Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
				</Table.Body>
			</>
		),
	},
};

const ROWS = [
	{ id: "1", label: "Row one" },
	{ id: "2", label: "Row two" },
	{ id: "3", label: "Row three" },
];

const CheckboxTableDemo = () => (
	<Table.CheckboxProvider allValues={ ROWS.map( ( r ) => r.id ) }>
		<Table>
			<Table.Head>
				<Table.Row>
					<Table.CheckboxHeader id="story-select-all" name="story-select-all" aria-label="Select all" scope="col" />
					<Table.Header scope="col">Label</Table.Header>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				{ ROWS.map( ( row ) => (
					<Table.Row key={ row.id }>
						<Table.CheckboxCell
							id={ `story-select-${ row.id }` }
							name={ `story-select-${ row.id }` }
							value={ row.id }
							aria-label={ `Select ${ row.label }` }
						/>
						<Table.Cell>{ row.label }</Table.Cell>
					</Table.Row>
				) ) }
			</Table.Body>
		</Table>
	</Table.CheckboxProvider>
);

export const CheckboxTable = {
	name: "Table with checkboxes",
	parameters: {
		controls: { disable: true },
	},
	render: () => <CheckboxTableDemo />,
};

export const MinimalVariant = {
	name: "Table variant minimal",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: minimal } },
	},
	args: {
		variant: "minimal",
		children: (
			<>
				<Table.Head>
					<Table.Row>
						<Table.Header>Header 1</Table.Header>
						<Table.Header>Header 2</Table.Header>
						<Table.Header>Header 3</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.Row>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
				</Table.Body>
			</>
		),
	},
};

export default {
	title: "1) Elements/Table",
	component: Table,
	argTypes: {
		children: { control: false },
		variant: {
			control: { type: "select" },
		},
	},
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage
				stories={ [
					TableHead,
					TableRow,
					TableRowStriped,
					TableHeader,
					TableBody,
					TableCell,
					CheckboxTable,
					MinimalVariant,
				] }
			/>,
		},
	},
};
