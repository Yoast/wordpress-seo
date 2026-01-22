<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Enhancement\Person_Config;

use Brain\Monkey\Functions;
use Generator;

/**
 * Test class for the is_enhancement_enabled method.
 *
 * @group schema-aggregator
 * @group Article_Config
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Person_Config::is_enhancement_enabled
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Person_Config_Is_Enhancement_Enabled_Test extends Abstract_Person_Config_Test {

	/**
	 * Tests checking if an enhancement is enabled.
	 *
	 * @dataProvider is_enhancement_enabled_data
	 *
	 * @param string $enhancement    The enhancement name.
	 * @param bool   $default_value  The default value for this enhancement.
	 * @param bool   $filtered_value The value returned by the filter.
	 * @param bool   $expected       The expected result.
	 *
	 * @return void
	 */
	public function test_is_enhancement_enabled( $enhancement, $default_value, $filtered_value, $expected ) {
		Functions\expect( 'apply_filters' )
			->once()
			->with( "wpseo_person_enhance_{$enhancement}", $default_value )
			->andReturn( $filtered_value );

		$this->assertEquals( $expected, $this->instance->is_enhancement_enabled( $enhancement ) );
	}

	/**
	 * Data provider for the is_enhancement_enabled test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function is_enhancement_enabled_data() {
		yield 'person_job_title enabled by default, not filtered' => [
			'enhancement'    => 'person_job_title',
			'default_value'  => true,
			'filtered_value' => true,
			'expected'       => true,
		];
		yield 'person_job_title enabled by default, filtered to false' => [
			'enhancement'    => 'person_job_title',
			'default_value'  => true,
			'filtered_value' => false,
			'expected'       => false,
		];
		yield 'unknown enhancement disabled by default, not filtered' => [
			'enhancement'    => 'unknown_enhancement',
			'default_value'  => false,
			'filtered_value' => false,
			'expected'       => false,
		];
		yield 'unknown enhancement disabled by default, filtered to true' => [
			'enhancement'    => 'unknown_enhancement',
			'default_value'  => false,
			'filtered_value' => true,
			'expected'       => true,
		];
	}
}
