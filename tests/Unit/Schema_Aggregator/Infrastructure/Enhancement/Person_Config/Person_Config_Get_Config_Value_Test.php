<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Enhancement\Person_Config;

use Brain\Monkey\Functions;
use Generator;

/**
 * Test class for the get_config_value method.
 *
 * @group Person_Config
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Person_Config::get_config_value
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Person_Config_Get_Config_Value_Test extends Abstract_Person_Config_Test {

	/**
	 * Tests getting a configuration value.
	 *
	 * @dataProvider get_config_value_data
	 *
	 * @param string          $key         The configuration key.
	 * @param string|int|bool $the_default The default value.
	 * @param string|int|bool $expected    The expected filtered value.
	 *
	 * @return void
	 */
	public function test_get_config_value( $key, $the_default, $expected ) {
		Functions\expect( 'apply_filters' )
			->once()
			->with( "wpseo_person_enhance_config_{$key}", $the_default )
			->andReturn( $expected );

		$this->assertEquals( $expected, $this->instance->get_config_value( $key, $the_default ) );
	}

	/**
	 * Data provider for the get_config_value test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function get_config_value_data() {
		yield 'String value' => [
			'key'         => 'some_string_key',
			'the_default' => 'default_value',
			'expected'    => 'filtered_value',
		];
		yield 'Integer value' => [
			'key'         => 'some_integer_key',
			'the_default' => 100,
			'expected'    => 200,
		];
		yield 'Boolean true value' => [
			'key'         => 'some_bool_key',
			'the_default' => false,
			'expected'    => true,
		];
		yield 'Boolean false value' => [
			'key'         => 'another_bool_key',
			'the_default' => true,
			'expected'    => false,
		];
		yield 'Job title config' => [
			'key'         => 'job_title_max_length',
			'the_default' => 50,
			'expected'    => 100,
		];
	}
}
