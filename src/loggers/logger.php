<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\YoastSEO\Loggers
 */

namespace Yoast\WP\Free\Loggers;

use YoastSEO_Vendor\Psr\Log\LoggerInterface;
use YoastSEO_Vendor\Psr\Log\LoggerTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Creates an instance of a logger object.
 */
class Logger implements LoggerInterface {
	use LoggerTrait;

	/**
	 * @var \YoastSEO_Vendor\Psr\Log\LoggerInterface
	 */
	protected $wrapped_logger;

	/**
	 * Logger constructor.
	 */
	public function __construct() {
		$this->wrapped_logger = new NullLogger();

		/**
		 * Gives the possibility to set override the logger interface.
		 *
		 * @api \YoastSEO_Vendor\Psr\Log\LoggerInterface $logger Instance of NullLogger.
		 *
		 * @return \YoastSEO_Vendor\Psr\Log\LoggerInterface The logger object.
		 */
		$this->wrapped_logger = \apply_filters( 'wpseo_logger', $this->wrapped_logger );
	}

	/**
	 * Logs with an arbitrary level.
	 *
	 * @param mixed  $level   The log level.
	 * @param string $message The log message.
	 * @param array  $context The log context.
	 *
	 * @return void
	 */
	public function log( $level, $message, array $context = [] ) {
		$this->wrapped_logger->log( $level, $message, $context );
	}
}
