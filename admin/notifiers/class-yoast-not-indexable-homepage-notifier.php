<?php
/**
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Class Yoast_Not_Indexable_Homepage_Notifier
 */
class Yoast_Not_Indexable_Homepage_Notifier implements Yoast_Notifier_Interface {

	/** @var WPSEO_OnPage OnPage object to get information from */
	private $wpseo_onpage;

	/**
	 * Yoast_Not_Indexable_Homepage_Notifier constructor.
	 *
	 * @param WPSEO_OnPage $wpseo_onpage WPSEO Onpage to get information from.
	 */
	public function __construct( WPSEO_OnPage $wpseo_onpage ) {
		$this->wpseo_onpage = $wpseo_onpage;
	}

	/**
	 * Check if the cause for the notification is present
	 *
	 * @return bool True if notification is no longer relevant, False if it is still active.
	 */
	public function notify() {
		// If development note is on or the tagline notice is shown, just don't show this notice.
		if ( WPSEO_Utils::is_development_mode() || ( '0' === get_option( 'blog_public' ) ) ) {
			return false;
		}

		return $this->wpseo_onpage->get_onpage_option()->get_status() === WPSEO_OnPage_Option::IS_NOT_INDEXABLE;
	}

	/**
	 * Create the notification
	 *
	 * @return Yoast_Notification
	 */
	public function get_notification() {
		$notice = sprintf(
			/* translators: 1: opens a link to a related knowledge base article. 2: closes the link */
			__( '%1$sYour homepage cannot be indexed by search engines%2$s. This is very bad for SEO and should be fixed.', 'wordpress-seo' ),
			'<a href="http://yoa.st/onpageindexerror" target="_blank">',
			'</a>'
		);

		return new Yoast_Notification(
			$notice,
			array(
				'type'         => 'error yoast-dismissible',
				'id'           => 'wpseo-dismiss-onpageorg',
				'nonce'        => wp_create_nonce( 'wpseo-dismiss-onpageorg' ),
				'capabilities' => array( 'manage_options' ),
			)
		);
	}
}
