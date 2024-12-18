<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\User_Interface\Readability_Scores;

use WP_REST_Request;
use WP_REST_Response;

/**
 * Class Invalid_Term_Test
 *
 * @group dashboard
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Scores\Readability_Scores_Route::get_validated_term_id
 */
final class Invalid_Term_Test extends Abstract_Readability_Scores_Test {

	/**
	 * Tests the get_scores by sending an invalid term for this taxonomy and content type.
	 *
	 * @return void
	 */
	public function test_get_readability_scores_with_invalid_term() {
		$tag_id = \wp_insert_term(
			'Test tag',
			'post_tag',
			[
				'slug' => 'test-tag',
			]
		);

		$request = new WP_REST_Request( 'GET', '/yoast/v1/readability_scores' );
		$request->set_param( 'contentType', 'post' );
		$request->set_param( 'taxonomy', 'category' );
		$request->set_param( 'term', $tag_id['term_id'] );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( 400, $response->status );
		$this->assertSame( $response_data['error'], 'Invalid term.' );
	}
}
