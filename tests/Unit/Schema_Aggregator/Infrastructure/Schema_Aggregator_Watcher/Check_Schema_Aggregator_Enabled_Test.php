<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Aggregator_Watcher;

use Generator;
use Mockery;

/**
 * Tests the check_schema_aggregator_enabled method.
 *
 * @group schema-aggregator
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Watcher::check_schema_aggregator_enabled
 */
final class Check_Schema_Aggregator_Enabled_Test extends Abstract_Schema_Aggregator_Watcher_Test {

	/**
	 * Tests check_schema_aggregator_enabled returns the expected result based on various scenarios.
	 *
	 * @dataProvider data_check_schema_aggregator_enabled
	 *
	 * @param array<string, bool|int|string>|bool|string $old_value              The old value of the option.
	 * @param array<string, bool|int|string>|bool|string $new_value              The new value of the option.
	 * @param bool                                       $expected               The expected return value.
	 * @param bool                                       $should_check_timestamp Whether the timestamp should be checked.
	 * @param bool                                       $should_set_timestamp   Whether the timestamp should be set.
	 * @param int|string|null                            $current_timestamp      The current timestamp value from options.
	 *
	 * @return void
	 */
	public function test_check_schema_aggregator_enabled(
		$old_value,
		$new_value,
		$expected,
		$should_check_timestamp,
		$should_set_timestamp,
		$current_timestamp
	) {
		if ( $should_check_timestamp ) {
			$this->options_helper
				->expects( 'get' )
				->once()
				->with( 'schema_aggregation_endpoint_enabled_on' )
				->andReturn( $current_timestamp );
		}

		if ( $should_set_timestamp ) {
			$this->options_helper
				->expects( 'set' )
				->once()
				->with( 'schema_aggregation_endpoint_enabled_on', Mockery::type( 'int' ) );
		}

		$result = $this->instance->check_schema_aggregator_enabled( $old_value, $new_value );

		$this->assertSame( $expected, $result );
	}

	/**
	 * Data provider for test_check_schema_aggregator_enabled.
	 *
	 * @return Generator Test data to use.
	 */
	public static function data_check_schema_aggregator_enabled() {
		yield 'Sets timestamp when transitioning from disabled to enabled (first time)' => [
			'old_value'              => [ 'enable_schema_aggregation_endpoint' => false ],
			'new_value'              => [ 'enable_schema_aggregation_endpoint' => true ],
			'expected'               => true,
			'should_check_timestamp' => true,
			'should_set_timestamp'   => true,
			'current_timestamp'      => null,
		];
		yield 'Returns false when timestamp already exists' => [
			'old_value'              => [ 'enable_schema_aggregation_endpoint' => false ],
			'new_value'              => [ 'enable_schema_aggregation_endpoint' => true ],
			'expected'               => false,
			'should_check_timestamp' => true,
			'should_set_timestamp'   => false,
			'current_timestamp'      => 1234567890,
		];
		yield 'Returns false when already enabled (no transition)' => [
			'old_value'              => [ 'enable_schema_aggregation_endpoint' => true ],
			'new_value'              => [ 'enable_schema_aggregation_endpoint' => true ],
			'expected'               => false,
			'should_check_timestamp' => false,
			'should_set_timestamp'   => false,
			'current_timestamp'      => null,
		];
		yield 'Returns false when disabling' => [
			'old_value'              => [ 'enable_schema_aggregation_endpoint' => true ],
			'new_value'              => [ 'enable_schema_aggregation_endpoint' => false ],
			'expected'               => false,
			'should_check_timestamp' => false,
			'should_set_timestamp'   => false,
			'current_timestamp'      => null,
		];
		yield 'Handles old_value as false (WordPress default for missing options)' => [
			'old_value'              => false,
			'new_value'              => [ 'enable_schema_aggregation_endpoint' => true ],
			'expected'               => true,
			'should_check_timestamp' => true,
			'should_set_timestamp'   => true,
			'current_timestamp'      => null,
		];
		yield 'Returns false when old_value is not array' => [
			'old_value'              => 'string',
			'new_value'              => [ 'enable_schema_aggregation_endpoint' => true ],
			'expected'               => false,
			'should_check_timestamp' => false,
			'should_set_timestamp'   => false,
			'current_timestamp'      => null,
		];
		yield 'Returns false when new_value is not array' => [
			'old_value'              => [],
			'new_value'              => 'string',
			'expected'               => false,
			'should_check_timestamp' => false,
			'should_set_timestamp'   => false,
			'current_timestamp'      => null,
		];
		yield 'Handles missing key in old_value (treated as disabled)' => [
			'old_value'              => [],
			'new_value'              => [ 'enable_schema_aggregation_endpoint' => true ],
			'expected'               => true,
			'should_check_timestamp' => true,
			'should_set_timestamp'   => true,
			'current_timestamp'      => null,
		];
		yield 'Handles missing key in new_value (treated as disabled)' => [
			'old_value'              => [ 'enable_schema_aggregation_endpoint' => true ],
			'new_value'              => [],
			'expected'               => false,
			'should_check_timestamp' => false,
			'should_set_timestamp'   => false,
			'current_timestamp'      => null,
		];
		yield 'Handles truthy values with boolean casting (0 to 1 transition)' => [
			'old_value'              => [ 'enable_schema_aggregation_endpoint' => 0 ],
			'new_value'              => [ 'enable_schema_aggregation_endpoint' => 1 ],
			'expected'               => true,
			'should_check_timestamp' => true,
			'should_set_timestamp'   => true,
			'current_timestamp'      => null,
		];
		yield 'Returns false when both values are truthy but would cast to true' => [
			'old_value'              => [ 'enable_schema_aggregation_endpoint' => 'yes' ],
			'new_value'              => [ 'enable_schema_aggregation_endpoint' => 1 ],
			'expected'               => false,
			'should_check_timestamp' => false,
			'should_set_timestamp'   => false,
			'current_timestamp'      => null,
		];
		yield 'Sets timestamp when current timestamp is empty string' => [
			'old_value'              => [ 'enable_schema_aggregation_endpoint' => false ],
			'new_value'              => [ 'enable_schema_aggregation_endpoint' => true ],
			'expected'               => true,
			'should_check_timestamp' => true,
			'should_set_timestamp'   => true,
			'current_timestamp'      => '',
		];
	}

	/**
	 * Tests that the timestamp is not set when the get method returns an existing timestamp.
	 *
	 * @return void
	 */
	public function test_check_schema_aggregator_enabled_does_not_overwrite_existing_timestamp() {
		$old_value = [ 'enable_schema_aggregation_endpoint' => false ];
		$new_value = [ 'enable_schema_aggregation_endpoint' => true ];

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'schema_aggregation_endpoint_enabled_on' )
			->andReturn( 1234567890 );

		$this->options_helper
			->expects( 'set' )
			->never();

		$result = $this->instance->check_schema_aggregator_enabled( $old_value, $new_value );

		$this->assertFalse( $result );
	}
}
