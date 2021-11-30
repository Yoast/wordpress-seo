<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Configuration\Configuration_Workout_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Routes\Configuration_Workout_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Configuration_Workout_Route_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Configuration_Workout_Route
 *
 * @group routes
 * @group workout
 */
class Configuration_Workout_Route_Test extends TestCase {

	/**
	 * Represents the action.
	 *
	 * @var Mockery\MockInterface|Configuration_Workout_Action
	 */
	protected $action;

	/**
	 * Represents the instance to test.
	 *
	 * @var Configuration_Workout_Route
	 */
	protected $instance;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->action   = Mockery::mock( Configuration_Workout_Action::class );
		$this->instance = new Configuration_Workout_Route( $this->action );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Configuration_Workout_Action::class,
			$this->getPropertyValue( $this->instance, 'configuration_workout_action' )
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
				'/workouts/site_representation',
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
				'/workouts/social_profiles',
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
						'instagram_url' => [
							'type'     => 'string',
						],
						'linkedin_url' => [
							'type'     => 'string',
						],
						'myspace_url' => [
							'type'     => 'string',
						],
						'pinterest_url' => [
							'type'     => 'string',
						],
						'youtube_url' => [
							'type'     => 'string',
						],
						'wikipedia_url' => [
							'type'     => 'string',
						],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'/workouts/enable_tracking',
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
}
