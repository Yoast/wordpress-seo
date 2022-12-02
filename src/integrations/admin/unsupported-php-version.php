<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Whip_InvalidType;
use Whip_InvalidVersionComparisonString;
use Whip_Message;
use Whip_MessageDismisser;
use Whip_MessageFormatter;
use Whip_RequirementsChecker;
use Whip_VersionRequirement;
use Whip_WPDismissOption;
use Whip_WPMessagePresenter;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class Unsupported_PHP_Version.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */
class Unsupported_PHP_Version implements Integration_Interface, Whip_Message {

	/**
	 * Returns the conditionals based on which this integration should be active.
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		return [
			Yoast_Admin_And_Dashboard_Conditional::class,
		];
	}

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'check_php_version' ], 10 );
	}

	/**
	 * Checks the current PHP version.
	 *
	 * @return void
	 */
	public function check_php_version() {
		// If the user isn't an admin, don't display anything.
		if ( ! $this->has_right_capabilities() ) {
			return;
		}

		if ( ! $this->on_dashboard_page( $GLOBALS['pagenow'] ) ) {
			return;
		}

		// Checks if the user is running at least PHP 7.2.
		if ( $this->is_supported_php_version_installed() === false ) {
			$this->show_unsupported_php_message();
		}
	}

	/**
	 * Composes the body of the message to display.
	 *
	 * @return string The message to display.
	 */
	public function body() {
		$message   = [];
		$message[] = Whip_MessageFormatter::strongParagraph( \__( 'Upgrade your PHP version', 'wordpress-seo' ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph(
			\sprintf(
				/* translators: 1: Yoast SEO, 2: Yoast SEO Premium */
				\__(
					'By March 1st, 2023, we’ll update the minimum PHP requirement for %1$s, %2$s and all our add-ons to PHP 7.2. This, to ensure we can keep delivering state of the art features.',
					'wordpress-seo'
				),
				'Yoast SEO',
				'Yoast SEO Premium'
			)
		) . '<br />';
		$message[] = Whip_MessageFormatter::strongParagraph( \__( 'Can’t upgrade yourself? Ask your host!', 'wordpress-seo' ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph(
			\sprintf(
				/* translators: 1: Link tag to WordPress Hosts page on Yoast.com; 2: Link closing tag */
				\__(
					'Upgrading your PHP version is something your hosting provider can help you out with. If they can’t upgrade your PHP version, we advise you to consider %1$sswitching to a hosting provider%2$s that can provide the security and features a modern host should provide.',
					'wordpress-seo'
				),
				'<a href="' . WPSEO_Shortlinker::get( 'http://yoa.st/whip-hosting' ) . '" target="_blank">',
				'</a>'
			)
		) . '<br />';

		return \implode( PHP_EOL, $message );
	}

	/**
	 * Checks if the current user has the right capabilities.
	 *
	 * @return bool True when user has right capabilities.
	 */
	protected function has_right_capabilities() {
		return \current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Whether we are on the admin dashboard page or in the Yoast dashboard page.
	 *
	 * We need to have the notice in the main admin otherwise the dismissal mechanism won't work.
	 *
	 * @param string $current_page The current page.
	 *
	 * @return bool True if current page is the index.php.
	 */
	protected function on_dashboard_page( $current_page ) {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Date is not processed or saved.
		if ( $current_page === 'admin.php' && isset( $_GET['page'] ) && \sanitize_text_field( \wp_unslash( $_GET['page'] ) ) === 'wpseo_dashboard' ) {
			return true;
		}

		return ( $current_page === 'index.php' );
	}

	/**
	 * Checks if the installed php version is supported.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool True when the php version is support.
	 */
	protected function is_supported_php_version_installed() {
		try {
			$checker = new Whip_RequirementsChecker( [ 'php' => PHP_VERSION ] );

			$checker->addRequirement( Whip_VersionRequirement::fromCompareString( 'php', '>=7.2' ) );
			$checker->check();

			return $checker->hasMessages() === false;
		}
		catch ( Whip_InvalidVersionComparisonString $e ) {
			return true;
		}
		catch ( Whip_InvalidType $e ) {
			return true;
		}
	}

	/**
	 * Creates a new message to display regarding the usage of PHP 7.1 (or lower).
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	protected function show_unsupported_php_message() {
		$presenter = new Whip_WPMessagePresenter(
			$this,
			new Whip_MessageDismisser( \time(), ( WEEK_IN_SECONDS * 4 ), new Whip_WPDismissOption() ),
			\__( 'Remind me again in 4 weeks.', 'wordpress-seo' )
		);
		$presenter->registerHooks();
	}
}
