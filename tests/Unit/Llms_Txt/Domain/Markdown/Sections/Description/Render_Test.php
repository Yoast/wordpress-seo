<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Domain\Markdown\Sections\Description;

use Generator;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Description;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the link domain object's render function.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Description::__construct
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Description::render
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Description::get_prefix
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer::render
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer::add_section
 */
final class Render_Test extends TestCase {

	/**
	 * Tests render() functions.
	 *
	 * @param string $description_content The intro links.
	 * @param string $expected_result     The expected rendered result.
	 *
	 * @dataProvider render_data_provider
	 *
	 * @return void
	 */
	public function test_render(
		$description_content,
		$expected_result
	) {
		$llms_txt_renderer = new Llms_Txt_Renderer();

		$description = new Description( $description_content );
		$llms_txt_renderer->add_section( $description );

		$this->assertSame( $expected_result, $llms_txt_renderer->render() );
	}

	/**
	 * Data provider for test_render.
	 *
	 * @return Generator
	 */
	public static function render_data_provider() {

		yield 'This is a description' => [
			'description_content' => 'This is a description.',
			'expected_result'     => '> This is a description.' . \PHP_EOL,
		];
		yield 'Empty description' => [
			'description_content' => '',
			'expected_result'     => '',
		];
	}
}
