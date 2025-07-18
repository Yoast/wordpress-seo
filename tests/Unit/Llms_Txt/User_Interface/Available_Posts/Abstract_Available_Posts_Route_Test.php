<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Available_Posts;

use Mockery;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\Available_Posts\Available_Posts_Repository;
use Yoast\WP\SEO\Llms_Txt\User_Interface\Available_Posts_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Available_Posts_Route tests.
 *
 * @group available_posts_route
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Available_Posts_Route_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Available_Posts_Route
	 */
	protected $instance;

	/**
	 * Holds the mock for the data provider for available posts.
	 *
	 * @var Mockery\MockInterface|Available_Posts_Repository
	 */
	protected $available_posts_repository;

	/**
	 * Holds the mock for the capability helper.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->available_posts_repository = Mockery::mock( Available_Posts_Repository::class );
		$this->capability_helper          = Mockery::mock( Capability_Helper::class );

		$this->instance = new Available_Posts_Route(
			$this->available_posts_repository,
			$this->capability_helper
		);
	}
}
