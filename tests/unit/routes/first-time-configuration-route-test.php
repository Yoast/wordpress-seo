<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Configuration\First_Time_Configuration_Action;
use Yoast\WP\SEO\Routes\First_Time_Configuration_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- First time configuration simply has a lot of words.
/**
 * Class First_Time_Configuration_Route_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\First_Time_Configuration_Route
 *
 * @group routes
 * @group workout
 */
class First_Time_Configuration_Route_Test extends TestCase {

	/**
	 * Represents the action.
	 *
	 * @var Mockery\MockInterface|First_Time_Configuration_Action
	 */
	protected $first_time_configuration_action;

	/**
	 * Represents the instance to test.
	 *
	 * @var First_Time_Configuration_Route
	 */
	protected $instance;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->first_time_configuration_action = Mockery::mock( First_Time_Configuration_Action::class );
		$this->instance                        = new First_Time_Configuration_Route( $this->first_time_configuration_action );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			First_Time_Configuration_Action::class,
			$this->getPropertyValue( $this->instance, 'first_time_configuration_action' )
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
				'/configuration/site_representation',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'set_site_representation' ],
					'permission_callback' => [ $this->instance, 'can_manage_options' ],
					'args'                => [
						'company_or_person' => [
							'type'     => 'string',
							'enum'     => [
								'company',
								'person',
							],
							'required' => true,
						],
						'company_name' => [
							'type'     => 'string',
						],
						'company_logo' => [
							'type'     => 'string',
						],
						'company_logo_id' => [
							'type'     => 'integer',
						],
						'person_logo' => [
							'type'     => 'string',
						],
						'person_logo_id' => [
							'type'     => 'integer',
						],
						'company_or_person_user_id' => [
							'type'     => 'integer',
						],
						'description' => [
							'type'     => 'string',
						],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'/configuration/social_profiles',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'set_social_profiles' ],
					'permission_callback' => [ $this->instance, 'can_manage_options' ],
					'args'                => [
						'facebook_site' => [
							'type'     => 'string',
						],
						'twitter_site' => [
							'type'     => 'string',
						],
						'other_social_urls' => [
							'type'     => 'array',
						],
					],
				]
			);

			Monkey\Functions\expect( 'register_rest_route' )
				->with(
					'yoast/v1',
					'/configuration/person_social_profiles',
					[
						[
							'methods'             => 'GET',
							'callback'            => [ $this->instance, 'get_person_social_profiles' ],
							'permission_callback' => [ $this->instance, 'can_manage_options' ],
							'args'                => [
								'user_id' => [
									'required' => true,
								],
							],
						],
						[
							'methods'             => 'POST',
							'callback'            => [ $this->instance, 'set_person_social_profiles' ],
							'permission_callback' => [ $this->instance, 'can_edit_user' ],
							'args'                => [
								'user_id' => [
									'type'     => 'integer',
								],
								'facebook' => [
									'type'     => 'string',
								],
								'instagram' => [
									'type'     => 'string',
								],
								'linkedin' => [
									'type'     => 'string',
								],
								'myspace' => [
									'type'     => 'string',
								],
								'pinterest' => [
									'type'     => 'string',
								],
								'soundcloud' => [
									'type'     => 'string',
								],
								'tumblr' => [
									'type'     => 'string',
								],
								'twitter' => [
									'type'     => 'string',
								],
								'youtube' => [
									'type'     => 'string',
								],
								'wikipedia' => [
									'type'     => 'string',
								],
							],
						],
					]
				);

			Monkey\Functions\expect( 'register_rest_route' )
				->with(
					'yoast/v1',
					'/configuration/check_capability',
					[
						'methods'             => 'GET',
						'callback'            => [ $this->instance, 'check_capability' ],
						'permission_callback' => [ $this->instance, 'can_manage_options' ],
						'args'                => [
							'user_id' => [
								'required' => true,
							],
						],
					]
				);

			Monkey\Functions\expect( 'register_rest_route' )
				->with(
					'yoast/v1',
					'/configuration/enable_tracking',
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'set_enable_tracking' ],
						'permission_callback' => [ $this->instance, 'can_manage_options' ],
						'args'                => [
							'tracking' => [
								'type'     => 'boolean',
								'required' => true,
							],
						],
					]
				);

			Monkey\Functions\expect( 'register_rest_route' )
				->with(
					'yoast/v1',
					'/configuration/save_configuration_state',
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'save_configuration_state' ],
						'permission_callback' => [ $this->instance, 'can_edit_other_posts' ],
						'args'                => [
							'finishedSteps' => [
								'type'     => 'array',
								'required' => true,
							],
							'IndexablesBySteps' => [
								'type'     => 'array',
							],
							'priority' => [
								'type'     => 'integer',
								'required' => true,
							],
						],
					]
				);

			Monkey\Functions\expect( 'register_rest_route' )
				->with(
					'yoast/v1',
					'/configuration/get_configuration_state',
					[
						[
							'methods'             => 'GET',
							'callback'            => [ $this->instance, 'get_configuration_state' ],
							'permission_callback' => [ $this->instance, 'can_manage_options' ],
						],
					]
				);

		$this->instance->register_routes();
	}

	/**
	 * Tests the can_manage_options method.
	 *
	 * @covers ::can_manage_options
	 */
	public function test_can_manage_options() {
		Monkey\Functions\expect( 'current_user_can' )
			->with( 'wpseo_manage_options' )
			->andReturn( true, false );

		$this->assertTrue( $this->instance->can_manage_options() );
		$this->assertFalse( $this->instance->can_manage_options() );
	}

	/**
	 * Tests the can_edit_user method.
	 *
	 * @param bool   $can_edit The result of the check_capability call.
	 * @param object $expected The expected result object.
	 * @covers ::can_edit_user
	 *
	 * @dataProvider can_edit_user_provider
	 */
	public function test_can_edit_user( $can_edit, $expected ) {
		$request = Mockery::mock( 'WP_Rest_Request' );
		$request
			->shouldReceive( 'get_param' )
			->with( 'user_id' )
			->andReturn( 123 );

		$this->first_time_configuration_action
			->expects( 'check_capability' )
			->with( $request->get_param( 'user_id' ) )
			->andReturn( $can_edit );

			$this->assertEquals(
				$expected,
				$this->instance->can_edit_user( $request )
			);
	}

	/**
	 * Dataprovider for can_edit_user function.
	 *
	 * @return array Data for can_edit_user function.
	 */
	public function can_edit_user_provider() {
		$success = [
			'can_edit' => (object) [
				'success' => true,
				'status'  => 200,
			],
			'expected' => true,
		];

		$failed = [
			'can_edit' => (object) [
				'success' => false,
				'status'  => 403,
			],
			'expected' => false,
		];

		return [
			'User can edit other users'    => $success,
			'User cannot edit other users' => $failed,
		];
	}

	/**
	 * Tests the can_edit_other_posts method.
	 *
	 * @covers ::can_edit_other_posts
	 */
	public function test_can_edit_other_posts() {
		Monkey\Functions\expect( 'current_user_can' )
			->with( 'edit_others_posts' )
			->andReturn( true, false );

		$this->assertTrue( $this->instance->can_edit_other_posts() );
		$this->assertFalse( $this->instance->can_edit_other_posts() );
	}
}
