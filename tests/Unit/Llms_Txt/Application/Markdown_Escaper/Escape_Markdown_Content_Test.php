<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Escaper;

/**
 * Tests escape_markdown_content().
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Markdown_Escaper::escape_markdown_content
 */
final class Escape_Markdown_Content_Test extends Abstract_Markdown_Escaper_Test {

	/**
	 * Tests escape_markdown_content().
	 *
	 * @param string $content_to_escape        The content to escape.
	 * @param string $expected_escaped_content The expected escaped content.
	 *
	 * @return void
	 *
	 * @dataProvider data_escape_markdown_content
	 */
	public function test_escape_markdown_content(
		$content_to_escape,
		$expected_escaped_content
	) {
		$actual_escaped_content = $this->instance->escape_markdown_content( $content_to_escape );

		$this->assertSame( $expected_escaped_content, $actual_escaped_content );
	}

	/**
	 * Data provider for test_escape_markdown_content().
	 *
	 * @return array<string, array<string>>
	 */
	public function data_escape_markdown_content() {
		yield 'Empty content' => [
			'content_to_escape'        => '',
			'expected_escaped_content' => '',
		];

		yield 'Content with no special characters' => [
			'content_to_escape'        => 'No special characters here',
			'expected_escaped_content' => 'No special characters here',
		];

		yield 'Content with some special characters' => [
			'content_to_escape'        => 'Here some special characters: *bold*, _italic_, `code`, [link](http://example.com)',
			'expected_escaped_content' => 'Here some special characters: \*bold\*, \_italic\_, \`code\`, \[link\]\(http://example\.com\)',
		];

		yield 'Content with all the other special characters' => [
			'content_to_escape'        => 'Here are the other special characters: -#+\!&<>{}|',
			'expected_escaped_content' => 'Here are the other special characters: \-\#\+\\\!\&\<\>\{\}\|',
		];

		yield 'Content with HTML encoded entities' => [
			'content_to_escape'        => "I'll &quot;walk&quot; the &lt;b&gt;dog&lt;/b&gt; now",
			'expected_escaped_content' => 'I\'ll "walk" the \<b\>dog\</b\> now',
		];
	}
}
