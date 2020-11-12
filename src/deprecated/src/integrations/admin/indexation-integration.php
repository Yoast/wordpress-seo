<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Indexing_Complete_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Indexation_Integration class.
 *
 * @deprecated 15.1
 * @codeCoverageIgnore
 */
class Indexation_Integration implements Integration_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 */
	public static function get_conditionals() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );

		return [
			Admin_Conditional::class,
			Yoast_Admin_And_Dashboard_Conditional::class,
			Migrations_Conditional::class,
		];
	}

	/**
	 * Indexation_Integration constructor.
	 *
	 * @param Indexable_Post_Indexation_Action              $post_indexation              The post indexation action.
	 * @param Indexable_Term_Indexation_Action              $term_indexation              The term indexation action.
	 * @param Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation The archive indexation action.
	 * @param Indexable_General_Indexation_Action           $general_indexation           The general indexation action.
	 * @param Indexable_Indexing_Complete_Action            $complete_indexation_action   The complete indexation action.
	 * @param Options_Helper                                $options_helper               The options helper.
	 * @param WPSEO_Admin_Asset_Manager                     $asset_manager                The admin asset manager.
	 * @param Yoast_Tools_Page_Conditional                  $yoast_tools_page_conditional The Yoast tools page conditional.
	 * @param Indexable_Helper                              $indexable_helper             The indexable helper.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 */
	public function __construct(
		Indexable_Post_Indexation_Action $post_indexation,
		Indexable_Term_Indexation_Action $term_indexation,
		Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation,
		Indexable_General_Indexation_Action $general_indexation,
		Indexable_Indexing_Complete_Action $complete_indexation_action,
		Options_Helper $options_helper,
		WPSEO_Admin_Asset_Manager $asset_manager,
		Yoast_Tools_Page_Conditional $yoast_tools_page_conditional,
		Indexable_Helper $indexable_helper
	) {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Initializes the integration.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 */
	public function register_hooks() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Enqueues the required scripts.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Renders the indexation warning.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function render_indexation_warning() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Renders the indexation modal.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function render_indexation_modal() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Renders the indexation list item.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function render_indexation_list_item() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Renders the indexation permalink warning.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function render_indexation_permalink_warning() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Runs a single indexation pass of each indexation action. Intended for use as a shutdown function.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function shutdown_indexation() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Returns the total number of unindexed objects.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return int The total number of unindexed objects.
	 */
	public function get_total_unindexed() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );

		return 0;
	}
}
