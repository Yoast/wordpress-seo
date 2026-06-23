<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Posts_Route;

use Mockery;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Bulk_Editor\Application\Posts\Posts_Collector_Interface;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Page;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Query;

/**
 * Tests get_posts.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Route::get_posts
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Route::is_valid_content_type
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Posts_Test extends Abstract_Posts_Route_Test {

	/**
	 * Tests that a valid content type builds a query and returns the posts in a response.
	 *
	 * @return void
	 */
	public function test_get_posts_valid() {
		$rows = [
			'posts'       => [
				[
					'id'    => 7,
					'title' => 'Hello world',
				],
			],
			'total'       => 1,
			'total_pages' => 1,
			'page'        => 1,
			'per_page'    => 20,
		];

		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )->with( 'content_type' )->andReturn( 'page' );
		$request->expects( 'get_param' )->with( 'page' )->andReturn( 1 );
		$request->expects( 'get_param' )->with( 'per_page' )->andReturn( 20 );
		$request->expects( 'get_param' )->with( 'search' )->andReturn( 'seo' );
		$request->expects( 'get_param' )->with( 'status' )->andReturn( [ 'draft', 'pending' ] );

		$this->content_types_repository
			->expects( 'get_content_types' )
			->once()
			->andReturn(
				[
					[
						'name'  => 'page',
						'label' => 'Pages',
					],
				],
			);

		$posts_page = Mockery::mock( Posts_Page::class );
		$posts_page->expects( 'to_array' )->once()->andReturn( $rows );

		// The selected statuses are carried through to the query unchanged.
		$this->posts_repository
			->expects( 'get_posts' )
			->once()
			->with(
				Mockery::on(
					static function ( $query ) {
						return $query instanceof Posts_Query
							&& $query->get_statuses() === [ 'draft', 'pending' ];
					},
				),
			)
			->andReturn( $posts_page );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->get_posts( $request ) );
	}

	/**
	 * Tests that an empty status selection falls back to all statuses, so it never returns zero results.
	 *
	 * @return void
	 */
	public function test_get_posts_falls_back_to_all_statuses_when_none_selected() {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )->with( 'content_type' )->andReturn( 'page' );
		$request->expects( 'get_param' )->with( 'page' )->andReturn( 1 );
		$request->expects( 'get_param' )->with( 'per_page' )->andReturn( 20 );
		$request->expects( 'get_param' )->with( 'search' )->andReturn( '' );
		$request->expects( 'get_param' )->with( 'status' )->andReturn( [] );

		$this->content_types_repository
			->expects( 'get_content_types' )
			->once()
			->andReturn(
				[
					[
						'name'  => 'page',
						'label' => 'Pages',
					],
				],
			);

		$posts_page = Mockery::mock( Posts_Page::class );
		$posts_page->expects( 'to_array' )->once()->andReturn( [] );

		$this->posts_repository
			->expects( 'get_posts' )
			->once()
			->with(
				Mockery::on(
					static function ( $query ) {
						return $query instanceof Posts_Query
							&& $query->get_statuses() === Posts_Collector_Interface::STATUSES;
					},
				),
			)
			->andReturn( $posts_page );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->get_posts( $request ) );
	}

	/**
	 * Tests that an unknown content type returns a WP_Error.
	 *
	 * @return void
	 */
	public function test_get_posts_invalid_content_type() {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )->with( 'content_type' )->andReturn( 'unknown' );

		$this->content_types_repository
			->expects( 'get_content_types' )
			->once()
			->andReturn(
				[
					[
						'name'  => 'page',
						'label' => 'Pages',
					],
				],
			);

		$this->posts_repository->expects( 'get_posts' )->never();

		// Defines the WP_Error class, which is not available in the unit test context.
		Mockery::mock( WP_Error::class );

		$this->assertInstanceOf( WP_Error::class, $this->instance->get_posts( $request ) );
	}
}
