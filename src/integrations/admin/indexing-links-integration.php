<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Actions\Indexation\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexation\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional;
use Yoast\WP\SEO\Integrations\Indexing_Interface;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Routes\Link_Indexing_Route;

/**
 * Class Indexing_Links_Integration.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */
class Indexing_Links_Integration implements Indexing_Interface, Integration_Interface {

	/**
	 * The post link indexing action.
	 *
	 * @var Post_Link_Indexing_Action
	 */
	protected $post_link_indexing_action;

	/**
	 * The term link indexing action.
	 *
	 * @var Term_Link_Indexing_Action
	 */
	protected $term_link_indexing_action;

	/**
	 * The total number of unindexed objects.
	 *
	 * @var int
	 */
	protected $total_unindexed;

	/**
	 * Returns the conditionals based on which this integration should be active.
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		return [
			Yoast_Tools_Page_Conditional::class,
			Migrations_Conditional::class,
		];
	}

	/**
	 * Indexing_Links_Integration constructor.
	 *
	 * @param Post_Link_Indexing_Action $post_link_indexing_action The post indexing action.
	 * @param Term_Link_Indexing_Action $term_link_indexing_action The term indexing action.
	 */
	public function __construct(
		Post_Link_Indexing_Action $post_link_indexing_action,
		Term_Link_Indexing_Action $term_link_indexing_action
	) {
		$this->post_link_indexing_action = $post_link_indexing_action;
		$this->term_link_indexing_action = $term_link_indexing_action;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_indexing_instances', [ $this, 'register_instance' ] );
	}

	/**
	 * Registers the instance.
	 *
	 * @param Indexing_Interface[] $instances The interfaces to extend.
	 *
	 * @return Indexing_Interface[] The extended instances.
	 */
	public function register_instance( $instances ) {
		$instances[] = $this;

		return $instances;
	}

	/**
	 * Retrieves the endpoints to call.
	 *
	 * @return array The endpoints.
	 */
	public function get_endpoints() {
		return [
			'post_link' => Link_Indexing_Route::FULL_POSTS_ROUTE,
			'term_link' => Link_Indexing_Route::FULL_TERMS_ROUTE,
		];
	}

	/**
	 * Returns the total number of unindexed objects.
	 *
	 * @return int The total number of unindexed objects.
	 */
	public function get_total_unindexed() {
		if ( \is_null( $this->total_unindexed ) ) {
			$this->total_unindexed  = $this->post_link_indexing_action->get_total_unindexed();
			$this->total_unindexed += $this->term_link_indexing_action->get_total_unindexed();
		}

		return $this->total_unindexed;
	}
}
