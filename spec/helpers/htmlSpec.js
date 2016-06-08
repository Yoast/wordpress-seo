var html = require( "../../js/helpers/html" );

var blockElements = html.blockElements;
var inlineElements = html.inlineElements;
var isBlockElement = html.isBlockElement;
var isInlineElement = html.isInlineElement;
var getBlocks = html.getBlocks;

describe( "html", function() {

	describe( "block elements", function() {
		it( "should contain exactly the block elements", function() {
			expect( blockElements ).toEqual( [ "address", "article", "aside", "blockquote", "canvas", "dd", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li", "main", "nav", "noscript", "ol", "output", "p", "pre", "section", "table", "tfoot", "ul", "video" ] );
		});
	});

	describe( "inline elements", function() {
		it( "should contain exactly the inline elements", function() {
			expect( inlineElements ).toEqual( [ "b", "big", "i", "small", "tt", "abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong", "samp", "time", "var", "a", "bdo", "br", "img", "map", "object", "q", "script", "span", "sub", "sup", "button", "input", "label", "select", "textarea" ] );
		});
	});

	describe( "isBlockElement", function() {
		it( "should return true for block elements", function() {
			blockElements.forEach( function( blockElement ) {
				expect( isBlockElement( blockElement ) ).toBe( true );
			});
		});

		it( "should return false for inline elements", function() {
			inlineElements.forEach( function( inlineElement) {
				expect( isBlockElement( inlineElement ) ).toBe( false );
			});
		});
	});

	describe( "isInlineElement", function() {
		it( "should return true for inline elements", function() {
			inlineElements.forEach( function ( inlineElement ) {
				expect( isInlineElement( inlineElement ) ).toBe( true );
			} );
		});

		it( "should return false for block elements", function() {
			blockElements.forEach( function ( blockElement ) {
				expect( isInlineElement( blockElement ) ).toBe( false );
			} );
		});
	});

	describe( "getBlocks", function() {
		it( "should split on block elements", function() {
			var text = "<p>Some text</p><div>Another piece of text</div>";
			var expected = [ "<p>Some text</p>", "<div>Another piece of text</div>" ];

			expect( getBlocks( text ) ).toEqual( expected );
		});

		it( "shouldn't split on inline elements", function() {
			var text = "<p>Some text <span class='some-class'>more text</span> and more text.</p>";
			var expected = [ "<p>Some text <span class='some-class'>more text</span> and more text.</p>" ];

			expect( getBlocks( text ) ).toEqual( expected );
		} );

		it( "should handle self-closing elements", function() {
			var text = "Some text <img src='img-src' /> to test.";
			var expected = [ "Some text <img src='img-src' /> to test." ];

			expect( getBlocks( text ) ).toEqual( expected );
		});

		it( "should handle well structured HTML", function() {
			var text = '<p>Earlier, I wrote <a title="Writing a blog: obtaining an attractive writing style!" href="https://yoast.com/attractive-writing-style-blog/">a post about obtaining an attractive writing style</a>. I gave some practical tips to make your blogs more readable. In this post, I will give practical tips to help you set up a nice and clear blog structure.</p><p><img class="alignright size-full wp-image-611687" src="https://yoast-mercury.s3.amazonaws.com/uploads/2014/12/Blog_structure_FI.png" alt="Blog_structure_FI" width="1200" height="628" /></p><h2 class="clear"> </h2><h2 class="clear">Why is blog post structure important?</h2><p>It really pays off to think about the structure of your piece before you actually start writing. The structure is the skeleton of your text: it will help the reader grasp the main idea of your text.</p><p>Writing awesome articles will not instantly improve your ranking. But: in the long run it will definitely have a positive effect on your SEO! Well structured texts have lower bounce rates and higher chances to receive social media attention.</p><p>Post with clear blog post structure will also result in higher conversions on your website. If your message is properly understood by your audience, chances are much larger for them to buy your products or return to your website.</p><h2>How to set up your structure</h2><p>Think before you start writing. Take a piece of paper and write down what you want to write about. Set up a blog post structure, before you start writing and hold on to that structure while writing your blog post. Setting up a structure of your text can (for instance) be done following these three steps:</p>';
			var expected = [
				'<p>Earlier, I wrote <a title="Writing a blog: obtaining an attractive writing style!" href="https://yoast.com/attractive-writing-style-blog/">a post about obtaining an attractive writing style</a>. I gave some practical tips to make your blogs more readable. In this post, I will give practical tips to help you set up a nice and clear blog structure.</p>',
				'<p><img class="alignright size-full wp-image-611687" src="https://yoast-mercury.s3.amazonaws.com/uploads/2014/12/Blog_structure_FI.png" alt="Blog_structure_FI" width="1200" height="628" /></p>',
				'<h2 class="clear"> </h2>',
				'<h2 class="clear">Why is blog post structure important?</h2>',
				'<p>It really pays off to think about the structure of your piece before you actually start writing. The structure is the skeleton of your text: it will help the reader grasp the main idea of your text.</p>',
				'<p>Writing awesome articles will not instantly improve your ranking. But: in the long run it will definitely have a positive effect on your SEO! Well structured texts have lower bounce rates and higher chances to receive social media attention.</p>',
				'<p>Post with clear blog post structure will also result in higher conversions on your website. If your message is properly understood by your audience, chances are much larger for them to buy your products or return to your website.</p>',
				'<h2>How to set up your structure</h2>',
				'<p>Think before you start writing. Take a piece of paper and write down what you want to write about. Set up a blog post structure, before you start writing and hold on to that structure while writing your blog post. Setting up a structure of your text can (for instance) be done following these three steps:</p>'
			];

			expect( getBlocks( text ) ).toEqual( expected );
		});

		it( "should handle greater than or smaller than characters", function() {
			var text = '<div>This is < than > that</div><p>Hello!</p>';
			var expected =  [ '<div>This is < than > that</div>', '<p>Hello!</p>' ];

			var actual = getBlocks( text );

			expect( actual ).toEqual( expected );
		});

		it( "should handle HTML tables", function() {
			var text = '<table><caption>Table 1: Types of ordening</caption><thead><tr><th>Type of ordening</th><td class="empty"> </td></tr></thead><tbody><tr><th>Thematic</th><td>ordened on theme, aspect, topic</td></tr><tr><th>Chronological</th><td>old- new</td></tr><tr><th>Didactic</th><td>easy - hard</td></tr><tr><th>Problem- solution(s)</th><td>introduce problem first and then possible solutions</td></tr></tbody></table>';
			var expected = [ '<table><caption>Table 1: Types of ordening</caption><thead><tr><th>Type of ordening</th><td class="empty"> </td></tr></thead><tbody><tr><th>Thematic</th><td>ordened on theme, aspect, topic</td></tr><tr><th>Chronological</th><td>old- new</td></tr><tr><th>Didactic</th><td>easy - hard</td></tr><tr><th>Problem- solution(s)</th><td>introduce problem first and then possible solutions</td></tr></tbody></table>' ];

			var actual = getBlocks( text );

			expect( actual ).toEqual( expected );
		});

		it( "should handle HTML blocks over newlines", function() {
			var text = "<div>\n\nThis is a piece of content. \n\nThis is another piece of content.</div>";
			var expected = [ "<div>\n\nThis is a piece of content. \n\nThis is another piece of content.</div>" ];

			var actual = getBlocks( text );

			expect( actual ).toEqual( expected );
		});
	});
});
