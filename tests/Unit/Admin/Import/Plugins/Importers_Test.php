<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the tested class.
namespace Yoast\WP\SEO\Tests\Unit\Admin\Import\Plugins;

use WPSEO_Plugin_Importers;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the list of importers.
 *
 * @coversDefaultClass WPSEO_Plugin_Importers
 */
class Importers_Test extends TestCase {

	/**
	 * Tests that plugin importers return the expected set of plugin importers.
	 *
	 * @covers ::get
	 */
	public function test_get_importers() {
		self::assertEquals(
			[
				'WPSEO_Import_AIOSEO',
				'WPSEO_Import_AIOSEO_V4',
				'WPSEO_Import_Greg_SEO',
				'WPSEO_Import_HeadSpace',
				'WPSEO_Import_Jetpack_SEO',
				'WPSEO_Import_WP_Meta_SEO',
				'WPSEO_Import_Platinum_SEO',
				'WPSEO_Import_Premium_SEO_Pack',
				'WPSEO_Import_RankMath',
				'WPSEO_Import_SEOPressor',
				'WPSEO_Import_SEO_Framework',
				'WPSEO_Import_Smartcrawl_SEO',
				'WPSEO_Import_Squirrly',
				'WPSEO_Import_Ultimate_SEO',
				'WPSEO_Import_WooThemes_SEO',
				'WPSEO_Import_WPSEO',
			],
			WPSEO_Plugin_Importers::get()
		);
	}
}
