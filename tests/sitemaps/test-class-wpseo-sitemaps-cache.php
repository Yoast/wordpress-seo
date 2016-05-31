<?php
/**
 * @package WPSEO\Unittests\Sitemaps
 */

/**
 * Class WPSEO_Sitemaps_Cache_Test
 */
class WPSEO_Sitemaps_Cache_Test extends WPSEO_UnitTestCase {

	/**
	 * Clean up
	 */
	public function tearDown() {

		parent::tearDown();

		remove_action( 'update_option', array( 'WPSEO_Sitemaps_Cache', 'clear_on_option_update' ) );
	}

	/**
	 * Test sitemap cache not set
	 *
	 * @covers WPSEO_Sitemaps_Cache::get_sitemap_data()
	 */
	public function test_transient_not_set() {

		$cache  = new WPSEO_Sitemaps_Cache();
		$result = $cache->get_sitemap_data( 'post', 1 );

		$this->assertNull( $result );
	}

	/**
	 * Test if the transient cache is set as a cache data object
	 *
	 * @covers WPSEO_Sitemaps_Cache::store_sitemap()
	 * @covers WPSEO_Sitemaps_Cache::get_sitemap()
	 * @covers WPSEO_Sitemaps_Cache::get_sitemap_data()
	 */
	public function test_transient_cache_data_object() {

		$sitemap = 'this_is_a_sitemap';
		$type    = 'post';
		$page    = 1;

		$test = new WPSEO_Sitemap_Cache_Data();
		$test->set_sitemap( $sitemap );

		$cache = new WPSEO_Sitemaps_Cache();
		$this->assertTrue( $cache->store_sitemap( $type, $page, $sitemap, true ) );

		$result = $cache->get_sitemap( $type, $page );

		$this->assertEquals( $test, unserialize( $result ) );
		$this->assertEquals( $test, $cache->get_sitemap_data( $type, $page ) );
	}

	/**
	 * Test sitemap cache XML set as string not being validated
	 *
	 * @covers WPSEO_Sitemaps_Cache::get_sitemap_data()
	 * @covers WPSEO_Sitemap_Cache_Data::set_sitemap()
	 * @covers WPSEO_Sitemap_Cache_Data::is_usable()
	 */
	public function test_transient_string_to_cache_data() {

		$sitemap = 'this is not a wpseo_sitemap_cache_data object';
		$type    = 'post';
		$page    = 1;

		$transient_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );

		set_transient( $transient_key, $sitemap, DAY_IN_SECONDS );

		$cache  = new WPSEO_Sitemaps_Cache();
		$result = $cache->get_sitemap_data( $type, $page );

		$this->assertEquals( $sitemap, get_transient( $transient_key ) );
		$this->assertNull( $result );
	}

	/**
	 * Clearing all cache.
	 */
	public function test_clear() {

		$type         = 'page';
		$page         = 1;
		$test_content = 'test_content';

		$cache_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );
		set_transient( $cache_key, $test_content );

		// Act.
		WPSEO_Sitemaps_Cache::clear();
		WPSEO_Sitemaps_Cache::clear_queued();

		$cache_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );
		$content   = get_transient( $cache_key );

		// Assert.
		$this->assertEmpty( $content );
	}

	/**
	 * Clearing specific cache.
	 */
	public function test_clear_type() {

		$type         = 'page';
		$page         = 1;
		$test_content = 'test_content';

		$cache_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );
		set_transient( $cache_key, $test_content );

		// Act.
		WPSEO_Sitemaps_Cache::clear( array( $type ) );
		WPSEO_Sitemaps_Cache::clear_queued();

		// Get the key again.
		$cache_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );
		$result    = get_transient( $cache_key );

		// Assert.
		$this->assertEmpty( $result );
	}

	/**
	 * Clearing specific cache should also clear index.
	 */
	public function test_clear_index_also_cleared() {

		$test_index_content = 'test_content';

		$index_cache_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key();
		set_transient( $index_cache_key, $test_index_content );

		// Act.
		WPSEO_Sitemaps_Cache::clear( array( 'page' ) );
		WPSEO_Sitemaps_Cache::clear_queued();

		// Get the key again.
		$index_cache_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key();
		$result          = get_transient( $index_cache_key );

		// Assert.
		$this->assertEmpty( $result );
	}

	/**
	 * Clearing specific cache should not touch other type.
	 */
	public function test_clear_type_isolation() {

		$type_a         = 'page';
		$type_a_content = 'content_a';

		$type_b         = 'post';
		$type_b_content = 'content_b';

		$type_a_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type_a );
		set_transient( $type_a_key, $type_a_content );

		$type_b_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type_b );
		set_transient( $type_b_key, $type_b_content );

		// Act.
		WPSEO_Sitemaps_Cache::clear( array( $type_a ) );
		WPSEO_Sitemaps_Cache::clear_queued();

		// Get the key again.
		$type_b_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type_b );
		$result     = get_transient( $type_b_key );

		// Assert.
		$this->assertEquals( $type_b_content, $result );
	}

	/**
	 * Make sure the hook is registered on registration
	 */
	public function test_register_clear_on_option_update() {

		new WPSEO_Sitemaps_Cache();
		// Hook will be added on default priority.
		$this->assertEquals( 10, has_action( 'update_option', array(
			'WPSEO_Sitemaps_Cache',
			'clear_on_option_update',
		) ) );
	}

	/**
	 * Option update should clear cache for registered type.
	 */
	public function test_clear_transient_cache() {

		$type         = 'page';
		$page         = 1;
		$test_content = 'test_content';
		$option       = 'my_option';

		new WPSEO_Sitemaps_Cache();

		WPSEO_Sitemaps_Cache::register_clear_on_option_update( $option, $type );

		$cache_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );
		set_transient( $cache_key, $test_content );

		// Act.
		// Updating the option should clear cache for specified type.
		do_action( 'update_option', $option );
		WPSEO_Sitemaps_Cache::clear_queued();

		// Get the key again.
		$cache_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );
		$result    = get_transient( $cache_key );

		// Assert.
		$this->assertEmpty( $result );
	}
}
