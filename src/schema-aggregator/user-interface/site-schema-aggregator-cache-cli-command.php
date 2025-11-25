<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface;

use WP_CLI;
use WP_CLI\ExitException;
use Yoast\WP\SEO\Commands\Command_Interface;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;

/**
 * Handles the CLI command to represent a site's schema as JSON.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Site_Schema_Aggregator_Cache_Cli_Command implements Command_Interface {

	/**
	 * The configuration instance.
	 *
	 * @var Config
	 */
	private $config;

	/**
	 * The The cache manager instance.
	 *
	 * @var Manager
	 */
	private $cache_manager;

	/**
	 * The XML cache manager instance.
	 *
	 * @var Xml_Manager
	 */
	private $xml_manager;

	/**
	 * Site_Schema_Aggregator_Cache_Cli_Command constructor.
	 *
	 * @param Config      $config        The config object.
	 * @param Manager     $cache_manager The cache manager.
	 * @param Xml_Manager $xml_manager   The XML cache manager.
	 */
	public function __construct( Config $config, Manager $cache_manager, Xml_Manager $xml_manager ) {
		$this->config        = $config;
		$this->cache_manager = $cache_manager;
		$this->xml_manager   = $xml_manager;
	}

	/**
	 * Returns the namespace of this command.
	 *
	 * @return string
	 */
	public static function get_namespace() {
		return Main::WP_CLI_NAMESPACE;
	}

	/**
	 * Aggregates the schema for a certain site.
	 *
	 * ## OPTIONS
	 *
	 * [--page=<page>]
	 * : The current page to process.
	 * ---
	 * ## EXAMPLES
	 *
	 *     wp yoast aggregate_site_schema_clear_cache
	 *
	 * @when after_wp_load
	 *
	 * @param array<string>|null $args       The arguments.
	 * @param array<string>|null $assoc_args The associative arguments.
	 *
	 * @throws ExitException When the input args are invalid.
	 * @return void
	 */
	public function aggregate_site_schema_clear_cache( $args = null, $assoc_args = null ) {
		if ( isset( $assoc_args['page'] ) && (int) $assoc_args['page'] >= 1 ) {
			$this->cache_manager->invalidate( $assoc_args['page'] );
			$this->xml_manager->invalidate();
			WP_CLI::log(
				\__( 'The site schema cache has been cleared successfully.', 'wordpress-seo' )
			);
			return;
		}
		$this->cache_manager->invalidate_all();
		$this->xml_manager->invalidate();

		WP_CLI::log(
			\__( 'All site schema cache has been cleared successfully.', 'wordpress-seo' )
		);
	}
}
