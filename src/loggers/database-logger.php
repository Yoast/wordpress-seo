<?php
/**
 * A simple logger to allow query and memory usage logging.
 *
 * @package Yoast\WP\SEO\Loggers
 */

namespace Yoast\WP\SEO\Loggers;

use Yoast\WP\SEO\Conditionals\Development_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use YoastSEO_Vendor\ORM;

/**
 * Class Database_Logger
 */
class Database_Logger implements Integration_Interface {
	/**
	 * Private array of queries used for logging.
	 *
	 * @var array
	 */
	protected $query_log = [];

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		ORM::configure( 'logging', true );
		ORM::configure( 'logger', [ $this, 'logger' ] );

		\add_action( 'shutdown', [ $this, 'log_output' ] );
	}

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Development_Conditional::class ];
	}

	/**
	 * Logs the query to a local variable for output on shutdown.
	 *
	 * @param string $query The query.
	 * @param float  $time  The time the query took to execute.
	 *
	 * @return void
	 */
	public function logger( $query, $time ) {
		$query             = [
			'query' => $query,
			'time'  => $time,
		];
		$this->query_log[] = $query;
	}

	/**
	 * Outputs some logging.
	 *
	 * @return void
	 */
	public function log_output() {
		$content_type = $this->get_content_type();

		if (
			\wp_doing_ajax() ||
			( defined( 'WP_CLI' ) && WP_CLI ) ||
			( defined( 'REST_REQUEST' ) && REST_REQUEST ) ||
			( stripos( $content_type, 'text/html' ) === false && $content_type !== '' )
		) {
			return;
		}

		echo PHP_EOL, PHP_EOL, '<!--';

		$this->log_time();
		$this->log_memory_usage();
		$this->log_idiorm_queries();
		$this->log_wpdb_queries();

		echo '-->', PHP_EOL;
	}

	/**
	 * Get the content type from the return header.
	 *
	 * @return string The return header if any, empty string if not.
	 */
	private function get_content_type() {
		$headers = headers_list();
		foreach ( $headers as $header ) {
			if ( stripos( $header, 'Content-Type:' ) !== false ) {
				return (string) preg_replace( '/^Content-Type:\s*(.*)/', '$1', $header );
			}
		}

		return '';
	}

	/**
	 * Outputs a log header.
	 *
	 * @param string $string The header to output.
	 *
	 * @return void
	 */
	private function header( $string ) {
		echo PHP_EOL, PHP_EOL, $string, PHP_EOL;
		echo '====', PHP_EOL;
	}

	/**
	 * Logs the memory usage.
	 *
	 * @return void
	 */
	protected function log_memory_usage() {
		$memory_used_peak = number_format( ( memory_get_peak_usage() / ( 1024 * 1024 ) ), 2 );
		$memory_used      = number_format( ( memory_get_usage() / ( 1024 * 1024 ) ), 2 );

		$this->header( 'Memory usage' );
		echo 'Peak: ', $memory_used_peak, 'MB', PHP_EOL;
		echo 'Average: ', $memory_used, 'MB', PHP_EOL;
	}

	/**
	 * Logs the IdiORM queries.
	 *
	 * @return void
	 */
	protected function log_idiorm_queries() {
		$this->header( 'Yoast Idiorm Queries (' . count( $this->query_log ) . ')' );
		$i = 1;
		foreach ( $this->query_log as $query ) {
			echo $i, ': "', $query['query'], '" in ', round( $query['time'], 5 ), PHP_EOL;
			$i ++;
		}
	}

	/**
	 * Logs the WPDB queries, if `SAVEQUERIES` has been set to true.
	 *
	 * @return void
	 */
	protected function log_wpdb_queries() {
		if ( defined( 'SAVEQUERIES' ) && SAVEQUERIES ) {
			global $wpdb;
			$this->header( 'WPDB Queries (' . count( $wpdb->queries ) . ')' );
			$i = 1;
			foreach ( $wpdb->queries as $query ) {
				echo $i, ': "', trim( $query[0] ), '" in ', round( $query[1], 5 ), PHP_EOL;
				echo '    ', $query[2], PHP_EOL;
				$i ++;
			}

			return;
		}
		$this->header( 'WPDB Queries' );
		echo 'Please add this to your wp-config.php to allow WPDB Query logging:', PHP_EOL;
		echo "define( 'SAVEQUERIES', true );", PHP_EOL;
	}

	/**
	 * Logs the request time.
	 *
	 * @return void
	 */
	protected function log_time() {
		$this->header( 'Request time' );
		echo timer_stop(), 's', PHP_EOL;
	}
}
