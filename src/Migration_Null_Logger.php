<?php

namespace Yoast\YoastSEO;

use YoastSEO_Vendor\Ruckusing_Util_Logger;

class Migration_Null_Logger extends Ruckusing_Util_Logger {
	/**
	 * Creates an instance of Ruckusing_Util_Logger
	 */
	public function __construct() {
		// Intentionally left empty.
	}

	/**
	 * Logs a message
	 *
	 * @param string $msg message to log
	 *
	 * @return void
	 */
	public function log( $msg ) {
	}

	/**
	 * Close the log file handler
	 *
	 * @return void
	 */
	public function close() {
	}
}
