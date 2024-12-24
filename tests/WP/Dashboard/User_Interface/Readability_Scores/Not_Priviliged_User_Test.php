<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\User_Interface\Readability_Scores;

use WP_REST_Request;
use WP_REST_Response;

/**
 * Class Not_Priviliged_User_Test
 *
 * @group dashboard
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Scores\Readability_Scores_Route::permission_manage_options
 */
final class Not_Priviliged_User_Test extends Abstract_Readability_Scores_Test {

	/**
	 * Tests trying to get_scores with an unauthorized user.
	 *
	 * @return void
	 */
	public function test_get_readability_scores_with_not_priviliged_user() {
		$user = $this->factory->user->create_and_get( [ 'role' => 'author' ] );
		\wp_set_current_user( $user->ID );

		$request = new WP_REST_Request( 'GET', '/yoast/v1/readability_scores' );
		$request->set_param( 'contentType', 'post' );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( $response_data['code'], 'rest_forbidden' );
		$this->assertSame( $response_data['data']['status'], 403 );
	}
}
