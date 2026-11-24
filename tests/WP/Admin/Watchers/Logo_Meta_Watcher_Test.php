<?php

namespace Yoast\WP\SEO\Tests\WP\Admin\Watchers;

use WPSEO_Options;
use Yoast\WP\SEO\Abilities\Application\Site_Representation_Collector;
use Yoast\WP\SEO\Abilities\Application\Site_Representation_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Site_Representation_Field_Validators;
use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_General_Settings_Importing_Action;
use Yoast\WP\SEO\Conditionals\Local_SEO_Active_Conditional;
use Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Logo_Meta_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 *
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher
 */
final class Logo_Meta_Watcher_Test extends TestCase {

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
	 * Tests that the meta of the company logo is stored in the same save as the logo, and follows a change of logo.
	 *
	 * @return void
	 */
	public function test_saving_the_titles_option_stores_the_logo_meta() {
		$first_logo  = self::factory()->attachment->create_upload_object( \dirname( __DIR__, 2 ) . '/Assets/yoast.png' );
		$second_logo = self::factory()->attachment->create_upload_object( \dirname( __DIR__, 2 ) . '/Assets/small.png' );

		$titles                    = \get_option( 'wpseo_titles' );
		$titles['company_logo']    = \wp_get_attachment_url( $first_logo );
		$titles['company_logo_id'] = $first_logo;
		unset( $titles['company_logo_meta'] );

		\update_option( 'wpseo_titles', $titles );

		$stored = \get_option( 'wpseo_titles' );

		$this->assertIsArray( $stored['company_logo_meta'] );
		$this->assertSame( $first_logo, $stored['company_logo_meta']['id'] );
		$this->assertSame( \wp_get_attachment_url( $first_logo ), $stored['company_logo_meta']['url'] );

		WPSEO_Options::set( 'company_logo_id', $second_logo );

		$stored = \get_option( 'wpseo_titles' );

		$this->assertSame( $second_logo, $stored['company_logo_meta']['id'] );
		$this->assertSame( \wp_get_attachment_url( $second_logo ), $stored['company_logo_meta']['url'] );
	}

	/**
	 * Tests that removing the ID of the company logo also removes the meta of that logo.
	 *
	 * @return void
	 */
	public function test_removing_the_logo_id_removes_the_logo_meta() {
		$logo = self::factory()->attachment->create_upload_object( \dirname( __DIR__, 2 ) . '/Assets/yoast.png' );

		$titles                    = \get_option( 'wpseo_titles' );
		$titles['company_logo']    = \wp_get_attachment_url( $logo );
		$titles['company_logo_id'] = $logo;

		\update_option( 'wpseo_titles', $titles );

		$this->assertSame( $logo, \get_option( 'wpseo_titles' )['company_logo_meta']['id'] );

		WPSEO_Options::set( 'company_logo_id', 0 );

		$stored = \get_option( 'wpseo_titles' );

		$this->assertSame( 0, $stored['company_logo_id'] );
		$this->assertFalse( $stored['company_logo_meta'] );
	}

	/**
	 * Tests that the meta is added before a translation plugin restores the values a save did not change.
	 *
	 * The callback on priority 10 stands in for what WPML String Translation 5.4 does before a translated option is
	 * saved: it puts the stored value back for every entry that still equals the translated value it handed out, and
	 * it hands back the translated value as a whole when that leaves nothing to save.
	 *
	 * @return void
	 */
	public function test_adds_the_logo_meta_before_untouched_values_are_restored() {
		global $wpdb;

		$logo = self::factory()->attachment->create_upload_object( \dirname( __DIR__, 2 ) . '/Assets/yoast.png' );

		// Stores an English title and a logo without meta.
		\remove_all_filters( 'pre_update_option_wpseo_titles' );

		$titles                      = \get_option( 'wpseo_titles' );
		$titles['title-404-wpseo']   = 'English title';
		$titles['company_logo']      = \wp_get_attachment_url( $logo );
		$titles['company_logo_id']   = $logo;
		$titles['company_logo_meta'] = false;

		\update_option( 'wpseo_titles', $titles );

		$this->assertFalse( \get_option( 'wpseo_titles' )['company_logo_meta'] );

		// Reads the option the way a request in another language does.
		\add_filter(
			'option_wpseo_titles',
			static function ( $value ) {
				$value['title-404-wpseo'] = 'Titre français';

				return $value;
			},
		);

		$this->register_watcher();

		\add_filter(
			'pre_update_option_wpseo_titles',
			static function ( $value, $old_value ) use ( $wpdb ) {
				$stored = \maybe_unserialize(
					$wpdb->get_var( $wpdb->prepare( "SELECT option_value FROM {$wpdb->options} WHERE option_name = %s", 'wpseo_titles' ) ),
				);

				foreach ( $value as $key => $item ) {
					if ( \array_key_exists( $key, $old_value ) && \array_key_exists( $key, $stored ) && $item === $old_value[ $key ] ) {
						$value[ $key ] = $stored[ $key ];
					}
				}

				return ( $value === $stored ) ? $old_value : $value;
			},
			10,
			2,
		);

		$pending_save = null;
		\add_filter(
			'pre_update_option_wpseo_titles',
			static function ( $value ) use ( &$pending_save ) {
				$pending_save = $value;

				return $value;
			},
			99,
		);

		WPSEO_Options::set( 'company_logo_meta', false );

		$this->assertSame( 'English title', $pending_save['title-404-wpseo'] );
		$this->assertSame( $logo, $pending_save['company_logo_meta']['id'] );
	}

	/**
	 * Tests that an AIOSEO import of a logo that is not in the media library leaves nothing of the previous logo.
	 *
	 * @dataProvider data_provider_previous_logo
	 *
	 * @param bool $previous_logo_has_id Whether the previous logo is stored with its ID and meta, or with only its URL.
	 *
	 * @return void
	 */
	public function test_aioseo_import_of_an_unknown_logo_replaces_the_previous_logo( $previous_logo_has_id ) {
		$this->store_previous_logo( $previous_logo_has_id );

		$aioseo_options = [
			'searchAppearance' => [
				'global' => [
					'schema' => [ 'organizationLogo' => 'https://example.com/new-logo.png' ],
				],
			],
		];

		\update_option( 'aioseo_options', \wp_json_encode( $aioseo_options ) );

		\YoastSEO()->classes->get( Aioseo_General_Settings_Importing_Action::class )->index();

		$stored = \get_option( 'wpseo_titles' );

		$this->assertSame(
			[
				'company_logo'      => 'https://example.com/new-logo.png',
				'company_logo_id'   => 0,
				'company_logo_meta' => false,
			],
			[
				'company_logo'      => $stored['company_logo'],
				'company_logo_id'   => $stored['company_logo_id'],
				'company_logo_meta' => $stored['company_logo_meta'],
			],
		);
	}

	/**
	 * Tests that clearing the logo through the site representation updater leaves nothing of the previous logo.
	 *
	 * @dataProvider data_provider_previous_logo
	 *
	 * @param bool $previous_logo_has_id Whether the previous logo is stored with its ID and meta, or with only its URL.
	 *
	 * @return void
	 */
	public function test_site_representation_updater_clears_the_previous_logo( $previous_logo_has_id ) {
		$this->store_previous_logo( $previous_logo_has_id );

		$options_helper   = \YoastSEO()->helpers->options;
		$image_helper     = \YoastSEO()->helpers->image;
		$local_seo_active = new Local_SEO_Active_Conditional();
		$field_map        = new Site_Representation_Field_Map(
			$local_seo_active,
			new Site_Representation_Field_Validators( $local_seo_active, $image_helper, $options_helper ),
		);
		$updater          = new Site_Representation_Updater(
			$options_helper,
			$field_map,
			$image_helper,
			\YoastSEO()->helpers->social_profiles,
			new Site_Representation_Collector( $field_map, $options_helper ),
		);

		$result = $updater->update( [ 'company_logo_id' => 0 ] );

		$stored = \get_option( 'wpseo_titles' );

		$this->assertSame(
			[
				'warning'           => null,
				'company_logo'      => '',
				'company_logo_id'   => 0,
				'company_logo_meta' => false,
			],
			[
				'warning'           => ( $result['warning'] ?? null ),
				'company_logo'      => $stored['company_logo'],
				'company_logo_id'   => $stored['company_logo_id'],
				'company_logo_meta' => $stored['company_logo_meta'],
			],
		);
	}

	/**
	 * Data provider for the tests that replace or clear a previous logo.
	 *
	 * @return array<string, array<bool>>
	 */
	public static function data_provider_previous_logo() {
		return [
			'Previous logo stored with its ID and meta' => [ true ],
			'Previous logo stored with only its URL'    => [ false ],
		];
	}

	/**
	 * Stores a logo exactly as given, without a watcher that completes it, and then registers the watcher.
	 *
	 * @param bool $with_id Whether to store the logo with its ID and meta, or with only its URL.
	 *
	 * @return void
	 */
	private function store_previous_logo( $with_id ) {
		$previous_logo = self::factory()->attachment->create_upload_object( \dirname( __DIR__, 2 ) . '/Assets/yoast.png' );
		$previous_meta = \YoastSEO()->helpers->image->get_best_attachment_variation( $previous_logo );

		\remove_all_filters( 'pre_update_option_wpseo_titles' );

		$titles                      = \get_option( 'wpseo_titles' );
		$titles['company_logo']      = \wp_get_attachment_url( $previous_logo );
		$titles['company_logo_id']   = ( $with_id ) ? $previous_logo : 0;
		$titles['company_logo_meta'] = ( $with_id ) ? $previous_meta : false;

		\update_option( 'wpseo_titles', $titles );

		$this->assertSame( $titles['company_logo_id'], \get_option( 'wpseo_titles' )['company_logo_id'] );

		$this->register_watcher();
	}

	/**
	 * Replaces every callback that runs before the titles option is saved by the watcher.
	 *
	 * @return void
	 */
	private function register_watcher() {
		\remove_all_filters( 'pre_update_option_wpseo_titles' );

		( new Logo_Meta_Watcher( \YoastSEO()->helpers->image ) )->register_hooks();
	}
}
