<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Domain\Markdown\Sections\Link_List;

use Generator;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the link domain object's render function.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List::__construct
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List::add_link
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List::render
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List::get_prefix
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link::render
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer::render
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer::add_section
 */
final class Render_Test extends TestCase {

	/**
	 * Tests render() functions.
	 *
	 * @param string $type            The list type.
	 * @param Link[] $links           The list links.
	 * @param string $expected_result The expected rendered result.
	 *
	 * @dataProvider render_data_provider
	 *
	 * @return void
	 */
	public function test_render(
		$type,
		$links,
		$expected_result
	) {
		$llms_txt_renderer = new Llms_Txt_Renderer();

		$link_list = new Link_List( $type, $links );
		$llms_txt_renderer->add_section( $link_list );

		$this->assertSame( $expected_result, $llms_txt_renderer->render() );
	}

	/**
	 * Data provider for test_render.
	 *
	 * @return Generator
	 */
	public static function render_data_provider() {
		$link1 = new Link( 'Intro Link 1', 'https://example.com/intro1' );
		$link2 = new Link( 'Intro Link 2', 'https://example.com/intro2' );

		yield 'List with a link' => [
			'type'            => 'List type',
			'links'           => [ $link1 ],
			'expected_result' => '## List type'
				. \PHP_EOL
				. '- [Intro Link 1](https://example.com/intro1)'
				. \PHP_EOL,
		];
		yield 'List with two links' => [
			'type'            => 'List type',
			'links'           => [ $link1, $link2 ],
			'expected_result' => '## List type'
				. \PHP_EOL
				. '- [Intro Link 1](https://example.com/intro1)'
				. \PHP_EOL
				. '- [Intro Link 2](https://example.com/intro2)'
				. \PHP_EOL,
		];
		yield 'List with νο links' => [
			'type'            => 'List type',
			'links'           => [],
			'expected_result' => '',
		];
	}
}
