<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Domain\Markdown\Sections\Title;

use Generator;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Title;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the link domain object's render function.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Title::__construct
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Title::render
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Title::get_prefix
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer::render
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer::add_section
 */
final class Render_Test extends TestCase {

	/**
	 * Tests render() functions.
	 *
	 * @param string $site_title      The site title.
	 * @param string $site_tagline    The site tagline.
	 * @param string $expected_result The expected rendered result.
	 *
	 * @dataProvider render_data_provider
	 *
	 * @return void
	 */
	public function test_render(
		$site_title,
		$site_tagline,
		$expected_result
	) {
		$llms_txt_renderer = new Llms_Txt_Renderer();

		$title = new Title( $site_title, $site_tagline );
		$llms_txt_renderer->add_section( $title );

		$this->assertSame( $expected_result, $llms_txt_renderer->render() );
	}

	/**
	 * Data provider for test_render.
	 *
	 * @return Generator
	 */
	public static function render_data_provider() {
		yield 'Site title and tagline' => [
			'site_title'      => 'Site title',
			'site_tagline'    => 'Site tagline',
			'expected_result' => '# Site title: Site tagline' . \PHP_EOL,
		];
		yield 'Another site title and tagline' => [
			'site_title'      => 'Test title',
			'site_tagline'    => 'Test tagline',
			'expected_result' => '# Test title: Test tagline' . \PHP_EOL,
		];
		yield 'Site title and empty tagline' => [
			'site_title'      => 'Custom title',
			'site_tagline'    => '',
			'expected_result' => '# Custom title' . \PHP_EOL,
		];
		yield 'Empty title and site tagline' => [
			'site_title'      => '',
			'site_tagline'    => 'Custom tagline',
			'expected_result' => '# Custom tagline' . \PHP_EOL,
		];
		yield 'Empty tagline and empty title' => [
			'site_title'      => '',
			'site_tagline'    => '',
			'expected_result' => '',
		];
	}
}
