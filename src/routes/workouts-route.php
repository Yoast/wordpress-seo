<?php

namespace Yoast\WP\SEO\Routes;

use WP_REST_Response;
use WPSEO_Meta;
use WPSEO_Redirect;
use WPSEO_Redirect_Manager;
use WPSEO_Taxonomy_Meta;
use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Workouts_Route class.
 */
class Workouts_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 * Represents workouts route.
	 *
	 * @var string
	 */
	const WORKOUTS_ROUTE = '/workouts';

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The link suggestions action.
	 *
	 * @var Indexable_Term_Builder
	 */
	private $indexable_term_builder;

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * Workouts_Route constructor.
	 *
	 * @param Indexable_Repository   $indexable_repository    The indexable repository.
	 * @param Indexable_Term_Builder $indexable_term_builder  The indexable term builder.
	 * @param Post_Type_Helper       $post_type_helper        The post type helper.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Indexable_Term_Builder $indexable_term_builder,
		Post_Type_Helper $post_type_helper
	) {
		$this->indexable_repository   = $indexable_repository;
		$this->indexable_term_builder = $indexable_term_builder;
		$this->post_type_helper       = $post_type_helper;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$edit_others_posts = static function() {
			return \current_user_can( 'edit_others_posts' );
		};

		$workouts_route = [
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_workouts' ],
				'permission_callback' => $edit_others_posts,
			],
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'set_workouts' ],
				'permission_callback' => $edit_others_posts,
				'args'                => [
					'cornerstone' => [
						'validate_callback' => [ $this, 'cornerstone_is_allowed' ],
						'required'          => true,
					],
					'orphaned' => [
						'validate_callback' => [ $this, 'orphaned_is_allowed' ],
						'required'          => true,
					],
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::WORKOUTS_ROUTE, $workouts_route );
	}

	/**
	 * Returns the workouts as configured for the site.
	 *
	 * @return WP_REST_Response the configuration of the workouts.
	 */
	public function get_workouts() {
		return new WP_REST_Response(
			[ 'json' => \YoastSEO()->helpers->options->get( 'workouts' ) ]
		);
	}

	/**
	 * Sets the workout configuration.
	 *
	 * @param WP_Rest_Request $request The request object.
	 *
	 * @return WP_REST_Response the configuration of the workouts.
	 */
	public function set_workouts( $request ) {
		$value = [
			'cornerstone' => $request['cornerstone'],
			'orphaned'    => $request['orphaned'],
		];

		foreach ( $value as $workout => $data ) {
			if ( isset( $data['indexablesByStep'] ) && \is_array( $data['indexablesByStep'] ) ) {
				foreach ( $data['indexablesByStep'] as $step => $indexables ) {
					if ( $step === 'removed' ) {
						continue;
					}
					$value[ $workout ]['indexablesByStep'][ $step ] = \wp_list_pluck( $indexables, 'id' );
				}
			}
		}

		return new WP_REST_Response(
			[ 'json' => \YoastSEO()->helpers->options->set( 'workouts', $value ) ]
		);
	}

	/**
	 * Validates a workout.
	 *
	 * @param array $workout       The workout.
	 * @param array $allowed_steps The allowed steps for this workout.
	 * @return bool If the payload is valid or not.
	 */
	public function is_allowed( $workout, $allowed_steps ) {
		// Only 2 properties are allowed, the below validated finishedSteps property.
		if ( \count( $workout ) !== 2 ) {
			return false;
		}

		if ( isset( $workout['finishedSteps'] ) && \is_array( $workout['finishedSteps'] ) ) {
			foreach ( $workout['finishedSteps'] as $step ) {
				if ( ! \in_array( $step, $allowed_steps, true ) ) {
					return false;
				}
			}
			return true;
		}
		return false;
	}
}
