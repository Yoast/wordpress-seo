import ListTable from "./components/list-table";

function IndexablesPage() {
	return <div
		className="yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md yst-max-w-2xl yst-mt-6"
	>
		<ListTable status={ "loading" } label={ "Lowest SEO scores" } columns={ [ "title", "id", "hello" ] }>
			<ListTable.EmptyRow label={ "tests" } />
		</ListTable>
	</div>;
}

export default IndexablesPage;
