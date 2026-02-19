<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;

use Generator;

/**
 * Tests the is_met method.
 *
 * @group schema-aggregator
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional::is_met
 */
final class Is_Met_Test extends Abstract_Schema_Aggregator_Conditional_Test {

	/**
	 * Tests is_met returns the expected result based on the option value.
	 *
	 * @dataProvider data_is_met
	 *
	 * @param bool|int|string|null $option_value The value returned by the options helper.
	 * @param bool                 $expected     The expected result from is_met().
	 *
	 * @return void
	 */
	public function test_is_met( $option_value, $expected ) {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'enable_schema_aggregation_endpoint' )
			->andReturn( $option_value );

		$result = $this->instance->is_met();

		$this->assertSame( $expected, $result );
	}

	/**
	 * Data provider for test_is_met.
	 *
	 * @return Generator Test data to use.
	 */
	public static function data_is_met() {
		yield 'Returns true when option is boolean true' => [
			'option_value' => true,
			'expected'     => true,
		];
		yield 'Returns false when option is boolean false' => [
			'option_value' => false,
			'expected'     => false,
		];
		yield 'Returns false when option is integer 1 (strict comparison)' => [
			'option_value' => 1,
			'expected'     => false,
		];
		yield 'Returns false when option is string "1" (strict comparison)' => [
			'option_value' => '1',
			'expected'     => false,
		];
		yield 'Returns false when option is string "true" (strict comparison)' => [
			'option_value' => 'true',
			'expected'     => false,
		];
		yield 'Returns false when option is null' => [
			'option_value' => null,
			'expected'     => false,
		];
	}
}
