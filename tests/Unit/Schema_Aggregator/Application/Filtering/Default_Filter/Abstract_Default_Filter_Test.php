<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Filtering\Default_Filter;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Default_Filter;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Elements_Context_Map_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Default_Filter tests.
 */
final class Abstract_Default_Filter_Test extends TestCase {

	/**
	 * The instance of Default_Filter being tested.
	 *
	 * @var Default_Filter
	 */
	protected $instance;

	/**
	 * The elements context map repository mock.
	 *
	 * @var Mockery\MockInterface|Elements_Context_Map_Repository
	 */
	protected $elements_context_map_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->elements_context_map_repository = Mockery::mock( Elements_Context_Map_Repository::class );
		$this->instance                        = new Default_Filter( $this->elements_context_map_repository );
	}
}
