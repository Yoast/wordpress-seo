<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Surfaces
 */

namespace Yoast\WP\SEO\Tests\Surfaces;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\TestCase;
use Yoast\WP\SEO\Wrappers\WP_Rewrite_Wrapper;
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
	 * The context
	 *
	 * @var Meta_Tags_Context_Mock
	 */
	protected $context;

	/**
	 * The indexable
	 *
	 * @var Indexable_Mock
	 */
	protected $indexable;

	/**
	 * @var WP_Rewrite_Wrapper
	 */
	private $wp_rewrite_wrapper;

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
		$this->container          = Mockery::mock( ContainerInterface::class );
		$this->context_memoizer   = Mockery::mock( Meta_Tags_Context_Memoizer::class );
		$this->repository         = Mockery::mock( Indexable_Repository::class );
		$this->context            = Mockery::mock( Meta_Tags_Context_Mock::class );
		$this->wp_rewrite_wrapper = Mockery::mock( WP_Rewrite_Wrapper::class );
		$this->indexable          = Mockery::mock( Indexable_Mock::class );

		$this->instance = new Meta_Surface(
			$this->container,
			$this->context_memoizer,
			$this->repository,
			$this->wp_rewrite_wrapper
		);

		$this->context->presentation = (object) [ 'test' => 'succeeds' ];

		parent::setUp();
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_current_page
	 */
	public function test_for_current_page() {
		$this->container->expects( 'get' )->times( 3 )->andReturn( null );
		$this->context_memoizer->expects( 'for_current_page' )->once()->andReturn( $this->context );

		$meta = $this->instance->for_current_page();

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_home_page
	 */
	public function test_for_home_page() {
		$this->container->expects( 'get' )->times( 3 )->andReturn( null );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_on_front' )->andReturn( 0 );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'show_on_front' )->andReturn( 'posts' );
		$this->repository->expects( 'find_for_home_page' )->once()->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Home_Page' )->andReturn( $this->context );

		$meta = $this->instance->for_home_page();

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_home_page
	 */
	public function test_for_home_page_no_indexable() {
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_on_front' )->andReturn( 0 );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'show_on_front' )->andReturn( 'posts' );
		$this->repository->expects( 'find_for_home_page' )->once()->andReturn( null );

		$this->assertFalse( $this->instance->for_home_page() );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_home_page
	 */
	public function test_for_home_page_static_page() {
		$this->container->expects( 'get' )->times( 3 )->andReturn( null );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_on_front' )->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'show_on_front' )->andReturn( 'page' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' )->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Static_Home_Page' )->andReturn( $this->context );

		$meta = $this->instance->for_home_page();

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_home_page
	 */
	public function test_for_home_page_static_page_no_indexable() {
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_on_front' )->andReturn( 1 );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'show_on_front' )->andReturn( 'page' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' )->andReturn( null );

		$this->assertFalse( $this->instance->for_home_page() );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_posts_page
	 */
	public function test_for_posts_page() {
		$this->container->expects( 'get' )->times( 3 )->andReturn( null );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_for_posts' )->andReturn( 0 );
		$this->repository->expects( 'find_for_home_page' )->once()->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Home_Page' )->andReturn( $this->context );

		$meta = $this->instance->for_posts_page();

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_posts_page
	 */
	public function test_for_posts_page_no_indexable() {
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_for_posts' )->andReturn( 0 );
		$this->repository->expects( 'find_for_home_page' )->once()->andReturn( null );

		$this->assertFalse( $this->instance->for_posts_page() );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_posts_page
	 */
	public function test_for_posts_page_with_page() {
		$this->container->expects( 'get' )->times( 3 )->andReturn( null );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_for_posts' )->andReturn( 1 );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' )->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Static_Posts_Page' )->andReturn( $this->context );

		$meta = $this->instance->for_posts_page();

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_posts_page
	 */
	public function test_for_posts_page_with_page_no_indexable() {
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_for_posts' )->andReturn( 1 );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' )->andReturn( null );

		$this->assertFalse( $this->instance->for_posts_page() );
	}

	/**
	 * Tests the post type archive function.
	 *
	 * @covers ::for_post_type_archive
	 */
	public function test_for_post_type_archive() {
		$this->container->expects( 'get' )->times( 3 )->andReturn( null );
		$this->repository->expects( 'find_for_post_type_archive' )->once()->with( 'post_type' )->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Post_Type_Archive' )->andReturn( $this->context );

		$meta = $this->instance->for_post_type_archive( 'post_type' );

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Tests the post type archive function.
	 *
	 * @covers ::for_post_type_archive
	 */
	public function test_for_post_type_archive_no_indexable() {
		$this->repository->expects( 'find_for_post_type_archive' )->once()->with( 'post_type' )->andReturn( null );
		$this->instance->for_post_type_archive( 'post_type' );
	}

	/**
	 * Tests the search result function.
	 *
	 * @covers ::for_search_result
	 */
	public function test_for_search_result() {
		$this->container->expects( 'get' )->times( 3 )->andReturn( null );
		$this->repository->expects( 'find_for_system_page' )->once()->with( 'search-result' )->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Search_Result_Page' )->andReturn( $this->context );

		$meta = $this->instance->for_search_result();

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Tests the search result function.
	 *
	 * @covers ::for_search_result
	 */
	public function test_for_search_result_no_indexable() {
		$this->repository->expects( 'find_for_system_page' )->once()->with( 'search-result' )->andReturn( null );
		$this->assertFalse( $this->instance->for_search_result() );
	}

	/**
	 * Tests the 404 function.
	 *
	 * @covers ::for_404
	 */
	public function test_for_404() {
		$this->container->expects( 'get' )->times( 3 )->andReturn( null );
		$this->repository->expects( 'find_for_system_page' )->once()->with( '404' )->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Error_Page' )->andReturn( $this->context );

		$meta = $this->instance->for_404();

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Tests the 404 function.
	 *
	 * @covers ::for_404
	 */
	public function test_for_404_no_indexable() {
		$this->repository->expects( 'find_for_system_page' )->once()->with( '404' )->andReturn( null );
		$this->assertFalse( $this->instance->for_404() );
	}

	/**
	 * Tests the post function.
	 *
	 * @covers ::for_post
	 */
	public function test_for_post() {
		$this->container->expects( 'get' )->times( 3 )->andReturn( null );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' )->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Post_Type' )->andReturn( $this->context );

		$meta = $this->instance->for_post( 1 );

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Tests the post function.
	 *
	 * @covers ::for_post
	 */
	public function test_for_post_no_indexable() {
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' )->andReturn( null );
		$this->instance->for_post( 1 );
	}

	/**
	 * Tests the term function.
	 *
	 * @covers ::for_term
	 */
	public function test_for_term() {
		$this->container->expects( 'get' )->times( 3 )->andReturn( null );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'term' )->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Term_Archive' )->andReturn( $this->context );

		$meta = $this->instance->for_term( 1 );

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Tests the term function.
	 *
	 * @covers ::for_term
	 */
	public function test_for_term_no_indexable() {
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'term' )->andReturn( null );
		$this->instance->for_term( 1 );
	}

	/**
	 * Tests the author function.
	 *
	 * @covers ::for_author
	 */
	public function test_for_author() {
		$this->container->expects( 'get' )->times( 3 )->andReturn( null );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'user' )->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Author_Archive' )->andReturn( $this->context );

		$meta = $this->instance->for_author( 1 );

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Tests the author function.
	 *
	 * @covers ::for_author
	 */
	public function test_for_author_no_indexable() {
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'user' )->andReturn( null );
		$this->instance->for_author( 1 );
	}

	/**
	 * Tests the url function.
	 *
	 * @param string $object_type       The object type.
	 * @param string $object_sub_type   The object sub type.
	 * @param int    $object_id         The object id.
	 * @param string $page_type         The page type.
	 * @param int    $front_page_id     The front page id.
	 * @param int    $page_for_posts_id The page for posts id.
	 *
	 * @covers ::for_url
	 * @dataProvider for_url_provider
	 */
	public function test_for_url( $object_type, $object_sub_type, $object_id, $page_type, $front_page_id, $page_for_posts_id ) {
		$wp_rewrite = Mockery::mock( 'WP_Rewrite' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->with( 'url' )
			->andReturn(
				[
					'host' => 'host',
					'path' => '/path',
				]
			);

		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->with( 'https://www.example.org' )
			->andReturn(
				[
					'scheme' => 'scheme',
					'host'   => 'host',
				]
			);

		$this->container->expects( 'get' )
			->times( 3 )
			->andReturn( null );

		$this->repository->expects( 'find_by_permalink' )
			->once()
			->with( 'scheme://host/path' )
			->andReturn( $this->indexable );

		$this->wp_rewrite_wrapper->expects( 'get' )
			->once()
			->andReturn( $wp_rewrite );

		$wp_rewrite->expects( 'get_date_permastruct' )
			->once()
			->andReturn( 'date_permastruct' );

		$wp_rewrite->expects( 'generate_rewrite_rules' )
			->once()
			->with( 'date_permastruct', \EP_DATE )
			->andReturn( [] );

		$this->indexable->object_type     = $object_type;
		$this->indexable->object_id       = $object_id;
		$this->indexable->object_sub_type = $object_sub_type;

		if ( $object_type === 'post' ) {
			Monkey\Functions\expect( 'get_option' )
				->once()
				->with( 'page_on_front' )
				->andReturn( $front_page_id );

			if ( $front_page_id === 0 ) {
				Monkey\Functions\expect( 'get_option' )
					->once()
					->with( 'page_for_posts' )
					->andReturn( $page_for_posts_id );
			}
		}

		$this->context_memoizer->expects( 'get' )->with( $this->indexable, $page_type )->andReturn( $this->context );

		$meta = $this->instance->for_url( 'url' );

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Data provider for the url test.
	 *
	 * @return array The test parameters.
	 */
	public function for_url_provider() {
		return [
			[ 'post', 'post', 1, 'Static_Home_Page', 1, 0 ],
			[ 'post', 'post', 1, 'Static_Posts_Page', 0, 1 ],
			[ 'post', 'post', 1, 'Post_Type', 0, 0 ],
			[ 'term', 'tag', 1, 'Term_Archive', 0, 0 ],
			[ 'user', null, 1, 'Author_Archive', 0, 0 ],
			[ 'home-page', null, 1, 'Home_Page', 0, 0 ],
			[ 'post-type-archive', 'book', 1, 'Post_Type_Archive', 0, 0 ],
			[ 'system-page', 'search-result', 1, 'Search_Result_Page', 0, 0 ],
			[ 'system-page', '404', 1, 'Error_Page', 0, 0 ],
		];
	}
}
