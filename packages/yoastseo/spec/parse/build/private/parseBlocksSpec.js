import parseBlocks, { updateBlocksOffset } from "../../../../src/parse/build/private/parseBlocks";
import Paper from "../../../../src/values/Paper";
import adapt from "../../../../src/parse/build/private/adapt";
import { parseFragment } from "parse5";

describe( "The parseBlocks function", () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );
	it( "should return undefined when parsing an undefined node block", () => {
		const paper = new Paper( "" );

		expect( parseBlocks( paper ) ).toBeUndefined();
	} );

	it( "should return undefined when parsing an empty blocks list", () => {
		const paper = new Paper( "", { wpBlocks: [] } );
		const html = paper.getText();
		const node = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );

		expect( parseBlocks( paper, node ) ).toBeUndefined();
	} );

	it( "should not set offsets if the text has an incorrect block structure", () => {
		const paper = new Paper( "<!-- testwp:paragraph -->\n" +
			"<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>" +
			"\n<!-- /testwp:paragraph -->",
		{ wpBlocks: [
			{
				clientId: "34e59165-166d-4663-a8b9-00349b193e36",
				name: "core/paragraph",
				isValid: true,
				originalContent: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>",
				validationIssues: [],
				attributes: {
					content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
					dropCap: false,
				},
				innerBlocks: [],
			},
		] } );

		const html = paper.getText();
		const node = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );

		parseBlocks( paper, node );

		const firstBlock = paper._attributes.wpBlocks[ 0 ];

		expect( firstBlock.startOffset ).toBeUndefined();
		expect( firstBlock.contentOffset ).toBeUndefined();
	} );

	it( "should set the offsets correctly for regular blocks", () => {
		const paper = new Paper( "<!-- wp:paragraph -->\n" +
			"<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>" +
			"\n<!-- /wp:paragraph -->\n" +
			"\n<!-- wp:paragraph -->\n" +
			"<p>Duis sagittis.</p>\n" +
			"<!-- /wp:paragraph -->",
		{ wpBlocks: [
			{
				clientId: "34e59165-166d-4663-a8b9-00349b193e36",
				name: "core/paragraph",
				isValid: true,
				originalContent: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>",
				validationIssues: [],
				attributes: {
					content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
					dropCap: false,
				},
				innerBlocks: [],
			},
			{
				clientId: "f0f597ef-f054-4831-8831-b8acc0dc6149",
				name: "core/paragraph",
				isValid: true,
				originalContent: "<p>Duis sagittis.</p>",
				validationIssues: [],
				attributes: {
					content: "Duis sagittis.",
					dropCap: false,
				},
				innerBlocks: [],
			},
		] } );

		const html = paper.getText();
		const node = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		parseBlocks( paper, node );

		const firstBlock = paper._attributes.wpBlocks[ 0 ];

		expect( firstBlock.startOffset ).toEqual( 0 );
		expect( firstBlock.contentOffset ).toEqual( 22 );

		const secondBlock = paper._attributes.wpBlocks[ 1 ];

		expect( secondBlock.startOffset ).toEqual( 110 );
		expect( secondBlock.contentOffset ).toEqual( 132 );
	} );

	it( "should set the offsets correctly for blocks with inner blocks", () => {
		const paper = new Paper( "<!-- wp:columns -->\n" +
			'<div class="wp-block-columns"><!-- wp:column -->\n' +
			'<div class="wp-block-column"><!-- wp:paragraph -->\n' +
			"<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n" +
			"<!-- /wp:paragraph --></div>\n" +
			"<!-- /wp:column -->\n" +
			"\n" +
			"<!-- wp:column -->\n" +
			'<div class="wp-block-column"><!-- wp:paragraph -->\n' +
			"<p>Duis sagittis.</p>\n" +
			"<!-- /wp:paragraph --></div>\n" +
			"<!-- /wp:column --></div>\n" +
			"<!-- /wp:columns -->",
		{ wpBlocks: [
			{
				clientId: "8cf41a06-d45e-4434-b1d3-4670c231afa7",
				name: "core/columns",
				isValid: true,
				attributes: {
					isStackedOnMobile: true,
				},
				innerBlocks: [
					{
						clientId: "06cc72bd-d6f0-42c3-a558-d338f855436c",
						name: "core/column",
						isValid: true,
						attributes: {},
						innerBlocks: [
							{
								clientId: "78136cca-8160-4fe6-b221-a1575de1dbcd",
								name: "core/paragraph",
								isValid: true,
								attributes: {
									content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
									dropCap: false,
								},
								innerBlocks: [],
							},
						],
					},
					{
						clientId: "a2b05c72-b677-4ed6-a46f-6154867d0ef1",
						name: "core/column",
						isValid: true,
						attributes: {},
						innerBlocks: [
							{
								clientId: "a7f0c6a6-963f-48d4-b802-331900c4c645",
								name: "core/paragraph",
								isValid: true,
								attributes: {
									content: "Duis sagittis.",
									dropCap: false,
								},
								innerBlocks: [],
							},
						],
					},
				],
			},
		] } );

		const html = paper.getText();
		const node = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );

		parseBlocks( paper, node );

		const columnsBlock = paper._attributes.wpBlocks[ 0 ];

		expect( columnsBlock.startOffset ).toEqual( 0 );
		expect( columnsBlock.contentOffset ).toEqual( 20 );

		const firstColumnBlock = columnsBlock.innerBlocks[ 0 ];

		expect( firstColumnBlock.startOffset ).toEqual( 50 );
		expect( firstColumnBlock.contentOffset ).toEqual( 69 );

		const firstColumnParagraphBlock = firstColumnBlock.innerBlocks[ 0 ];

		expect( firstColumnParagraphBlock.startOffset ).toEqual( 98 );
		expect( firstColumnParagraphBlock.contentOffset ).toEqual( 120 );

		const secondColumnBlock = columnsBlock.innerBlocks[ 1 ];

		expect( secondColumnBlock.startOffset ).toEqual( 234 );
		expect( secondColumnBlock.contentOffset ).toEqual( 253 );

		const secondColumnParagraphBlock = secondColumnBlock.innerBlocks[ 0 ];

		expect( secondColumnParagraphBlock.startOffset ).toEqual( 282 );
		expect( secondColumnParagraphBlock.contentOffset ).toEqual( 304 );
	} );

	it( "should set the clientId correctly for blocks and inner blocks", () => {
		const clientId = "8cf41a06-d45e-4434-b1d3-4670c231afa7";
		const paper = new Paper( "<!-- wp:columns -->\n" +
			'<div class="wp-block-columns"><!-- wp:column -->\n' +
			'<div class="wp-block-column"><!-- wp:paragraph -->\n' +
			"<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n" +
			"<!-- /wp:paragraph --></div>\n" +
			"<!-- /wp:column -->\n" +
			"\n" +
			"<!-- wp:column -->\n" +
			'<div class="wp-block-column"><!-- wp:paragraph -->\n' +
			"<p>Duis sagittis.</p>\n" +
			"<!-- /wp:paragraph --></div>\n" +
			"<!-- /wp:column --></div>\n" +
			"<!-- /wp:columns -->",
		{ wpBlocks: [
			{
				clientId: clientId,
				name: "core/columns",
				isValid: true,
				attributes: {
					isStackedOnMobile: true,
				},
				innerBlocks: [
					{
						name: "core/column",
						isValid: true,
						attributes: {},
						innerBlocks: [
							{
								name: "core/paragraph",
								isValid: true,
								attributes: {
									content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
									dropCap: false,
								},
								innerBlocks: [],
							},
						],
					},
					{
						name: "core/column",
						isValid: true,
						attributes: {},
						innerBlocks: [
							{
								name: "core/paragraph",
								isValid: true,
								attributes: {
									content: "Duis sagittis.",
									dropCap: false,
								},
								innerBlocks: [],
							},
						],
					},
				],
			},
		] } );

		const html = paper.getText();
		const node = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );

		parseBlocks( paper, node );

		const divNode = node.childNodes[ 2 ];

		expect( divNode.clientId ).toEqual( clientId );
	} );

	it( "should set the attributeId correctly correctly for a Yoast FAQ block", () => {
		const attributeId = "faq-question-1698963671829";
		const paper = new Paper( "<!-- wp:yoast/faq-block {\"questions\":" +
			"[{\"id\":\"" + attributeId + "\",\"question\":[\"Question\"],\"answer\":[\"Answer\"]," +
			"\"jsonQuestion\":\"Question\",\"jsonAnswer\":\"Answer\"}]} -->\n" +
			"<div class=\"schema-faq wp-block-yoast-faq-block\">" +
			"<div class=\"schema-faq-section\" id=\"" + attributeId + "\">" +
			"<strong class=\"schema-faq-question\">Question</strong> " +
			"<p class=\"schema-faq-answer\">Answer</p> </div> </div>\n" +
			"<!-- /wp:yoast/faq-block -->",
		{
			wpBlocks: [
				{
					clientId: "61988c01-b912-42b7-9475-4886e77fac45",
					name: "yoast/faq-block",
					isValid: true,
					attributes: {
						questions: [
							{
								id: attributeId,
								question: [
									"Question",
								],
								answer: [
									"Answer",
								],
								jsonQuestion: "Question",
								jsonAnswer: "Answer",
							},
						],
					},
					innerBlocks: [],
				},
			],
		} );

		const html = paper.getText();
		const node = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );

		parseBlocks( paper, node );

		const blockDiv = node.childNodes[ 2 ];
		const sectionDiv = blockDiv.childNodes[ 0 ];

		const strongNode = sectionDiv.childNodes[ 0 ];

		expect( strongNode.attributeId ).toEqual( attributeId );
		expect( strongNode.isFirstSection ).toBeTruthy();

		const paragraphNode = sectionDiv.childNodes[ 2 ];

		expect( paragraphNode.attributeId ).toEqual( attributeId );
		expect( paragraphNode.isFirstSection ).toBeFalsy();
	} );

	it( "should not set the attributeId correctly correctly for an invalid Yoast FAQ block", () => {
		const attributeId = "faq-question-1698963671829";
		const paper = new Paper( "<!-- wp:yoast/faq-block {\"questions\":" +
			"[{\"id\":\"" + attributeId + "\",\"question\":[\"Question\"],\"jsonQuestion\":\"Question\"}]} -->\n" +
			"<div class=\"schema-faq wp-block-yoast-faq-block\">" +
			"<div class=\"schema-faq-section\" id=\"" + attributeId + "\">" +
			"<strong class=\"schema-faq-question\">Question</strong> </div> </div>\n" +
			"<!-- /wp:yoast/faq-block -->",
		{
			wpBlocks: [
				{
					clientId: "61988c01-b912-42b7-9475-4886e77fac45",
					name: "yoast/faq-block",
					isValid: true,
					attributes: {
						questions: [
							{
								id: attributeId,
								question: [
									"Question",
								],
								jsonQuestion: "Question",
							},
						],
					},
					innerBlocks: [],
				},
			],
		} );

		const html = paper.getText();
		const node = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );

		parseBlocks( paper, node );

		const blockDiv = node.childNodes[ 2 ];
		const sectionDiv = blockDiv.childNodes[ 0 ];

		const strongNode = sectionDiv.childNodes[ 0 ];

		expect( strongNode.attributeId ).toBeUndefined();
		expect( strongNode.isFirstSection ).toBeUndefined();
	} );
} );

describe( "A test for updateBlocksOffset function", () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );
	it( "should return early if blocks array is empty", () => {
		const blocks = [];
		const text = "Some text";
		const result = updateBlocksOffset( blocks, text );
		expect( result ).toBeUndefined();
	} );

	it( "should update offsets for classic (core/freeform) block: the classic block occurs at 0 index of the blocks array", () => {
		const blocks = [
			{
				name: "core/freeform",
				blockLength: 10,
			},
		];
		const text = "Some text";
		updateBlocksOffset( blocks, text );
		expect( blocks[ 0 ].startOffset ).toEqual( 0 );
		expect( blocks[ 0 ].endOffset ).toEqual( 10 );
		expect( blocks[ 0 ].contentOffset ).toEqual( 0 );
	} );

	it( "should update offsets for classic (core/freeform) block: the classic block occurs at 1 index of the block array", () => {
		const blocks = [
			{ name: "core/quote", blockLength: 40, endOffset: 40 },
			{
				name: "core/freeform",
				blockLength: 10,
			},
		];
		const text = "Some text";
		updateBlocksOffset( blocks, text );
		expect( blocks[ 1 ].startOffset ).toEqual( 42 );
		expect( blocks[ 1 ].contentOffset ).toEqual( 42 );
		expect( blocks[ 1 ].endOffset ).toEqual( 52 );
	} );

	it( "should update offsets for non-classic block", () => {
		const blocks = [
			{
				name: "core/paragraph",
				blockLength: 54,
			},
		];
		const text = "<!-- wp:paragraph -->Some text<!-- /wp:paragraph -->";
		updateBlocksOffset( blocks, text );
		expect( blocks[ 0 ].startOffset ).toEqual( 0 );
		expect( blocks[ 0 ].endOffset ).toEqual( 54 );
		expect( blocks[ 0 ].contentOffset ).toEqual( 22 );
	} );

	it( "should update offsets for inner blocks", () => {
		const blocks = [
			{
				name: "core/columns",
				innerBlocks: [
					{
						name: "core/column",
						blockLength: 100,
						innerBlocks: [
							{ name: "core/paragraph", innerBlocks: [], blockLength: 50 },
						],
					},
					{
						name: "core/column",
						blockLength: 100,
						innerBlocks: [
							{ name: "core/paragraph", innerBlocks: [], blockLength: 50 },
						],
					},
				],
				blockLength: 341,
			},
		];
		const text = "<!-- wp:columns -->\n" +
			"<div class=\"wp-block-columns\"><!-- wp:column -->\n" +
			"<div class=\"wp-block-column\"><!-- wp:paragraph -->\n" +
			"<p>Test</p>\n" +
			"<!-- /wp:paragraph --></div>\n" +
			"<!-- /wp:column -->\n" +
			"\n" +
			"<!-- wp:column -->\n" +
			"<div class=\"wp-block-column\"><!-- wp:paragraph -->\n" +
			"<p>Test 2</p>\n" +
			"<!-- /wp:paragraph --></div>\n" +
			"<!-- /wp:column --></div>\n" +
			"<!-- /wp:columns -->";

		updateBlocksOffset( blocks, text );
		expect( blocks[ 0 ].innerBlocks[ 0 ].startOffset ).toBeTruthy();
		expect( blocks[ 0 ].innerBlocks[ 0 ].contentOffset ).toBeTruthy();
		expect( blocks[ 0 ].innerBlocks[ 0 ].endOffset ).toBeTruthy();
	} );
} );
