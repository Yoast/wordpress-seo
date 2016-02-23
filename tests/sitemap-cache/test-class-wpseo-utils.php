<?php

// only test sitemap cache functions
// these will be moved to the new structure in 3.2

/**
 * apply_filters( 'wpseo_enable_xml_sitemap_transient_caching', true ); -- only applicable for retrieval (awesome!)
 *
 * Public
 *
 * ::register_cache_clear_option .done
 * ::clear_transient_cache - can't be done.
 * ::get_sitemap_cache_validator_key .done
 * ::get_sitemap_cache_key .done
 * ::clear_sitemap_cache .done
 *
 * Private (determine by coverage)
 *
 * ::invalidate_sitemap_cache .implied
 * ::new_sitemap_cache_validator .implied
 * ::get_sitemap_cache_validator .implied
 * ::get_safe_sitemap_cache_type .implied
 */
class WPSEO_Utils_Sitemap_Cache_Test extends WPSEO_UnitTestCase {

	/**
	 * Test the building of cache keys
	 */
	public function test_get_sitemap_cache_validator_key_global() {
		$result = WPSEO_Utils::get_sitemap_cache_validator_key();

		$this->assertEquals( 'wpseo_sitemap_cache_validator_global', $result );
	}

	/**
	 * Test the building of cache keys
	 */
	public function test_get_sitemap_cache_validator_key_type() {
		$type     = 'blabla';
		$expected = sprintf( 'wpseo_sitemap_%s_cache_validator', $type );

		$result = WPSEO_Utils::get_sitemap_cache_validator_key( $type );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Normal cache key retrieval
	 */
	public function test_get_sitemap_cache_key() {
		$n                = 1;
		$type             = 'page';
		$global_validator = 'global';
		$type_validator   = 'type';

		$global_validator_key = WPSEO_Utils::get_sitemap_cache_validator_key();
		update_option( $global_validator_key, $global_validator );

		$type_validator_key = WPSEO_Utils::get_sitemap_cache_validator_key( $type );
		update_option( $type_validator_key, $type_validator );

		$prefix  = WPSEO_Utils::get_sitemap_cache_key_prefix();
		$postfix = sprintf( '_%d:%s_%s', $n, $global_validator, $type_validator );

		$expected = $prefix . $type . $postfix;

		// Act
		$result = WPSEO_Utils::get_sitemap_cache_key( $type, $n );

		// Assert
		$this->assertEquals( $expected, $result );
	}

	/**
	 * Key length should never be over 45 characters
	 *
	 * This would be 53 if we don't use a timeout, but we can't because all sitemaps would be autoloaded every request.
	 */
	public function test_get_sitemap_cache_key_very_long_type() {
		$n    = 1;
		$type = str_repeat( 'a', 60 );

		// Act
		$result = WPSEO_Utils::get_sitemap_cache_key( $type, $n );

		// Assert
		$this->assertEquals( 45, strlen( $result ) );
	}

	/**
	 * Clearing all cache.
	 */
	public function test_clear_sitemap_cache() {
		$type         = 'page';
		$n            = 1;
		$test_content = 'test_content';

		$cache_key = WPSEO_Utils::get_sitemap_cache_key( $type, $n );
		set_transient( $cache_key, $test_content );

		// Clear all.
		WPSEO_Utils::clear_sitemap_cache();

		// Get the key again.
		$cache_key = WPSEO_Utils::get_sitemap_cache_key( $type, $n );
		$content   = get_transient( $cache_key );

		$this->assertEmpty( $content );
	}

	/**
	 * Clearing specific cache.
	 */
	public function test_clear_sitemap_cache_type() {
		$type         = 'page';
		$n            = 1;
		$test_content = 'test_content';

		$cache_key = WPSEO_Utils::get_sitemap_cache_key( $type, $n );
		set_transient( $cache_key, $test_content );

		// Clear specific cache.
		WPSEO_Utils::clear_sitemap_cache( array( $type ) );

		// Get the key again.
		$cache_key = WPSEO_Utils::get_sitemap_cache_key( $type, $n );
		$result    = get_transient( $cache_key );

		$this->assertEmpty( $result );
	}

	/**
	 * Clearing specific cache should also clear index.
	 */
	public function test_clear_sitemap_cache_index_also_cleared() {
		$test_index_content = 'test_content';

		$index_cache_key = WPSEO_Utils::get_sitemap_cache_key();
		set_transient( $index_cache_key, $test_index_content );

		// Clear specific cache.
		WPSEO_Utils::clear_sitemap_cache( array( 'page' ) );

		// Get the key again.
		$index_cache_key = WPSEO_Utils::get_sitemap_cache_key();
		$result          = get_transient( $index_cache_key );

		$this->assertEmpty( $result );
	}

	/**
	 * Clearing specific cache should not touch other type.
	 */
	public function test_clear_sitemap_cache_type_isolation() {
		$type_a         = 'page';
		$type_a_content = 'content_a';

		$type_b         = 'post';
		$type_b_content = 'content_b';

		$type_a_key = WPSEO_Utils::get_sitemap_cache_key( $type_a );
		set_transient( $type_a_key, $type_a_content );

		$type_b_key = WPSEO_Utils::get_sitemap_cache_key( $type_b );
		set_transient( $type_b_key, $type_b_content );

		// Clear specific cache.
		WPSEO_Utils::clear_sitemap_cache( array( $type_a ) );

		// Get the key again.
		$type_b_key = WPSEO_Utils::get_sitemap_cache_key( $type_b );
		$result     = get_transient( $type_b_key );

		$this->assertEquals( $type_b_content, $result );
	}

	/**
	 * Make sure the hook is registered on registration
	 */
	public function test_register_cache_clear_option() {
		$option = 'test_option';

		$function = array( 'WPSEO_Utils', 'clear_transient_cache' );
		$hook     = 'update_option';

		WPSEO_Utils::register_cache_clear_option( $option );

		// Hook will be added on default priority.
		$this->assertEquals( 10, has_action( $hook, $function ) );
	}

	/**
	 * Option update should clear cache for registered type.
	 */
	public function test_clear_transient_cache() {
		$type         = 'page';
		$n            = 1;
		$test_content = 'test_content';
		$option       = 'my_option';

		WPSEO_Utils::register_cache_clear_option( $option, $type );

		$cache_key = WPSEO_Utils::get_sitemap_cache_key( $type, $n );
		set_transient( $cache_key, $test_content );

		// Updating the option should clear cache for specified type.
		do_action( 'update_option', $option );

		// Get the key again.
		$cache_key = WPSEO_Utils::get_sitemap_cache_key( $type, $n );
		$result    = get_transient( $cache_key );

		$this->assertEmpty( $result );
	}
}