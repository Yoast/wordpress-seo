<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Available_Posts;

use Brain\Monkey;
use Generator;
use Mockery;
use WP_Post_Type;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Llms_Txt\Domain\Available_Posts\Data_Provider\Data_Container;
use Yoast\WP\SEO\Llms_Txt\Domain\Available_Posts\Data_Provider\Parameters;

/**
 * Test class for the get_available_posts method.
 *
 * @group available_posts_route
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Available_Posts_Route::get_available_posts
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Available_Posts_Route::validate_request_parameters
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Available_Posts\Data_Provider\Parameters::get_post_type
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Available_Posts\Data_Provider\Parameters::get_search_filter
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Available_Posts_Route_Get_Posts_Test extends Abstract_Available_Posts_Route_Test {

	/**
	 * Tests get_available_posts.
	 *
	 * @dataProvider data_get_available_posts
	 *
	 * @param string                $post_type             The post type argument.
	 * @param string                $search                The search argument.
	 * @param array<string, string> $response              The expected response.
	 * @param int                   $response_code         The expected response code.
	 * @param WP_Post_Type          $post_type_object      The post type object.
	 * @param int                   $available_posts_times The number of times the available posts repository is called.
	 *
	 * @return void
	 */
	public function test_get_available_posts(
		$post_type,
		$search,
		$response,
		$response_code,
		$post_type_object,
		$available_posts_times
	) {

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$data_container_mock   = Mockery::mock( Data_Container::class );

		$data_container_mock
			->expects( 'to_array' )
			->times( $available_posts_times )
			->andReturn( [] );

		$wp_rest_response_mock
			->expects( '__construct' )
			->with( $response, $response_code )
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_param' )
			->once()
			->with( 'postType' )
			->andReturn( $post_type );
		$wp_rest_request
			->expects( 'get_param' )
			->once()
			->with( 'search' )
			->andReturn( $search );

		Monkey\Functions\expect( 'get_post_type_object' )
			->once()
			->andReturn( $post_type_object );

		$this->available_posts_repository
			->expects( 'get_posts' )
			->with(
				Mockery::on(
					static function ( $request_parameters ) use ( $post_type, $search ) {

						return $request_parameters instanceof Parameters
						&& $request_parameters->get_post_type() === $post_type
						&& $request_parameters->get_search_filter() === $search;
					}
				)
			)
			->times( $available_posts_times )
			->andReturn( $data_container_mock );

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->get_available_posts( $wp_rest_request )
		);
	}

	/**
	 * Data provider for test_get_available_posts.
	 *
	 * @return Generator Test data to use
	 */
	public static function data_get_available_posts() {
		$post_type_object = Mockery::mock( WP_Post_Type::class );

		yield 'Asking for posts and with a search term' => [
			'post_type'             => 'post',
			'search'                => 'test',
			'response'              => [],
			'response_code'         => 200,
			'post_type_object'      => $post_type_object,
			'available_posts_times' => 1,
		];
		yield 'Asking for a non-valid post type' => [
			'post_type'             => 'post',
			'search'                => '',
			'response'              => [
				'error' => 'The post type asked is not valid',
			],
			'response_code'         => 400,
			'post_type_object'      => null,
			'available_posts_times' => 0,
		];
	}
}
