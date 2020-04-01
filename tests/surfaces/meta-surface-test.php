<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Surfaces
 */

use Brain\Monkey;
use Yoast\WP\Free\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Integrations\Front_End_Integration;
use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Meta_Surface_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Surfaces\Meta_Surface
 *
 * @group indexables
 * @group surfaces
 */
class Meta_Surface_Test extends TestCase {

	/**
	 * The container
	 *
	 * @var ContainerInterface
	 */
	protected $container;

	/**
	 * The context memoizer
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	protected $context_memoizer;

	/**
	 * The repository
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The front_end
	 *
	 * @var Front_End_Integration
	 */
	protected $front_end;

	/**
	 * The context
	 *
	 * @var Meta_Tags_Context
	 */
	protected $context;

	/**
	 * The indexable
	 *
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * The instance
	 *
	 * @var Meta_Surface
	 */
	protected $instance;

	/**
	 * Sets up the test instance.
	 *
	 * @return void
	 */
	protected function setUp() {
		$this->container = Mockery::mock( ContainerInterface::class );
		$this->context_memoizer = Mockery::mock( Meta_Tags_Context_Memoizer::class );
		$this->repository = Mockery::mock( Indexable_Repository::class );
		$this->front_end = Mockery::mock( Front_End_Integration::class );
		$this->context = Mockery::mock( Meta_Tags_Context::class );
		$this->indexable = Mockery::mock( Indexable::class );

		$this->instance = new Meta_Surface(
			$this->container,
			$this->context_memoizer,
			$this->repository,
			$this->front_end
		);

		parent::setUp();
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_current_page
	 */
	public function test_for_current_page() {
		$this->context_memoizer->expects( 'for_current_page' )->once()->andReturn( $this->context );

		$meta = $this->instance->for_current_page();

		$this->assertEquals( $this->context, $meta->context );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_home_page
	 */
	public function test_for_home_page() {
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_on_front' )->andReturn( 0 );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'show_on_front' )->andReturn( 'posts' );
		$this->repository->expects( 'find_for_home_page' )->once()->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Home_Page' )->andReturn( $this->context );

		$meta = $this->instance->for_home_page();

		$this->assertEquals( $this->context, $meta->context );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_home_page
	 * @expectedException Exception
	 * @expectedExceptionMessage Could not find meta for home page.
	 */
	public function test_for_home_page_no_indexable() {
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_on_front' )->andReturn( 0 );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'show_on_front' )->andReturn( 'posts' );
		$this->repository->expects( 'find_for_home_page' )->once()->andReturn( null );

		$this->instance->for_home_page();
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_home_page
	 */
	public function test_for_home_page_static_page() {
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_on_front' )->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'show_on_front' )->andReturn( 'page' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' )->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Static_Home_Page' )->andReturn( $this->context );

		$meta = $this->instance->for_home_page();

		$this->assertEquals( $this->context, $meta->context );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_home_page
	 * @expectedException Exception
	 * @expectedExceptionMessage Could not find meta for home page.
	 */
	public function test_for_home_page_static_page_no_indexable() {
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_on_front' )->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'show_on_front' )->andReturn( 'page' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' )->andReturn( null );

		$this->instance->for_home_page();
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_posts_page
	 */
	public function test_for_posts_page() {
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_for_posts' )->andReturn( 0 );
		$this->repository->expects( 'find_for_home_page' )->once()->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Home_Page' )->andReturn( $this->context );

		$meta = $this->instance->for_posts_page();

		$this->assertEquals( $this->context, $meta->context );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_posts_page
	 * @expectedException Exception
	 * @expectedExceptionMessage Could not find meta for posts page.
	 */
	public function test_for_posts_page_no_indexable() {
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_for_posts' )->andReturn( 0 );
		$this->repository->expects( 'find_for_home_page' )->once()->andReturn( null );

		$this->instance->for_posts_page();
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_posts_page
	 */
	public function test_for_posts_page_with_page() {
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_for_posts' )->andReturn( 1 );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' )->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Static_Posts_Page' )->andReturn( $this->context );

		$meta = $this->instance->for_posts_page();

		$this->assertEquals( $this->context, $meta->context );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_posts_page
	 * @expectedException Exception
	 * @expectedExceptionMessage Could not find meta for posts page.
	 */
	public function test_for_posts_page_with_page_no_indexable() {
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_for_posts' )->andReturn( 1 );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' )->andReturn( null );

		$this->instance->for_posts_page();
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_date_archive
	 */
	public function test_for_date_archive() {
		$this->repository->expects( 'find_for_date_archive' )->once()->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Date_Archive' )->andReturn( $this->context );

		$meta = $this->instance->for_date_archive();

		$this->assertEquals( $this->context, $meta->context );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_date_archive
	 * @expectedException Exception
	 * @expectedExceptionMessage Could not find meta for date archive.
	 */
	public function test_for_date_archive_no_indexable() {
		$this->repository->expects( 'find_for_date_archive' )->once()->andReturn( null );
		$this->instance->for_date_archive();
	}

	/**
	 * Tests the post type archive function.
	 *
	 * @covers ::for_post_type_archive
	 */
	public function test_for_post_type_archive() {
		$this->repository->expects( 'find_for_post_type_archive' )->once()->with( 'post_type' )->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Post_Type_Archive' )->andReturn( $this->context );

		$meta = $this->instance->for_post_type_archive( 'post_type' );

		$this->assertEquals( $this->context, $meta->context );
	}

	/**
	 * Tests the post type archive function.
	 *
	 * @covers ::for_post_type_archive
	 * @expectedException Exception
	 * @expectedExceptionMessage Could not find meta for post type archive: post_type.
	 */
	public function test_for_post_type_archive_no_indexable() {
		$this->repository->expects( 'find_for_post_type_archive' )->once()->with( 'post_type' )->andReturn( null );
		$this->instance->for_post_type_archive( 'post_type' );
	}
}
