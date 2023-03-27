import { stripTagsFromHtmlString } from "../../src/strings";

describe( "stripTagsFromHtmlString", () => {
	test.each( [
		[
			"removes a script",
			"<script type='application/javascript' defer>console.log('log');</script>",
			"",
		],
		[
			"removes a nested script",
			"<div><script type='application/javascript' defer>console.log('log');</script></div>",
			"",
		],
		[
			"removes a script next to other nodes",
			"<h1>Header</h1><script type='application/javascript' defer>console.log('log');</script>",
			"Header",
		],
		[
			"removes a script next to other nodes that do not have any content",
			"<div></div><script type='application/javascript' defer>console.log('log');</script>",
			"",
		],
		[
			"removes all the tags in a full HTML document",
			// eslint-disable-next-line max-len
			"<html><head><title>title</title><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><link rel=\"icon\" type=\"image/x-icon\" href=\"/favicon.ico\"><style>.relative {position: relative}</style></head><body><div id=\"__app\"><div class=\"relative\"><h1 class=\"font-medium\">header</h1><ul class=\"text-white pt-3\"><li><a href=\"example.com\" target=\"_blank\" rel=\"noreferrer\">one</a></li><li><span class=\"two\">two</span></li><li><h2 data-three=\"3\">three</h2></li></ul></div><script type=\"application/javascript\" defer>console.log( \"boo\" );</script></div></body></html>",
			"headeronetwothree",
		],
		[
			"removes a style",
			"<style>.relative{ position: relative; }</style>",
			"",
		],
		[
			"removes script and style, even when specified as allowed",
			"<style>.relative{ position: relative; }</style><script type='application/javascript'>console.log('log');</script>",
			"",
			[ "script", "style" ],
		],
		[
			"removes all but the allowed tags",
			// eslint-disable-next-line max-len
			"<ul class=\"text-white pt-3\"><li><a href=\"example.com\" target=\"_blank\" rel=\"noreferrer\">one</a></li><li><span class=\"two\">two</span></li><li><h2 data-three=\"3\">three</h2></li></ul>",
			"<a href=\"example.com\" target=\"_blank\" rel=\"noreferrer\">one</a>twothree",
			[ "a" ],
		],
		[
			"keeps inner text",
			"<div>inner</div>",
			"inner",
		],
	] )( "%s", ( name, html, expected, allowedTags = [] ) => {
		expect( stripTagsFromHtmlString( html, allowedTags ) ).toBe( expected );
	} );
} );
