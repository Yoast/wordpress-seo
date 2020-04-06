<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\SEO\Initializers;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Loggers\Logger;
use Yoast\WP\SEO\ORM\Yoast_Model;
use YoastSEO_Vendor\ORM;
use YoastSEO_Vendor\Psr\Log\LoggerInterface;

/**
 * Configures the ORM with the database credentials.
 */
class Database_Setup implements Initializer_Interface {
	use No_Conditionals;

	/**
	 * The logger object.
	 *
	 * @var LoggerInterface
	 */
	protected $logger;

	/**
	 * Database_Setup constructor.
	 *
	 * @param Logger $logger The logger.
	 */
	public function __construct( Logger $logger ) {
		$this->logger = $logger;
	}

	/**
	 * Initializes the database setup.
	 */
	public function initialize() {
		ORM::configure( $this->get_connection_string() );
		ORM::configure( 'username', \DB_USER );
		ORM::configure( 'password', \DB_PASSWORD );

		Yoast_Model::$auto_prefix_models = '\\Yoast\\WP\\SEO\\Models\\';
		Yoast_Model::$logger             = $this->logger;
	}

	/**
	 * Builds a connection string from wpdb
	 *
	 * @return string The connection string.
	 */
	private function get_connection_string() {
		global $wpdb;

		$host    = \DB_HOST;
		$port    = null;
		$socket  = null;
		$is_ipv6 = false;

		$host_data = $wpdb->parse_db_host( \DB_HOST );
		if ( $host_data ) {
			list( $host, $port, $socket, $is_ipv6 ) = $host_data;
		}
		if ( $is_ipv6 && extension_loaded( 'mysqlnd' ) ) {
			$host = "[$host]";
		}
		if ( empty( $port ) ) {
			$port = ini_get( 'mysqli.default_port' );
		}

		$connection_string = 'mysql:host=' . $host . ';dbname=' . \DB_NAME . ';';
		if ( ! empty( $port ) ) {
			$connection_string .= 'port=' . $port . ';';
		}
		if ( ! empty( $socket ) ) {
			$connection_string .= 'unix_socket=' . $socket . ';';
		}
		if ( ! empty( \DB_CHARSET ) ) {
			$connection_string .= 'charset=' . \DB_CHARSET . ';';
		}
		return $connection_string;
	}
}
