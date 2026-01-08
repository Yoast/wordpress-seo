<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Article_Config;

/**
 * Tests the Article_Schema_Enhancer class.
 *
 * @group schema-aggregator
 *
 * @coversDefaultClass \Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer
 */
final class Set_Article_Config_Test extends Abstract_Article_Schema_Enhancer_Test {

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

		$this->config = Mockery::mock( Article_Config::class );
		$this->instance->set_article_config( $this->config );
	}

	/**
	 * Tests set_article_config() method.
	 *
	 * @covers ::set_article_config
	 *
	 * @return void
	 */
	public function test_set_article_config() {
		$config   = Mockery::mock( Article_Config::class );
		$instance = new Article_Schema_Enhancer();

		$instance->set_article_config( $config );

		$this->assertInstanceOf( Article_Schema_Enhancer::class, $instance );
	}
}
