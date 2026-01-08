<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Article_Config;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Article_Schema_Enhancer tests.
 */
abstract class Abstract_Article_Schema_Enhancer_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Article_Schema_Enhancer
	 */
	protected $instance;

	/**
	 * The Article_Config mock.
	 *
	 * @var Article_Config|Mockery\MockInterface
	 */
	protected $config;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Article_Schema_Enhancer();
		$this->config   = Mockery::mock( Article_Config::class );
		$this->instance->set_article_config( $this->config );
	}
}
