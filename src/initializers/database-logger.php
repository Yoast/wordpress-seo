<?php
/**
 * A helper object to allow query and memory usage logging.
 *
 * @package Yoast\WP\Free\Helpers
 */

namespace Yoast\WP\Free\Helpers;

use YoastSEO_Vendor\ORM;

/**
 * Class Log_Helper
 */
class Log_Helper {
	/**
	 * Private array of queries used for logging.
	 *
	 * @var array
	 */
	protected $query_log = [];

	/**
	 * Log_Helper constructor.
	 */
	public function __construct() {
		ORM::configure( 'logging', true );
		ORM::configure( 'logger', [ $this, 'logger' ] );

		add_action( 'shutdown', [ $this, 'log_output' ] );
	}

	/**
	 * Logs the query to a local variable for output on shutdown.
	 *
	 * @param string $query The query.
	 * @param float  $time  The time the query took to execute.
	 */
	public function logger( $query, $time ) {
		$query             = [
			'query' => $query,
			'time'  => $time
		];
		$this->query_log[] = $query;
	}

	/**
	 * Outputs some logging.
	 */
	public function log_output() {
		echo PHP_EOL . PHP_EOL . '<!--';

		$this->log_memory_usage();
		$this->log_idiorm_queries();
		$this->log_wpdb_queries();

		echo '-->' . PHP_EOL;
	}

	/**
	 * Outputs a log header.
	 *
	 * @param $string
	 */
	private function header( $string ) {
		echo PHP_EOL . PHP_EOL . $string . PHP_EOL;
		echo '====' . PHP_EOL;
	}

	/**
	 * Logs the memory usage.
	 *
	 * @return void
	 */
	protected function log_memory_usage() {
		$memory_used_peak = number_format( ( memory_get_peak_usage() / 1048576 ), 2 );
		$memory_used      = number_format( ( memory_get_usage() / 1048576 ), 2 );

		$this->header( 'Memory usage' );
		echo 'Peak: ' . $memory_used_peak . 'MB' . PHP_EOL;
		echo 'Average: ' . $memory_used . 'MB' . PHP_EOL;
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
			echo $i . ': "' . $query['query'] . '" in ' . round( $query['time'], 5 ) . PHP_EOL;
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
				echo $i . ': "' . $query[0] . '" in ' . round( $query[1], 5 ) . PHP_EOL;
				$i ++;
			}
		}
	}
}