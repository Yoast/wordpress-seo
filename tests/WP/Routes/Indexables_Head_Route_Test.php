<?php

namespace Yoast\WP\SEO\Tests\WP\Routes;

use ReflectionProperty;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Indexables\Indexable_Head_Action;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class for Indexable_Head_Route class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Routes\Indexables_Head_Route
 */
final class Indexables_Head_Route_Test extends TestCase {

	/**
	 * Post content with markers in a paragraph and in an FAQ block.
	 *
	 * @var string
	 */
	private const CONTENT = '<!-- wp:paragraph --><p>BODY_MARKER</p><!-- /wp:paragraph -->'
		. '<!-- wp:yoast/faq-block {"questions":[{"id":"faq-question-1","jsonQuestion":"QUESTION_MARKER","jsonAnswer":"ANSWER_MARKER"}]} -->'
		. '<div class="schema-faq wp-block-yoast-faq-block"></div>'
		. '<!-- /wp:yoast/faq-block -->';

	/**
	 * Sets up the test environment.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->set_permalink_structure( '/%postname%/' );
	}

	/**
	 * Tears down the test environment.
	 *
	 * @return void
	 */
	public function tear_down() {
		\update_option( 'show_on_front', 'posts' );
		\update_option( 'page_on_front', 0 );
		\update_option( 'page_for_posts', 0 );

		parent::tear_down();
	}

	/**
	 * Tests the register_routes method.
	 *
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_has_route() {
			$routes = \rest_get_server()->get_routes();
			$this->assertArrayHasKey( '/yoast/v1/get_head', $routes );
	}

	/**
	 * Tests the get_head method.
	 *
	 * @covers ::get_head
	 * @covers ::is_valid_url
	 *
	 * @dataProvider data_provider_get_head
	 *
	 * @param string $url             The url.
	 * @param bool   $valid_head_data Wether the response contains valid data for the page head.
	 *
	 * @return void
	 */
	public function test_get_head( $url, $valid_head_data ) {
		$request = new WP_REST_Request( 'GET', '/yoast/v1/get_head' );
		$request->set_param( 'url', $url );

		$response = \rest_get_server()->dispatch( $request );

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$response,
			'get_head WP_REST_Response object',
		);

		$this->assertEquals(
			$valid_head_data,
			\is_object( $response->data ) && \property_exists( $response->data, 'html' ) && \property_exists( $response->data, 'json' ),
			'get_head valid data',
		);
	}

	/**
	 * Data provider for test_get_head.
	 *
	 * @return array<string, string|bool>
	 */
	public static function data_provider_get_head() {
		yield 'Home URL' => [
			'url'             => \trailingslashit( \home_url() ),
			'valid_head_data' => true,
		];
		yield 'Multiple words search string' => [
			'url'             => \add_query_arg( 's', 'xxx yyy', \trailingslashit( \home_url() ) ),
			'valid_head_data' => true,
		];
		yield 'Invalid URL' => [
			'url'             => 'This is not a URL',
			'valid_head_data' => false,
		];
	}

	/**
	 * Tests that the head of a private post is only returned to users who can read it.
	 *
	 * @covers ::get_head
	 *
	 * @return void
	 */
	public function test_get_head_for_private_post() {
		$admin_id = self::factory()->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin_id );

		$post_id = self::factory()->post->create(
			[
				'post_status'  => 'private',
				'post_content' => self::CONTENT,
				'post_excerpt' => '',
			],
		);
		$url     = \get_permalink( $post_id );

		\wp_set_current_user( 0 );
		$this->assert_markers_absent( $this->get_head( $url ), 404 );

		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'subscriber' ] ) );
		$this->assert_markers_absent( $this->get_head( $url ), 404 );

		\wp_set_current_user( $admin_id );
		$this->assert_markers_present( $this->get_head( $url ) );
	}

	/**
	 * Tests that the head of a private static front page is not returned to logged-out users.
	 *
	 * @covers ::get_head
	 *
	 * @return void
	 */
	public function test_get_head_for_private_front_page() {
		$this->set_front_page( 'private' );

		\wp_set_current_user( 0 );
		$this->assert_markers_absent( $this->get_head( \trailingslashit( \home_url() ) ), 404 );
	}

	/**
	 * Tests that the head of a public static front page is returned to logged-out users.
	 *
	 * @covers ::get_head
	 *
	 * @return void
	 */
	public function test_get_head_for_public_front_page() {
		$this->set_front_page( 'publish' );

		\wp_set_current_user( 0 );
		$this->assert_markers_present( $this->get_head( \trailingslashit( \home_url() ) ) );
	}

	/**
	 * Tests that the head of a private static posts page is not exposed on the post type REST endpoint to logged-out users.
	 *
	 * @coversNothing
	 *
	 * @return void
	 */
	public function test_post_type_head_for_private_posts_page() {
		\update_option( 'page_for_posts', $this->create_marker_page( 'private' ) );

		\wp_set_current_user( 0 );
		$data = $this->get_post_type_head();

		$this->assertNull( $data['yoast_head'] );
		$this->assertNull( $data['yoast_head_json'] );
	}

	/**
	 * Tests that the head of a public static posts page is exposed on the post type REST endpoint to logged-out users.
	 *
	 * @coversNothing
	 *
	 * @return void
	 */
	public function test_post_type_head_for_public_posts_page() {
		\update_option( 'page_for_posts', $this->create_marker_page( 'publish' ) );

		\wp_set_current_user( 0 );
		$data = $this->get_post_type_head();
		$json = \wp_json_encode( $data['yoast_head_json'] );

		$this->assertStringContainsString( 'BODY_MARKER', $data['yoast_head'] );
		$this->assertStringContainsString( 'QUESTION_MARKER', $json );
		$this->assertStringContainsString( 'ANSWER_MARKER', $json );
	}

	/**
	 * Creates a page with marker content.
	 *
	 * @param string $post_status The post status of the page.
	 *
	 * @return int The page ID.
	 */
	private function create_marker_page( $post_status ) {
		return self::factory()->post->create(
			[
				'post_type'    => 'page',
				'post_status'  => $post_status,
				'post_content' => self::CONTENT,
				'post_excerpt' => '',
			],
		);
	}

	/**
	 * Requests the post type of posts from the REST API, without results cached by earlier requests.
	 *
	 * @return array<string, mixed> The response data.
	 */
	private function get_post_type_head() {
		$this->reset_head_cache();

		return \rest_get_server()->dispatch( new WP_REST_Request( 'GET', '/wp/v2/types/post' ) )->get_data();
	}

	/**
	 * Resets the results cached by the head action.
	 *
	 * @return void
	 */
	private function reset_head_cache() {
		$cache = new ReflectionProperty( Indexable_Head_Action::class, 'cache' );
		$cache->setAccessible( true );
		$cache->setValue( \YoastSEO()->classes->get( Indexable_Head_Action::class ), [] );
	}

	/**
	 * Creates a page with marker content and sets it as the static front page.
	 *
	 * @param string $post_status The post status of the page.
	 *
	 * @return void
	 */
	private function set_front_page( $post_status ) {
		\update_option( 'show_on_front', 'page' );
		\update_option( 'page_on_front', $this->create_marker_page( $post_status ) );
	}

	/**
	 * Dispatches a get_head request, without results cached by earlier requests.
	 *
	 * @param string $url The url to get the head for.
	 *
	 * @return WP_REST_Response The response.
	 */
	private function get_head( $url ) {
		$this->reset_head_cache();

		$request = new WP_REST_Request( 'GET', '/yoast/v1/get_head' );
		$request->set_param( 'url', $url );

		return \rest_get_server()->dispatch( $request );
	}

	/**
	 * Asserts that the response has a 200 status and contains the markers in both the HTML and the JSON.
	 *
	 * @param WP_REST_Response $response The response.
	 *
	 * @return void
	 */
	private function assert_markers_present( $response ) {
		$this->assertSame( 200, $response->get_status() );

		$json = \wp_json_encode( $response->data->json );
		$this->assertStringContainsString( 'BODY_MARKER', $response->data->json['og_description'] );
		$this->assertStringContainsString( 'BODY_MARKER', $response->data->html );
		$this->assertStringContainsString( 'QUESTION_MARKER', $json );
		$this->assertStringContainsString( 'ANSWER_MARKER', $json );
	}

	/**
	 * Asserts that the response has the expected status and contains none of the markers.
	 *
	 * @param WP_REST_Response $response The response.
	 * @param int              $status   The expected status.
	 *
	 * @return void
	 */
	private function assert_markers_absent( $response, $status ) {
		$this->assertSame( $status, $response->get_status() );

		$output = $response->data->html . \wp_json_encode( $response->data->json );
		foreach ( [ 'BODY_MARKER', 'QUESTION_MARKER', 'ANSWER_MARKER' ] as $marker ) {
			$this->assertStringNotContainsString( $marker, $output );
		}
	}
}
