<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Presenters\Admin\Notice_Presenter;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Routes\Workouts_Route;

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
		\add_filter( 'wpseo_submenu_pages', [ $this, 'add_submenu_page' ], 9 );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ], 11 );
	}

	/**
	 * Adds the workouts submenu page.
	 *
	 * @param array $submenu_pages The Yoast SEO submenu pages.
	 *
	 * @return array the filtered submenu pages.
	 */
	public function add_submenu_page( $submenu_pages ) {
		// If Premium has an outdated version, which also adds a 'workouts' submenu, don't show the Premium submenu.
		if ( $this->should_update_premium() ) {
			$submenu_pages = array_filter(
				$submenu_pages,
				function ( $item ) {
					return $item[4] !== 'wpseo_workouts';
				}
			);
		}

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

		if ( $this->should_update_premium() ) {
			\wp_dequeue_script( 'yoast-seo-premium-workouts' );
		}

		$this->admin_asset_manager->enqueue_style( 'workouts' );

		$workouts_option = $this->get_workouts_option();

		$this->admin_asset_manager->enqueue_script( 'workouts' );
		$this->admin_asset_manager->localize_script(
			'workouts',
			'wpseoWorkoutsData',
			[
				'workouts'     => $workouts_option,
				'homeUrl'      => \home_url(),
				'toolsPageUrl' => \esc_url( \admin_url( 'admin.php?page=wpseo_tools' ) ),
				'isPremium'    => YoastSEO()->helpers->product->is_premium(),
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
		if ( $this->should_update_premium() ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output escaped in get_update_premium_notice.
			echo $this->get_update_premium_notice();
		}

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
	 * Gets the workouts option and extends it with indexable data.
	 *
	 * @return mixed|null Returns workouts option if found, null if not.
	 */
	private function get_workouts_option() {
		$workouts_option = $this->options_helper->get( 'workouts' );

		if ( ! ( isset( $workouts_option['orphaned']['indexablesByStep'] )
			&& \is_array( $workouts_option['orphaned']['indexablesByStep'] )
			&& isset( $workouts_option['cornerstone']['indexablesByStep'] )
			&& \is_array( $workouts_option['cornerstone']['indexablesByStep'] ) )
		) {
			return $workouts_option;
		}

		// Get all indexable ids from all workouts and all steps.
		$indexable_ids_in_workouts = [ 0 ];
		foreach ( [ 'orphaned', 'cornerstone' ] as $workout ) {
			foreach ( $workouts_option[ $workout ]['indexablesByStep'] as $step => $indexables ) {
				if ( $step === 'removed' ) {
					continue;
				}
				foreach ( $indexables as $indexable_id ) {
					$indexable_ids_in_workouts[] = $indexable_id;
				}
			}
		}

		// Get all indexables corresponding to the indexable ids.
		$indexables_in_workouts = $this->indexable_repository->find_by_ids( $indexable_ids_in_workouts );

		// Extend the workouts option with the indexables data.
		foreach ( [ 'orphaned', 'cornerstone' ] as $workout ) {
			// Don't add indexables for steps that are not allowed.
			$workouts_option[ $workout ]['finishedSteps'] = \array_values(
				\array_intersect(
					$workouts_option[ $workout ]['finishedSteps'],
					[
						'orphaned'    => Workouts_Route::ALLOWED_ORPHANED_STEPS,
						'cornerstone' => Workouts_Route::ALLOWED_CORNERSTONE_STEPS,
					][ $workout ]
				)
			);

			// Don't add indexables that are not published or are no-indexed.
			foreach ( $workouts_option[ $workout ]['indexablesByStep'] as $step => $indexables ) {
				if ( $step === 'removed' ) {
					continue;
				}
				$workouts_option[ $workout ]['indexablesByStep'][ $step ] = \array_values(
					\array_filter(
						\array_map(
							static function( $indexable_id ) use ( $indexables_in_workouts ) {
								foreach ( $indexables_in_workouts as $updated_indexable ) {
									if ( \is_array( $indexable_id ) ) {
										$indexable_id = $indexable_id['id'];
									}
									if ( (int) $indexable_id === $updated_indexable->id ) {
										if ( $updated_indexable->post_status !== 'publish' && $updated_indexable->post_status !== null ) {
											return false;
										}
										if ( $updated_indexable->is_robots_noindex ) {
											return false;
										}
										return $updated_indexable;
									}
								}
								return false;
							},
							$indexables
						)
					)
				);
			}
		}

		return $workouts_option;
	}

	/**
	 * Returns the notification to show when Premium needs to be updated.
	 *
	 * @return string The notification to update Premium.
	 */
	private function get_update_premium_notice() {
		$url = \wp_nonce_url( \self_admin_url( 'update.php?action=upgrade-plugin&plugin=wordpress-seo-premium/wp-seo-premium.php' ), 'upgrade-plugin_wordpress-seo-premium/wp-seo-premium.php' );

		$notice = new Notice_Presenter(
			\__( 'Update to the latest version of Yoast SEO Premium', 'wordpress-seo' ),
			\sprintf(
			/* translators: 1: Link start tag to the page to update Premium, 2: Link closing tag. */
				__( 'It looks like you\'re running an outdated version of Yoast SEO Premium, please %1$supdate to the latest version%2$s to gain access to our updated workouts section, including the all new configuration workout.', 'wordpress-seo' ),
				'<a href="' . \esc_url( $url ) . '">',
				'</a>'
			),
			'Assistent_Time_bubble_500x570.png'
		);

		return $notice->present();
	}

	/**
	 * Check whether Premium should be updated.
	 *
	 * @return bool Returns true when Premium is enabled and the version is below 17.7.
	 */
	private function should_update_premium() {
		$premium_version = YoastSEO()->helpers->product->get_premium_version();
		return $premium_version !== null && $premium_version < 17.7;
	}
}
