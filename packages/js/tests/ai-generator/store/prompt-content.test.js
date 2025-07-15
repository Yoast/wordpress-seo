import {
	promptContentReducer,
	getInitialPromptContentState,
	PROMPT_CONTENT_NAME,
	promptContentSelectors,
	promptContentActions,
} from "../../../src/ai-generator/store/prompt-content.js";

describe( "promptContentReducer", () => {
	it( "should return the initial state", () => {
		expect( promptContentReducer( undefined, {} ) ).toEqual( getInitialPromptContentState() );
	} );

	it( "should handle setPromptContent", () => {
		const initialState = {
			content: "",
			initialized: false,
		};

		const newContent = "New Prompt Content";
		const newStage = {
			content: "New Prompt Content",
			initialized: true,
		};

		expect( promptContentReducer( initialState, promptContentActions.setPromptContent( newContent ) ) ).toEqual( newStage );
	} );
} );

describe( "selectPromptContent", () => {
	const mockStateWithContent = {
		[ PROMPT_CONTENT_NAME ]: {
			content: "Sample Content",
			initialized: true,
		},
	};

	const mockStateWithoutContent = {
		[ PROMPT_CONTENT_NAME ]: {
			content: "",
			initialized: false,
		},
	};

	it( "should select the prompt content if available", () => {
		expect( promptContentSelectors.selectPromptContent( mockStateWithContent ) ).toBe( "Sample Content" );
	} );

	it( "should select an empty string if no content is available", () => {
		expect( promptContentSelectors.selectPromptContent( mockStateWithoutContent ) ).toBe( "" );
	} );

	it( "should return an empty string if the state does not have the promptContent property", () => {
		const incompleteState = {};
		expect( promptContentSelectors.selectPromptContent( incompleteState ) ).toBe( "" );
	} );
} );

describe( "selectPromptContentInitialized", () => {
	const mockStateInitialized = {
		[ PROMPT_CONTENT_NAME ]: {
			content: "Sample Content",
			initialized: true,
		},
	};

	const mockStateWithoutContent = {
		[ PROMPT_CONTENT_NAME ]: {
			content: "",
			initialized: false,
		},
	};

	it( "should select true if the the prompt content is present", () => {
		expect( promptContentSelectors.selectPromptContentInitialized( mockStateInitialized ) ).toBe( true );
	} );

	it( "should select false if no content is available", () => {
		expect( promptContentSelectors.selectPromptContentInitialized( mockStateWithoutContent ) ).toBe( false );
	} );

	it( "should return false if the state does not have the promptContent property", () => {
		const incompleteState = {};
		expect( promptContentSelectors.selectPromptContentInitialized( incompleteState ) ).toBe( false );
	} );
} );

