<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Options\Options_Action;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Input_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Integrations\Options_Form_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Options_Form_Integration_Test.
 *
 * @group integrations
 * @group options
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Options_Form_Integration
 */
class Options_Form_Integration_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Options_Form_Integration
	 */
	protected $instance;

	/**
	 * Holds the options action instance.
	 *
	 * @var Options_Action|Mockery\MockInterface
	 */
	protected $options_action;

	/**
	 * Holds the capability helper instance.
	 *
	 * @var Capability_Helper|Mockery\MockInterface
	 */
	protected $capability_helper;

	/**
	 * Holds the input helper instance.
	 *
	 * @var Input_Helper|Mockery\MockInterface
	 */
	protected $input_helper;

	/**
	 * Holds the redirect helper instance.
	 *
	 * @var Redirect_Helper|Mockery\MockInterface
	 */
	protected $redirect_helper;

	/**
	 * Set up the class which will be tested.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->options_action    = Mockery::mock( Options_Action::class );
		$this->capability_helper = Mockery::mock( Capability_Helper::class );
		$this->input_helper      = Mockery::mock( Input_Helper::class );
		$this->redirect_helper   = Mockery::mock( Redirect_Helper::class );
		$this->instance          = new Options_Form_Integration( $this->options_action, $this->capability_helper, $this->input_helper, $this->redirect_helper );
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Options_Form_Integration::class, $this->instance );
		$this->assertInstanceOf(
			Options_Action::class,
			$this->getPropertyValue( $this->instance, 'options_action' )
		);
		$this->assertInstanceOf(
			Capability_Helper::class,
			$this->getPropertyValue( $this->instance, 'capability_helper' )
		);
		$this->assertInstanceOf(
			Input_Helper::class,
			$this->getPropertyValue( $this->instance, 'input_helper' )
		);
		$this->assertInstanceOf(
			Redirect_Helper::class,
			$this->getPropertyValue( $this->instance, 'redirect_helper' )
		);
	}

	/**
	 * Tests the get_conditionals functions.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [], Options_Form_Integration::get_conditionals() );
	}

	/**
	 * Tests that the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'admin_action_yoast_set_options' )
			->with( [ $this->instance, 'handle_set_options_request' ] )
			->once();

		$this->instance->register_hooks();
	}

	/**
	 * Tests the set options request.
	 *
	 * @covers ::handle_set_options_request
	 * @covers ::verify_request
	 * @covers ::terminate_request
	 * @covers ::persist_settings_errors
	 * @covers ::redirect_back
	 */
	public function test_handle_set_options_request() {
		$this->input_helper->expects( 'filter' )
			->with( \INPUT_POST, 'option', \FILTER_SANITIZE_STRING, \FILTER_NULL_ON_FAILURE )
			->andReturn( 'wpseo_options' );

		$this->capability_helper->expects( 'current_user_can' )->with( 'wpseo_manage_options' )->andReturnTrue();
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( false );
		Monkey\Functions\expect( 'check_admin_referer' )->with( 'yoast_set_options:wpseo_options', '_wpnonce' );

		$values = [ 'foo' => 'bar' ];
		$this->input_helper->expects( 'filter' )
			->with( \INPUT_POST, 'wpseo_options', \FILTER_SANITIZE_STRING, ( \FILTER_REQUIRE_ARRAY | \FILTER_NULL_ON_FAILURE ) )
			->andReturn( $values );
		$this->options_action->expects( 'set' )
			->with( $values )
			->andReturn( [ 'success' => true ] );

		$updated_error = [
			[
				'setting' => 'wpseo_options',
				'code'    => 'settings_updated',
				'message' => 'Settings Updated.',
				'type'    => 'updated',
			],
		];
		Monkey\Functions\expect( 'get_settings_errors' )->andReturnValues( [ [], $updated_error ] );
		Monkey\Functions\expect( 'add_settings_error' )->with( 'wpseo_options', 'settings_updated', 'Settings Updated.', 'updated' );

		Monkey\Functions\expect( 'set_transient' )->with( 'settings_errors', $updated_error, 30 );
		Monkey\Functions\expect( 'wp_get_referer' )->andReturn( 'https://example.com' );
		Monkey\Functions\expect( 'add_query_arg' )
			->with( [ 'settings-updated' => 'true' ], 'https://example.com' )
			->andReturn( 'https://example.com?settings-updated=true' );
		$this->redirect_helper->expects( 'do_safe_redirect' )->with( 'https://example.com?settings-updated=true' );

		$this->instance->handle_set_options_request();
	}

	/**
	 * Tests the set options request with errors.
	 *
	 * @covers ::handle_set_options_request
	 */
	public function test_handle_set_options_request_with_errors() {
		$this->input_helper->expects( 'filter' )
			->with( \INPUT_POST, 'option', \FILTER_SANITIZE_STRING, \FILTER_NULL_ON_FAILURE )
			->andReturn( 'wpseo_options' );

		$this->capability_helper->expects( 'current_user_can' )->with( 'wpseo_manage_options' )->andReturnTrue();
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( false );
		Monkey\Functions\expect( 'check_admin_referer' )->with( 'yoast_set_options:wpseo_options', '_wpnonce' );

		$values = [ 'foo' => 'bar' ];
		$this->input_helper->expects( 'filter' )
			->with( \INPUT_POST, 'wpseo_options', \FILTER_SANITIZE_STRING, ( \FILTER_REQUIRE_ARRAY | \FILTER_NULL_ON_FAILURE ) )
			->andReturn( $values );
		$this->options_action->expects( 'set' )
			->with( $values )
			->andReturn(
				[
					'success'      => false,
					'error'        => 'Message',
					'field_errors' => [ 'foo' => 'Something' ],
				]
			);
		Monkey\Functions\expect( 'add_settings_error' )->with( 'wpseo_options', 'settings_save_error', 'Message', 'error' );
		Monkey\Functions\expect( 'add_settings_error' )->with( 'wpseo_options', 'foo', 'Something', 'error' );

		$errors = [
			[
				'setting' => 'wpseo_options',
				'code'    => 'settings_save_error',
				'message' => 'Message',
				'type'    => 'error',
			],
			[
				'setting' => 'wpseo_options',
				'code'    => 'foo',
				'message' => 'Something',
				'type'    => 'error',
			],
		];
		Monkey\Functions\expect( 'get_settings_errors' )->andReturn( $errors );

		Monkey\Functions\expect( 'set_transient' )->with( 'settings_errors', $errors, 30 );
		Monkey\Functions\expect( 'wp_get_referer' )->andReturn( 'https://example.com' );
		Monkey\Functions\expect( 'add_query_arg' )
			->with( [ 'settings-updated' => 'true' ], 'https://example.com' )
			->andReturn( 'https://example.com?settings-updated=true' );
		$this->redirect_helper->expects( 'do_safe_redirect' )->with( 'https://example.com?settings-updated=true' );

		$this->instance->handle_set_options_request();
	}

	/**
	 * Tests the set options request without values.
	 *
	 * @covers ::handle_set_options_request
	 */
	public function test_handle_set_options_request_without_values() {
		$this->input_helper->expects( 'filter' )
			->with( \INPUT_POST, 'option', \FILTER_SANITIZE_STRING, \FILTER_NULL_ON_FAILURE )
			->andReturn( 'wpseo_options' );

		$this->capability_helper->expects( 'current_user_can' )->with( 'wpseo_manage_options' )->andReturnTrue();
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( false );
		Monkey\Functions\expect( 'check_admin_referer' )->with( 'yoast_set_options:wpseo_options', '_wpnonce' );

		$this->input_helper->expects( 'filter' )
			->with( \INPUT_POST, 'wpseo_options', \FILTER_SANITIZE_STRING, ( \FILTER_REQUIRE_ARRAY | \FILTER_NULL_ON_FAILURE ) )
			->andReturnNull();
		Monkey\Functions\expect( 'add_settings_error' )->with( 'wpseo_options', 'settings_error', 'Please provide settings to save.', 'error' );

		Monkey\Functions\expect( 'get_settings_errors' )->andReturn( [] );

		Monkey\Functions\expect( 'set_transient' )->with( 'settings_errors', [], 30 );
		Monkey\Functions\expect( 'wp_get_referer' )->andReturn( 'https://example.com' );
		$this->redirect_helper->expects( 'do_safe_redirect' )->with( 'https://example.com' );

		$this->options_action->expects( 'set' )->never();

		$this->instance->handle_set_options_request();
	}

	/**
	 * Tests the set options request without capabilities.
	 *
	 * @covers ::handle_set_options_request
	 * @covers ::verify_request
	 */
	public function test_handle_set_options_without_capabilities() {
		$this->input_helper->expects( 'filter' )
			->with( \INPUT_POST, 'option', \FILTER_SANITIZE_STRING, \FILTER_NULL_ON_FAILURE )
			->andReturn( 'wpseo_options' );

		$this->capability_helper->expects( 'current_user_can' )->with( 'wpseo_manage_options' )->andReturnFalse();
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( false );
		Monkey\Functions\expect( 'check_admin_referer' )->with( 'yoast_set_options:wpseo_options', '_wpnonce' );

		$stop_test_continuing_on = new \Exception();
		Monkey\Functions\expect( 'wp_die' )
			->with( 'You are not allowed to perform this action.' )
			->andThrow( $stop_test_continuing_on );
		$this->expectExceptionObject( $stop_test_continuing_on );

		$this->instance->handle_set_options_request();
	}

	/**
	 * Tests the set options AJAX request.
	 *
	 * @covers ::handle_set_options_request
	 * @covers ::verify_request
	 * @covers ::terminate_request
	 */
	public function test_handle_set_options_ajax_request() {
		$this->input_helper->expects( 'filter' )
			->with( \INPUT_POST, 'option', \FILTER_SANITIZE_STRING, \FILTER_NULL_ON_FAILURE )
			->andReturn( 'wpseo_options' );

		$this->capability_helper->expects( 'current_user_can' )->with( 'wpseo_manage_options' )->andReturnTrue();
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( true );
		Monkey\Functions\expect( 'check_ajax_referer' )->with( 'yoast_set_options:wpseo_options', '_wpnonce' );

		$values = [ 'foo' => 'bar' ];
		$this->input_helper->expects( 'filter' )
			->with( \INPUT_POST, 'wpseo_options', \FILTER_SANITIZE_STRING, ( \FILTER_REQUIRE_ARRAY | \FILTER_NULL_ON_FAILURE ) )
			->andReturn( $values );
		$this->options_action->expects( 'set' )
			->with( $values )
			->andReturn( [ 'success' => true ] );

		$updated_error = [
			[
				'setting' => 'wpseo_options',
				'code'    => 'settings_updated',
				'message' => 'Settings Updated.',
				'type'    => 'updated',
			],
		];
		Monkey\Functions\expect( 'get_settings_errors' )->andReturnValues( [ [], $updated_error ] );
		Monkey\Functions\expect( 'add_settings_error' )->with( 'wpseo_options', 'settings_updated', 'Settings Updated.', 'updated' );

		$stop_test_continuing_on = new \Exception();
		Monkey\Functions\expect( 'wp_send_json_success' )
			->with( $updated_error, 200 )
			->andThrow( $stop_test_continuing_on );
		$this->expectExceptionObject( $stop_test_continuing_on );

		$this->instance->handle_set_options_request();
	}

	/**
	 * Tests the set options AJAX request with errors.
	 *
	 * @covers ::handle_set_options_request
	 * @covers ::terminate_request
	 */
	public function test_handle_set_options_ajax_request_with_errors() {
		$this->input_helper->expects( 'filter' )
			->with( \INPUT_POST, 'option', \FILTER_SANITIZE_STRING, \FILTER_NULL_ON_FAILURE )
			->andReturn( 'wpseo_options' );

		$this->capability_helper->expects( 'current_user_can' )->with( 'wpseo_manage_options' )->andReturnTrue();
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( true );
		Monkey\Functions\expect( 'check_ajax_referer' )->with( 'yoast_set_options:wpseo_options', '_wpnonce' );

		$values = [ 'foo' => 'bar' ];
		$this->input_helper->expects( 'filter' )
			->with( \INPUT_POST, 'wpseo_options', \FILTER_SANITIZE_STRING, ( \FILTER_REQUIRE_ARRAY | \FILTER_NULL_ON_FAILURE ) )
			->andReturn( $values );
		$this->options_action->expects( 'set' )
			->with( $values )
			->andReturn(
				[
					'success'      => false,
					'error'        => 'Message',
					'field_errors' => [ 'foo' => 'Something' ],
				]
			);
		Monkey\Functions\expect( 'add_settings_error' )->with( 'wpseo_options', 'settings_save_error', 'Message', 'error' );
		Monkey\Functions\expect( 'add_settings_error' )->with( 'wpseo_options', 'foo', 'Something', 'error' );

		$errors = [
			[
				'setting' => 'wpseo_options',
				'code'    => 'settings_save_error',
				'message' => 'Message',
				'type'    => 'error',
			],
			[
				'setting' => 'wpseo_options',
				'code'    => 'foo',
				'message' => 'Something',
				'type'    => 'error',
			],
		];
		Monkey\Functions\expect( 'get_settings_errors' )->andReturn( $errors );

		$stop_test_continuing_on = new \Exception();
		Monkey\Functions\expect( 'wp_send_json_error' )->with( $errors, 400 )->andThrow( $stop_test_continuing_on );
		$this->expectExceptionObject( $stop_test_continuing_on );

		$this->instance->handle_set_options_request();
	}

	/**
	 * Tests the set options AJAX request without capabilities.
	 *
	 * @covers ::handle_set_options_request
	 * @covers ::verify_request
	 */
	public function test_handle_set_options_ajax_without_capabilities() {
		$this->input_helper->expects( 'filter' )
			->with( \INPUT_POST, 'option', \FILTER_SANITIZE_STRING, \FILTER_NULL_ON_FAILURE )
			->andReturn( 'wpseo_options' );

		$this->capability_helper->expects( 'current_user_can' )->with( 'wpseo_manage_options' )->andReturnFalse();
		Monkey\Functions\expect( 'wp_doing_ajax' )->andReturn( true );
		Monkey\Functions\expect( 'check_ajax_referer' )->with( 'yoast_set_options:wpseo_options', '_wpnonce' );

		$stop_test_continuing_on = new \Exception();
		Monkey\Functions\expect( 'wp_die' )->with( -1 )->andThrow( $stop_test_continuing_on );
		$this->expectExceptionObject( $stop_test_continuing_on );

		$this->instance->handle_set_options_request();
	}
}
