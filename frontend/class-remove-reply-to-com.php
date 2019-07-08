<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Class WPSEO_Remove_Reply_To_Com.
 *
 * @since 7.0
 */
class WPSEO_Remove_Reply_To_Com implements WPSEO_WordPress_Integration {

	/**
	 * Registers the hooks necessary to handle removing ?replytocom.
	 *
	 * @since 7.0
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( $this->clean_reply_to_com() ) {
			add_filter( 'comment_reply_link', array( $this, 'remove_reply_to_com' ) );
			add_action( 'template_redirect', array( $this, 'replytocom_redirect' ), 1 );
		}
	}

	/**
	 * Removes the ?replytocom variable from the link, replacing it with a #comment-<number> anchor.
	 *
	 * @todo Should this function also allow for relative urls ?
	 *
	 * @param string $link The comment link as a string.
	 *
	 * @return string The modified link.
	 */
	public function remove_reply_to_com( $link ) {
		return preg_replace( '`href=(["\'])(?:.*(?:\?|&|&#038;)replytocom=(\d+)#respond)`', 'href=$1#comment-$2', $link );
	}

	/**
	 * Redirects out the ?replytocom variables.
	 *
	 * @since 1.4.13
	 * @return boolean True when redirect has been done.
	 */
	public function replytocom_redirect() {
		if ( isset( $_GET['replytocom'] ) && is_singular() ) {
			$url          = get_permalink( $GLOBALS['post']->ID );
			$hash         = sanitize_text_field( wp_unslash( $_GET['replytocom'] ) );
			$query_string = '';
			if ( isset( $_SERVER['QUERY_STRING'] ) ) {
				$query_string = remove_query_arg( 'replytocom', sanitize_text_field( wp_unslash( $_SERVER['QUERY_STRING'] ) ) );
			}
			if ( ! empty( $query_string ) ) {
				$url .= '?' . $query_string;
			}
			$url .= '#comment-' . $hash;

			$front = WPSEO_Frontend::get_instance();
			$front->redirect( $url, 301 );

			return true;
		}

		return false;
	}

	/**
	 * Checks whether we can allow the feature that removes ?replytocom query parameters.
	 *
	 * @return bool True to remove, false not to remove.
	 */
	private function clean_reply_to_com() {
		/**
		 * Filter: 'wpseo_remove_reply_to_com' - Allow disabling the feature that removes ?replytocom query parameters.
		 *
		 * @param bool $return True to remove, false not to remove.
		 */
		return (bool) apply_filters( 'wpseo_remove_reply_to_com', true );
	}
}
