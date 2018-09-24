<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc\Options
 */

/**
 * Unit Test Class.
 */
class WPSEO_Option_Titles_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests if the enrich_defaults() cache is properly invalidated
     * when a new post type or taxonomy is registered.
	 *
	 * @covers WPSEO_Option_Titles::enrich_defaults()
	 */
	public function test_enrich_defaults_cache_invalidation() {
		$wpseo_option_titles = WPSEO_Option_Titles::get_instance();

		register_post_type( 'custom-post-type', array( 'public' => true ) );
		$this->assertArrayHasKey( 'title-custom-post-type', $wpseo_option_titles->get_defaults() );

		register_taxonomy( 'custom-taxonomy', 'post' );
		$this->assertArrayHasKey( 'title-tax-custom-taxonomy', $wpseo_option_titles->get_defaults() );

		unregister_taxonomy( 'custom-taxonomy' );
		unregister_post_type( 'custom-post-type' );
	}

}
