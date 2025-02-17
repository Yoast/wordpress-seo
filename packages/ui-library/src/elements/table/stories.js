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
				<Table.Head className="yst-bg-amber-200">
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
	},
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ TableHead, TableRow, TableHeader, TableBody, TableCell, MinimalVariant ] } />,
		},
	},
};
