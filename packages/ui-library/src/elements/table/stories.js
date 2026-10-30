import { useArgs } from "@storybook/preview-api";
import React, { useCallback } from "react";
import Table from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { component, tableBody, tableCell, tableHead, tableHeader, tableImageCell, tableRow, minimal, tableCheckbox, tablePagination } from "./docs";

const STORY_PAGE_SIZE = 5;
const STORY_TOTAL = 25;

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
						<Table.CheckboxHeader
							checkboxProps={ {
								id: "story-select-all",
								name: "story-select-all",
								value: "all",
								"aria-label": "Select all rows",
								indeterminate: true,
							} }
						/>
						<Table.Header>Header 1</Table.Header>
						<Table.Header>Header 2</Table.Header>
						<Table.Header>Header 3</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.Row>
						<Table.CheckboxCell
							checkboxProps={ {
								id: "story-select-row-1",
								name: "story-select-row-1",
								value: "1",
								"aria-label": "Select row 1",
								defaultChecked: true,
							} }
						/>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.CheckboxCell
							checkboxProps={ {
								id: "story-select-row-2",
								name: "story-select-row-2",
								value: "2",
								"aria-label": "Select row 2",
							} }
						/>
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
						<Table.CheckboxHeader
							checkboxProps={ {
								id: "story-select-all",
								name: "story-select-all",
								value: "all",
								"aria-label": "Select all rows",
								indeterminate: true,
							} }
						/>
						<Table.Header>Header 1</Table.Header>
						<Table.Header>Header 2</Table.Header>
						<Table.Header>Header 3</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.Row>
						<Table.CheckboxCell
							checkboxProps={ {
								id: "story-select-row-1",
								name: "story-select-row-1",
								value: "1",
								"aria-label": "Select row 1",
								defaultChecked: true,
							} }
						/>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.CheckboxCell
							checkboxProps={ {
								id: "story-select-row-2",
								name: "story-select-row-2",
								value: "2",
								"aria-label": "Select row 2",
								defaultChecked: true,
							} }
						/>
						<Table.Cell>Cell 1</Table.Cell>
						<Table.Cell>Cell 2</Table.Cell>
						<Table.Cell>Cell 3</Table.Cell>
					</Table.Row>
				</Table.Body>
			</>
		),
	},
};

export const TablePaginationStory = {
	name: "Table pagination",
	parameters: {
		controls: { disable: false },
		docs: { description: { story: tablePagination } },
	},
	render: ( args ) => {
		const [ storyArgs, updateArgs ] = useArgs();
		const handleNavigate = useCallback( ( targetPage ) => updateArgs( { page: targetPage } ), [ updateArgs ] );

		const { page, totalPages } = storyArgs;
		const from = ( page - 1 ) * STORY_PAGE_SIZE + 1;
		const to = Math.min( page * STORY_PAGE_SIZE, STORY_TOTAL );

		return (
			<Table>
				<Table.Head>
					<Table.Row>
						<Table.Header>Name</Table.Header>
						<Table.Header>Status</Table.Header>
						<Table.Header>Count</Table.Header>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					{ [ ...Array( STORY_PAGE_SIZE ) ].map( ( _, i ) => (
						<Table.Row key={ i }>
							<Table.Cell>Item { from + i }</Table.Cell>
							<Table.Cell>Active</Table.Cell>
							<Table.Cell>{ from + i }</Table.Cell>
						</Table.Row>
					) ) }
				</Table.Body>
				<Table.Pagination
					colSpan={ 3 }
					page={ page }
					totalPages={ totalPages }
					onNavigate={ handleNavigate }
					summary={ <>Showing <strong>{ from }</strong> to <strong>{ to }</strong> of <strong>{ STORY_TOTAL }</strong> results</> }
					screenReaderTextPrevious="Previous page"
					screenReaderTextNext="Next page"
					{ ...args }
				/>
			</Table>
		);
	},
	args: {
		page: 1,
		totalPages: 5,
	},
	argTypes: {
		page: { control: { type: "number", min: 1 } },
		totalPages: { control: { type: "number", min: 2 } },
		children: { table: { disable: true } },
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
						<Table.ImageCell cellProps={ { className: "yst-w-24" } } imageProps={ { src: sampleImage, alt: "" } } />
						<Table.Cell>With an image</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.ImageCell cellProps={ { className: "yst-w-24" } } />
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
					TablePaginationStory,
				] }
			/>,
		},
	},
};
