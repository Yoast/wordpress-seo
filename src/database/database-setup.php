<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\SEO\Database;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Loggers\Logger;
use Yoast\WP\SEO\WordPress\Initializer;
use Yoast\WP\SEO\ORM\Yoast_Model;
use YoastSEO_Vendor\ORM;

/**
 * Configures the ORM with the database credentials.
 */
class Database_Setup implements Initializer {
	use No_Conditionals;

	/**
	 * The logger object.
	 *
	 * @var \YoastSEO_Vendor\Psr\Log\LoggerInterface
	 */
	protected $logger;

	/**
	 * Database_Setup constructor.
	 *
	 * @param \Yoast\WP\SEO\Loggers\Logger $logger The logger.
	 */
	public function __construct( Logger $logger ) {
		$this->logger = $logger;
	}

	/**
	 * Initializes the database setup.
	 */
	public function initialize() {
		ORM::configure( 'mysql:host=' . \DB_HOST . ';dbname=' . \DB_NAME );
		ORM::configure( 'username', \DB_USER );
		ORM::configure( 'password', \DB_PASSWORD );

		Yoast_Model::$auto_prefix_models = '\\Yoast\\WP\\SEO\\Models\\';
		Yoast_Model::$logger             = $this->logger;
	}
}
