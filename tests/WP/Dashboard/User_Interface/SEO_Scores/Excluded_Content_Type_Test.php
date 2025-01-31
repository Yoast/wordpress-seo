<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\User_Interface\SEO_Scores;

use WP_REST_Request;
use WP_REST_Response;

/**
 * Class Excluded_Content_Type_Test
 *
 * @group dashboard
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Scores\SEO_Scores_Route::get_scores
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Scores\SEO_Scores_Route::get_content_type
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Content_Types\Content_Types_Collector::get_content_types
 * @covers Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Types_List::add
 */
final class Excluded_Content_Type_Test extends Abstract_SEO_Scores_Test {

	/**
	 * Tests the get_scores by sending an excluded-from-indexable-creation content type.
	 *
	 * @return void
	 */
	public function test_get_seo_scores_with_excluded_content_type() {
		$request = new WP_REST_Request( 'GET', '/yoast/v1/seo_scores' );
		$request->set_param( 'contentType', 'post' );

		\add_filter( 'wpseo_indexable_excluded_post_types', [ $this, 'filter_exclude_post' ] );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );

		$response_data = $response->get_data();

		$this->assertSame( 400, $response->status );
		$this->assertSame( $response_data['error'], 'Invalid content type.' );

		\remove_filter( 'wpseo_indexable_excluded_post_types', [ $this, 'filter_exclude_post' ] );
	}

	/**
	 * Filter function to exclude posts from indexable creation.
	 *
	 * @param array<string> $excluded_post_types The excluded post types before the filter.
	 *
	 * @return array<string> The excluded post types after the filter.
	 */
	public function filter_exclude_post( $excluded_post_types ) {
		$excluded_post_types[] = 'post';

		return $excluded_post_types;
	}
}
