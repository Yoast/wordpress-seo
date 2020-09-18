<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for server related actions.
 */
class Server_Helper {

	/**
	 * Check if the web server is running on Apache.
	 *
	 * @return bool
	 */
	public function is_apache() {
		return \stripos( $this->get_server_software(), 'apache' ) !== false;
	}

	/**
	 * Check if the web server is running on Nginx.
	 *
	 * @return bool
	 */
	public function is_nginx() {
		return \stripos( $this->get_server_software(), 'nginx' ) !== false;
	}

	/**
	 * Retrieves the server software value from the $_SERVER.
	 *
	 * @return string The server software.
	 */
	protected function get_server_software() {
		if ( ! isset( $_SERVER['SERVER_SOFTWARE'] ) ) {
			return '';
		}

		return \sanitize_text_field( \wp_unslash( $_SERVER['SERVER_SOFTWARE'] ) );
	}


}
