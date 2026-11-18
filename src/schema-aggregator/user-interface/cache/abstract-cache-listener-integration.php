<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface\Cache;

use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;

/**
 * Abstract base class for cache listener integrations.
 *
 * This class provides common functionality for integrations that listen to events
 * and invalidate the schema aggregator cache based on those events.
 */
abstract class Abstract_Cache_Listener_Integration implements Integration_Interface {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository $indexable_repository
	 */
	protected $indexable_repository;

	/**
	 * The configuration object.
	 *
	 * @var Config
	 */
	protected $config;

	/**
	 * The Manager object.
	 *
	 * @var Manager
	 */
	protected $manager;

	/**
	 * The XML cache manager.
	 *
	 * @var Xml_Manager
	 */
	protected $xml_manager;

	/**
	 * The constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 * @param Config               $config               The config object.
	 * @param Manager              $manager              The manager object.
	 * @param Xml_Manager          $xml_manager          The XML cache manager.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Config $config,
		Manager $manager,
		Xml_Manager $xml_manager
	) {
		$this->indexable_repository = $indexable_repository;
		$this->config               = $config;
		$this->manager              = $manager;
		$this->xml_manager          = $xml_manager;
	}

	/**
	 * Registers the hooks with WordPress.
	 *
	 * @return void
	 */
	abstract public function register_hooks();

	/**
	 * Returns the needed conditionals.
	 *
	 * @return array<string>
	 */
	abstract public static function get_conditionals();

	/**
	 * Calculates which page an indexable appears on in a filtered, paginated list.
	 *
	 * This method accounts for deletions by counting the actual position in the result set,
	 * not just using the ID directly.
	 *
	 * @param Indexable $indexable The indexable to find the page for.
	 *
	 * @return int The page number (1-indexed) where this indexable appears.
	 */
	protected function get_page_number( $indexable ) {
		$query = $this->indexable_repository->query();
		$query->where_raw( '( is_public IS NULL OR is_public = 1 )' );
		$query->where( 'object_sub_type', $indexable->object_sub_type );
		$query->where( 'post_status', 'publish' );

		// Count how many records come before this indexable (have a smaller ID).
		$count_before = $query
			->where_lt( 'id', $indexable->id )
			->count();

		return ( (int) \floor( $count_before / $this->config->get_per_page( $indexable->object_sub_type ) ) + 1 );
	}
}
