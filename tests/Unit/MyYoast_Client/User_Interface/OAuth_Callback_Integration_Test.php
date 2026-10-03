<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\MyYoast_Client\Application\Authorization_Code_Handler;
use Yoast\WP\SEO\MyYoast_Client\Application\Callback_Outcome;
use Yoast\WP\SEO\MyYoast_Client\Application\OAuth_Callback_Handler;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\OAuth_Callback_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the OAuth_Callback_Integration class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\User_Interface\OAuth_Callback_Integration
 */
final class OAuth_Callback_Integration_Test extends TestCase {

	// The fallback mirrors General_Page_Integration::PAGE; the return URL is a distinct
	// stored page so the success path proves a stored URL is honored over the fallback.
	private const FALLBACK_URL = 'https://example.com/wp-admin/admin.php?page=wpseo_dashboard';
	private const RETURN_URL   = 'https://example.com/wp-admin/admin.php?page=wpseo_integrations';

	/**
	 * The callback handler mock.
	 *
	 * @var OAuth_Callback_Handler|Mockery\MockInterface
	 */
	private $callback_handler;

	/**
	 * The authorization code handler mock.
	 *
	 * @var Authorization_Code_Handler|Mockery\MockInterface
	 */
	private $auth_code_handler;

	/**
	 * The redirect helper mock.
	 *
	 * @var Redirect_Helper|Mockery\MockInterface
	 */
	private $redirect_helper;

	/**
	 * The instance under test.
	 *
	 * @var OAuth_Callback_Integration
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->callback_handler  = Mockery::mock( OAuth_Callback_Handler::class );
		$this->auth_code_handler = Mockery::mock( Authorization_Code_Handler::class );
		$this->redirect_helper   = Mockery::mock( Redirect_Helper::class );

		$this->instance = new OAuth_Callback_Integration(
			$this->callback_handler,
			$this->auth_code_handler,
			$this->redirect_helper,
		);

		// resolve_return_url always builds the fallback and validates any stored
		// URL against it; stub both so every test path has them available.
		Monkey\Functions\stubs(
			[
				'admin_url' => static function ( $path ) {
					return 'https://example.com/wp-admin/' . $path;
				},
				// Valid URLs pass through; a fallback would only be returned for an
				// off-host URL, which is covered explicitly where it matters.
				'wp_validate_redirect' => static function ( $location ) {
					return $location;
				},
			],
		);

		$_GET = [];
	}

	/**
	 * Tears down test fixtures.
	 *
	 * @return void
	 */
	protected function tear_down() {
		$_GET = [];
		parent::tear_down();
	}

	/**
	 * Tests the conditional list.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame(
			[ MyYoast_Connection_Conditional::class ],
			OAuth_Callback_Integration::get_conditionals(),
		);
	}

	/**
	 * Tests the admin-post callback hook is registered.
	 *
	 * The redirect URI no longer needs filtering here: the redirect-URI provider
	 * defaults to this endpoint's URL directly, so the integration only wires the
	 * `admin_post_*` handler.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'admin_post_yoast_myyoast_oauth_callback' )
			->once()
			->with( [ $this->instance, 'handle' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests the callback endpoint URL points at the dedicated admin-post action.
	 *
	 * @covers ::get_callback_url
	 *
	 * @return void
	 */
	public function test_get_callback_url_points_at_admin_post_action() {
		$callback_url = 'https://example.com/wp-admin/admin-post.php?action=yoast_myyoast_oauth_callback';

		Monkey\Functions\expect( 'get_admin_url' )
			->with( null, 'admin-post.php?action=yoast_myyoast_oauth_callback' )
			->andReturn( $callback_url );

		$this->assertSame( $callback_url, OAuth_Callback_Integration::get_callback_url() );
	}

	/**
	 * Tests the extracted callback parameters are passed to the handler and the user is redirected back.
	 *
	 * @covers ::__construct
	 * @covers ::handle
	 * @covers ::resolve_return_url
	 * @covers ::read_query_arg
	 *
	 * @return void
	 */
	public function test_handle_drives_callback_handler_with_extracted_params() {
		$_GET = [
			'code'  => 'abc',
			'state' => 'xyz',
			'error' => '',
		];

		$this->expect_user( 42 );
		$this->expect_return_url_lookup( 42, self::RETURN_URL );
		$this->expect_callback( 42, 'abc', 'xyz', '', Callback_Outcome::success() );

		$this->expect_redirect( self::RETURN_URL );

		$this->instance->handle();
	}

	/**
	 * Tests a provider error is forwarded verbatim to the handler before redirecting.
	 *
	 * @covers ::handle
	 * @covers ::read_query_arg
	 *
	 * @return void
	 */
	public function test_handle_forwards_provider_error() {
		$_GET = [ 'error' => 'access_denied' ];

		$this->expect_user( 7 );
		$this->expect_return_url_lookup( 7, self::RETURN_URL );
		$this->expect_callback( 7, '', '', 'access_denied', Callback_Outcome::provider_error( 'access_denied' ) );

		$this->expect_redirect( self::RETURN_URL );

		$this->instance->handle();
	}

	/**
	 * Tests the handler still drives the use-case (and redirects) for a no-op callback.
	 *
	 * @covers ::handle
	 *
	 * @return void
	 */
	public function test_handle_no_op_redirects() {
		$_GET = [];

		$this->expect_user( 42 );
		$this->expect_return_url_lookup( 42, self::RETURN_URL );
		$this->expect_callback( 42, '', '', '', Callback_Outcome::no_op() );

		$this->expect_redirect( self::RETURN_URL );

		$this->instance->handle();
	}

	/**
	 * Tests the handler falls back to the integrations page when no return URL is stored.
	 *
	 * @covers ::resolve_return_url
	 *
	 * @return void
	 */
	public function test_handle_falls_back_to_integrations_page_when_no_return_url_stored() {
		$_GET = [];

		$this->expect_user( 42 );

		$this->auth_code_handler->shouldReceive( 'get_return_url' )->once()->with( 42 )->andReturn( null );
		$this->expect_callback( 42, '', '', '', Callback_Outcome::no_op() );

		$this->expect_redirect( self::FALLBACK_URL );

		$this->instance->handle();
	}

	/**
	 * Tests anonymous requests are redirected to the fallback without driving the handler.
	 *
	 * @covers ::handle
	 *
	 * @return void
	 */
	public function test_handle_anonymous_request_redirects_to_fallback() {
		$_GET = [
			'code'  => 'abc',
			'state' => 'xyz',
		];

		$this->expect_user( 0 );

		$this->callback_handler->shouldNotReceive( 'handle' );

		$this->expect_redirect( self::FALLBACK_URL );

		$this->instance->handle();
	}

	/**
	 * Configures the current user id stub.
	 *
	 * @param int $user_id The user id to return.
	 *
	 * @return void
	 */
	private function expect_user( int $user_id ): void {
		Monkey\Functions\expect( 'get_current_user_id' )->andReturn( $user_id );
	}

	/**
	 * Configures the stored return URL lookup.
	 *
	 * @param int    $user_id The user id.
	 * @param string $url     The URL to return.
	 *
	 * @return void
	 */
	private function expect_return_url_lookup( int $user_id, string $url ): void {
		$this->auth_code_handler->shouldReceive( 'get_return_url' )->once()->with( $user_id )->andReturn( $url );
	}

	/**
	 * Configures the expected delegation to the callback handler.
	 *
	 * @param int              $user_id The user id.
	 * @param string           $code    The expected authorization code argument.
	 * @param string           $state   The expected state argument.
	 * @param string           $error   The expected provider error argument.
	 * @param Callback_Outcome $outcome The outcome to return.
	 *
	 * @return void
	 */
	private function expect_callback( int $user_id, string $code, string $state, string $error, Callback_Outcome $outcome ): void {
		$this->callback_handler->shouldReceive( 'handle' )
			->once()
			->with( $user_id, $code, $state, $error )
			->andReturn( $outcome );
	}

	/**
	 * Configures the expected redirect.
	 *
	 * @param string $url The expected redirect target.
	 *
	 * @return void
	 */
	private function expect_redirect( string $url ): void {
		$this->redirect_helper->shouldReceive( 'do_safe_redirect' )->once()->with( $url );
	}
}
