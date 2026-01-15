<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface\Cache;

use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;

/**
 * This class listens to changes in the indexables and resets the cache.
 */
class Indexables_Update_Listener_Integration extends Abstract_Cache_Listener_Integration {

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
		return [ Schema_Aggregator_Conditional::class ];
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
			$this->xml_manager->invalidate();

			return false;
		}
		if ( $indexable->object_sub_type !== null ) {
			$page = $this->get_page_number( $indexable );
			$this->manager->invalidate( $indexable->object_sub_type, $page );
			$this->xml_manager->invalidate();
		}

		return true;
	}
}
