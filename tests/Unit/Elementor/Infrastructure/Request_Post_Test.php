<?php

namespace Yoast\WP\SEO\Tests\Unit\Elementor\Infrastructure;

use Brain\Monkey;
use Yoast\WP\SEO\Elementor\Infrastructure\Request_Post;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Request_Post_Test.
 *
 * @group elementor
 *
 * @coversDefaultClass \Yoast\WP\SEO\Elementor\Infrastructure\Request_Post
 */
final class Request_Post_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Request_Post
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Request_Post();
	}

	/**
	 * Tests that get_post calls global (WP) get_post.
	 *
	 * @covers ::get_post
	 *
	 * @return void
	 */
	public function test_get_post() {
		Monkey\Functions\expect( 'get_post' )
			->with( null )
			->andReturn( null );

		$this->assertNull( $this->instance->get_post() );
	}

	/**
	 * Tests the post ID retrieval.
	 *
	 * @dataProvider get_post_id_data_provider
	 *
	 * @covers ::get_post_id
	 * @covers ::get_server_request_method
	 * @covers ::get_post_action
	 * @covers ::get_document_id
	 *
	 * @param mixed $request_method        The value of $_SERVER['REQUEST_METHOD'].
	 * @param mixed $get_post_variable     The value of $_GET['post'].
	 * @param bool  $doing_ajax            What wp_doing_ajax should return.
	 * @param mixed $post_action_variable  The value of $_POST['action'].
	 * @param mixed $post_post_id_variable The value of $_POST['post_id'].
	 * @param mixed $post_actions_variable The value of $_POST['actions'].
	 * @param ?int  $return_value          The expected return value.
	 *
	 * @return void
	 */
	public function test_get_post_id(
		$request_method,
		$get_post_variable,
		bool $doing_ajax,
		$post_action_variable,
		$post_post_id_variable,
		$post_actions_variable,
		?int $return_value
	) {
		$_SERVER['REQUEST_METHOD'] = $request_method;
		$_GET['post']              = $get_post_variable;
		$_POST['action']           = $post_action_variable;
		$_POST['post_id']          = $post_post_id_variable;
		$_POST['actions']          = $post_actions_variable;

		Monkey\Functions\when( 'wp_doing_ajax' )->justReturn( $doing_ajax );

		$this->assertSame( $return_value, $this->instance->get_post_id() );
	}

	/**
	 * Provides test data for `test_get_post_id`.
	 *
	 * @return array<string,array<string,string|bool|int|null>> The test data.
	 */
	public static function get_post_id_data_provider(): array {
		return [
			'GET with post variable' => [
				'request_method'        => 'GET',
				'get_post_variable'     => 123,
				'doing_ajax'            => false,
				'post_action_variable'  => null,
				'post_post_id_variable' => null,
				'post_actions_variable' => null,
				'return_value'          => 123,
			],

			'GET without post variable' => [
				'request_method'        => 'GET',
				'get_post_variable'     => null,
				'doing_ajax'            => false,
				'post_action_variable'  => null,
				'post_post_id_variable' => null,
				'post_actions_variable' => null,
				'return_value'          => null,
			],

			'GET non-numeric post variable' => [
				'request_method'        => 'GET',
				'get_post_variable'     => 'non-numeric',
				'doing_ajax'            => false,
				'post_action_variable'  => null,
				'post_post_id_variable' => null,
				'post_actions_variable' => null,
				'return_value'          => null,
			],

			'GET post variable int string cast to int' => [
				'request_method'        => 'GET',
				'get_post_variable'     => '123',
				'doing_ajax'            => false,
				'post_action_variable'  => null,
				'post_post_id_variable' => null,
				'post_actions_variable' => null,
				'return_value'          => 123,
			],

			'GET post variable scientific notation string cast to int' => [
				'request_method'        => 'GET',
				'get_post_variable'     => '2e2',
				'doing_ajax'            => false,
				'post_action_variable'  => null,
				'post_post_id_variable' => null,
				'post_actions_variable' => null,
				'return_value'          => 200,
			],

			'GET post variable float string cast to int' => [
				'request_method'        => 'GET',
				'get_post_variable'     => '123.456',
				'doing_ajax'            => false,
				'post_action_variable'  => null,
				'post_post_id_variable' => null,
				'post_actions_variable' => null,
				'return_value'          => 123,
			],

			'POST no ajax' => [
				'request_method'        => 'POST',
				'get_post_variable'     => 123,
				'doing_ajax'            => false,
				'post_action_variable'  => 'wpseo_elementor_save',
				'post_post_id_variable' => 123,
				'post_actions_variable' => null,
				'return_value'          => null,
			],

			'POST wpseo_elementor_save action, happy path' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'wpseo_elementor_save',
				'post_post_id_variable' => 123,
				'post_actions_variable' => null,
				'return_value'          => 123,
			],

			'POST wpseo_elementor_save action, no post_id' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'wpseo_elementor_save',
				'post_post_id_variable' => null,
				'post_actions_variable' => null,
				'return_value'          => null,
			],

			'POST wpseo_elementor_save action, int string cast to int' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'wpseo_elementor_save',
				'post_post_id_variable' => '123',
				'post_actions_variable' => null,
				'return_value'          => 123,
			],

			'POST wpseo_elementor_save action, scientific notation string cast to int' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'wpseo_elementor_save',
				'post_post_id_variable' => '2e2',
				'post_actions_variable' => null,
				'return_value'          => 200,
			],

			'POST wpseo_elementor_save action, float string cast to int' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'wpseo_elementor_save',
				'post_post_id_variable' => '123.456',
				'post_actions_variable' => null,
				'return_value'          => 123,
			],

			'POST action, unknown string' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'unknown',
				'post_post_id_variable' => null,
				'post_actions_variable' => null,
				'return_value'          => null,
			],

			'POST action, non-string' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 123,
				'post_post_id_variable' => null,
				'post_actions_variable' => null,
				'return_value'          => null,
			],

			'POST elementor_ajax action, happy path' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'elementor_ajax',
				'post_post_id_variable' => null,
				'post_actions_variable' => \json_encode(
					[
						'document-1' => [
							'action' => 'get_document_config',
							'data'   => [
								'id' => 123,
							],
						],
					]
				),
				'return_value'          => 123,
			],

			'POST elementor_ajax action, no actions' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'elementor_ajax',
				'post_post_id_variable' => null,
				'post_actions_variable' => null,
				'return_value'          => null,
			],

			'POST elementor_ajax action, no array' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'elementor_ajax',
				'post_post_id_variable' => null,
				'post_actions_variable' => \json_encode( 'not-an-array' ),
				'return_value'          => null,
			],

			'POST elementor_ajax action, empty array' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'elementor_ajax',
				'post_post_id_variable' => null,
				'post_actions_variable' => \json_encode( [] ),
				'return_value'          => null,
			],

			'POST elementor_ajax action, unknown action' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'elementor_ajax',
				'post_post_id_variable' => null,
				'post_actions_variable' => \json_encode(
					[
						'document-1' => [
							'action' => 'unknown_action',
							'data'   => [
								'id' => 123,
							],
						],
					]
				),
				'return_value'          => null,
			],

			'POST elementor_ajax action, int string cast to int' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'elementor_ajax',
				'post_post_id_variable' => null,
				'post_actions_variable' => \json_encode(
					[
						'document-1' => [
							'action' => 'get_document_config',
							'data'   => [
								'id' => '123',
							],
						],
					]
				),
				'return_value'          => 123,
			],

			'POST elementor_ajax action, scientific notation string cast to int' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'elementor_ajax',
				'post_post_id_variable' => null,
				'post_actions_variable' => \json_encode(
					[
						'document-1' => [
							'action' => 'get_document_config',
							'data'   => [
								'id' => '2e2',
							],
						],
					]
				),
				'return_value'          => 200,
			],

			'POST elementor_ajax action, float string cast to int' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'elementor_ajax',
				'post_post_id_variable' => null,
				'post_actions_variable' => \json_encode(
					[
						'document-1' => [
							'action' => 'get_document_config',
							'data'   => [
								'id' => '123.456',
							],
						],
					]
				),
				'return_value'          => 123,
			],

			'POST elementor_ajax action, no id in data' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'elementor_ajax',
				'post_post_id_variable' => null,
				'post_actions_variable' => \json_encode(
					[
						'document-1' => [
							'action' => 'get_document_config',
							'data'   => [],
						],
					]
				),
				'return_value'          => null,
			],

			'POST elementor_ajax action, no data' => [
				'request_method'        => 'POST',
				'get_post_variable'     => null,
				'doing_ajax'            => true,
				'post_action_variable'  => 'elementor_ajax',
				'post_post_id_variable' => null,
				'post_actions_variable' => \json_encode(
					[
						'document-1' => [
							'action' => 'get_document_config',
						],
					]
				),
				'return_value'          => null,
			],

			'request method not set' => [
				'request_method'        => null,
				'get_post_variable'     => 123,
				'doing_ajax'            => true,
				'post_action_variable'  => 'elementor_ajax',
				'post_post_id_variable' => null,
				'post_actions_variable' => \json_encode(
					[
						'document-1' => [
							'action' => 'get_document_config',
							'data'   => [
								'id' => 123,
							],
						],
					]
				),
				'return_value'          => null,
			],

			'request method non-string' => [
				'request_method'        => 123,
				'get_post_variable'     => 123,
				'doing_ajax'            => true,
				'post_action_variable'  => 'elementor_ajax',
				'post_post_id_variable' => null,
				'post_actions_variable' => \json_encode(
					[
						'document-1' => [
							'action' => 'get_document_config',
							'data'   => [
								'id' => 123,
							],
						],
					]
				),
				'return_value'          => null,
			],

			'request method unknown' => [
				'request_method'        => 'PUT',
				'get_post_variable'     => 123,
				'doing_ajax'            => true,
				'post_action_variable'  => 'elementor_ajax',
				'post_post_id_variable' => null,
				'post_actions_variable' => \json_encode(
					[
						'document-1' => [
							'action' => 'get_document_config',
							'data'   => [
								'id' => 123,
							],
						],
					]
				),
				'return_value'          => null,
			],

			'request method lowercase' => [
				'request_method'        => 'get',
				'get_post_variable'     => 123,
				'doing_ajax'            => false,
				'post_action_variable'  => null,
				'post_post_id_variable' => null,
				'post_actions_variable' => null,
				'return_value'          => 123,
			],
		];
	}
}
