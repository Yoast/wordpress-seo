<?php
/**
 * Empty migration logger.
 *
 * @package Yoast\YoastSEO
 */

namespace Yoast\WP\SEO\Loggers;

use YoastSEO_Vendor\Ruckusing_Util_Logger;

/**
 * Logger to make sure the output is not written into a file.
 */
class Migration_Logger extends Ruckusing_Util_Logger {

	/**
	 * The logger object.
	 *
	 * @var Logger
	 */
	protected $logger;

	/**
	 * Creates an instance of Ruckusing_Util_Logger.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Logger $logger The logger to wrap.
	 */
	public function __construct( Logger $logger ) {
		$this->logger = $logger;
	}

	/**
	 * Logs a message.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $msg Message to log.
	 *
	 * @return void
	 */
	public function log( $msg ) {
		$this->logger->info( $msg );
	}

	/**
	 * Close the log file handler.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function close() {
	}
}
