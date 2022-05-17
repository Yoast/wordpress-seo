<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\OAuth\Authorize;
use Yoast\WP\SEO\Helpers\Encryption_Helper;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Conditionals\OpenSSL_Enabled;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Class OAuth_Integration.
 */
class OAuth_Integration implements Integration_Interface {

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

	protected $authorize;

	public function __construct( Options_Helper $options_helper, Encryption_Helper $encryption_helper, Authorize $authorize ) {
		$this->options_helper = $options_helper;
		$this->encryption_helper = $encryption_helper;
		$this->authorize = $authorize;
	}

	/**
	 * Only activate this integration when the OpenSSL extension is enabled.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ OpenSSL_Enabled::class ];
	}

	public function register_hooks() {
		\add_action( 'admin_menu', [ $this, 'add_admin_menu_page' ] );
		\add_action( 'wpseo_oauth_remove_expired_tokens', [ $this, 'remove_expired_tokens' ] );
	}

	public function load_authorize_template() {
		$this->authorize->handle_authorization_request();
	}

	/**
	 * Add an admin page for authorization but do not add it to the WordPress admin dashboard.
	 *
	 * @return void
	 */
	public function add_admin_menu_page() {
		\add_menu_page( 'Yoast SEO OAuth', 'Yoast SEO OAuth', 'edit_plugins', 'wpseo_oauth_authorize', [ $this, 'load_authorize_template' ]);
		\remove_menu_page('wpseo_oauth_authorize');
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
	}

	/**
	 * Create and store the keys used in the OAuth process.
	 *
	 * @return void
	 */
	public function create_oauth_keys() {
		$private_key = "";
		$private_key_resource = \openssl_pkey_new();
		\openssl_pkey_export( $private_key_resource, $private_key );
		$public_key = \openssl_pkey_get_details( $private_key_resource )[ "key" ];
		$this->options_helper->set("oauth_server", array(
			"private_key" => $this->encryption_helper->encrypt($private_key),
			"public_key" => $this->encryption_helper->encrypt($public_key),
		));
	}

	/**
	 * Remove the OAuth keys.
	 *
	 * @return void
	 */
	public function remove_oauth_keys() {
		$this->options_helper->set("oauth_server", [
			"private_key" => "",
			"public_key" => "",
		]);
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
	 * Unschedules the cronjob to remove expired tokens.
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
		global $wpdb;

		// TODO: Remove these database queries -> via repository.
		$auth_code_table = Model::get_table_name( 'AuthTokens' );
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM $auth_code_table
					WHERE `expiry_date_time` <= %s;",
				[
					(new \DateTimeImmutable( 'now' ))->format("Y-m-d H:i:s"),
				]
			)
		);

		$access_token_table = Model::get_table_name( 'AccessTokens' );
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM $access_token_table
					WHERE `expiry_date_time` <= %s;",
				[
					(new \DateTimeImmutable( 'now' ))->format("Y-m-d H:i:s"),
				]
			)
		);

		$refresh_token_table = Model::get_table_name( 'RefreshTokens' );
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM $refresh_token_table
					WHERE `expiry_date_time` <= %s;",
				[
					(new \DateTimeImmutable( 'now' ))->format("Y-m-d H:i:s"),
				]
			)
		);
	}
}
