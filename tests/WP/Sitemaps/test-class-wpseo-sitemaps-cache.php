<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class WPSEO_Sitemaps_Cache_Test.
 *
 * @group sitemaps
 */
class WPSEO_Sitemaps_Cache_Test extends WPSEO_UnitTestCase {

	/**
	 * Clean up.
	 */
	public function tear_down() {
		remove_action( 'update_option', [ 'WPSEO_Sitemaps_Cache', 'clear_on_option_update' ] );

		parent::tear_down();
	}

	/**
	 * Test sitemap cache not set.
	 *
	 * @covers WPSEO_Sitemaps_Cache::get_sitemap_data
	 */
	public function test_transient_not_set() {

		$cache  = new WPSEO_Sitemaps_Cache();
		$result = $cache->get_sitemap_data( 'post', 1 );

		$this->assertNull( $result );
	}

	/**
	 * Test if the transient cache is set as a cache data object.
	 *
	 * @covers WPSEO_Sitemaps_Cache::store_sitemap
	 * @covers WPSEO_Sitemaps_Cache::get_sitemap
	 * @covers WPSEO_Sitemaps_Cache::get_sitemap_data
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

		/*
		 * In PHP < 7.4 the "old" serialization mechanism via the Serializable interface is used,
		 * which combined with the WP logic doesn't automatically unserialize, which is why we need
		 * to do so ourselves.
		 * As of PHP 7.4, the new serialization using magic methods is used.
		 */
		if ( PHP_VERSION_ID < 70400 ) {
			// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_unserialize -- Reason: There's no security risk, because users don't interact with tests.
			$result = unserialize( $result );
		}

		$this->assertEquals( $test, $result );

		$this->assertEquals( $test, $cache->get_sitemap_data( $type, $page ) );
	}

	/**
	 * Test sitemap cache XML set as string not being validated.
	 *
	 * @covers WPSEO_Sitemaps_Cache::get_sitemap_data
	 * @covers WPSEO_Sitemap_Cache_Data::set_sitemap
	 * @covers WPSEO_Sitemap_Cache_Data::is_usable
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
	 * Test that a sitemap cache originally stored when WP was running on PHP < 7.4 can be retrieved and used in all PHP versions.
	 *
	 * @covers WPSEO_Sitemaps_Cache::get_sitemap_data
	 * @covers WPSEO_Sitemap_Cache_Data::__serialize
	 * @covers WPSEO_Sitemap_Cache_Data::__unserialize
	 * @covers WPSEO_Sitemap_Cache_Data::serialize
	 * @covers WPSEO_Sitemap_Cache_Data::unserialize
	 */
	public function test_retrieving_transient_stored_in_php_lt_74() {

		$sitemap = 'this is a wpseo_sitemap_cache_data object stored in PHP < 7.4';
		$type    = 'post';
		$page    = 1;

		$transient_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );

		/*
		 * Using this filter, we effectively mock the get_transient() and
		 * the get_option() WP functions, including the call to maybe_unserialize() in get_option().
		 * These functions are used in the get_sitemap[_data]() method to retrieve the transient.
		 * This filter short-circuits those function calls to return the specific value we need for this test.
		 */
		add_filter(
			"pre_transient_{$transient_key}",
			static function ( $pre_transient ) {
				$pre_transient = 'C:24:"WPSEO_Sitemap_Cache_Data":107:{a:2:{s:6:"status";s:2:"ok";s:3:"xml";s:61:"this is a wpseo_sitemap_cache_data object stored in PHP < 7.4";}}';
				return maybe_unserialize( $pre_transient );
			}
		);

		$cache  = new WPSEO_Sitemaps_Cache();
		$result = $cache->get_sitemap_data( $type, $page );

		$this->assertInstanceOf( 'WPSEO_Sitemap_Cache_Data', $result );
		$this->assertSame( $sitemap, $result->get_sitemap() );
		$this->assertSame( 'ok', $result->get_status() );
	}

	/**
	 * Test that a sitemap cache originally stored when WP was running on PHP >= 7.4 can be retrieved and used
	 * without problems on PHP >= 7.4.
	 *
	 * This test also documents that when the cache was stored in PHP >= 7.4, but the PHP version on which WP
	 * is being run was subsequently downgraded to PHP < 7.4, the cache will be disregarded and the sitemap will
	 * need to be rebuild.
	 *
	 * For that particular scenario, this test also safeguards that the code under test doesn't yield any PHP
	 * errors when the unusable sitemap cache data is encountered.
	 *
	 * @covers WPSEO_Sitemaps_Cache::get_sitemap_data
	 * @covers WPSEO_Sitemap_Cache_Data::__serialize
	 * @covers WPSEO_Sitemap_Cache_Data::__unserialize
	 * @covers WPSEO_Sitemap_Cache_Data::serialize
	 * @covers WPSEO_Sitemap_Cache_Data::unserialize
	 */
	public function test_retrieving_transient_stored_in_php_gte_74() {

		$sitemap = 'this is a wpseo_sitemap_cache_data object stored in PHP >= 7.4';
		$type    = 'post';
		$page    = 1;

		$transient_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );

		/*
		 * Using this filter, we effectively mock the get_transient() and
		 * the get_option() WP functions, including the call to maybe_unserialize() in get_option().
		 * These functions are used in the get_sitemap[_data]() method to retrieve the transient.
		 * This filter short-circuits those function calls to return the specific value we need for this test.
		 */
		add_filter(
			"pre_transient_{$transient_key}",
			static function ( $pre_transient ) {
				$pre_transient = 'O:24:"WPSEO_Sitemap_Cache_Data":2:{s:6:"status";s:2:"ok";s:3:"xml";s:62:"this is a wpseo_sitemap_cache_data object stored in PHP >= 7.4";}';
				return maybe_unserialize( $pre_transient );
			}
		);

		$cache  = new WPSEO_Sitemaps_Cache();
		$result = $cache->get_sitemap_data( $type, $page );

		if ( PHP_VERSION_ID >= 70400 ) {
			// PHP 7.4+.
			$this->assertInstanceOf( 'WPSEO_Sitemap_Cache_Data', $result );
			$this->assertSame( $sitemap, $result->get_sitemap() );
			$this->assertSame( 'ok', $result->get_status() );
		}
		else {
			// PHP 7.3 and lower.
			$this->assertNull( $result );
		}
	}

	/**
	 * Clearing all cache.
	 *
	 * @covers WPSEO_Sitemaps_Cache::clear
	 * @covers WPSEO_Sitemaps_Cache::clear_queued
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
		$this->assertEquals( $test_content, $content );
	}

	/**
	 * Clearing specific cache.
	 *
	 * @covers WPSEO_Sitemaps_Cache::clear
	 * @covers WPSEO_Sitemaps_Cache::clear_queued
	 */
	public function test_clear_type() {

		$type         = 'page';
		$page         = 1;
		$test_content = 'test_content';

		$cache_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );
		set_transient( $cache_key, $test_content );

		// Act.
		WPSEO_Sitemaps_Cache::clear( [ $type ] );
		WPSEO_Sitemaps_Cache::clear_queued();

		// Get the key again.
		$cache_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );
		$result    = get_transient( $cache_key );

		// Assert.
		$this->assertEquals( $test_content, $result );
	}

	/**
	 * Clearing specific cache should also clear index.
	 *
	 * @covers WPSEO_Sitemaps_Cache::clear
	 * @covers WPSEO_Sitemaps_Cache::clear_queued
	 */
	public function test_clear_index_also_cleared() {

		$test_index_content = 'test_content';

		$index_cache_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key();
		set_transient( $index_cache_key, $test_index_content );

		/*
		 * The cache invalidator is based on time so if there isn't enough time
		 * difference between the two generations we will end up with the same
		 * cache invalidator, failing this test.
		 */
		usleep( 10000 );

		// Act.
		WPSEO_Sitemaps_Cache::clear( [ 'page' ] );
		WPSEO_Sitemaps_Cache::clear_queued();

		// Get the key again.
		$index_cache_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key();
		$result          = get_transient( $index_cache_key );

		// Assert.
		$this->assertEquals( $test_index_content, $result );
	}

	/**
	 * Clearing specific cache should not touch other type.
	 *
	 * @covers WPSEO_Sitemaps_Cache::clear
	 * @covers WPSEO_Sitemaps_Cache::clear_queued
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
		WPSEO_Sitemaps_Cache::clear( [ $type_a ] );
		WPSEO_Sitemaps_Cache::clear_queued();

		// Get the key again.
		$type_b_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type_b );
		$result     = get_transient( $type_b_key );

		// Assert.
		$this->assertEquals( $type_b_content, $result );
	}

	/**
	 * Make sure the hook is registered on registration.
	 *
	 * @covers WPSEO_Sitemaps_Cache::__construct
	 */
	public function test_register_clear_on_option_update() {

		new WPSEO_Sitemaps_Cache();
		// Hook will be added on default priority.
		$has_action = has_action(
			'update_option',
			[ 'WPSEO_Sitemaps_Cache', 'clear_on_option_update' ]
		);
		$this->assertEquals( 10, $has_action );
	}

	/**
	 * Option update should clear cache for registered type.
	 *
	 * @covers WPSEO_Sitemaps_Cache::clear_queued
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
		$this->assertEquals( $test_content, $result );
	}

	/**
	 * Tests the attempt to clear the author sitemap for an unknown user, which should return false.
	 *
	 * @covers WPSEO_Sitemaps_Cache::invalidate_author
	 */
	public function test_clearing_author_sitemap_by_unknown_userid() {
		$this->assertFalse( WPSEO_Sitemaps_Cache::invalidate_author( -1 ) );
	}

	/**
	 * Tests the attempt to clear the author sitemap for a user with the proper roles, which should return true.
	 *
	 * @covers WPSEO_Sitemaps_Cache::invalidate_author
	 */
	public function test_clearing_author_sitemap_by_userid() {
		$user_id = $this->factory->user->create(
			[ 'role' => 'administrator' ]
		);

		$this->assertTrue( WPSEO_Sitemaps_Cache::invalidate_author( $user_id ) );
	}

	/**
	 * Tests the attempt to clear the author sitemap for a user with the subscriber role, which should return false.
	 *
	 * @covers WPSEO_Sitemaps_Cache::invalidate_author
	 */
	public function test_clearing_author_sitemap_by_userid_with_subscriber_role() {
		$user_id = $this->factory->user->create(
			[ 'role' => 'subscriber' ]
		);

		$this->assertFalse( WPSEO_Sitemaps_Cache::invalidate_author( $user_id ) );
	}
}
