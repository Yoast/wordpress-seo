import ClassicEditorData from "../src/analysis/classicEditorData";

describe( "ClassicEditorData", () => {
	let store;
	let classicEditorData;

	beforeEach( () => {
		document.body.innerHTML = "";
		store = {
			dispatch: jest.fn(),
			subscribe: jest.fn(),
			getState: jest.fn( () => ( {
				snippetEditor: {
					data: {},
				},
			} ) ),
		};
		classicEditorData = new ClassicEditorData( jest.fn(), store );
	} );

	describe( "getContentElementId", () => {
		it( "returns attachment_content when #content is absent and #attachment_content exists", () => {
			document.body.innerHTML = '<textarea id="attachment_content">Media description</textarea>';

			expect( classicEditorData.getContentElementId() ).toBe( "attachment_content" );
		} );

		it( "returns content when #content exists", () => {
			document.body.innerHTML = '<textarea id="content">Post content</textarea>';

			expect( classicEditorData.getContentElementId() ).toBe( "content" );
		} );

		it( "preserves a custom tinyMceId even on screens without #content", () => {
			document.body.innerHTML = '<textarea id="attachment_content">Media description</textarea>';
			const termEditorData = new ClassicEditorData( jest.fn(), store, "description" );

			expect( termEditorData.getContentElementId() ).toBe( "description" );
		} );
	} );

	describe( "getContent", () => {
		it( "reads the media description from #attachment_content when editing an attachment", () => {
			document.body.innerHTML = '<textarea id="attachment_content">Detailed media description text</textarea>';

			expect( classicEditorData.getContent() ).toBe( "Detailed media description text" );
		} );

		it( "reads post content from #content in classic post editor", () => {
			document.body.innerHTML = '<textarea id="content">Standard post body</textarea>';

			expect( classicEditorData.getContent() ).toBe( "Standard post body" );
		} );
	} );

	describe( "getExcerpt", () => {
		it( "reads #attachment_caption when editing an attachment with a caption", () => {
			document.body.innerHTML = '<textarea id="attachment_caption">Photo caption text</textarea><textarea id="attachment_content">Photo description text</textarea>';

			expect( classicEditorData.getExcerpt() ).toBe( "Photo caption text" );
		} );

		it( "falls back to #attachment_content when #attachment_caption is empty", () => {
			document.body.innerHTML = '<textarea id="attachment_caption"></textarea><textarea id="attachment_content">Fallback media description text</textarea>';

			expect( classicEditorData.getExcerpt() ).toBe( "Fallback media description text" );
		} );

		it( "returns an empty string when useFallBack is false and #attachment_caption is empty", () => {
			document.body.innerHTML = '<textarea id="attachment_caption"></textarea><textarea id="attachment_content">Fallback media description text</textarea>';

			expect( classicEditorData.getExcerpt( false ) ).toBe( "" );
		} );

		it( "prefers #excerpt over #attachment_caption when both exist", () => {
			document.body.innerHTML = '<textarea id="excerpt">Post excerpt</textarea><textarea id="attachment_caption">Media caption</textarea>';

			expect( classicEditorData.getExcerpt() ).toBe( "Post excerpt" );
		} );
	} );

	describe( "attachment editor initialization and input events", () => {
		it( "initializes content and excerpt from media fields and reacts to caption and description edits", () => {
			document.body.innerHTML = '<input id="title" value="Sample Image" /><textarea id="attachment_caption"></textarea><textarea id="attachment_content">Initial attachment description</textarea>';

			classicEditorData.initialize( {} );

			expect( classicEditorData.getData() ).toEqual(
				expect.objectContaining( {
					title: "Sample Image",
					content: "Initial attachment description",
					excerpt: "Initial attachment description",
					// eslint-disable-next-line camelcase
					excerpt_only: "",
				} )
			);

			expect( store.dispatch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					type: "SET_EDITOR_DATA_CONTENT",
					content: "Initial attachment description",
				} )
			);

			store.dispatch.mockClear();

			const captionField = document.getElementById( "attachment_caption" );
			captionField.value = "Updated media caption";
			captionField.dispatchEvent( new Event( "input" ) );

			expect( store.dispatch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					type: "SET_EDITOR_DATA_EXCERPT",
					excerpt: "Updated media caption",
				} )
			);
			expect( store.dispatch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					type: "SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE",
					name: "excerpt_only",
					value: "Updated media caption",
				} )
			);

			store.dispatch.mockClear();

			const descriptionField = document.getElementById( "attachment_content" );
			descriptionField.value = "Updated attachment description";
			descriptionField.dispatchEvent( new Event( "input" ) );

			expect( store.dispatch ).toHaveBeenCalledWith(
				expect.objectContaining( {
					type: "SET_EDITOR_DATA_CONTENT",
					content: "Updated attachment description",
				} )
			);
			expect( classicEditorData.getData().content ).toBe( "Updated attachment description" );
		} );
	} );
} );
