<?php

namespace Yoast\WP\SEO\Tests\WP\Inc\Options;

use WPSEO_Option_Titles;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Option_Titles_Test extends TestCase {

	/**
	 * Tests if the enrich_defaults() cache is properly invalidated
	 * when a new post type or taxonomy is registered.
	 *
	 * @covers WPSEO_Option_Titles::enrich_defaults
	 *
	 * @return void
	 */
	public function test_enrich_defaults_cache_invalidation() {
		$wpseo_option_titles = WPSEO_Option_Titles::get_instance();

		// Register all actions again as they will have been removed in previous teardowns.
		\add_action( 'registered_post_type', [ $wpseo_option_titles, 'invalidate_enrich_defaults_cache' ] );
		\add_action( 'unregistered_post_type', [ $wpseo_option_titles, 'invalidate_enrich_defaults_cache' ] );
		\add_action( 'registered_taxonomy', [ $wpseo_option_titles, 'invalidate_enrich_defaults_cache' ] );
		\add_action( 'unregistered_taxonomy', [ $wpseo_option_titles, 'invalidate_enrich_defaults_cache' ] );

		\register_post_type( 'custom-post-type', [ 'public' => true ] );
		$this->assertArrayHasKey( 'title-custom-post-type', $wpseo_option_titles->get_defaults() );

		\register_taxonomy( 'custom-taxonomy', 'post' );
		$this->assertArrayHasKey( 'title-tax-custom-taxonomy', $wpseo_option_titles->get_defaults() );

		\unregister_taxonomy( 'custom-taxonomy' );
		\unregister_post_type( 'custom-post-type' );
	}
}
