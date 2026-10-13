<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\WP\AI\Content_Planner\User_Interface;

use Mockery;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command_Handler;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Section;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Section_List;
use Yoast\WP\SEO\AI\Content_Planner\User_Interface\Get_Outline_Route;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration tests for Get_Outline_Route.
 *
 * Exercises the WordPress REST schema validation on the
 * POST /yoast/v1/ai_content_planner/get_outline endpoint, with focus on the
 * required `recent_content` request body parameter.
 *
 * @group ai-content-planner
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Get_Outline_Route
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Outline_Route_Test extends TestCase {

	/**
	 * The route under test.
	 *
	 * @var Get_Outline_Route
	 */
	private $instance;

	/**
	 * The command handler mock.
	 *
	 * @var Content_Outline_Command_Handler|Mockery\MockInterface
	 */
	private $command_handler;

	/**
	 * Sets up the route on the live REST server and authenticates as an admin.
	 *
	 * Disables the AI conditional so the plugin's loader skips its own
	 * registration of Get_Outline_Route, then registers a mocked instance on
	 * rest_api_init and re-fires the action against a fresh REST server. This
	 * keeps register_rest_route inside the rest_api_init context (no
	 * _doing_it_wrong) and guarantees the mocked handler — not the real one — is
	 * what dispatch reaches.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		\YoastSEO()->helpers->options->set( 'enable_ai_generator', false );

		$this->command_handler = Mockery::mock( Content_Outline_Command_Handler::class );
		$this->instance        = new Get_Outline_Route( $this->command_handler );

		\add_action( 'rest_api_init', [ $this->instance, 'register_routes' ] );

		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- $wp_rest_server is a WP core global.
		$GLOBALS['wp_rest_server'] = new WP_REST_Server();
		\do_action( 'rest_api_init', $GLOBALS['wp_rest_server'] );

		$user_id = self::factory()->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $user_id );
	}

	/**
	 * Removes the route hook and resets the REST server so the next test starts clean.
	 *
	 * @return void
	 */
	public function tear_down() {
		\remove_action( 'rest_api_init', [ $this->instance, 'register_routes' ] );

		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- $wp_rest_server is a WP core global.
		$GLOBALS['wp_rest_server'] = null;

		parent::tear_down();
	}

	/**
	 * Builds a valid request body, optionally with overrides or removed keys.
	 *
	 * @param array<string, mixed> $overrides Values to override on the default body.
	 * @param array<int, string>   $remove    Top-level keys to remove from the default body.
	 *
	 * @return array<string, mixed> The request body.
	 */
	private function valid_body( array $overrides = [], array $remove = [] ): array {
		$body = [
			'post_type'        => 'post',
			'language'         => 'en_US',
			'editor'           => 'gutenberg',
			'title'            => 'How to use AI',
			'intent'           => 'informational',
			'explanation'      => 'Explanation',
			'keyphrase'        => 'AI usage',
			'meta_description' => 'Meta description',
			'category'         => [
				'name' => 'Tech',
				'id'   => 5,
			],
			'recent_content'   => [
				[
					'title'       => 'An earlier post',
					'description' => 'A short description of that earlier post.',
				],
			],
		];

		foreach ( $remove as $key ) {
			unset( $body[ $key ] );
		}

		return \array_merge( $body, $overrides );
	}

	/**
	 * Dispatches a POST request with a JSON body to the get_outline endpoint.
	 *
	 * @param array<string, mixed> $body The request body.
	 *
	 * @return WP_REST_Response The REST response.
	 */
	private function dispatch( array $body ): WP_REST_Response {
		$request = new WP_REST_Request( 'POST', '/yoast/v1/ai_content_planner/get_outline' );
		$request->set_header( 'Content-Type', 'application/json' );
		$request->set_body( (string) \wp_json_encode( $body ) );

		return \rest_get_server()->dispatch( $request );
	}

	/**
	 * Tests that the route is registered on the REST server.
	 *
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_route_is_registered() {
		$routes = \rest_get_server()->get_routes();

		$this->assertArrayHasKey(
			'/yoast/v1/ai_content_planner/get_outline',
			$routes,
			'Expected the get_outline route to be registered on the REST server.',
		);
	}

	/**
	 * Tests that a fully valid payload — including a populated recent_content array —
	 * passes schema validation and is forwarded to the command handler.
	 *
	 * @covers ::get_outline
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_valid_payload_is_dispatched_to_handler() {
		$section_list = new Section_List();
		$section_list->add( new Section( [ 'note 1' ], 'Section A' ) );

		$this->command_handler
			->expects( 'handle' )
			->once()
			->with( Mockery::type( Content_Outline_Command::class ) )
			->andReturn( $section_list );

		$response = $this->dispatch( $this->valid_body() );

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( $section_list->to_array(), $response->get_data() );
	}

	/**
	 * Tests that an empty recent_content array is accepted (the schema sets no minItems).
	 *
	 * @covers ::get_outline
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_empty_recent_content_is_accepted() {
		$this->command_handler
			->expects( 'handle' )
			->once()
			->andReturn( new Section_List() );

		$response = $this->dispatch( $this->valid_body( [ 'recent_content' => [] ] ) );

		$this->assertSame( 200, $response->get_status() );
	}

	/**
	 * Tests that omitting recent_content is rejected by REST schema validation.
	 *
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_missing_recent_content_returns_400() {
		$this->command_handler->expects( 'handle' )->never();

		$response = $this->dispatch( $this->valid_body( [], [ 'recent_content' ] ) );

		$this->assertSame( 400, $response->get_status() );
	}

	/**
	 * Tests that a recent_content item without the required title is rejected.
	 *
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_recent_content_item_without_title_returns_400() {
		$this->command_handler->expects( 'handle' )->never();

		$response = $this->dispatch(
			$this->valid_body(
				[
					'recent_content' => [
						[ 'description' => 'No title here.' ],
					],
				],
			),
		);

		$this->assertSame( 400, $response->get_status() );
	}

	/**
	 * Tests that a recent_content item without the required description is rejected.
	 *
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_recent_content_item_without_description_returns_400() {
		$this->command_handler->expects( 'handle' )->never();

		$response = $this->dispatch(
			$this->valid_body(
				[
					'recent_content' => [
						[ 'title' => 'Only a title.' ],
					],
				],
			),
		);

		$this->assertSame( 400, $response->get_status() );
	}

	/**
	 * Tests that a recent_content item with an unexpected property is rejected,
	 * because the schema declares additionalProperties: false on each item.
	 *
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_recent_content_item_with_extra_property_returns_400() {
		$this->command_handler->expects( 'handle' )->never();

		$response = $this->dispatch(
			$this->valid_body(
				[
					'recent_content' => [
						[
							'title'       => 'A title',
							'description' => 'A description',
							'unexpected'  => 'should be rejected',
						],
					],
				],
			),
		);

		$this->assertSame( 400, $response->get_status() );
	}
}
