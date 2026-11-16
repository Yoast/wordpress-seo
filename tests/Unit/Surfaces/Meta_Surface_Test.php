<?php

namespace Yoast\WP\SEO\Tests\Unit\Surfaces;

use Brain\Monkey;
use Brain\Monkey\Filters;
use Mockery;
use WP_Post;
use WP_Rewrite;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;
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
final class Meta_Surface_Test extends TestCase {

	/**
	 * The container.
	 *
	 * @var ContainerInterface
	 */
	protected $container;

	/**
	 * The context memoizer.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	protected $context_memoizer;

	/**
	 * The repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The context.
	 *
	 * @var Meta_Tags_Context_Mock
	 */
	protected $context;

	/**
	 * The indexable.
	 *
	 * @var Indexable_Mock
	 */
	protected $indexable;

	/**
	 * Represents the WP rewrite wrapper.
	 *
	 * @var WP_Rewrite_Wrapper
	 */
	private $wp_rewrite_wrapper;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * The instance.
	 *
	 * @var Meta_Surface
	 */
	protected $instance;

	/**
	 * Sets up the test instance.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->container          = Mockery::mock( ContainerInterface::class );
		$this->context_memoizer   = Mockery::mock( Meta_Tags_Context_Memoizer::class );
		$this->repository         = Mockery::mock( Indexable_Repository::class );
		$this->context            = Mockery::mock( Meta_Tags_Context_Mock::class );
		$this->wp_rewrite_wrapper = Mockery::mock( WP_Rewrite_Wrapper::class );
		$this->indexable_helper   = Mockery::mock( Indexable_Helper::class );
		$this->indexable          = Mockery::mock( Indexable_Mock::class );

		$this->instance = new Meta_Surface(
			$this->container,
			$this->context_memoizer,
			$this->repository,
			$this->wp_rewrite_wrapper,
			$this->indexable_helper,
		);

		$this->context->presentation = (object) [ 'test' => 'succeeds' ];
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_current_page
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_for_home_page_0_page_on_front() {
		$this->container->expects( 'get' )->times( 3 )->andReturn( null );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'page_on_front' )->andReturn( '0' );
		Monkey\Functions\expect( 'get_option' )->once()->with( 'show_on_front' )->andReturn( 'page' );
		$this->repository->expects( 'find_for_home_page' )->once()->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Home_Page' )->andReturn( $this->context );

		$meta = $this->instance->for_home_page();

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Tests the current page function.
	 *
	 * @covers ::for_home_page
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_for_post_type_archive_no_indexable() {
		$this->repository->expects( 'find_for_post_type_archive' )->once()->with( 'post_type' )->andReturn( null );
		$this->instance->for_post_type_archive( 'post_type' );
	}

	/**
	 * Tests the search result function.
	 *
	 * @covers ::for_search_result
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_for_search_result_no_indexable() {
		$this->repository->expects( 'find_for_system_page' )->once()->with( 'search-result' )->andReturn( null );
		$this->assertFalse( $this->instance->for_search_result() );
	}

	/**
	 * Tests the 404 function.
	 *
	 * @covers ::for_404
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_for_404_no_indexable() {
		$this->repository->expects( 'find_for_system_page' )->once()->with( '404' )->andReturn( null );
		$this->assertFalse( $this->instance->for_404() );
	}

	/**
	 * Tests the post function.
	 *
	 * @covers ::for_post
	 *
	 * @return void
	 */
	public function test_for_post() {
		$this->container->expects( 'get' )->times( 3 )->andReturn( null );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' )->andReturn( $this->indexable );
		$this->context_memoizer->expects( 'get' )->with( $this->indexable, 'Post_Type' )->andReturn( $this->context );

		$meta = $this->instance->for_post( 1 );

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Tests the posts function.
	 *
	 * @covers ::for_posts
	 *
	 * @return void
	 */
	public function test_for_posts() {
		$this->container->expects( 'get' )->times( 15 )->andReturn( null );
		$this->repository
			->expects( 'find_by_multiple_ids_and_type' )
			->once()
			->with( [ 1, 2, 3, 4, 5 ], 'post' )
			->andReturn( \array_fill( 0, 5, $this->indexable ) );
		$this->context_memoizer->expects( 'get' )->times( 5 )->with( $this->indexable, 'Post_Type' )->andReturn( $this->context );

		$results = $this->instance->for_posts( [ 1, 2, 3, 4, 5 ] );

		$this->assertEquals( 'succeeds', $results[0]->test );
	}

	/**
	 * Tests the post function.
	 *
	 * @covers ::for_post
	 *
	 * @return void
	 */
	public function test_for_post_no_indexable() {
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'post' )->andReturn( null );
		$this->instance->for_post( 1 );
	}

	/**
	 * Tests the term function.
	 *
	 * @covers ::for_term
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_for_term_no_indexable() {
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'term' )->andReturn( null );
		$this->instance->for_term( 1 );
	}

	/**
	 * Tests the author function.
	 *
	 * @covers ::for_author
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_for_author_no_indexable() {
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'user' )->andReturn( null );
		$this->instance->for_author( 1 );
	}

	/**
	 * Tests the url function.
	 *
	 * @covers ::for_url
	 * @covers ::is_post_readable
	 * @dataProvider for_url_provider
	 *
	 * @param string $object_type     The object type.
	 * @param string $object_sub_type The object sub type.
	 * @param int    $object_id       The object id.
	 * @param string $page_type       The page type.
	 * @param bool   $is_date_archive Optional. Whether the page is a date archive. Defaults to false.
	 *
	 * @return void
	 */
	public function test_for_url( $object_type, $object_sub_type, $object_id, $page_type, $is_date_archive = false ) {
		$wp_rewrite = Mockery::mock( WP_Rewrite::class );

		Monkey\Functions\expect( 'wp_parse_url' )
			->times( 3 )
			->andReturnUsing(
				static function ( $url, $component = -1 ) use ( $page_type, $is_date_archive ) {
					switch ( $url ) {
						case 'url':
							$path = '';
							if ( $is_date_archive ) {
								$path = '/2021/08/';
							}
							elseif ( \strpos( $page_type, 'Home_Page' ) === false ) {
								$path = '/path';
							}

							return [
								'host' => 'host',
								'path' => $path,
							];

						case 'https://www.example.org':
							return [
								'scheme' => 'scheme',
								'host'   => 'host',
							];

						default:
							// phpcs:ignore WordPress.WP.AlternativeFunctions.parse_url_parse_url -- Test mock.
							return \parse_url( $url, $component );
					}
				},
			);

		$this->container->expects( 'get' )
			->times( 3 )
			->andReturn( null );

		if ( $is_date_archive ) {
			$this->repository->expects( 'find_for_date_archive' )
				->once()
				->andReturn( $this->indexable );
		}
		elseif ( \strpos( $page_type, 'Home_Page' ) === false ) {
			$this->repository->expects( 'find_by_permalink' )
				->once()
				->with( 'scheme://host/path' )
				->andReturn( $this->indexable );
		}
		else {
			$this->repository->expects( 'find_by_permalink' )
				->once()
				->with( 'scheme://host' )
				->andReturn( $this->indexable );
		}

		$times = ( \strpos( $page_type, 'Home_Page' ) === false ) ? 1 : 0;
		$this->wp_rewrite_wrapper->expects( 'get' )
			->times( $times )
			->andReturn( $wp_rewrite );

		$wp_rewrite->expects( 'get_date_permastruct' )
			->times( $times )
			->andReturn( 'date_permastruct' );

		$wp_rewrite->expects( 'generate_rewrite_rules' )
			->times( $times )
			->with( 'date_permastruct', \EP_DATE )
			->andReturn( [] );

		Filters\expectApplied( 'date_rewrite_rules' )
			->times( $times )
			->andReturn(
				[
					'([0-9]{4})/page/?([0-9]{1,})/?$' => 'index.php?year=$matches[1]&paged=$matches[2]',
					'([0-9]{4})/([0-9]{1,2})/?$'      => 'index.php?year=$matches[1]&monthnum=$matches[2]',
					'([0-9]{4})/?$'                   => 'index.php?year=$matches[1]',
				],
			);

		$this->indexable->object_type     = $object_type;
		$this->indexable->object_id       = $object_id;
		$this->indexable->object_sub_type = $object_sub_type;

		if ( $object_type === 'post' ) {
			$post     = Mockery::mock( WP_Post::class );
			$post->ID = $object_id;

			Monkey\Functions\expect( 'get_post' )->once()->with( $object_id )->andReturn( $post );
			Monkey\Functions\expect( 'is_post_publicly_viewable' )->once()->with( $post )->andReturnTrue();
		}

		$this->indexable_helper->expects( 'get_page_type_for_indexable' )->with( $this->indexable )->andReturn( $page_type );

		$this->context_memoizer->expects( 'get' )->with( $this->indexable, $page_type )->andReturn( $this->context );

		$meta = $this->instance->for_url( 'url' );

		$this->assertEquals( 'succeeds', $meta->test );
	}

	/**
	 * Tests the url function for posts that are not publicly viewable.
	 *
	 * @covers ::for_url
	 * @covers ::is_post_readable
	 * @dataProvider data_for_url_with_non_public_post
	 *
	 * @param bool $post_exists   Whether the post exists.
	 * @param bool $user_can_read Whether the current user can read the post.
	 * @param bool $expected      Whether meta is expected to be returned.
	 *
	 * @return void
	 */
	public function test_for_url_with_non_public_post( $post_exists, $user_can_read, $expected ) {
		$instance = Mockery::mock(
			Meta_Surface::class,
			[
				$this->container,
				$this->context_memoizer,
				$this->repository,
				$this->wp_rewrite_wrapper,
				$this->indexable_helper,
			],
		)
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		Monkey\Functions\stubs(
			[
				'wp_parse_url' => static function ( $url ) {
					return \parse_url( $url );
				},
			],
		);

		$instance->expects( 'is_date_archive_url' )->once()->andReturnFalse();

		$this->indexable->object_type = 'post';
		$this->indexable->object_id   = 1;

		$this->repository->expects( 'find_by_permalink' )
			->once()
			->with( 'https://www.example.org/private-post/' )
			->andReturn( $this->indexable );

		$post     = null;
		$can_read = 0;
		if ( $post_exists ) {
			$post     = Mockery::mock( WP_Post::class );
			$post->ID = 1;
			$can_read = 1;

			Monkey\Functions\expect( 'is_post_publicly_viewable' )->once()->with( $post )->andReturnFalse();
		}

		Monkey\Functions\expect( 'get_post' )->once()->with( 1 )->andReturn( $post );
		Monkey\Functions\expect( 'current_user_can' )
			->times( $can_read )
			->with( 'read_post', 1 )
			->andReturn( $user_can_read );

		$page_type_times = ( $expected ) ? 1 : 0;
		$this->indexable_helper->expects( 'get_page_type_for_indexable' )
			->times( $page_type_times )
			->with( $this->indexable )
			->andReturn( 'Post_Type' );
		$this->context_memoizer->expects( 'get' )
			->times( $page_type_times )
			->with( $this->indexable, 'Post_Type' )
			->andReturn( $this->context );
		$this->container->expects( 'get' )
			->times( $page_type_times * 3 )
			->andReturn( null );

		$meta = $instance->for_url( 'https://www.example.org/private-post/' );

		if ( $expected ) {
			$this->assertEquals( 'succeeds', $meta->test );
		}
		else {
			$this->assertFalse( $meta );
		}
	}

	/**
	 * Data provider for the test_for_url_with_non_public_post test.
	 *
	 * @return array<string, array<bool>>
	 */
	public static function data_for_url_with_non_public_post() {
		return [
			'Post not found'              => [ false, false, false ],
			'Private post, logged out'    => [ true, false, false ],
			'Private post, user can read' => [ true, true, true ],
		];
	}

	/**
	 * Data provider for the url test.
	 *
	 * @return array<string, array<string|int|bool|null>>
	 */
	public static function for_url_provider() {
		return [
			'Static_Home_Page'   => [ 'post', 'post', 1, 'Static_Home_Page' ],
			'Static_Posts_Page'  => [ 'post', 'post', 1, 'Static_Posts_Page' ],
			'Post_Type'          => [ 'post', 'post', 1, 'Post_Type' ],
			'Term_Archive'       => [ 'term', 'tag', 1, 'Term_Archive' ],
			'Author_Archive'     => [ 'user', null, 1, 'Author_Archive' ],
			'Home_Page'          => [ 'home-page', null, 1, 'Home_Page' ],
			'Post_Type_Archive'  => [ 'post-type-archive', 'book', 1, 'Post_Type_Archive' ],
			'Date_Archive'       => [ 'date-archive', null, 1, 'Date_Archive', true ],
			'Search_Result_Page' => [ 'system-page', 'search-result', 1, 'Search_Result_Page' ],
			'Error_Page'         => [ 'system-page', '404', 1, 'Error_Page' ],
		];
	}

	/**
	 * Tests the for_url function with malformed and invalid URL values.
	 *
	 * @covers ::for_url
	 * @dataProvider data_for_url_with_unexpected_value
	 *
	 * @param string $url The malformed/invalid URL.
	 *
	 * @return void
	 */
	public function test_for_url_with_unexpected_value( $url ) {

		Monkey\Functions\stubs(
			[
				'wp_parse_url' => static function ( $url ) {
					return \parse_url( $url );
				},
			],
		);

		$this->assertFalse( $this->instance->for_url( $url ) );
	}

	/**
	 * Data provider for the test_for_url_with_unexpected_value test.
	 *
	 * @return array<string, array<string>>
	 */
	public static function data_for_url_with_unexpected_value() {
		return [
			'malformed_url' => [ 'http:///example.com' ],
			'invalid_url'   => [ '' ],
		];
	}
}
