<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the tested class.
namespace Yoast\WP\SEO\Tests\Unit\Admin\Import\Plugins;

use Mockery;
use WPSEO_Plugin_Importers;
use Yoast\WP\SEO\Conditionals\AIOSEO_V4_Importer_Conditional;
use Yoast\WP\SEO\Surfaces\Classes_Surface;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Brain\Monkey\Functions;

/**
 * Tests the list of importers.
 *
 * @coversDefaultClass WPSEO_Plugin_Importers
 */
class Importers_Test extends TestCase {

	/**
	 * Tests that the AiOSEO V4 importer is not added to the list of
	 * active importers when the AiOSEO V4 feature flag is disabled.
	 *
	 * @covers ::get
	 */
	public function test_get_importers_with_aioseo_v4_importer_feature_disabled() {
		$aioseo_v4_importer_conditional = Mockery::mock( AIOSEO_V4_Importer_Conditional::class );
		$aioseo_v4_importer_conditional->expects( 'is_met' )
			->andReturnFalse();

		$this->mock_classes_surface( $aioseo_v4_importer_conditional );

		self::assertEquals(
			[
				'WPSEO_Import_AIOSEO',
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

	/**
	 * Tests that the AiOSEO V4 importer is added to the list of
	 * active importers when the AiOSEO V4 feature flag is enabled.
	 *
	 * @covers ::get
	 */
	public function test_get_importers_with_aioseo_v4_importer_feature_enabled() {
		$aioseo_v4_importer_conditional = Mockery::mock( AIOSEO_V4_Importer_Conditional::class );
		$aioseo_v4_importer_conditional->expects( 'is_met' )
			->andReturnTrue();

		$this->mock_classes_surface( $aioseo_v4_importer_conditional );

		self::assertEquals(
			[
				'WPSEO_Import_AIOSEO',
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
				'WPSEO_Import_AIOSEO_V4',
			],
			WPSEO_Plugin_Importers::get()
		);
	}

	/**
	 * Sets the mocked importer conditional on the mocked classes surface.
	 *
	 * @param AIOSEO_V4_Importer_Conditional $aioseo_v4_importer_conditional The importer conditional.
	 */
	protected function mock_classes_surface( $aioseo_v4_importer_conditional ) {
		$classes_surface = Mockery::mock( Classes_Surface::class );
		$classes_surface->expects( 'get' )
			->with( AIOSEO_V4_Importer_Conditional::class )
			->andReturn( $aioseo_v4_importer_conditional );

		Functions\expect( 'YoastSEO' )
			->once()
			->andReturn( (object) [ 'classes' => $classes_surface ] );
	}
}
