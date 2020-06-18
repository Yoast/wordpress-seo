<?php
/**
 * Presenter class for the indexation warning.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Migration_Error_Presenter class.
 */
class Dismissable_Notification_Presenter extends Abstract_Presenter {

	/**
	 * Holds the notification messsage.
	 *
	 * @var string
	 */
	protected $message;

	/**
	 * Holds the notification identifier, to dismiss it.
	 *
	 * @var string
	 */
	protected $identifier;

	/**
	 * The type of notification to show.
	 *
	 * @var string
	 */
	protected $type;

	/**
	 * The label to show on the dismiss button.
	 *
	 * @var string
	 */
	protected $dismiss_label;

	/**
	 * Declares the nonce key to be used.
	 */
	const NONCE_KEY = 'wpseo-dismiss-notification';

	/**
	 * Migration_Error_Presenter constructor.
	 *
	 * @param string $message       The notification message.
	 * @param string $identifier    The message identifier.
	 * @param string $type          Optional. The type of notification.
	 * @param string $dismiss_label Optional. Custom label to show on the dismiss button.
	 */
	public function __construct( $message, $identifier, $type = 'info', $dismiss_label = '' ) {
		$this->message       = $message;
		$this->identifier    = $identifier;
		$this->type          = $type;
		$this->dismiss_label = $dismiss_label;
	}

	/**
	 * Presents the migration error that occurred.
	 *
	 * @return string The error HTML.
	 */
	public function present() {
		$nonce      = \esc_attr( \wp_create_nonce( self::NONCE_KEY ) );
		$identifier = \esc_attr( $this->identifier );

		// Fetch the current page, so we can stay on it.
		$page = \esc_attr( \filter_input( INPUT_GET, 'page', FILTER_SANITIZE_STRING ) );

		$message = \esc_html( $this->message );

		$type = $this->type;
		if ( ! in_array( $type, [ 'info', 'warning', 'error' ], true ) ) {
			$type = 'info';
		}

		$dismiss_label = $this->dismiss_label;
		if ( empty( $this->dismiss_label ) ) {
			$dismiss_label = \__( 'Dismiss', 'wordpress-seo' );
		}
		$dismiss_label = \esc_html( $dismiss_label );

		$html = <<<PHP_EOL
<div class="notice notice-$type"><p>$message</p>
<form method="GET" action="">
	<div class="yoast-notice--container">
		<input type="hidden" name="identifier" value="$identifier">
		<input type="hidden" name="page" value="$page">
		<input type="hidden" name="nonce" value="$nonce">
		<input class="yoast-button yoast-button--secondary" type="submit" value="$dismiss_label">
	</div>
</form>
</div>
PHP_EOL;

		return $html;
	}
}
