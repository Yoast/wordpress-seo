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

	/**
	 * Tests that saving an empty SEO title template does not persist an empty value, but keeps the
	 * hardcoded installation default instead.
	 *
	 * @covers WPSEO_Option_Titles::validate_option
	 *
	 * @return void
	 */
	public function test_validate_rejects_empty_title_template() {
		$wpseo_option_titles = WPSEO_Option_Titles::get_instance();

		$clean = $wpseo_option_titles->validate( [ 'title-post' => '' ] );

		$this->assertSame( '%%title%% %%page%% %%sep%% %%sitename%%', $clean['title-post'] );
	}

	/**
	 * Tests that saving an empty social title template does not persist an empty value, but keeps the
	 * hardcoded installation default instead.
	 *
	 * @covers WPSEO_Option_Titles::validate_option
	 *
	 * @return void
	 */
	public function test_validate_rejects_empty_social_title_template() {
		$wpseo_option_titles = WPSEO_Option_Titles::get_instance();

		$clean = $wpseo_option_titles->validate( [ 'social-title-post' => '' ] );

		$this->assertSame( '%%title%%', $clean['social-title-post'] );
	}

	/**
	 * Tests that a non-empty SEO title template is still saved as submitted.
	 *
	 * @covers WPSEO_Option_Titles::validate_option
	 *
	 * @return void
	 */
	public function test_validate_accepts_non_empty_title_template() {
		$wpseo_option_titles = WPSEO_Option_Titles::get_instance();

		$clean = $wpseo_option_titles->validate( [ 'title-post' => 'Custom %%sitename%%' ] );

		$this->assertSame( 'Custom %%sitename%%', $clean['title-post'] );
	}
}
