<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Person_Config;

/**
 * Tests the Person_Schema_Enhancer class.
 *
 * @group schema-aggregator
 *
 * @coversDefaultClass \Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer
 */
final class Set_Person_Config_Test extends Abstract_Person_Schema_Enhancer_Test {

	/**
	 * The Person_Config mock.
	 *
	 * @var Person_Config|Mockery\MockInterface
	 */
	protected $config;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->config = Mockery::mock( Person_Config::class );
		$this->instance->set_person_config( $this->config );
	}

	/**
	 * Tests set_person_config() method.
	 *
	 * @covers ::set_person_config
	 *
	 * @return void
	 */
	public function test_set_person_config() {
		$config   = Mockery::mock( Person_Config::class );
		$instance = new Person_Schema_Enhancer();

		$instance->set_person_config( $config );

		$this->assertInstanceOf( Person_Schema_Enhancer::class, $instance );
	}
}
