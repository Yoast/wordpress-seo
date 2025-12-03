<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\User_Interface\Cache;

use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;

/**
 * This class listens to WooCommerce product type changes and resets the cache.
 *
 * When a product type changes (e.g., from simple to variable or vice versa),
 * this integration invalidates the relevant schema aggregator cache to ensure
 * the cached schema reflects the new product structure.
 */
class WooCommerce_Product_Type_Change_Listener_Integration implements Integration_Interface {

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
	 * The XML cache manager.
	 *
	 * @var Xml_Manager
	 */
	private $xml_manager;

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
	public function register_hooks() {
		\add_action( 'woocommerce_product_type_changed', [ $this, 'reset_cache' ], \PHP_INT_MAX, 3 );
	}

	/**
	 * Returns the needed conditionals.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [
			Schema_Aggregator_Conditional::class,
			WooCommerce_Conditional::class,
		];
	}

	/**
	 * This method resets the cache for the cached page where the product is located.
	 *
	 * @param \WC_Product $product  The product whose type was changed.
	 * @param string      $old_type The previous product type.
	 * @param string      $new_type The new product type.
	 *
	 * @return bool
	 */
	public function reset_cache( $product, $old_type, $new_type ) {
		// Get the product ID.
		$product_id = $product->get_id();

		if ( ! $product_id ) {
			return false;
		}

		// Find the indexable for this product.
		$indexable = $this->indexable_repository->find_by_id_and_type( $product_id, 'post' );

		if ( ! $indexable ) {
			// If no indexable exists, invalidate all to be safe.
			$this->manager->invalidate_all();
			$this->xml_manager->invalidate();

			return false;
		}

		// Calculate which page this product appears on and invalidate that page.
		$page = $this->get_page_number( $indexable );
		$this->manager->invalidate( $page );
		$this->xml_manager->invalidate();

		return true;
	}

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
	public function get_page_number( $indexable ) {
		$query = $this->indexable_repository->query();
		$query->where_raw( '( is_public IS NULL OR is_public = 1 )' );
		$query->where( 'post_status', 'publish' );

		// Count how many records come before this indexable (have a smaller ID).
		$count_before = $query
			->where_lt( 'id', $indexable->id )
			->count();

		return ( (int) \floor( $count_before / $this->config->get_per_page( $indexable->object_sub_type ) ) + 1 );
	}
}
