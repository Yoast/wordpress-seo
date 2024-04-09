<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Shortlinker;
use Yoast\WHIPv2\Exceptions\InvalidType;
use Yoast\WHIPv2\Exceptions\InvalidVersionComparisonString;
use Yoast\WHIPv2\Interfaces\Message;
use Yoast\WHIPv2\MessageDismisser;
use Yoast\WHIPv2\MessageFormatter;
use Yoast\WHIPv2\Presenters\WPMessagePresenter;
use Yoast\WHIPv2\RequirementsChecker;
use Yoast\WHIPv2\VersionRequirement;
use Yoast\WHIPv2\WPDismissOption;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class Unsupported_PHP_Version_Notice.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */
class Unsupported_PHP_Version_Notice implements Integration_Interface, Message {

	/**
	 * Returns the conditionals based on which this integration should be active.
	 *
	 * @return array<string> The array of conditionals.
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
		\add_action( 'admin_init', [ $this, 'check_php_version' ] );
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
		$message[] = MessageFormatter::strongParagraph( \__( 'Upgrade your PHP version', 'wordpress-seo' ) ) . '<br />';
		$message[] = MessageFormatter::paragraph(
			\sprintf(
				/* translators: 1: Yoast SEO, 2: Yoast SEO Premium */
				\__(
					'By November 1st, 2024, we’ll update the minimum PHP requirement for %1$s, %2$s and all our add-ons to PHP 7.4. This, to ensure we can keep delivering state of the art features.',
					'wordpress-seo'
				),
				'Yoast SEO',
				'Yoast SEO Premium'
			)
		) . '<br />';
		$message[] = MessageFormatter::strongParagraph( \__( 'Can’t upgrade yourself? Ask your host!', 'wordpress-seo' ) ) . '<br />';
		$message[] = MessageFormatter::paragraph(
			\sprintf(
			/* translators: 1: Link tag to WordPress Hosts page on Yoast.com; 2: Link closing tag */
				\__(
					'Upgrading your PHP version is something your hosting provider can help you out with. If they can’t upgrade your PHP version, we advise you to consider %1$sswitching to a hosting provider%2$s that can provide the security and features a modern host should provide.',
					'wordpress-seo'
				),
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoast.com/wordpress-hosting/' ) . '">',
				'</a>'
			)
		) . '<br />';

		return \implode( \PHP_EOL, $message );
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
			$checker = new RequirementsChecker( [ 'php' => \PHP_VERSION ] );

			$checker->addRequirement( VersionRequirement::fromCompareString( 'php', '>=7.4' ) );
			$checker->check();

			return $checker->hasMessages() === false;
		}
		catch ( InvalidVersionComparisonString $e ) {
			return true;
		}
		catch ( InvalidType $e ) {
			return true;
		}
	}

	/**
	 * Creates a new message to display regarding the usage of PHP 7.3 (or lower).
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	protected function show_unsupported_php_message() {
		$presenter = new WPMessagePresenter(
			$this,
			new MessageDismisser( \time(), ( \WEEK_IN_SECONDS * 4 ), new WPDismissOption() ),
			\__( 'Remind me again in 4 weeks.', 'wordpress-seo' )
		);
		$presenter->registerHooks();
	}
}
