<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexables_Page_Action;
use Yoast\WP\SEO\Helpers\Indexables_Page_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Routes\Indexables_Page_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexables_Page_Route_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Indexables_Page_Route
 *
 * @group routes
 * @group indexables
 */
class Indexables_Page_Route_Test extends TestCase {

	/**
	 * Represents the indexable action.
	 *
	 * @var Mockery\MockInterface|Indexables_Page_Action
	 */
	protected $indexable_action;

	/**
	 * Represents the indexables page helper.
	 *
	 * @var Mockery\MockInterface|Indexables_Page_Helper
	 */
	protected $indexables_page_helper;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexables_Page_Route
	 */
	protected $instance;

	/**
	 * {@inheritDoc}
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_action       = Mockery::mock( Indexables_Page_Action::class );
		$this->indexables_page_helper = Mockery::mock( Indexables_Page_Helper::class );
		$this->instance               = new Indexables_Page_Route( $this->indexable_action, $this->indexables_page_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Indexables_Page_Action::class,
			$this->getPropertyValue( $this->instance, 'indexables_page_action' )
		);
		$this->assertInstanceOf(
			Indexables_Page_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexables_page_helper' )
		);
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'/least_readability',
				[
					[
						'methods'             => 'GET',
						'callback'            => [ $this->instance, 'get_least_readable' ],
						'permission_callback' => [ $this->instance, 'permission_edit_others_posts' ],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'/least_seo_score',
				[
					[
						'methods'             => 'GET',
						'callback'            => [ $this->instance, 'get_least_seo_score' ],
						'permission_callback' => [ $this->instance, 'permission_edit_others_posts' ],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'/most_linked',
				[
					[
						'methods'             => 'GET',
						'callback'            => [ $this->instance, 'get_most_linked' ],
						'permission_callback' => [ $this->instance, 'permission_edit_others_posts' ],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'/least_linked',
				[
					[
						'methods'             => 'GET',
						'callback'            => [ $this->instance, 'get_least_linked' ],
						'permission_callback' => [ $this->instance, 'permission_edit_others_posts' ],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'/ignore_indexable',
				[
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'ignore_indexable' ],
						'permission_callback' => [ $this->instance, 'permission_edit_others_posts' ],
						'args'                => [
							'id' => [
								'type'     => 'integer',
								'minimum'  => 0,
							],
							'type' => [
								'type'     => 'string',
								'enum'     => [
									'least_readability',
									'least_seo_score',
									'most_linked',
									'least_linked',
								],
							],
						],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'/restore_indexable',
				[
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'restore_indexable' ],
						'permission_callback' => [ $this->instance, 'permission_edit_others_posts' ],
						'args'                => [
							'id' => [
								'type'     => 'integer',
								'minimum'  => 0,
							],
							'type' => [
								'type'     => 'string',
								'enum'     => [
									'least_readability',
									'least_seo_score',
									'most_linked',
									'least_linked',
								],
							],
						],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'/restore_all_indexables',
				[
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'restore_all_indexables' ],
						'permission_callback' => [ $this->instance, 'permission_edit_others_posts' ],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'/restore_all_indexables_for_list',
				[
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'restore_all_indexables_for_list' ],
						'permission_callback' => [ $this->instance, 'permission_edit_others_posts' ],
						'args'                => [
							'type' => [
								'type'     => 'string',
								'enum'     => [
									'least_readability',
									'least_seo_score',
									'most_linked',
									'least_linked',
								],
							],
						],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'/setup_info',
				[
					[
						'methods'             => 'GET',
						'callback'            => [ $this->instance, 'get_setup_info' ],
						'permission_callback' => [ $this->instance, 'permission_edit_others_posts' ],
					],
				]
			);

			Monkey\Functions\expect( 'register_rest_route' )
				->with(
					'yoast/v1',
					'/get_reading_list',
					[
						[
							'methods'             => 'GET',
							'callback'            => [ $this->instance, 'get_reading_list' ],
							'permission_callback' => [ $this->instance, 'permission_edit_others_posts' ],
						],
					]
				);

			Monkey\Functions\expect( 'register_rest_route' )
				->with(
					'yoast/v1',
					'/set_reading_list',
					[
						[
							'methods'             => 'POST',
							'callback'            => [ $this->instance, 'set_reading_list' ],
							'permission_callback' => [ $this->instance, 'permission_edit_others_posts' ],
							'args'                => [
								'state' => [
									'type'     => 'array',
								],
							],
						],
					]
				);
		$this->instance->register_routes();
	}

	/**
	 * Tests the get least readable route.
	 *
	 * @covers ::get_least_readable
	 */
	public function test_get_least_readable() {
		$least_readables = [
			Mockery::mock( Indexable::class ),
			Mockery::mock( Indexable::class ),
		];
		$this->indexable_action
			->expects( 'get_least_readable' )
			->with( 20 )
			->once()
			->andReturn( $least_readables );

		$this->indexables_page_helper
			->expects( 'get_buffer_size' )
			->once()
			->andReturn( 20 );

		$wp_rest_response_mock = Mockery::mock( 'overload:WP_REST_Response' );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => [
						'list'   => $least_readables,
						'length' => \count( $least_readables ),
					],
				]
			)
			->once();

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->get_least_readable()
		);
	}

	/**
	 * Tests the get least seo score route.
	 *
	 * @covers ::get_least_seo_score
	 */
	public function test_get_least_seo_score() {
		$least_seo_score = [
			Mockery::mock( Indexable::class ),
			Mockery::mock( Indexable::class ),
		];
		$this->indexable_action
			->expects( 'get_least_seo_score' )
			->with( 20 )
			->once()
			->andReturn( $least_seo_score );

		$this->indexables_page_helper
			->expects( 'get_buffer_size' )
			->once()
			->andReturn( 20 );

		$wp_rest_response_mock = Mockery::mock( 'overload:WP_REST_Response' );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => [
						'list'   => $least_seo_score,
						'length' => \count( $least_seo_score ),
					],
				]
			)
			->once();

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->get_least_seo_score()
		);
	}

	/**
	 * Tests the get most linked route.
	 *
	 * @covers ::get_most_linked
	 */
	public function test_get_most_linked() {
		$most_linked = [
			Mockery::mock( Indexable::class ),
			Mockery::mock( Indexable::class ),
		];
		$this->indexable_action
			->expects( 'get_most_linked' )
			->with( 20 )
			->once()
			->andReturn( $most_linked );

		$this->indexables_page_helper
			->expects( 'get_buffer_size' )
			->once()
			->andReturn( 20 );

		$wp_rest_response_mock = Mockery::mock( 'overload:WP_REST_Response' );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => [
						'list'   => $most_linked,
						'length' => \count( $most_linked ),
					],
				]
			)
			->once();

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->get_most_linked()
		);
	}

	/**
	 * Tests the get least linked route.
	 *
	 * @covers ::get_least_seo_score
	 */
	public function test_get_least_linked() {
		$least_linked = [
			Mockery::mock( Indexable::class ),
			Mockery::mock( Indexable::class ),
		];
		$this->indexable_action
			->expects( 'get_least_linked' )
			->with( 20 )
			->once()
			->andReturn( $least_linked );

		$this->indexables_page_helper
			->expects( 'get_buffer_size' )
			->once()
			->andReturn( 20 );

		$wp_rest_response_mock = Mockery::mock( 'overload:WP_REST_Response' );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => [
						'list'   => $least_linked,
						'length' => \count( $least_linked ),
					],
				]
			)
			->once();

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->get_least_linked()
		);
	}

	/**
	 * Tests the ignore indexable route.
	 *
	 * @param array  $request_params the parameters returned for get_json_params().
	 * @param array  $indexable_action_params the expected parameters passed to add_indexable_to_ignore_list().
	 * @param bool   $indexable_action_return_value the return value for add_indexable_to_ignore_list().
	 * @param array  $params_rest_response the expected parameters passed to the constructor of WP_REST_Response.
	 * @param string $rest_response_type the type of the response object, WP_REST_Response or WP_Error.
	 * @covers ::ignore_indexable
	 *
	 * @dataProvider ignore_indexables_provider
	 */
	public function test_ignore_indexables( $request_params, $indexable_action_params, $indexable_action_return_value, $params_rest_response, $rest_response_type ) {
		$wp_rest_request = Mockery::mock( 'WP_REST_Request' );
		$wp_rest_request
			->expects( 'get_json_params' )
			->once()
			->andReturn( $request_params );

		$this->indexable_action
			->expects( 'add_indexable_to_ignore_list' )
			->with(
				...$indexable_action_params
			)->andReturn(
				$indexable_action_return_value
			);

		if ( $rest_response_type === 'WP_REST_Response' ) {
			$wp_rest_response_mock = Mockery::mock( 'overload:WP_REST_Response' );
			$wp_rest_response_mock
				->expects( '__construct' )
				->with(
					...$params_rest_response
				)
				->once();
		}
		else {
			$wp_rest_response_mock = Mockery::mock( 'overload:WP_Error' );
			$wp_rest_response_mock
				->expects( '__construct' )
				->with(
					...$params_rest_response
				)
				->once();
		}
		$this->assertInstanceOf(
			$rest_response_type,
			$this->instance->ignore_indexable( $wp_rest_request )
		);
	}

	/**
	 * Data provider for test_ignore_indexables function.
	 *
	 * @return array Data for test_ignore_indexables function.
	 */
	public function ignore_indexables_provider() {
		$valid_parameter_types = [
			'request_params'                => [
				'type' => 'least_readability',
				'id'   => 5,
			],
			'indexable_action_params'       => [
				'least_readability_ignore_list',
				5,
			],
			'indexable_action_return_value' => true,
			'params_rest_response'          => [
				[ 'json' => (object) [ 'success' => true ] ],
				200,
			],
			'rest_response_type'            => 'WP_REST_Response',
		];

		$invalid_option_name = [
			'request_params'                => [
				'type' => 'invalid',
				'id'   => 5,
			],
			'indexable_action_params'       => [
				'invalid_ignore_list',
				5,
			],
			'indexable_action_return_value' => false,
			'params_rest_response'          => [
				'ignore_failed',
				'Could not save the option in the database',
				[
					'status' => 500,
				],
			],
			'rest_response_type'            => 'WP_Error',
		];

		return [
			'Valid parameters'    => $valid_parameter_types,
			'Invalid option name' => $invalid_option_name,
		];
	}

	/**
	 * Tests the restore indexable route.
	 *
	 * @param array  $request_params the parameters returned for get_json_params().
	 * @param array  $indexable_action_params the expected parameters passed to remove_indexable_from_ignore_list().
	 * @param bool   $indexable_action_return_value the return value for remove_indexable_from_ignore_list().
	 * @param array  $params_rest_response the expected parameters passed to the constructor of WP_REST_Response.
	 * @param string $rest_response_type the type of the response object, WP_REST_Response or WP_Error.
	 * @covers ::restore_indexable
	 *
	 * @dataProvider restore_indexables_provider
	 */
	public function test_restore_indexables( $request_params, $indexable_action_params, $indexable_action_return_value, $params_rest_response, $rest_response_type ) {
		$wp_rest_request = Mockery::mock( 'WP_REST_Request' );
		$wp_rest_request
			->expects( 'get_json_params' )
			->once()
			->andReturn( $request_params );

		$this->indexable_action
			->expects( 'remove_indexable_from_ignore_list' )
			->with(
				...$indexable_action_params
			)->andReturn(
				$indexable_action_return_value
			);

		if ( $rest_response_type === 'WP_REST_Response' ) {
			$wp_rest_response_mock = Mockery::mock( 'overload:WP_REST_Response' );
			$wp_rest_response_mock
				->expects( '__construct' )
				->with(
					...$params_rest_response
				)
				->once();
		}
		else {
			$wp_rest_response_mock = Mockery::mock( 'overload:WP_Error' );
			$wp_rest_response_mock
				->expects( '__construct' )
				->with(
					...$params_rest_response
				)
				->once();
		}
		$this->assertInstanceOf(
			$rest_response_type,
			$this->instance->restore_indexable( $wp_rest_request )
		);
	}

	/**
	 * Data provider for test_restore_indexables function.
	 *
	 * @return array Data for test_restore_indexables function.
	 */
	public function restore_indexables_provider() {
		$valid_parameter_types = [
			'request_params'                => [
				'type' => 'least_readability',
				'id'   => 5,
			],
			'indexable_action_params'       => [
				'least_readability_ignore_list',
				5,
			],
			'indexable_action_return_value' => true,
			'params_rest_response'          => [
				[ 'json' => (object) [ 'success' => true ] ],
				200,
			],
			'rest_response_type'            => 'WP_REST_Response',
		];

		$invalid_option_name = [
			'request_params'                => [
				'type' => 'invalid',
				'id'   => 5,
			],
			'indexable_action_params'       => [
				'invalid_ignore_list',
				5,
			],
			'indexable_action_return_value' => false,
			'params_rest_response'          => [
				'restore_failed',
				'Could not save the option in the database',
				[
					'status' => 500,
				],
			],
			'rest_response_type'            => 'WP_Error',
		];

		return [
			'Valid parameters'    => $valid_parameter_types,
			'Invalid option name' => $invalid_option_name,
		];
	}
}
