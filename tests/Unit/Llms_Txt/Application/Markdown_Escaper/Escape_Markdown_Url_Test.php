<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Markdown_Escaper;


/**
 * Tests escape_markdown_url().
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Markdown_Escaper::escape_markdown_url
 */
final class Escape_Markdown_Url_Test extends Abstract_Markdown_Escaper_Test {

	/**
	 * Tests escape_markdown_url().
	 *
	 * @return void
	 *
	 * @dataProvider data_escape_markdown_url
	 */
	public function test_escape_markdown_url(
		$url_to_escape,
		$expected_escaped_url
	) {
		$actual_escaped_url = $this->instance->escape_markdown_url( $url_to_escape );

		$this->assertSame( $expected_escaped_url, $actual_escaped_url );
	}

	/**
	 * Data provider for test_escape_markdown_url().
	 *
	 * @return array<string, array<string>>
	 */
	public function data_escape_markdown_url() {
		yield 'Empty URL' => [
			'url_to_escape' => '',
			'expected_escaped_content' => '',
		];

		yield 'URL with no special character' => [
			'url_to_escape' => 'https://example.com',
			'expected_escaped_content' => 'https://example.com',
		];

		yield 'URL with special character' => [
			'url_to_escape' => 'https:// example.com/(test)/test\\test',
			'expected_escaped_content' => 'https://%20example.com/%28test%29/test%5Ctest',
		];
	}
}
