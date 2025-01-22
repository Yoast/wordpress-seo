<?php

namespace Yoast\WP\SEO\Tests\Unit\Dashboard\User_Interface;

use Brain\Monkey\Functions;
use Mockery;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Dashboard\Infrastructure\Repositories\Permanently_Dismissed_Site_Kit_Widget_Repository_interface;
use Yoast\WP\SEO\Dashboard\User_Interface\Site_Kit_Widget_Permanent_Dismissal_Route;
use Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Repositories\Permanently_Dismissed_Site_Kit_Widget_Repository_Fake;
use Yoast\WP\SEO\Tests\Unit\TestCase;
/**
 * Tests the Introductions seen route.
 *
 * @group introductions
 *
 * @coversDefaultClass Site_Kit_Widget_Permanent_Dismissal_Route
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Kit_Widget_Permanent_Dismissal_Route_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Site_Kit_Widget_Permanent_Dismissal_Route
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Mockery::mock( WP_Error::class );

		$this->instance = new Site_Kit_Widget_Permanent_Dismissal_Route(
			new Permanently_Dismissed_Site_Kit_Widget_Repository_Fake()
		);
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Permanently_Dismissed_Site_Kit_Widget_Repository_interface::class,
			$this->getPropertyValue( $this->instance, 'permanently_dismissed_site_kit_widget_repository' )
		);
	}

	/**
	 * Tests the get_conditionals function.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [], Site_Kit_Widget_Permanent_Dismissal_Route::get_conditionals() );
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'/site_kit_widget_permanent_dismissal',
				[
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'set_site_kit_widget_permanent_dismissal' ],
						'permission_callback' => [ $this->instance, 'check_capabilities' ],
						'args'                => [
							'is_dismissed' => [
								'required'          => true,
								'type'              => 'bool',
								'default'           => false,
								'sanitize_callback' => 'rest_sanitize_boolean',
							],
						],
					],
				]
			);

		$this->instance->register_routes();
	}

	/**
	 * Tests that the capability that is tested for is `edit_posts`.
	 *
	 * @covers ::check_capabilities
	 *
	 * @return void
	 */
	public function test_check_capabilities() {
		Functions\expect( 'current_user_can' )->once()->with( 'administrator' )->andReturn( true );

		$this->assertTrue( $this->instance->check_capabilities() );
	}

	/**
	 * Tests the set_introduction_seen route's happy path.
	 *
	 * @dataProvider set_site_kit_widget_permanent_dismissal_data
	 * @covers ::set_introduction_seen
	 *
	 * @param bool $is_dismissed    The value to set.
	 * @param int  $expected_status The expected status code.
	 *
	 * @return void
	 */
	public function test_set_site_kit_widget_permanent_dismissal( $is_dismissed, $expected_status ) {

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => (object) [
						'success' => $is_dismissed,
					],
				],
				$expected_status
			)
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_params' )
			->once()
			->andReturn(
				[
					'is_dismissed'         => $is_dismissed,
				]
			);

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->set_site_kit_widget_permanent_dismissal( $wp_rest_request )
		);
	}

	/**
	 * Data provider for the set_site_kit_widget_permanent_dismissal test.
	 *
	 * @return array<array<bool, int>>
	 */
	public static function set_site_kit_widget_permanent_dismissal_data() {
		return [
			'Update site_kit_widget_permanently_dismissed succeeded' => [ true, 200 ],
			'Update site_kit_widget_permanently_dismissed failed'    => [ false, 400 ],
		];
	}
}
