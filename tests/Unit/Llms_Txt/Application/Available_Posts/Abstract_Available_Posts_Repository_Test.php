<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Available_Posts;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\Application\Available_Posts\Available_Posts_Repository;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Content\Automatic_Post_Collection;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Available_Posts_Repository tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Available_Posts_Repository_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Available_Posts_Repository
	 */
	protected $instance;

	/**
	 * The automatic post collection.
	 *
	 * @var Mockery\MockInterface|Automatic_Post_Collection
	 */
	protected $automatic_post_collection;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->automatic_post_collection = Mockery::mock( Automatic_Post_Collection::class );

		$this->instance = new Available_Posts_Repository( $this->automatic_post_collection );
	}
}
