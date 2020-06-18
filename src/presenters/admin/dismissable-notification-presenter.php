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
	 * The label to show on the dismiss button.
	 *
	 * @var string
	 */
	protected $dismiss_label;

	/**
	 * Migration_Error_Presenter constructor.
	 *
	 * @param string $message       The notification message.
	 * @param string $identifier    The message identifier.
	 * @param string $dismiss_label Optional. Custom label to show on the dismiss button.
	 */
	public function __construct( $message, $identifier, $dismiss_label = '' ) {
		$this->message       = $message;
		$this->identifier    = $identifier;
		$this->dismiss_label = $dismiss_label;
	}

	/**
	 * Presents the migration error that occurred.
	 *
	 * @return string The error HTML.
	 */
	public function present() {
		$nonce      = \esc_attr( \wp_create_nonce( 'wpseo-dismiss-notification' ) );
		$identifier = \esc_attr( $this->identifier );

		// Fetch the current page, so we can stay on it.
		$page = \esc_attr( \filter_input( INPUT_GET, 'page', FILTER_SANITIZE_STRING ) );

		$message = \esc_html( $this->message );

		$dismiss_label = $this->dismiss_label;
		if ( empty ( $this->dismiss_label ) ) {
			$dismiss_label = \__( 'Dismiss', 'wordpress-seo' );
		}
		$dismiss_label = \esc_html( $dismiss_label );

		$html = <<<PHP_EOL
<div class="notice notice-info"><p>$message</p>
<form method="GET" action="">
<input type="hidden" name="identifier" value="$identifier">
<input type="hidden" name="page" value="$page">
<input type="hidden" name="action" value="wpseo-dismiss-notification">
<input type="hidden" name="nonce" value="$nonce">
<input type="submit" value="$dismiss_label">
</form>
</div>
PHP_EOL;

		return $html;
	}
}
