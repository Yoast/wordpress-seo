<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Llms_Txt\Infrastructure;

use WPSEO_Options;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Sitemap_Link_Collector;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Post_Site_Information_Test
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Sitemap_Link_Collector::__construct
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Sitemap_Link_Collector::get_link
 */
final class Sitemap_Link_Collector_Test extends TestCase {

	/**
	 * The Sitemap_Link_Collector container.
	 *
	 * @var Sitemap_Link_Collector
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Sitemap_Link_Collector();
	}

	/**
	 * Tests getting the link.
	 *
	 * @param bool $is_xml_sitemap_enabled Whether the Yoast XML sitemap is enabled.
	 *
	 * @dataProvider get_link_data_provider
	 *
	 * @return void
	 */
	public function test_legacy_site_information(
		bool $is_xml_sitemap_enabled
	) {
		WPSEO_Options::set( 'enable_xml_sitemap', $is_xml_sitemap_enabled );

		$link_result = $this->instance->get_link();
		$this->assertInstanceOf( Link::class, $link_result );

		if ( $is_xml_sitemap_enabled ) {
			$this->assertTrue( \strpos( $link_result->render(), 'sitemap_index.xml' ) !== false );
		}
		else {
			$this->assertTrue( \strpos( $link_result->render(), 'sitemap=index' ) !== false );
		}
	}

	/**
	 * Data provider for test_get_title.
	 *
	 * @return Generator
	 */
	public static function get_link_data_provider() {
		yield 'Yoast XML sitemaps are enabled' => [
			'is_xml_sitemap_enabled' => true,
		];
		yield 'Yoast XML sitemaps are not enabled' => [
			'is_xml_sitemap_enabled' => false,
		];
	}
}
