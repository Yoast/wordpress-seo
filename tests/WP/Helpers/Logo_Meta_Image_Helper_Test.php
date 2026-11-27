<?php

namespace Yoast\WP\SEO\Tests\WP\Helpers;

use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for the logo meta that the Image_Helper class reads from the settings.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Image_Helper
 */
final class Logo_Meta_Image_Helper_Test extends TestCase {

	/**
	 * Removes the uploaded images.
	 *
	 * @return void
	 */
	public function tear_down() {
		$this->remove_added_uploads();

		parent::tear_down();
	}

	/**
	 * Tests that a logo that only has a URL gets its ID and then its meta, without saving the titles option.
	 *
	 * @covers ::get_attachment_meta_from_settings
	 *
	 * @return void
	 */
	public function test_get_attachment_meta_from_settings_for_a_logo_with_only_a_url() {
		$logo = self::factory()->attachment->create_upload_object( \dirname( __DIR__ ) . '/Assets/yoast.png' );

		// Stores the logo with only its URL, without the filters that add the ID and the meta when the option is saved.
		\remove_all_filters( 'pre_update_option_wpseo_titles' );

		$titles                      = \get_option( 'wpseo_titles' );
		$titles['company_logo']      = \wp_get_attachment_url( $logo );
		$titles['company_logo_id']   = 0;
		$titles['company_logo_meta'] = false;

		\update_option( 'wpseo_titles', $titles );

		$saves = 0;
		\add_filter(
			'pre_update_option_wpseo_titles',
			static function ( $value ) use ( &$saves ) {
				++$saves;

				return $value;
			},
		);

		$image_helper = \YoastSEO()->helpers->image;

		$this->assertSame( $logo, $image_helper->get_attachment_id_from_settings( 'company_logo' ) );

		$logo_meta = $image_helper->get_attachment_meta_from_settings( 'company_logo' );

		$this->assertIsArray( $logo_meta );
		$this->assertSame( $logo, $logo_meta['id'] );
		$this->assertSame( \wp_get_attachment_url( $logo ), $logo_meta['url'] );

		$stored = \get_option( 'wpseo_titles' );

		$this->assertSame( 0, $saves );
		$this->assertSame( 0, $stored['company_logo_id'] );
		$this->assertFalse( $stored['company_logo_meta'] );
	}
}
