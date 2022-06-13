<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use wpdb;
use Yoast\WP\SEO\Helpers\Aioseo_Helper;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Aioseo_Helper_Test.
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Aioseo_Helper
 * @phpcs:disable Yoast.Yoast.AlternativeFunctions.json_encode_json_encode
 */
class Aioseo_Helper_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Aioseo_Helper
	 */
	protected $instance;

	/**
	 * The mocked WordPress database object.
	 *
	 * @var Mockery\MockInterface|wpdb
	 */
	protected $wpdb;

	/**
	 * The wpdb helper.
	 *
	 * @var Mockery\MockInterface|Wpdb_Helper
	 */
	protected $wpdb_helper;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->wpdb        = Mockery::mock( 'wpdb' );
		$this->wpdb_helper = Mockery::mock( Wpdb_Helper::class );
		$this->instance    = new Aioseo_Helper(
			$this->wpdb,
			$this->wpdb_helper
		);

		$this->wpdb->prefix = 'wp_';
	}

	/**
	 * Tests retrieving the AIOSEO table name along with the db prefix.
	 *
	 * @covers ::get_table
	 */
	public function test_get_table() {
		$table = $this->instance->get_table();

		$this->assertSame( 'wp_aioseo_posts', $table );
	}

	/**
	 * Tests checking if the AIOSEO database table exists.
	 *
	 * @param bool $table_exists    Whether the AIOSEO table exists.
	 * @param bool $expected_result The expected result.
	 *
	 * @dataProvider provider_aioseo_exists
	 * @covers ::aioseo_exists
	 */
	public function test_aioseo_exists( $table_exists, $expected_result ) {
		$this->wpdb_helper->expects( 'table_exists' )
			->once()
			->with( 'wp_aioseo_posts' )
			->andReturn( $table_exists );

		$result = $this->instance->aioseo_exists();

		$this->assertSame( $expected_result, $result );
	}

	/**
	 * Tests retrieving the option where the global settings exist.
	 *
	 * @param string $retrieved_option Whether the AIOSEO table exists.
	 * @param array  $expected_result  The expected result.
	 *
	 * @dataProvider provider_get_global_option
	 * @covers ::get_global_option
	 */
	public function test_get_global_option( $retrieved_option, $expected_result ) {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'aioseo_options', '' )
			->andReturn( $retrieved_option );

		$result = $this->instance->get_global_option();

		$this->assertSame( $expected_result, $result );
	}

	/**
	 * Data provider for test_aioseo_exists().
	 *
	 * @return array
	 */
	public function provider_get_global_option() {
		$retrieved_aioseo_options = [
			'option1' => 'value1',
			'option2' => 'value2',
			'option3' => 'value3',
		];
		return [
			[ \json_encode( $retrieved_aioseo_options ), $retrieved_aioseo_options ],
		];
	}

	/**
	 * Data provider for test_aioseo_exists().
	 *
	 * @return array
	 */
	public function provider_aioseo_exists() {
		return [
			[ false, false ],
			[ true, true ],
		];
	}
}
