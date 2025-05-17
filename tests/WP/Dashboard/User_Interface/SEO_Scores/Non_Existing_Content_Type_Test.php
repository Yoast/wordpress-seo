<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\User_Interface\SEO_Scores;

use WP_REST_Request;
use WP_REST_Response;

/**
 * Class Non_Existing_Content_Type_Test
 *
 * @group dashboard
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Scores\SEO_Scores_Route::get_scores
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Scores\SEO_Scores_Route::get_content_type
 */
final class Non_Existing_Content_Type_Test extends Abstract_SEO_Scores_Test {

	/**
	 * Tests the get_scores by sending a non existing content type.
	 *
	 * @return void
	 */
	public function test_get_seo_scores_with_non_existing_content_type() {
		$request = new WP_REST_Request( 'GET', '/yoast/v1/seo_scores' );
		$request->set_param( 'contentType', 'not-existing-content-type' );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( 400, $response->status );
		$this->assertSame( $response_data['error'], 'Invalid content type.' );
	}
}
