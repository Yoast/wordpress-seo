<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Schema_Enhancement_Factory;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Schema_Enhancement_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Schema_Enhancement_Factory tests.
 */
abstract class Abstract_Schema_Enhancement_Factory_Test extends TestCase {

	/**
	 * The Article_Schema_Enhancer mock.
	 *
	 * @var Mockery\MockInterface|Article_Schema_Enhancer
	 */
	protected $article_enhancer;

	/**
	 * The Person_Schema_Enhancer mock.
	 *
	 * @var Mockery\MockInterface|Person_Schema_Enhancer
	 */
	protected $person_enhancer;

	/**
	 * The instance under test.
	 *
	 * @var Schema_Enhancement_Factory
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->article_enhancer = Mockery::mock( Article_Schema_Enhancer::class );
		$this->person_enhancer  = Mockery::mock( Person_Schema_Enhancer::class );
		$this->instance         = new Schema_Enhancement_Factory(
			$this->article_enhancer,
			$this->person_enhancer
		);
	}
}
