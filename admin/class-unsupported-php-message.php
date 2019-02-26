<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class that creates the PHP 5.6 support message.
 */
class WPSEO_Unsupported_PHP_Message implements Whip_Message, WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'admin_init', array( $this, 'check_php_version' ) );
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

		// Checks if the user is running PHP 5.6.
		if ( $this->is_supported_php_version_installed() === false ) {
			$this->show_unsupported_php_message();
		}

		$this->check_versions(
			array(
				'php' => '>=5.6',
			)
		);
	}

	/**
	 * Composes the body of the message to display.
	 *
	 * @return string The message to display.
	 */
	public function body() {
		$message = array();
		$message[] = Whip_MessageFormatter::strongParagraph( __( 'Take full advantage of features such as Live indexing with a newer PHP version.', 'wordpress-seo' ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph(
				sprintf(
					__(
						/* translators: 1: WordPress; 2: Yoast SEO, 3: Link tag to post over live indexing; 2: Link closing tag */
						'Hey, we’ve noticed that you’re running an outdated version of PHP. PHP is the programming language that %1$s and %2$s are built on. You should update to a newer PHP version to make sure you’re not missing out on awesome features such as %3$sLive indexing%4$s.',
						'wordpress-seo'
					),
					'WordPress',
					'Yoast SEO',
					'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3lk' ) . '">',
					'</a>'
				)
			) . '<br />';
		$message[] = Whip_MessageFormatter::strongParagraph( __( 'To which version should I update?', 'wordpress-seo' ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph(
				sprintf(
					__(
						/* translators: 1: WordPress; 2: Link tag to KB article about PHP 7; 3: Link closing tag */
						'You should update your PHP version to either 5.6 or to 7.1 or 7.2. On a normal %1$s site, switching to PHP 5.6 should never cause issues. We would however actually recommend you switch to PHP 7.1 or higher. There are some plugins that are not ready for PHP 7.1 (or higher) though, so do some testing first. We have an article on %2$show to test whether that’s an option for you%3$s. PHP 7.1 (or higher) is much faster than PHP 5.6. It’s also the only PHP version still in active development and therefore the better option for your site in the long run.',
						'wordpress-seo'
					),
					'WordPress',
					'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3ll' ) . '">',
					'</a>'
				)
			) . '<br />';
		$message[] = Whip_MessageFormatter::strongParagraph( __( 'Can’t update? Ask your host!', 'wordpress-seo' ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph(
				sprintf(
					__(
						/* translators: 1: Link tag to email example page; 2: Link closing tag; 3: Link tag to WordPress Hosts; 4: WordPress; 5: Yoast */
						'If you cannot upgrade your PHP version yourself, you can send an email to your host. We have an %1$sexample of such an email%2$s. If they don’t want to upgrade your PHP version, we would suggest you switch hosts. Have a look at one of our %3$srecommended %4$s hosting partners%2$s, they’ve all been vetted by our %5$s support team and provide all the features a modern host should provide.',
						'wordpress-seo'
					),
					'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3lm' ) . '">',
					'</a>',
					'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3ln' ) . '">',
					'WordPress',
					'Yoast'
				)
			) . '<br />';

		return implode( $message, PHP_EOL );
	}

	/**
	 * Checks if the current user has the right capabilities.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool True when user has right capabilities.
	 */
	protected function has_right_capabilities() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Whether we are on the admin dashboard page.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $current_page The current page.
	 *
	 * @return bool True if current page is the index.php.
	 */
	protected function on_dashboard_page( $current_page ) {
		if ( $current_page === 'admin.php' && isset( $_GET['page'] ) && sanitize_text_field( $_GET['page'] ) === 'wpseo_dashboard' ) {
			return true;
		}

		return 'index.php' === $current_page;
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
			$checker = new Whip_RequirementsChecker( array( 'php' => PHP_VERSION ) );

			$checker->addRequirement( Whip_VersionRequirement::fromCompareString( 'php', '>=5.6' ) );
			$checker->check();

			return $checker->hasMessages() === false;
		}
		catch ( Whip_InvalidVersionComparisonString $e ) {
			return true;
		}
	}

	/**
	 * Creates a new message to display regarding the usage of PHP 5.6 (or lower).
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	protected function show_unsupported_php_message() {
		$presenter = new Whip_WPMessagePresenter(
			$this,
			new Whip_MessageDismisser( time(), ( WEEK_IN_SECONDS * 4 ), new Whip_WPDismissOption() ),
			__( 'Remind me again in 4 weeks.', 'wordpress-seo' )
		);
		$presenter->register_hooks();
	}

	/**
	 * Checks the versions.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param array $versions_to_check The version to check.
	 *
	 * @return void
	 */
	protected function check_versions( $versions_to_check ) {
		whip_wp_check_versions( $versions_to_check );
	}
}
