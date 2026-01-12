<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Person_Config;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Person_Schema_Enhancer tests.
 */
abstract class Abstract_Person_Schema_Enhancer_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Person_Schema_Enhancer
	 */
	protected $instance;

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

		$this->instance = new Person_Schema_Enhancer();
		$this->config   = Mockery::mock( Person_Config::class );
		$this->instance->set_person_config( $this->config );
	}
}
