<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Posts_Content_Route;

use Brain\Monkey\Functions;
use Mockery;
use WP_Post;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Tests get_posts_content.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Content_Route::get_posts_content
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Posts_Content_Test extends Abstract_Posts_Content_Route_Test {

	/**
	 * Builds a request for the given IDs.
	 *
	 * @param array<int|string> $ids The requested IDs.
	 *
	 * @return Mockery\MockInterface|WP_REST_Request The request.
	 */
	private function create_request( array $ids ) {
		$request = Mockery::mock( WP_REST_Request::class );
		$request->expects( 'get_param' )->once()->with( 'ids' )->andReturn( $ids );

		// The cache is primed once, for the normalized IDs, so the checks per post do not each cost a query.
		Functions\expect( '_prime_post_caches' )
			->once()
			->with( \array_unique( \array_map( '\intval', $ids ) ), false, false );

		return $request;
	}

	/**
	 * Stubs the lookup of a post, listed in the bulk editor unless told otherwise.
	 *
	 * @param int    $post_id  The post ID.
	 * @param string $content  The stored post content.
	 * @param string $status   The post status.
	 * @param string $password The post password; a non-empty one marks the post password-protected.
	 *
	 * @return void
	 */
	private function expect_post( int $post_id, string $content, string $status = 'publish', string $password = '' ) {
		$post                = Mockery::mock( WP_Post::class );
		$post->post_content  = $content;
		$post->post_status   = $status;
		$post->post_password = $password;

		Functions\expect( 'get_post' )->once()->with( $post_id )->andReturn( $post );
	}

	/**
	 * Expects the response to be constructed with the given payload.
	 *
	 * WP_REST_Response is not loaded in the unit test suite, so it is overloaded; asserting on the constructor
	 * argument is what verifies the response body.
	 *
	 * @param array<string, array<array<string, int|string>>> $payload The expected response payload.
	 *
	 * @return void
	 */
	private function expect_response( array $payload ) {
		$response = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$response->expects( '__construct' )->once()->with( $payload );
	}

	/**
	 * Tests that the raw content of the requested posts is returned.
	 *
	 * @return void
	 */
	public function test_get_posts_content() {
		$this->allow_post( 11 );
		$this->allow_post( 22 );

		$this->expect_post( 11, 'Content of 11' );
		$this->expect_post( 22, 'Content of 22' );

		$this->expect_response(
			[
				'posts' => [
					[
						'id'      => 11,
						'content' => 'Content of 11',
					],
					[
						'id'      => 22,
						'content' => 'Content of 22',
					],
				],
			],
		);

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$this->instance->get_posts_content( $this->create_request( [ 11, 22 ] ) ),
		);
	}

	/**
	 * Tests that the content is returned unrendered, so the client can parse it the way the post editor does.
	 *
	 * @return void
	 */
	public function test_get_posts_content_returns_the_stored_content_unrendered() {
		$stored = "<!-- wp:paragraph -->\n<p>A [caption]captioned[/caption] paragraph.</p>\n<!-- /wp:paragraph -->";

		$this->allow_post( 11 );
		$this->expect_post( 11, $stored );

		$this->expect_response(
			[
				'posts' => [
					[
						'id'      => 11,
						'content' => $stored,
					],
				],
			],
		);

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$this->instance->get_posts_content( $this->create_request( [ 11 ] ) ),
		);
	}

	/**
	 * Tests that a post failing an access check is omitted instead of failing the whole request.
	 *
	 * @param string $failing_check The access check that fails.
	 *
	 * @dataProvider data_failing_access_checks
	 *
	 * @return void
	 */
	public function test_get_posts_content_omits_inaccessible_posts( string $failing_check ) {
		// The checks short-circuit in order, so only the ones up to and including the failing one run.
		foreach ( [ 'exists', 'is_supported_type', 'can_edit' ] as $check ) {
			$passes = ( $check !== $failing_check );
			$this->post_access_checker->expects( $check )->once()->with( 99 )->andReturn( $passes );
			if ( ! $passes ) {
				break;
			}
		}

		// The accessible post is still returned.
		$this->allow_post( 11 );
		$this->expect_post( 11, 'Kept.' );

		$this->expect_response(
			[
				'posts' => [
					[
						'id'      => 11,
						'content' => 'Kept.',
					],
				],
			],
		);

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$this->instance->get_posts_content( $this->create_request( [ 99, 11 ] ) ),
		);
	}

	/**
	 * Data provider for test_get_posts_content_omits_inaccessible_posts.
	 *
	 * @return array<string, array<string>>
	 */
	public static function data_failing_access_checks() {
		return [
			'the post no longer exists'      => [ 'failing_check' => 'exists' ],
			'the post type is not editable'  => [ 'failing_check' => 'is_supported_type' ],
			'the user may not edit the post' => [ 'failing_check' => 'can_edit' ],
		];
	}

	/**
	 * Tests that a duplicate ID is only resolved once.
	 *
	 * @return void
	 */
	public function test_get_posts_content_resolves_each_id_once() {
		$this->allow_post( 11 );
		$this->expect_post( 11, 'Once.' );

		$this->expect_response(
			[
				'posts' => [
					[
						'id'      => 11,
						'content' => 'Once.',
					],
				],
			],
		);

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$this->instance->get_posts_content( $this->create_request( [ 11, 11 ] ) ),
		);
	}

	/**
	 * Tests that IDs arriving as strings are cast, as they do from a comma separated query parameter.
	 *
	 * @return void
	 */
	public function test_get_posts_content_casts_string_ids() {
		$this->allow_post( 11 );
		$this->expect_post( 11, 'Cast.' );

		$this->expect_response(
			[
				'posts' => [
					[
						'id'      => 11,
						'content' => 'Cast.',
					],
				],
			],
		);

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$this->instance->get_posts_content( $this->create_request( [ '11' ] ) ),
		);
	}

	/**
	 * Tests that a post which disappears between the access check and the lookup is omitted, not fatal.
	 *
	 * @return void
	 */
	public function test_get_posts_content_omits_a_post_that_vanished_after_the_access_check() {
		$this->allow_post( 99 );
		Functions\expect( 'get_post' )->once()->with( 99 )->andReturnNull();

		// The accessible post is still returned.
		$this->allow_post( 11 );
		$this->expect_post( 11, 'Kept.' );

		$this->expect_response(
			[
				'posts' => [
					[
						'id'      => 11,
						'content' => 'Kept.',
					],
				],
			],
		);

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$this->instance->get_posts_content( $this->create_request( [ 99, 11 ] ) ),
		);
	}

	/**
	 * Tests that a post whose status the bulk editor does not list is omitted.
	 *
	 * @param string $status The post status that is not listed.
	 *
	 * @dataProvider data_unlisted_statuses
	 *
	 * @return void
	 */
	public function test_get_posts_content_omits_a_post_with_an_unlisted_status( string $status ) {
		$this->allow_post( 99 );
		$this->expect_post( 99, 'Not listed.', $status );

		// The listed post is still returned.
		$this->allow_post( 11 );
		$this->expect_post( 11, 'Kept.' );

		$this->expect_response(
			[
				'posts' => [
					[
						'id'      => 11,
						'content' => 'Kept.',
					],
				],
			],
		);

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$this->instance->get_posts_content( $this->create_request( [ 99, 11 ] ) ),
		);
	}

	/**
	 * Data provider for test_get_posts_content_omits_a_post_with_an_unlisted_status.
	 *
	 * @return array<string, array<string>>
	 */
	public static function data_unlisted_statuses() {
		return [
			'a private post'          => [ 'status' => 'private' ],
			'a trashed post'          => [ 'status' => 'trash' ],
			'an auto-draft'           => [ 'status' => 'auto-draft' ],
			'an inherited revision'   => [ 'status' => 'inherit' ],
			'an unknown post status'  => [ 'status' => 'some-plugin-status' ],
		];
	}

	/**
	 * Tests that a password-protected post is omitted, as it is left out of bulk editing.
	 *
	 * @return void
	 */
	public function test_get_posts_content_omits_a_password_protected_post() {
		$this->allow_post( 99 );
		$this->expect_post( 99, 'Protected.', 'publish', 'hunter2' );

		// The unprotected post is still returned.
		$this->allow_post( 11 );
		$this->expect_post( 11, 'Kept.' );

		$this->expect_response(
			[
				'posts' => [
					[
						'id'      => 11,
						'content' => 'Kept.',
					],
				],
			],
		);

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$this->instance->get_posts_content( $this->create_request( [ 99, 11 ] ) ),
		);
	}

	/**
	 * Tests that every status the bulk editor lists is served.
	 *
	 * @param string $status The listed post status.
	 *
	 * @dataProvider data_listed_statuses
	 *
	 * @return void
	 */
	public function test_get_posts_content_serves_every_listed_status( string $status ) {
		$this->allow_post( 11 );
		$this->expect_post( 11, 'Listed.', $status );

		$this->expect_response(
			[
				'posts' => [
					[
						'id'      => 11,
						'content' => 'Listed.',
					],
				],
			],
		);

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$this->instance->get_posts_content( $this->create_request( [ 11 ] ) ),
		);
	}

	/**
	 * Data provider for test_get_posts_content_serves_every_listed_status.
	 *
	 * @return array<string, array<string>>
	 */
	public static function data_listed_statuses() {
		return [
			'a published post' => [ 'status' => 'publish' ],
			'a draft'          => [ 'status' => 'draft' ],
			'a pending post'   => [ 'status' => 'pending' ],
			'a scheduled post' => [ 'status' => 'future' ],
		];
	}

	/**
	 * Tests that an empty posts list is returned when no requested post is accessible.
	 *
	 * @return void
	 */
	public function test_get_posts_content_without_accessible_posts() {
		$this->post_access_checker->expects( 'exists' )->once()->with( 99 )->andReturnFalse();

		$this->expect_response( [ 'posts' => [] ] );

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$this->instance->get_posts_content( $this->create_request( [ 99 ] ) ),
		);
	}
}
