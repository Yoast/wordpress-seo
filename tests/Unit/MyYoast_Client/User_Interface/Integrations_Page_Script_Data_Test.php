<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\MyYoast_Client\Application\Callback_Outcome;
use Yoast\WP\SEO\MyYoast_Client\Application\Management_Endpoints_Repository;
use Yoast\WP\SEO\MyYoast_Client\Application\OAuth_Callback_Handler;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Integrations_Page_Script_Data;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Status_Presenter;
use Yoast\WP\SEO\Routes\Endpoint\Endpoint_List;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Integrations_Page_Script_Data provider.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\User_Interface\Integrations_Page_Script_Data
 */
final class Integrations_Page_Script_Data_Test extends TestCase {

	/**
	 * The status presenter mock.
	 *
	 * @var Status_Presenter|Mockery\MockInterface
	 */
	private $status_presenter;

	/**
	 * The MyYoast connection conditional mock.
	 *
	 * @var MyYoast_Connection_Conditional|Mockery\MockInterface
	 */
	private $myyoast_connection_conditional;

	/**
	 * The callback handler mock.
	 *
	 * @var OAuth_Callback_Handler|Mockery\MockInterface
	 */
	private $callback_handler;

	/**
	 * The short-link helper mock.
	 *
	 * @var Short_Link_Helper|Mockery\MockInterface
	 */
	private $short_link_helper;

	/**
	 * The management endpoints repository mock.
	 *
	 * @var Management_Endpoints_Repository|Mockery\MockInterface
	 */
	private $endpoints_repository;

	/**
	 * The instance under test.
	 *
	 * @var Integrations_Page_Script_Data
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->status_presenter               = Mockery::mock( Status_Presenter::class );
		$this->myyoast_connection_conditional = Mockery::mock( MyYoast_Connection_Conditional::class );
		$this->callback_handler               = Mockery::mock( OAuth_Callback_Handler::class );
		$this->short_link_helper              = Mockery::mock( Short_Link_Helper::class );
		$this->endpoints_repository           = Mockery::mock( Management_Endpoints_Repository::class );
		$this->instance                       = new Integrations_Page_Script_Data(
			$this->status_presenter,
			$this->myyoast_connection_conditional,
			$this->callback_handler,
			$this->short_link_helper,
			$this->endpoints_repository,
		);
	}

	/**
	 * Stubs the endpoints repository to return the given name => path map.
	 *
	 * @param array<string, string> $paths The endpoint paths keyed by name.
	 *
	 * @return void
	 */
	private function stub_endpoints( array $paths ): void {
		$list = Mockery::mock( Endpoint_List::class );
		$list->shouldReceive( 'to_paths_array' )->andReturn( $paths );
		$this->endpoints_repository->shouldReceive( 'get_all_endpoints' )->andReturn( $list );
	}

	/**
	 * Tests the payload is returned when the feature flag is enabled and no
	 * callback outcome is pending.
	 *
	 * @covers ::__construct
	 * @covers ::present
	 * @covers ::consume_callback_outcome
	 *
	 * @return void
	 */
	public function test_present_when_enabled() {
		$status = [
			'is_provisioned'    => true,
			'is_registered'     => false,
			'registered_at'     => null,
			'registered_at_iso' => null,
			'redirect_uris'     => [],
		];

		$this->myyoast_connection_conditional->shouldReceive( 'is_met' )->andReturn( true );
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $status );

		Monkey\Functions\expect( 'get_current_user_id' )->andReturn( 42 );
		$this->callback_handler->shouldReceive( 'consume_outcome' )->once()->with( 42 )->andReturn( null );
		$this->short_link_helper->shouldReceive( 'get_query_params' )->once()->andReturn( [ 'php_version' => '8.2' ] );
		$this->stub_endpoints( [ 'authorize' => 'yoast/v1/myyoast/authorize' ] );

		$result = $this->instance->present();

		$this->assertIsArray( $result );
		$this->assertSame( $status, $result['initialStatus'] );
		$this->assertNull( $result['callbackOutcome'] );
		$this->assertSame( [ 'php_version' => '8.2' ], $result['linkParams'] );
		$this->assertSame( [ 'authorize' => 'yoast/v1/myyoast/authorize' ], $result['endpoints'] );
	}

	/**
	 * Tests a successful outcome is shaped into the verify_success notification.
	 *
	 * @covers ::present
	 * @covers ::consume_callback_outcome
	 *
	 * @return void
	 */
	public function test_present_consumes_success_outcome() {
		$status = [
			'is_provisioned'    => true,
			'is_registered'     => true,
			'registered_at'     => 1_731_369_600,
			'registered_at_iso' => '2024-11-12T00:00:00+00:00',
			'redirect_uris'     => [],
		];

		$this->myyoast_connection_conditional->shouldReceive( 'is_met' )->andReturn( true );
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $status );

		Monkey\Functions\expect( 'get_current_user_id' )->andReturn( 7 );
		$this->callback_handler->shouldReceive( 'consume_outcome' )->once()->with( 7 )->andReturn( Callback_Outcome::success() );
		$this->short_link_helper->shouldReceive( 'get_query_params' )->andReturn( [] );
		$this->stub_endpoints( [] );

		$result = $this->instance->present();

		$this->assertIsArray( $result );
		$this->assertSame(
			[
				'kind' => 'success',
				'key'  => 'verify_success',
			],
			$result['callbackOutcome'],
		);
	}

	/**
	 * Tests an error outcome is translated to its front-end message key.
	 *
	 * @covers ::present
	 * @covers ::consume_callback_outcome
	 * @covers ::error_message_key
	 *
	 * @dataProvider provide_error_outcomes
	 *
	 * @param Callback_Outcome $outcome      The stored outcome.
	 * @param string           $expected_key The expected front-end message key.
	 *
	 * @return void
	 */
	public function test_present_translates_error_outcome( Callback_Outcome $outcome, string $expected_key ) {
		$status = [
			'is_provisioned'    => true,
			'is_registered'     => false,
			'registered_at'     => null,
			'registered_at_iso' => null,
			'redirect_uris'     => [],
		];

		$this->myyoast_connection_conditional->shouldReceive( 'is_met' )->andReturn( true );
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $status );

		Monkey\Functions\expect( 'get_current_user_id' )->andReturn( 7 );
		$this->callback_handler->shouldReceive( 'consume_outcome' )->once()->with( 7 )->andReturn( $outcome );
		$this->short_link_helper->shouldReceive( 'get_query_params' )->andReturn( [] );
		$this->stub_endpoints( [] );

		$result = $this->instance->present();

		$this->assertSame(
			[
				'kind' => 'error',
				'key'  => $expected_key,
			],
			$result['callbackOutcome'],
		);
	}

	/**
	 * Provides error outcomes and the message keys they map to.
	 *
	 * @return array<string, array{Callback_Outcome, string}>
	 */
	public static function provide_error_outcomes(): array {
		return [
			'provider access_denied -> cancelled'    => [ Callback_Outcome::provider_error( 'access_denied' ), 'connection_cancelled' ],
			'other provider error -> unexpected'     => [ Callback_Outcome::provider_error( 'server_error' ), 'unexpected_error' ],
			'invalid_grant -> dedicated key'         => [ Callback_Outcome::exchange_error( 'invalid_grant' ), 'token_request_failed_invalid_grant' ],
			'other exchange error -> generic key'    => [ Callback_Outcome::exchange_error( 'invalid_request' ), 'token_request_failed' ],
			'code-less exchange error -> unexpected' => [ Callback_Outcome::exchange_error( null ), 'unexpected_error' ],
		];
	}

	/**
	 * Tests the store still drives consumption with the resolved (zero) user id when no user is logged in.
	 *
	 * @covers ::consume_callback_outcome
	 *
	 * @return void
	 */
	public function test_present_without_user() {
		$status = [
			'is_provisioned'    => true,
			'is_registered'     => false,
			'registered_at'     => null,
			'registered_at_iso' => null,
			'redirect_uris'     => [],
		];

		$this->myyoast_connection_conditional->shouldReceive( 'is_met' )->andReturn( true );
		$this->status_presenter->shouldReceive( 'present' )->andReturn( $status );

		Monkey\Functions\expect( 'get_current_user_id' )->andReturn( 0 );
		$this->callback_handler->shouldReceive( 'consume_outcome' )->once()->with( 0 )->andReturn( null );
		$this->short_link_helper->shouldReceive( 'get_query_params' )->andReturn( [] );
		$this->stub_endpoints( [] );

		$result = $this->instance->present();

		$this->assertNull( $result['callbackOutcome'] );
	}

	/**
	 * Tests `null` is returned when the feature flag is disabled.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_when_disabled() {
		$this->myyoast_connection_conditional->shouldReceive( 'is_met' )->andReturn( false );
		$this->status_presenter->shouldNotReceive( 'present' );

		$this->assertNull( $this->instance->present() );
	}
}
