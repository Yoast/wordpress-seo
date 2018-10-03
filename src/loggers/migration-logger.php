<?php
/**
 * Empty migration logger.
 *
 * @package Yoast\YoastSEO
 */

namespace Yoast\YoastSEO\Loggers;

use YoastSEO_Vendor\Ruckusing_Util_Logger;

/**
 * Logger to make sure the output is not written into a file.
 */
class Migration_Logger extends Ruckusing_Util_Logger {
	/**
	 * Creates an instance of Ruckusing_Util_Logger
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		// Intentionally left empty.
	}

	/**
	 * Logs a message
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $msg Message to log.
	 *
	 * @return void
	 */
	public function log( $msg ) {
		Logger::get_logger()->info( $msg );
	}

	/**
	 * Close the log file handler
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function close() {
	}
}
