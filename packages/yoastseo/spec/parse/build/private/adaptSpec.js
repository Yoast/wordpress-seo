import adapt from "../../../../src/parse/build/private/adapt";
import { parseFragment } from "parse5";
import Node from "../../../../src/parse/structure/Node";
import Text from "../../../../src/parse/structure/Text";
import Heading from "../../../../src/parse/structure/Heading";

describe( "The adapt function",
	() => {
		it( "adapts a basic div element", () => {
			const html = "<div><p class='yoast'>Hello, world!</p></div>";
			const tree = parseFragment( html );

			const adaptedTree = adapt( tree );

			const expected = {
				attributes: {},
				childNodes: [ {
					attributes: {},
					childNodes: [ {
						attributes: {
							"class": new Set( [ "yoast" ] ),
						},
						childNodes: [ {
							name: "#text",
							value: "Hello, world!",
						} ],
						isImplicit: false,
						name: "p",
					} ],
					name: "div",
				} ],
				name: "#document-fragment",
			};

			expect( adaptedTree ).toEqual( expected );
		} );

		it( "adapts a heading element", () => {
			const html = "<h1>Hello World!</h1>";
			const tree = parseFragment( html );

			const adaptedTree = adapt( tree );

			const expected = new Node( "#document-fragment", {}, [
				new Heading( 1, {}, [
					new Text( "Hello World!" ),
				] ),
			] );
			expect( adaptedTree ).toEqual( expected );
		} );

		it( "adapts a tree with a code element inside a paragraph", () => {
			const html = "<p>Hello World! <code>function()</code> Hello Yoast!</p>";
			const tree = parseFragment( html );

			const adaptedTree = adapt( tree );

			const expected = {
				"name": "#document-fragment",
				"attributes": {},
				"childNodes": [
					{
						"name": "p",
						"isImplicit": false,
						"attributes": {},
						"childNodes": [
							{
								"name": "#text",
								"value": "Hello World! "
							},
							{
								"name": "code",
								"attributes": {},
								"childNodes": [
									{
										"name": "#text",
										"value": "function()"
									}
								],
							},
							{
								"name": "#text",
								"value": " Hello Yoast!"
							},
						],
					}
				],
			}
			expect( adaptedTree ).toEqual( expected );
		} );

		it( "adapts a tree with a code element within a sentence", () => {
			const html = "<p>Hello <code>push()</code> World!</p>";
			const tree = parseFragment( html );

			const adaptedTree = adapt( tree );

			const expected = {
				"name": "#document-fragment",
				"attributes": {},
				"childNodes": [
					{
						"name": "p",
						"isImplicit": false,
						"attributes": {},
						"childNodes": [
							{
								"name": "#text",
								"value": "Hello "
							},
							{
								"name": "code",
								"attributes": {},
								"childNodes": [
									{
										"name": "#text",
										"value": "push()"
									}
								],
							},
							{
								"name": "#text",
								"value": " World!"
							}
						],
					}
				],
			}
			expect( adaptedTree ).toEqual( expected );
		} );

		it( "adapts a tree with a script element", () => {
			const html = "<div><script>alert(\"Hello World!\");</script><p>Hello World!</p></div>";
			const tree = parseFragment( html );

			const adaptedTree = adapt( tree );

			const expected = {
				"name": "#document-fragment",
				"attributes": {},
				"childNodes": [
					{
						"name": "div",
						"attributes": {},
						"childNodes": [
							{
								"name": "p",
								"isImplicit": true,
								"attributes": {},
								"childNodes": [
									{
										"name": "script",
										"attributes": {},
										"childNodes": [
											{
												"name": "#text",
												"value": "alert(\"Hello World!\");"
											}
										],
									},
								],
							},
							{
								"name": "p",
								"isImplicit": false,
								"attributes": {},
								"childNodes": [
									{
										"name": "#text",
										"value": "Hello World!"
									}
								],
							}
						],
					}
				],
			};
			expect( adaptedTree ).toEqual( expected );
		} );

		it( "adapts a tree with a script element within a paragraph", () => {
			const html = "<div><p><script>alert(\"Hello World!\");</script> Hello World!</p></div>";
			const tree = parseFragment( html );

			const adaptedTree = adapt( tree );

			const expected = {
				"name": "#document-fragment",
				"attributes": {},
				"childNodes": [
					{
						"name": "div",
						"attributes": {},
						"childNodes": [
							{
								"name": "p",
								"isImplicit": false,
								"attributes": {},
								"childNodes": [
									{
										"name": "script",
										"attributes": {},
										"childNodes": [
											{
												"name": "#text",
												"value": "alert(\"Hello World!\");"
											}
										],
									},
									{
										"name": "#text",
										"value": " Hello World!"
									}
								],
							}
						],
					}
				],
			}
			expect( adaptedTree ).toEqual( expected );
		} );

		it( "adapts a tree with a style element", () => {
			const html = "<style>div { color: #FF00FF}</style><p>Hello World!</p>";
			const tree = parseFragment( html );

			const adaptedTree = adapt( tree );

			const expected = {
				"name": "#document-fragment",
				"attributes": {},
				"childNodes": [
					{
						"name": "style",
						"attributes": {},
						"childNodes": [
							{
								"name": "p",
								"isImplicit": true,
								"attributes": {},
								"childNodes": [
									{
										"name": "#text",
										"value": "div { color: #FF00FF}"
									}
								],
							}
						],
					},
					{
						"name": "p",
						"isImplicit": false,
						"attributes": {},
						"childNodes": [
							{
								"name": "#text",
								"value": "Hello World!"
							}
						],
					}
				],
			}
			expect( adaptedTree ).toEqual( expected );
		} );


		it( "adapts a tree with a blockquote element", () => {
			const html = "<div><p>Hello World!</p><blockquote>Hello Yoast!</blockquote></div>";
			const tree = parseFragment( html );

			const adaptedTree = adapt( tree );

			const expected = {
				"name": "#document-fragment",
				"attributes": {},
				"childNodes": [
					{
						"name": "div",
						"attributes": {},
						"childNodes": [
							{
								"name": "p",
								"isImplicit": false,
								"attributes": {},
								"childNodes": [
									{
										"name": "#text",
										"value": "Hello World!"
									}
								],
							},
							{
								"name": "blockquote",
								"attributes": {},
								"childNodes": [
									{
										"name": "p",
										"isImplicit": true,
										"attributes": {},
										"childNodes": [
											{
												"name": "#text",
												"value": "Hello Yoast!"
											}
										],
									}
								],
							}
						],
					}
				],
			};
			expect( adaptedTree ).toEqual( expected );
		} );


		it( "should correctly adapt a node with no childnodes.", () => {
			const tree = { nodeName: "div" };
			const adaptedTree = adapt( tree );

			const expected = { attributes: {}, childNodes: [], name: "div" };
			expect( adaptedTree ).toEqual( expected );
		} );
	}
);
