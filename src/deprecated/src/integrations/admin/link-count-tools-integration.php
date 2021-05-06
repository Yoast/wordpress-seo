<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Actions\Indexing\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexing\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Link_Count_Tools_Integration class.
 *
 * @deprecated 15.1
 * @codeCoverageIgnore
 */
class Link_Count_Tools_Integration implements Integration_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		\_deprecated_function( __METHOD__, 'WPSEO 15.1' );

		return [
			Admin_Conditional::class,
			Yoast_Admin_And_Dashboard_Conditional::class,
			Migrations_Conditional::class,
		];
	}

	/**
	 * Constructor.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @param Post_Link_Indexing_Action $post_link_indexing_action The post link indexing action.
	 * @param Term_Link_Indexing_Action $term_link_indexing_action The term link indexing action.
	 * @param WPSEO_Admin_Asset_Manager $asset_manager             The asset manager.
	 */
	public function __construct(
		Post_Link_Indexing_Action $post_link_indexing_action,
		Term_Link_Indexing_Action $term_link_indexing_action,
		WPSEO_Admin_Asset_Manager $asset_manager
	) {
		\_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Initializes the integration.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Enqueues all required assets.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		\_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Renders the tools list item.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function render_tools_overview_item() {
		\_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Renders the link count indexing modal.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function render_modal() {
		\_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Returns the total number of unindexed objects.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return int
	 */
	protected function get_total_unindexed() {
		\_deprecated_function( __METHOD__, 'WPSEO 15.1' );

		return 0;
	}
}
