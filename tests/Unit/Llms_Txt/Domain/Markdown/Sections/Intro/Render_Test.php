<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Domain\Markdown\Sections\Intro;

use Generator;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Intro;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the link domain object's render function.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Intro::__construct
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Intro::render
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Intro::add_link
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Intro::get_prefix
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link::render
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer::render
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer::add_section
 */
final class Render_Test extends TestCase {

	/**
	 * Tests render() functions.
	 *
	 * @param string $intro_content   The intro content.
	 * @param Link[] $intro_links     The intro links.
	 * @param string $expected_result The expected rendered result.
	 *
	 * @dataProvider render_data_provider
	 *
	 * @return void
	 */
	public function test_render(
		$intro_content,
		$intro_links,
		$expected_result
	) {
		$llms_txt_renderer = new Llms_Txt_Renderer();

		$intro = new Intro( $intro_content, $intro_links );
		$llms_txt_renderer->add_section( $intro );

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

		yield 'Intro with a link' => [
			'intro_content'   => 'This is an intro section with the %s link.',
			'intro_links'     => [ $link1 ],
			'expected_result' => 'This is an intro section with the [Intro Link 1](https://example.com/intro1) link.' . \PHP_EOL,
		];
		yield 'Intro with two link' => [
			'intro_content'   => 'This is an intro section with a %1$s here and a %2$s there.',
			'intro_links'     => [ $link1, $link2 ],
			'expected_result' => 'This is an intro section with a [Intro Link 1](https://example.com/intro1) here and a [Intro Link 2](https://example.com/intro2) there.' . \PHP_EOL,
		];
		yield 'Intro with no links' => [
			'intro_content'   => 'This is an intro section with no links.',
			'intro_links'     => [],
			'expected_result' => 'This is an intro section with no links.' . \PHP_EOL,
		];
		yield 'Intro with a link but no link placeholder' => [
			'intro_content'   => 'This is an intro section with a link but no link placeholder.',
			'intro_links'     => [ $link1 ],
			'expected_result' => 'This is an intro section with a link but no link placeholder.' . \PHP_EOL,
		];
		yield 'Empty intro' => [
			'intro_content'   => '',
			'intro_links'     => [],
			'expected_result' => '',
		];
	}
}
