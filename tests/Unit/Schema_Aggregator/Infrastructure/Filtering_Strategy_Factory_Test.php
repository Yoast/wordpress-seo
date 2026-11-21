<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure;

use Brain\Monkey\Filters;
use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Default_Filter;
use Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Filtering_Strategy_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Filtering_Strategy_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests for the Filtering_Strategy_Factory::create method.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Filtering_Strategy_Factory::create
 *
 * @group schema-aggregator
 */
final class Filtering_Strategy_Factory_Test extends TestCase {

	/**
	 * Tests that create returns the default filter when the filter is not overridden.
	 *
	 * @return void
	 */
	public function test_create_returns_default_filter() {
		Filters\expectApplied( 'wpseo_schema_aggregator_filtering_strategy' )
			->once()
			->andReturnFirstArg();

		$instance = new Filtering_Strategy_Factory();
		$result   = $instance->create();

		$this->assertInstanceOf( Default_Filter::class, $result );
	}

	/**
	 * Tests that create returns a custom strategy when the filter provides one.
	 *
	 * @return void
	 */
	public function test_create_returns_custom_strategy_from_filter() {
		$custom_strategy = Mockery::mock( Filtering_Strategy_Interface::class );

		Filters\expectApplied( 'wpseo_schema_aggregator_filtering_strategy' )
			->once()
			->andReturn( $custom_strategy );

		$instance = new Filtering_Strategy_Factory();
		$result   = $instance->create();

		$this->assertSame( $custom_strategy, $result );
	}

	/**
	 * Tests that create returns the default filter when the filter returns a non-strategy value.
	 *
	 * @return void
	 */
	public function test_create_returns_default_filter_when_filter_returns_invalid_value() {
		Filters\expectApplied( 'wpseo_schema_aggregator_filtering_strategy' )
			->once()
			->andReturn( 'not a strategy' );

		$instance = new Filtering_Strategy_Factory();
		$result   = $instance->create();

		$this->assertInstanceOf( Default_Filter::class, $result );
	}
}
