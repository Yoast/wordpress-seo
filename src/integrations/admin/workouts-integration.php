<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * WorkoutsIntegration class
 */
class Workouts_Integration implements Integration_Interface {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository The indexable repository.
	 */
	private $indexable_repository;

	/**
	 * The admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * The shortlinker.
	 *
	 * @var WPSEO_Shortlinker
	 */
	private $shortlinker;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Workouts_Integration constructor.
	 *
	 * @param Indexable_Repository      $indexable_repository    The indexables repository.
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager     The admin asset manager.
	 * @param WPSEO_Shortlinker         $shortlinker             The shortlinker.
	 * @param Options_Helper            $options_helper          The options helper.
	 * @param Post_Type_Helper          $post_type_helper        The post type helper.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		WPSEO_Admin_Asset_Manager $admin_asset_manager,
		WPSEO_Shortlinker $shortlinker,
		Options_Helper $options_helper,
		Post_Type_Helper $post_type_helper
	) {
		$this->indexable_repository = $indexable_repository;
		$this->admin_asset_manager  = $admin_asset_manager;
		$this->shortlinker          = $shortlinker;
		$this->options_helper       = $options_helper;
		$this->post_type_helper     = $post_type_helper;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_submenu_pages', [ $this, 'add_submenu_page' ], 8 );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Adds the workouts submenu page.
	 *
	 * @param array $submenu_pages The Yoast SEO submenu pages.
	 *
	 * @return array the filtered submenu pages.
	 */
	public function add_submenu_page( $submenu_pages ) {
		// This inserts the workouts menu page at the correct place in the array without overriding that position.
		$submenu_pages[] = [
			'wpseo_dashboard',
			'',
			\__( 'Workouts', 'wordpress-seo' ) . ' <span class="yoast-badge yoast-premium-badge"></span>',
			'edit_others_posts',
			'wpseo_workouts',
			[ $this, 'render_target' ],
		];

		return $submenu_pages;
	}

	/**
	 * Enqueue the workouts app.
	 */
	public function enqueue_assets() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Date is not processed or saved.
		if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'wpseo_workouts' ) {
			return;
		}

		$this->admin_asset_manager->enqueue_style( 'workouts' );

		$workouts_option = $this->options_helper->get( 'workouts' );

		$this->admin_asset_manager->enqueue_script( 'workouts' );
		$this->admin_asset_manager->localize_script(
			'workouts',
			'wpseoWorkoutsData',
			[
				'workouts'                  => $workouts_option,
				'homeUrl'                   => \home_url(),
				'toolsPageUrl'              => \esc_url( \admin_url( 'admin.php?page=wpseo_tools' ) ),
			]
		);
	}

	/**
	 * Maps an array of indexables and replaces the object_sub_type with the singular name of that type.
	 *
	 * @param Indexable $indexable An Indexable in array format.
	 * @return array The new array.
	 */
	public function map_subtypes_to_singular_name( Indexable $indexable ) {
		if ( $indexable->object_type === 'post' ) {
			$post_type_labels           = \get_post_type_labels( \get_post_type_object( \get_post_type( $indexable->object_id ) ) );
			$indexable->object_sub_type = $post_type_labels->singular_name;
		}
		else {
			$taxonomy_labels            = \get_taxonomy_labels( \get_taxonomy( $indexable->object_sub_type ) );
			$indexable->object_sub_type = $taxonomy_labels->singular_name;
		}
		return $indexable;
	}

	/**
	 * Renders the target for the React to mount to.
	 */
	public function render_target() {
		echo '<div id="wpseo-workouts-container-free"></div>';
	}

	/**
	 * Retrieves the public indexable sub types.
	 *
	 * @return array The sub types.
	 */
	protected function get_public_sub_types() {
		$object_sub_types = \array_values(
			\array_merge(
				$this->post_type_helper->get_public_post_types(),
				\get_taxonomies( [ 'public' => true ] )
			)
		);

		$excluded_post_types = \apply_filters( 'wpseo_indexable_excluded_post_types', [ 'attachment' ] );
		$object_sub_types    = \array_diff( $object_sub_types, $excluded_post_types );
		return $object_sub_types;
	}

	/**
	 * Gets the orphaned indexables.
	 *
	 * @param array $indexable_ids_in_orphaned_workout The orphaned indexable ids.
	 * @param int   $limit                             The limit.
	 * @return array The orphaned indexables.
	 */
	protected function get_orphaned( array $indexable_ids_in_orphaned_workout, $limit = 10 ) {
		$orphaned = $this->indexable_repository->query()
			->where_raw( '( incoming_link_count is NULL OR incoming_link_count < 3 )' )
			->where_raw( '( post_status = \'publish\' OR post_status IS NULL )' )
			->where_raw( '( is_robots_noindex = FALSE OR is_robots_noindex IS NULL )' )
			->where_in( 'object_sub_type', $this->get_public_sub_types() )
			->where_in( 'object_type', [ 'post' ] )
			->where_not_in( 'id', $indexable_ids_in_orphaned_workout )
			->order_by_asc( 'created_at' )
			->limit( $limit )
			->find_many();
		$orphaned = \array_map( [ $this->indexable_repository, 'ensure_permalink' ], $orphaned );
		return $orphaned;
	}
}
