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
	 * Test the building of cache keys
	 */
	public function test_get_validator_key_global() {
		$result = WPSEO_Sitemaps_Cache::get_validator_key();

		$this->assertEquals( WPSEO_Sitemaps_Cache::VALIDATION_GLOBAL_KEY, $result );
	}

	/**
	 * Test the building of cache keys
	 */
	public function test_get_validator_key_type() {
		$type     = 'blabla';
		$expected = sprintf( WPSEO_Sitemaps_Cache::VALIDATION_TYPE_KEY_FORMAT, $type );

		$result = WPSEO_Sitemaps_Cache::get_validator_key( $type );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Normal cache key retrieval
	 */
	public function test_get_storage_key() {
		$page             = 1;
		$type             = 'page';
		$global_validator = 'global';
		$type_validator   = 'type';

		$global_validator_key = WPSEO_Sitemaps_Cache::get_validator_key();
		update_option( $global_validator_key, $global_validator );

		$type_validator_key = WPSEO_Sitemaps_Cache::get_validator_key( $type );
		update_option( $type_validator_key, $type_validator );

		$prefix  = WPSEO_Sitemaps_Cache::STORAGE_KEY_PREFIX;
		$postfix = '_1:global_type';

		$expected = $prefix . $type . $postfix;

		// Act.
		$result = WPSEO_Sitemaps_Cache::get_storage_key( $type, $page );

		// Assert.
		$this->assertEquals( $expected, $result );
	}

	/**
	 * Key length should never be over 45 characters
	 *
	 * This would be 53 if we don't use a timeout, but we can't because all sitemaps would be autoloaded every request.
	 */
	public function test_get_storage_key_very_long_type() {
		$page = 1;
		$type = str_repeat( 'a', 60 );

		// Act.
		$result = WPSEO_Sitemaps_Cache::get_storage_key( $type, $page );

		// Assert.
		$this->assertEquals( 45, strlen( $result ) );
	}

	/**
	 * Clearing all cache.
	 */
	public function test_clear() {
		$type         = 'page';
		$page         = 1;
		$test_content = 'test_content';

		$cache_key = WPSEO_Sitemaps_Cache::get_storage_key( $type, $page );
		set_transient( $cache_key, $test_content );

		// Act.
		WPSEO_Sitemaps_Cache::clear();

		$cache_key = WPSEO_Sitemaps_Cache::get_storage_key( $type, $page );
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

		$cache_key = WPSEO_Sitemaps_Cache::get_storage_key( $type, $page );
		set_transient( $cache_key, $test_content );

		// Act.
		WPSEO_Sitemaps_Cache::clear( array( $type ) );

		// Get the key again.
		$cache_key = WPSEO_Sitemaps_Cache::get_storage_key( $type, $page );
		$result    = get_transient( $cache_key );

		// Assert.
		$this->assertEmpty( $result );
	}

	/**
	 * Clearing specific cache should also clear index.
	 */
	public function test_clear_index_also_cleared() {
		$test_index_content = 'test_content';

		$index_cache_key = WPSEO_Sitemaps_Cache::get_storage_key();
		set_transient( $index_cache_key, $test_index_content );

		// Act.
		WPSEO_Sitemaps_Cache::clear( array( 'page' ) );

		// Get the key again.
		$index_cache_key = WPSEO_Sitemaps_Cache::get_storage_key();
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

		$type_a_key = WPSEO_Sitemaps_Cache::get_storage_key( $type_a );
		set_transient( $type_a_key, $type_a_content );

		$type_b_key = WPSEO_Sitemaps_Cache::get_storage_key( $type_b );
		set_transient( $type_b_key, $type_b_content );

		// Act.
		WPSEO_Sitemaps_Cache::clear( array( $type_a ) );

		// Get the key again.
		$type_b_key = WPSEO_Sitemaps_Cache::get_storage_key( $type_b );
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
			'clear_on_option_update'
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

		$cache_key = WPSEO_Sitemaps_Cache::get_storage_key( $type, $page );
		set_transient( $cache_key, $test_content );

		// Act.
		// Updating the option should clear cache for specified type.
		do_action( 'update_option', $option );

		// Get the key again.
		$cache_key = WPSEO_Sitemaps_Cache::get_storage_key( $type, $page );
		$result    = get_transient( $cache_key );

		// Assert.
		$this->assertEmpty( $result );
	}

	/**
	 * Test base 10 to base 61 converter
	 *
	 * @covers WPSEO_Sitemaps_Cache::convert_base10_to_base61
	 */
	public function test_base_10_to_base_61() {
		// Because of not using 0, everything has an offset.
		$this->assertEquals( '1', WPSEO_Sitemaps_Cache::convert_base10_to_base61( 0 ) );
		$this->assertEquals( '2', WPSEO_Sitemaps_Cache::convert_base10_to_base61( 1 ) );
		$this->assertEquals( 'Z', WPSEO_Sitemaps_Cache::convert_base10_to_base61( 60 ) );

		// Not using 10, because 0 offsets all positions -> 1+1=2, 0+1=1, makes 21 (this is a string not a number!).
		$this->assertEquals( '21', WPSEO_Sitemaps_Cache::convert_base10_to_base61( 61 ) );
		$this->assertEquals( '22', WPSEO_Sitemaps_Cache::convert_base10_to_base61( 62 ) );
		$this->assertEquals( '32', WPSEO_Sitemaps_Cache::convert_base10_to_base61( 123 ) );

		$this->assertEquals( 'iINbb6W', WPSEO_Sitemaps_Cache::convert_base10_to_base61( 912830912830 ) );
	}

	/**
	 * @expectedException InvalidArgumentException
	 */
	public function test_base_10_to_base_61_non_integer() {
		WPSEO_Sitemaps_Cache::convert_base10_to_base61( 'ab' );
	}
}
