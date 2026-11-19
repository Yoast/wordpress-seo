<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Features;

use Yoast\WP\SEO\Abilities\Infrastructure\Features\Schema_Aggregation_Endpoint_Feature;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Schema_Aggregation_Endpoint_Feature class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Features\Schema_Aggregation_Endpoint_Feature
 */
final class Schema_Aggregation_Endpoint_Feature_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Schema_Aggregation_Endpoint_Feature
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Schema_Aggregation_Endpoint_Feature();
	}

	/**
	 * Tests that the getters describe the feature.
	 *
	 * @covers ::get_key
	 * @covers ::get_option_name
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_getters() {
		$this->assertSame( 'schema_aggregation_endpoint', $this->instance->get_key() );
		$this->assertSame( 'enable_schema_aggregation_endpoint', $this->instance->get_option_name() );
		$this->assertSame( 'Schema aggregation endpoint', $this->instance->get_name() );
	}

	/**
	 * Tests that is_available always returns true, as the feature can be changed on every site.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Features\Abstract_Feature::is_available
	 *
	 * @return void
	 */
	public function test_is_available() {
		$this->assertTrue( $this->instance->is_available() );
	}
}
