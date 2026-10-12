<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map;

use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command_Handler;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Aggregator_Config;

/**
 * Provides the schema map XML, building and caching it when needed.
 */
class Schema_Map_Xml_Provider {

	/**
	 * The command handler instance.
	 *
	 * @var Aggregate_Site_Schema_Map_Command_Handler
	 */
	private $aggregate_site_schema_map_command_handler;

	/**
	 * The XML cache manager instance.
	 *
	 * @var Xml_Manager
	 */
	private $xml_cache_manager;

	/**
	 * The aggregator configuration instance.
	 *
	 * @var Aggregator_Config
	 */
	private $aggregator_config;

	/**
	 * Schema_Map_Xml_Provider constructor.
	 *
	 * @param Aggregate_Site_Schema_Map_Command_Handler $aggregate_site_schema_map_command_handler The command handler.
	 * @param Xml_Manager                               $xml_cache_manager                         The XML cache
	 *                                                                                             manager.
	 * @param Aggregator_Config                         $aggregator_config                         The aggregator
	 *                                                                                             configuration.
	 */
	public function __construct(
		Aggregate_Site_Schema_Map_Command_Handler $aggregate_site_schema_map_command_handler,
		Xml_Manager $xml_cache_manager,
		Aggregator_Config $aggregator_config
	) {
		$this->aggregate_site_schema_map_command_handler = $aggregate_site_schema_map_command_handler;
		$this->xml_cache_manager                         = $xml_cache_manager;
		$this->aggregator_config                         = $aggregator_config;
	}

	/**
	 * Returns the schema map XML, building and caching it when it is not cached yet.
	 *
	 * @return string The schema map XML.
	 */
	public function get_xml(): string {
		$cached_xml = $this->xml_cache_manager->get();
		if ( $cached_xml !== null ) {
			return $cached_xml;
		}

		$command = new Aggregate_Site_Schema_Map_Command( $this->aggregator_config->get_allowed_post_types() );
		$xml     = $this->aggregate_site_schema_map_command_handler->handle( $command );

		$this->xml_cache_manager->set( $xml );

		return $xml;
	}
}
