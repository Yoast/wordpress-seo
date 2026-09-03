import React, { useState, useCallback } from "react";
import Table from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component, tableBody, tableCell, tableHead, tableHeader, tableImageCell, tableRow, minimal, tableCheckbox } from "./docs";

// A stand-in thumbnail, so the story does not depend on a remote image.
const sampleImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 100'%3E%3Crect width='160' height='100' fill='%23e2e8f0'/%3E%3Ccircle cx='124' cy='28' r='14' fill='%23fbbf24'/%3E%3Cpath d='M0 100 L52 40 L104 100 Z' fill='%2394a3b8'/%3E%3Cpath d='M78 100 L118 58 L160 100 Z' fill='%23cbd5e1'/%3E%3C/svg%3E";

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

export const CheckboxTable = {
	name: "Table with checkboxes",
	parameters: {
		controls: { disable: true },
		docs: { description: { story: tableCheckbox } },
	},
	args: {
		children: (
			<>
				<Table.Head>
					<Table.Row>
						<Table.CheckboxHeader />
						<Table.Header>Header 1</Table.Header>
						<Table.Header>Header 2</Table.Header>
						<Table.Header>Header 3</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.Row>
						<Table.CheckboxCell />
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.CheckboxCell />
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

export const TableImageCell = {
	name: "Table image cell",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: tableImageCell } },
	},
	args: {
		children: (
			<>
				<Table.Head>
					<Table.Row>
						<Table.Header>Image</Table.Header>
						<Table.Header>Header 2</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.Row>
						<Table.ImageCell src={ sampleImage } alt="" />
						<Table.Cell>With an image</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.ImageCell />
						<Table.Cell>Without an image, so a placeholder is shown</Table.Cell>
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
					TableImageCell,
					MinimalVariant,
				] }
			/>,
		},
	},
};
