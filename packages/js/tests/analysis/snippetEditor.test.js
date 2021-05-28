import { getDataWithoutTemplates } from "../../src/analysis/snippetEditor";

describe( "getDataWithoutTemplates", () => {
	it( "returns an empty title and description when the data and templates are exactly the same", () => {
		const templates = {
			title: "%%title%% %%sep%% %%sitename%%",
			slug: "",
			description: "%%excerpt%%",
		};

		const data = {
			title: "%%title%% %%sep%% %%sitename%%",
			description: "%%excerpt%%",
		};

		const expected = {
			title: "",
			description: "",
		};

		const actual = getDataWithoutTemplates( data, templates );
		expect( actual ).toEqual( expected );
	} );

	it( "returns an empty title and description when the data and templates only differ regarding leading and trailing spaces", () => {
		const templates = {
			title: "%%title%% %%sep%% %%sitename%%",
			slug: "",
			description: "%%excerpt%%",
		};

		const data = {
			title: "  %%title%% %%sep%% %%sitename%%  ",
			description: "%%excerpt%%",
		};

		const expected = {
			title: "",
			description: "",
		};

		const actual = getDataWithoutTemplates( data, templates );
		expect( actual ).toEqual( expected );
	} );


	it( "returns the title and description from the data when the data and templates differ from each other", () => {
		const templates = {
			title: "%%title%% %%sep%% %%sitename%%",
			slug: "",
			description: "%%excerpt%%",
		};

		const data = {
			title: "%%title%% %%sep%% %%sitename%% changes are cool",
			description: "%%excerpt%% with more text",
		};

		const expected = {
			title: "%%title%% %%sep%% %%sitename%% changes are cool",
			description: "%%excerpt%% with more text",
		};

		const actual = getDataWithoutTemplates( data, templates );
		expect( actual ).toEqual( expected );
	} );
} );
