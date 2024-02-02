<?php

namespace Yoast\WP\SEO\Tests\WP\Sitemaps;

use InvalidArgumentException;
use WPSEO_Sitemaps_Cache_Validator;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Cache_Validator_Test.
 *
 * @coversDefaultClass WPSEO_Sitemaps_Cache_Validator
 *
 * @group sitemaps
 */
final class Cache_Validator_Test extends TestCase {

	/**
	 * Test the building of cache keys.
	 *
	 * @covers ::get_validator_key
	 *
	 * @return void
	 */
	public function test_get_validator_key_global() {

		$result = WPSEO_Sitemaps_Cache_Validator::get_validator_key();

		$this->assertEquals( WPSEO_Sitemaps_Cache_Validator::VALIDATION_GLOBAL_KEY, $result );
	}

	/**
	 * Test the building of cache keys.
	 *
	 * @covers ::get_validator_key
	 *
	 * @return void
	 */
	public function test_get_validator_key_type() {

		$type     = 'blabla';
		$expected = \sprintf( WPSEO_Sitemaps_Cache_Validator::VALIDATION_TYPE_KEY_FORMAT, $type );

		$result = WPSEO_Sitemaps_Cache_Validator::get_validator_key( $type );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Normal cache key retrieval.
	 *
	 * @covers ::get_storage_key
	 *
	 * @return void
	 */
	public function test_get_storage_key() {

		$page             = 1;
		$type             = 'page';
		$global_validator = 'global';
		$type_validator   = 'type';

		$global_validator_key = WPSEO_Sitemaps_Cache_Validator::get_validator_key();
		\update_option( $global_validator_key, $global_validator );

		$type_validator_key = WPSEO_Sitemaps_Cache_Validator::get_validator_key( $type );
		\update_option( $type_validator_key, $type_validator );

		$prefix  = WPSEO_Sitemaps_Cache_Validator::STORAGE_KEY_PREFIX;
		$postfix = '_1:global_type';

		$expected = $prefix . $type . $postfix;

		// Act.
		$result = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );

		// Assert.
		$this->assertEquals( $expected, $result );
	}

	/**
	 * Key length should never be over 45 characters.
	 *
	 * This would be 53 if we don't use a timeout, but we can't because all sitemaps would
	 * be autoloaded every request.
	 *
	 * @covers ::get_storage_key
	 *
	 * @return void
	 */
	public function test_get_storage_key_very_long_type() {

		$page = 1;
		$type = \str_repeat( 'a', 60 );

		// Act.
		$result = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );

		// Assert.
		$this->assertEquals( 45, \strlen( $result ) );
	}

	/**
	 * Test base 10 to base 61 converter.
	 *
	 * @covers ::convert_base10_to_base61
	 *
	 * @return void
	 */
	public function test_base_10_to_base_61() {

		// Because of not using 0, everything has an offset.
		$this->assertEquals( '1', WPSEO_Sitemaps_Cache_Validator::convert_base10_to_base61( 0 ) );
		$this->assertEquals( '2', WPSEO_Sitemaps_Cache_Validator::convert_base10_to_base61( 1 ) );
		$this->assertEquals( 'Z', WPSEO_Sitemaps_Cache_Validator::convert_base10_to_base61( 60 ) );

		// Not using 10, because 0 offsets all positions -> 1+1=2, 0+1=1, makes 21 (this is a string not a number!).
		$this->assertEquals( '21', WPSEO_Sitemaps_Cache_Validator::convert_base10_to_base61( 61 ) );
		$this->assertEquals( '22', WPSEO_Sitemaps_Cache_Validator::convert_base10_to_base61( 62 ) );
		$this->assertEquals( '32', WPSEO_Sitemaps_Cache_Validator::convert_base10_to_base61( 123 ) );

		// Check against PHP_INT_MAX on 32-bit systems.
		$this->assertEquals( '3y75pX', WPSEO_Sitemaps_Cache_Validator::convert_base10_to_base61( 2147483647 ) );
	}

	/**
	 * Tests whether an exception is thrown when a non numeric value is passed.
	 *
	 * @covers ::convert_base10_to_base61
	 *
	 * @return void
	 */
	public function test_base_10_to_base_61_non_integer() {
		$this->expectException( InvalidArgumentException::class );

		WPSEO_Sitemaps_Cache_Validator::convert_base10_to_base61( 'ab' );
	}
}
