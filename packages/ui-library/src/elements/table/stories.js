import Table from ".";

export default {
	title: "1) Elements/Table",
	component: Table,
	argTypes: {
		children: { control: false },
	},
	parameters: {
		docs: {
			description: {
				component: "A simple Table element. It contains sub components that allows you to construct a table. Has `Table.Head` and `Table.Body` as children",
			},
		},
	},
};

const Template = ( { children } ) => {
	return (
		<Table>
			{ children }
		</Table>
	);
};

export const Factory = Template.bind( {} );

Factory.parameters = {
	controls: { disable: false },
};

Factory.args = {
	children:
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

	</>,
};

export const TableHead = Template.bind( {} );
TableHead.storyName = "Table head";

TableHead.parameters = {
	controls: { disable: false },
	docs: { description: { story: "The sub component `Table.Head`. Has `Table.Row` as `children`, and `Table.Row` has `Table.Header` as children." } },
};

TableHead.args = {
	children:
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

	</>,
};

export const TableRow = Template.bind( {} );
TableRow.storyName = "Table row";

TableRow.parameters = {
	controls: { disable: false },
	docs: { description: { story: "The sub component `Table.Row`." } },
};

TableRow.args = {
	children:
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

	</>,
};

export const TableHeader = Template.bind( {} );
TableHeader.storyName = "Table header";

TableHeader.parameters = {
	controls: { disable: false },
	docs: { description: { story: "The sub component `Table.Header`." } },
};

TableHeader.args = {
	children:
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

	</>,
};

export const TableBody = Template.bind( {} );
TableBody.storyName = "Table body";

TableBody.parameters = {
	controls: { disable: false },
	docs: { description: { story: "The sub component `Table.Body`. Has `Table.Row` as `children`, and `Table.Row` has `Table.Cell` as children." } },
};

TableBody.args = {
	children:
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

	</>,
};

export const TableCell = Template.bind( {} );
TableCell.storyName = "Table cell";

TableCell.parameters = {
	controls: { disable: false },
	docs: { description: { story: "The sub component `Table.Cell`." } },
};

TableCell.args = {
	children:
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

	</>,
};
