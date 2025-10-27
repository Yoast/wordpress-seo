<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Nlweb\Schema_Aggregator\User_Interface\Cache;

use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Nlweb\Schema_Aggregator\Application\Cache\Manager;
use Yoast\WP\SEO\Nlweb\Schema_Aggregator\Infrastructure\Config;
use Yoast\WP\SEO\Nlweb\Schema_Aggregator\Infrastructure\Site_Schema_Json_Conditional;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * This class listens to changes in the indexables and resets the cache.
 */
class Indexables_Update_Listener_Integration implements Integration_Interface {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository $indexable_repository
	 */
	private $indexable_repository;

	/**
	 * The configuration object.
	 *
	 * @var Config
	 */
	private $config;

	/**
	 * The Manager object.
	 *
	 * @var Manager
	 */
	private $manager;

	/**
	 * The constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 * @param Config               $config               The config object.
	 * @param Manager              $manager              The manager object.
	 */
	public function __construct( Indexable_Repository $indexable_repository, Config $config, Manager $manager ) {
		$this->indexable_repository = $indexable_repository;
		$this->config               = $config;
		$this->manager              = $manager;
	}

	/**
	 * Registers the hooks with WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wpseo_save_indexable', [ $this, 'reset_cache' ], \PHP_INT_MAX, 2 );
	}

	/**
	 * Returns the needed conditionals.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [ Site_Schema_Json_Conditional::class ];
	}

	/**
	 * This method resets the cache for the cached page where the changed indexable is located.
	 *
	 * @param Indexable $indexable        The updated indexable.
	 * @param Indexable $indexable_before The state of the indexable before the update.
	 *
	 * @return bool
	 */
	public function reset_cache( $indexable, $indexable_before ) {
		if ( $indexable_before->permalink === null ) {
			$this->manager->invalidate_all();
			return false;
		}
		$page = $this->get_page_number( $indexable );
		$this->manager->invalidate( $page );

		return true;
	}

	/**
	 * Calculates which page an indexable appears on in a filtered, paginated list.
	 *
	 * This method accounts for deletions by counting the actual position in the result set,
	 * not just using the ID directly.
	 *
	 * @param Indexable     $indexable              The indexable to find the page for.
	 * @param array<string> $post_type_exclude_list The list of excluded post types.
	 *
	 * @return int The page number (1-indexed) where this indexable appears.
	 */
	public function get_page_number( $indexable, $post_type_exclude_list = [] ) {
		$query = $this->indexable_repository->query();

		$query->where_raw( '( is_public IS NULL OR is_public = 1 )' );
		if ( $post_type_exclude_list ) {
			$query->where_not_in( 'object_sub_type', $post_type_exclude_list );
		}

		// Count how many records come before this indexable (have a smaller ID).
		$count_before = $query
			->where_lt( 'id', $indexable->id )
			->count();

		return ( (int) \floor( $count_before / $this->config->get_per_page() ) + 1 );
	}
}
