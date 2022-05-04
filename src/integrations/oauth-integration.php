<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * Class Front_End_Integration.
 */
class OAuth_Integration implements Integration_Interface {

	use No_Conditionals;

	public function register_hooks() {
		add_action( 'admin_menu', [ $this, 'add_admin_menu_page' ] );
		add_action( 'wpseo_oauth_remove_expired_tokens', [ $this, 'remove_expired_tokens' ] );
	}

	public function load_authorize_template() {
		include_once WPSEO_PATH . 'src/oauth/authorize.php';
	}

	/**
	 * Add an admin page for authorization but do not add it to the WordPress admin dashboard.
	 *
	 * @return void
	 */
	public function add_admin_menu_page() {
		add_menu_page( 'Yoast SEO OAuth', 'Yoast SEO OAuth', 'edit_plugins', 'wpseo_oauth_authorize', [ $this, 'load_authorize_template' ]);
		remove_menu_page('wpseo_oauth_authorize');
	}

	/**
	 * Hooks to run on plugin activation.
	 */
	public function activate_hooks() {
		$this->schedule_cron();
	}

	/**
	 * Hooks to run on plugin deactivation.
	 */
	public function deactivate_hooks() {
		$this->unschedule_cron();
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
