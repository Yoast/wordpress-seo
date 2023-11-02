import parseBlocks from "../../../../src/parse/build/private/parseBlocks";
import Paper from "../../../../src/values/Paper";
import {htmlEntitiesRegex} from "../../../../src/helpers/htmlEntities";
import adapt from "../../../../src/parse/build/private/adapt";
import {parseFragment} from "parse5";

describe( "The parseBlocks function", () => {
	it( "parses an undefined node block should return undefined", () => {
		const paper = new Paper( );

		expect( parseBlocks( paper, undefined ) ).toBeUndefined();
	});

	it( "parses an empty blocks list should return undefined", () => {
		const paper = new Paper( '', { wpBlocks: [] } );


		expect( parseBlocks( paper, undefined ) ).toBeUndefined();
	});

	it( "offset correctly set for blocks", () => {
		const paper = new Paper( '<!-- wp:paragraph -->\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n<!-- /wp:paragraph -->\n\n<!-- wp:paragraph -->\n<p>Duis sagittis.</p>\n<!-- /wp:paragraph -->',
			{ wpBlocks: [
				{
					"clientId": "34e59165-166d-4663-a8b9-00349b193e36",
					"name": "core/paragraph",
					"isValid": true,
					"originalContent": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>",
					"validationIssues": [],
					"attributes": {
						"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
						"dropCap": false
					},
					"innerBlocks": []
				},
				{
					"clientId": "f0f597ef-f054-4831-8831-b8acc0dc6149",
					"name": "core/paragraph",
					"isValid": true,
					"originalContent": "<p>Duis sagittis.</p>",
					"validationIssues": [],
					"attributes": {
						"content": "Duis sagittis.",
						"dropCap": false
					},
					"innerBlocks": []
				}
			] } );

		let html = paper.getText();
		let node = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );
		parseBlocks( paper, node );


		parseBlocks( paper, node );

		const firstBlock = paper._attributes.wpBlocks[0];

		expect( firstBlock.startOffset ).toEqual(0);
		expect( firstBlock.contentOffset ).toEqual(22);

		const secondBlock = paper._attributes.wpBlocks[1];

		expect( secondBlock.startOffset ).toEqual(110);
		expect( secondBlock.contentOffset ).toEqual(132);
	});

	it( "offset correctly set for blocks with inner blocks", () => {
		const paper = new Paper( '<!-- wp:columns -->\n' +
			'<div class="wp-block-columns"><!-- wp:column -->\n' +
			'<div class="wp-block-column"><!-- wp:paragraph -->\n' +
			'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n' +
			'<!-- /wp:paragraph --></div>\n' +
			'<!-- /wp:column -->\n' +
			'\n' +
			'<!-- wp:column -->\n' +
			'<div class="wp-block-column"><!-- wp:paragraph -->\n' +
			'<p>Duis sagittis.</p>\n' +
			'<!-- /wp:paragraph --></div>\n' +
			'<!-- /wp:column --></div>\n' +
			'<!-- /wp:columns -->',
			{ wpBlocks: [
					{
						"clientId": "8cf41a06-d45e-4434-b1d3-4670c231afa7",
						"name": "core/columns",
						"isValid": true,
						"attributes": {
							"isStackedOnMobile": true
						},
						"innerBlocks": [
							{
								"clientId": "06cc72bd-d6f0-42c3-a558-d338f855436c",
								"name": "core/column",
								"isValid": true,
								"attributes": {},
								"innerBlocks": [
									{
										"clientId": "78136cca-8160-4fe6-b221-a1575de1dbcd",
										"name": "core/paragraph",
										"isValid": true,
										"attributes": {
											"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
											"dropCap": false
										},
										"innerBlocks": []
									}
								]
							},
							{
								"clientId": "a2b05c72-b677-4ed6-a46f-6154867d0ef1",
								"name": "core/column",
								"isValid": true,
								"attributes": {},
								"innerBlocks": [
									{
										"clientId": "a7f0c6a6-963f-48d4-b802-331900c4c645",
										"name": "core/paragraph",
										"isValid": true,
										"attributes": {
											"content": "Duis sagittis.",
											"dropCap": false
										},
										"innerBlocks": []
									}
								]
							}
						]
					}
				] } );

		let html = paper.getText();
		let node = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );


		parseBlocks( paper, node );


		const columnsBlock = paper._attributes.wpBlocks[0];

		expect( columnsBlock.startOffset ).toEqual(0);
		expect( columnsBlock.contentOffset ).toEqual(20);

		const firstColumnBlock = columnsBlock.innerBlocks[0]

		expect( firstColumnBlock.startOffset ).toEqual(50);
		expect( firstColumnBlock.contentOffset ).toEqual(69);

		const firstColumnParagraphBlock = firstColumnBlock.innerBlocks[0]

		expect( firstColumnParagraphBlock.startOffset ).toEqual(98);
		expect( firstColumnParagraphBlock.contentOffset ).toEqual(120);

		const secondColumnBlock = columnsBlock.innerBlocks[1]

		expect( secondColumnBlock.startOffset ).toEqual(234);
		expect( secondColumnBlock.contentOffset ).toEqual(253);

		const secondColumnParagraphBlock = secondColumnBlock.innerBlocks[0]

		expect( secondColumnParagraphBlock.startOffset ).toEqual(282);
		expect( secondColumnParagraphBlock.contentOffset ).toEqual(304);
	});

	it( "clientId correctly set for blocks and inner blocks", () => {
		const clientId = "8cf41a06-d45e-4434-b1d3-4670c231afa7";
		const paper = new Paper( '<!-- wp:columns -->\n' +
			'<div class="wp-block-columns"><!-- wp:column -->\n' +
			'<div class="wp-block-column"><!-- wp:paragraph -->\n' +
			'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n' +
			'<!-- /wp:paragraph --></div>\n' +
			'<!-- /wp:column -->\n' +
			'\n' +
			'<!-- wp:column -->\n' +
			'<div class="wp-block-column"><!-- wp:paragraph -->\n' +
			'<p>Duis sagittis.</p>\n' +
			'<!-- /wp:paragraph --></div>\n' +
			'<!-- /wp:column --></div>\n' +
			'<!-- /wp:columns -->',
			{ wpBlocks: [
					{
						"clientId": clientId,
						"name": "core/columns",
						"isValid": true,
						"attributes": {
							"isStackedOnMobile": true
						},
						"innerBlocks": [
							{
								"name": "core/column",
								"isValid": true,
								"attributes": {},
								"innerBlocks": [
									{
										"name": "core/paragraph",
										"isValid": true,
										"attributes": {
											"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
											"dropCap": false
										},
										"innerBlocks": []
									}
								]
							},
							{
								"name": "core/column",
								"isValid": true,
								"attributes": {},
								"innerBlocks": [
									{
										"name": "core/paragraph",
										"isValid": true,
										"attributes": {
											"content": "Duis sagittis.",
											"dropCap": false
										},
										"innerBlocks": []
									}
								]
							}
						]
					}
				] } );

		let html = paper.getText();
		let node = adapt( parseFragment( html, { sourceCodeLocationInfo: true } ) );

		parseBlocks( paper, node );

		const divNode = node.childNodes[2];


		expect( divNode.clientId ).toEqual(clientId);
	});
} );
