<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\YoastSEO\Loggers
 */

namespace Yoast\YoastSEO\Loggers;

use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;

/**
 * Creates an instance of a logger object.
 */
class Logger {

	/**
	 * The instance of the logger.
	 *
	 * @var LoggerInterface|null
	 */
	protected static $logger;

	/**
	 * Retrieves an instance of the logger.
	 *
	 * @return LoggerInterface The logger.
	 */
	public static function get_logger() {
		static $logger;

		if ( self::$logger instanceof LoggerInterface ) {
			return self::$logger;
		}

		if ( ! $logger ) {
			$logger = new NullLogger();

			/**
			 * Gives the possibility to set override the logger interface.
			 *
			 * @api LoggerInterface $logger Instance of NullLogger.
			 *
			 * @return LoggerInterface The logger object.
			 */
			$logger = apply_filters( 'wpseo_logger', $logger );
		}

		if ( ! $logger instanceof LoggerInterface ) {
			$logger = new NullLogger();
		}

		return $logger;
	}

	/**
	 * Sets the logger object.
	 *
	 * @param LoggerInterface|null $logger The logger to use.
	 */
	public static function set_logger( LoggerInterface $logger = null ) {
		if ( ! $logger instanceof LoggerInterface ) {
			$logger = new NullLogger();
		}
		self::$logger = $logger;
	}
}
