<?php

namespace Yoast\YoastSEO;

class Migration_Null_Logger extends \Ruckusing_Util_Logger {
	/**
	 * Creates an instance of Ruckusing_Util_Logger
	 */
	public function __construct() {
	}

	/**
	 * Log a message
	 *
	 * @param string $msg message to log
	 */
	public function log( $msg ) {
	}

	/**
	 * Close the log file handler
	 */
	public function close() {
	}
}
