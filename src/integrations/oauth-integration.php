<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\OAuth\Values\User;
use Yoast\WP\SEO\Helpers\Encryption_Helper;
use Yoast\WP\SEO\Conditionals\OpenSSL_Enabled;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\OAuth\Helpers\OAuth_Helper;
use Yoast\WP\SEO\OAuth\Presenters\Authorize_Error_Presenter;
use Yoast\WP\SEO\OAuth\Presenters\Authorize_Presenter;
use Yoast\WP\SEO\OAuth\Repositories\Access_Token_Repository;
use Yoast\WP\SEO\OAuth\Repositories\Auth_Code_Repository;
use Yoast\WP\SEO\OAuth\Repositories\Refresh_Token_Repository;
use Yoast\WP\SEO\Routes\OAuth_Routes;
use YoastSEO_Vendor\GuzzleHttp\Psr7\ServerRequest;
use YoastSEO_Vendor\League\OAuth2\Server\Exception\OAuthServerException;

/**
 * Class OAuth_Integration.
 *
 * This integration provides an OAuth server which can be used by third-parties to authenticate and authorize specific
 * operations towards the Yoast SEO plugin.
 */
class OAuth_Integration implements Integration_Interface {

	/**
	 * Auth Code repository.
	 *
	 * @var Auth_Code_Repository
	 */
	protected $auth_code_repository;

	/**
	 * Access Token repository.
	 *
	 * @var Access_Token_Repository
	 */
	protected $access_token_repository;

	/**
	 * Refresh Token repository.
	 *
	 * @var Refresh_Token_Repository
	 */
	protected $refresh_token_repository;

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Holds the Encryption_Helper instance.
	 *
	 * @var $encryption_helper
	 */
	protected $encryption_helper;

	/**
	 * Holds the OAuth Helper.
	 *
	 * @var OAuth_Helper
	 */
	protected $oauth_helper;

	/**
	 * Construct a new instance of the OAuth_Integration.
	 *
	 * @param Auth_Code_Repository     $auth_code_repository The auth code repository.
	 * @param Access_Token_Repository  $access_token_repository The access token repository.
	 * @param Refresh_Token_Repository $refresh_token_repository The refresh token repository.
	 * @param Options_Helper           $options_helper The option's helper.
	 * @param Encryption_Helper        $encryption_helper The encryption helper.
	 * @param OAuth_Helper             $oauth_helper The oauth helper.
	 */
	public function __construct( Auth_Code_Repository $auth_code_repository, Access_Token_Repository $access_token_repository, Refresh_Token_Repository $refresh_token_repository, Options_Helper $options_helper, Encryption_Helper $encryption_helper, OAuth_Helper $oauth_helper ) {
		$this->auth_code_repository     = $auth_code_repository;
		$this->access_token_repository  = $access_token_repository;
		$this->refresh_token_repository = $refresh_token_repository;
		$this->options_helper           = $options_helper;
		$this->encryption_helper        = $encryption_helper;
		$this->oauth_helper             = $oauth_helper;
	}

	/**
	 * Only activate this integration when the OpenSSL extension is enabled.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ OpenSSL_Enabled::class ];
	}

	/**
	 * Register integration hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_menu', [ $this, 'add_admin_menu_page' ] );
		\add_action( 'wpseo_oauth_remove_expired_tokens', [ $this, 'remove_expired_tokens' ] );
	}

	/**
	 * Handle an authorization request.
	 *
	 * @return void
	 * @throws \Exception When an authorization server can not be created.
	 */
	public function handle_authorization_request() {
		$server_request = ServerRequest::fromGlobals();
		try {
			$authorization_server = $this->oauth_helper->get_authorization_server();
			$auth_request         = $authorization_server->validateAuthorizationRequest(
				$server_request
			);
			$auth_request->setUser( new User( get_current_user_id() ) );
			$query_url           = add_query_arg(
				[
					'response_type'         => 'code',
					'client_id'             => $auth_request->getClient()->getIdentifier(),
					'redirect_uri'          => $auth_request->getRedirectUri(),
					'scope'                 => implode(
						',',
						array_map(
							function( $scope_entity ) {
								return $scope_entity->getIdentifier();},
							$auth_request->getScopes()
						)
					),
					'state'                 => $auth_request->getState(),
					'code_challenge'        => $auth_request->getCodeChallenge(),
					'code_challenge_method' => $auth_request->getCodeChallengeMethod(),
				],
				get_rest_url( null, OAuth_Routes::FULL_AUTHORIZE_ROUTE )
			);
			$authorize_presenter = new Authorize_Presenter(
				$auth_request->getClient()->getName(),
				array_map(
					function( $scope_entity ) {
						return $scope_entity->getIdentifier();
					},
					$auth_request->getScopes()
				),
				$query_url
			);
			$authorize_presenter->present();
		} catch ( OAuthServerException $e ) {
			$authorize_error_presenter = new Authorize_Error_Presenter( $e );
			$authorize_error_presenter->present();
		}
	}

	/**
	 * Add an admin page for authorization but do not add it to the WordPress admin dashboard.
	 *
	 * @return void
	 */
	public function add_admin_menu_page() {
		\add_menu_page( 'Yoast SEO OAuth', 'Yoast SEO OAuth', 'edit_plugins', 'wpseo_oauth_authorize', [ $this, 'handle_authorization_request' ] );
		\remove_menu_page( 'wpseo_oauth_authorize' );
	}

	/**
	 * Hooks to run on plugin activation.
	 */
	public function activate_hooks() {
		$this->schedule_cron();
		$this->create_oauth_keys();
	}

	/**
	 * Hooks to run on plugin deactivation.
	 */
	public function deactivate_hooks() {
		$this->unschedule_cron();
		$this->remove_oauth_keys();
		$this->clean_databases();
	}

	/**
	 * Create and store the keys used in the OAuth process.
	 *
	 * @return void
	 */
	public function create_oauth_keys() {
		$private_key          = '';
		$private_key_resource = \openssl_pkey_new();
		\openssl_pkey_export( $private_key_resource, $private_key );
		$public_key = \openssl_pkey_get_details( $private_key_resource )['key'];
		$this->options_helper->set(
			'oauth_server',
			[
				'private_key' => $this->encryption_helper->encrypt( $private_key ),
				'public_key'  => $this->encryption_helper->encrypt( $public_key ),
			]
		);
	}

	/**
	 * Remove the OAuth keys.
	 *
	 * @return void
	 */
	public function remove_oauth_keys() {
		$this->options_helper->set(
			'oauth_server',
			[
				'private_key' => '',
				'public_key'  => '',
			]
		);
	}

	/**
	 * Schedules the cronjob to remove expired tokens.
	 *
	 * @return void
	 */
	private function schedule_cron() {
		if ( wp_next_scheduled( 'wpseo_oauth_remove_expired_tokens' ) ) {
			return;
		}

		wp_schedule_event( time(), 'daily', 'wpseo_oauth_remove_expired_tokens' );
	}

	/**
	 * Deschedules the cronjob to remove expired tokens.
	 *
	 * @return void
	 */
	private function unschedule_cron() {
		if ( ! wp_next_scheduled( 'wpseo_oauth_remove_expired_tokens' ) ) {
			return;
		}

		wp_clear_scheduled_hook( 'wpseo_oauth_remove_expired_tokens' );
	}

	/**
	 * Remove expired OAuth tokens (access tokens, refresh tokens and authorization codes).
	 *
	 * @return void
	 */
	public function remove_expired_tokens() {
		$this->auth_code_repository->remove_expired();
		$this->access_token_repository->remove_expired();
		$this->refresh_token_repository->remove_expired();
	}

	/**
	 * Clean the OAuth database tables.
	 *
	 * @return void
	 */
	public function clean_databases() {
		$this->auth_code_repository->remove_all();
		$this->access_token_repository->remove_all();
		$this->refresh_token_repository->remove_all();
	}
}
