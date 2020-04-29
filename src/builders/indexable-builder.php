<?php
/**
 * Builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\SEO\Builders;

use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Creates all the indexables.
 */
class Indexable_Builder {

	/**
	 * The author builder.
	 *
	 * @var Indexable_Author_Builder
	 */
	private $author_builder;

	/**
	 * The post builder.
	 *
	 * @var Indexable_Post_Builder
	 */
	private $post_builder;

	/**
	 * The term builder.
	 *
	 * @var Indexable_Term_Builder
	 */
	private $term_builder;

	/**
	 * The home page builder.
	 *
	 * @var Indexable_Home_Page_Builder
	 */
	private $home_page_builder;

	/**
	 * The post type archive builder.
	 *
	 * @var Indexable_Post_Type_Archive_Builder
	 */
	private $post_type_archive_builder;

	/**
	 * The data archive builder.
	 *
	 * @var Indexable_Date_Archive_Builder
	 */
	private $date_archive_builder;

	/**
	 * The system page builder.
	 *
	 * @var Indexable_System_Page_Builder
	 */
	private $system_page_builder;

	/**
	 * The indexable hierarchy builder.
	 *
	 * @var Indexable_Hierarchy_Builder
	 */
	private $hierarchy_builder;

	/**
	 * The primary term builder
	 *
	 * @var Primary_Term_Builder
	 */
	private $primary_term_builder;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * Returns the instance of this class constructed through the ORM Wrapper.
	 *
	 * @param Indexable_Author_Builder            $author_builder            The author builder for creating missing indexables.
	 * @param Indexable_Post_Builder              $post_builder              The post builder for creating missing indexables.
	 * @param Indexable_Term_Builder              $term_builder              The term builder for creating missing indexables.
	 * @param Indexable_Home_Page_Builder         $home_page_builder         The front page builder for creating missing indexables.
	 * @param Indexable_Post_Type_Archive_Builder $post_type_archive_builder The post type archive builder for creating missing indexables.
	 * @param Indexable_Date_Archive_Builder      $date_archive_builder      The date archive builder for creating missing indexables.
	 * @param Indexable_System_Page_Builder       $system_page_builder       The search result builder for creating missing indexables.
	 * @param Indexable_Hierarchy_Builder         $hierarchy_builder         The hierarchy builder for creating the indexable hierarchy.
	 * @param Primary_Term_Builder                $primary_term_builder      The primary term builder for creating primary terms for posts.
	 */
	public function __construct(
		Indexable_Author_Builder $author_builder,
		Indexable_Post_Builder $post_builder,
		Indexable_Term_Builder $term_builder,
		Indexable_Home_Page_Builder $home_page_builder,
		Indexable_Post_Type_Archive_Builder $post_type_archive_builder,
		Indexable_Date_Archive_Builder $date_archive_builder,
		Indexable_System_Page_Builder $system_page_builder,
		Indexable_Hierarchy_Builder $hierarchy_builder,
		Primary_Term_Builder $primary_term_builder
	) {
		$this->author_builder            = $author_builder;
		$this->post_builder              = $post_builder;
		$this->term_builder              = $term_builder;
		$this->home_page_builder         = $home_page_builder;
		$this->post_type_archive_builder = $post_type_archive_builder;
		$this->date_archive_builder      = $date_archive_builder;
		$this->system_page_builder       = $system_page_builder;
		$this->hierarchy_builder         = $hierarchy_builder;
		$this->primary_term_builder      = $primary_term_builder;
	}

	/**
	 * Sets the indexable repository. Done to avoid circular dependencies.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 *
	 * @required
	 */
	public function set_indexable_repository( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Creates an indexable by its ID and type.
	 *
	 * @param int            $object_id   The indexable object ID.
	 * @param string         $object_type The indexable object type.
	 * @param Indexable|bool $indexable   Optional. An existing indexable to overwrite.
	 *
	 * @return bool|Indexable Instance of indexable. False when unable to build.
	 */
	public function build_for_id_and_type( $object_id, $object_type, $indexable = false ) {
		$indexable        = $this->ensure_indexable( $indexable );
		$indexable_before = $indexable;

		switch ( $object_type ) {
			case 'post':
				$indexable = $this->post_builder->build( $object_id, $indexable );
				if ( $indexable === false ) {
					break;
				}

				$this->primary_term_builder->build( $object_id );

				$author = $this->indexable_repository->find_by_id_and_type( $indexable->author_id, 'user', false );
				if ( ! $author ) {
					$this->build_for_id_and_type( $indexable->author_id, 'user' );
				}

				break;
			case 'user':
				$indexable = $this->author_builder->build( $object_id, $indexable );
				break;
			case 'term':
				$indexable = $this->term_builder->build( $object_id, $indexable );
				break;
			default:
				return $indexable;
		}

		// Something went wrong building, create a false indexable.
		if ( $indexable === false ) {
			$indexable = $this->indexable_repository->query()->create( [
				'object_id'   => $object_id,
				'object_type' => $object_type,
				'post_status' => 'unindexed',
			] );
		}

		$this->save_indexable( $indexable, $indexable_before );

		if ( in_array( $object_type, [ 'post', 'term' ], true ) && $indexable->post_status !== 'unindexed' ) {
			$this->hierarchy_builder->build( $indexable );
		}

		return $indexable;
	}

	/**
	 * Creates an indexable for the homepage.
	 *
	 * @param Indexable|bool $indexable Optional. An existing indexable to overwrite.
	 *
	 * @return Indexable The home page indexable.
	 */
	public function build_for_home_page( $indexable = false ) {
		$indexable_before = $this->ensure_indexable( $indexable );
		$indexable        = $this->home_page_builder->build( $indexable_before );

		return $this->save_indexable( $indexable, $indexable_before );
	}

	/**
	 * Creates an indexable for the date archive.
	 *
	 * @param Indexable|bool $indexable Optional. An existing indexable to overwrite.
	 *
	 * @return Indexable The date archive indexable.
	 */
	public function build_for_date_archive( $indexable = false ) {
		$indexable = $this->ensure_indexable( $indexable );
		$indexable = $this->date_archive_builder->build( $indexable );

		return $this->save_indexable( $indexable );
	}

	/**
	 * Creates an indexable for a post type archive.
	 *
	 * @param string         $post_type The post type.
	 * @param Indexable|bool $indexable Optional. An existing indexable to overwrite.
	 *
	 * @return Indexable The post type archive indexable.
	 */
	public function build_for_post_type_archive( $post_type, $indexable = false ) {
		$indexable_before = $this->ensure_indexable( $indexable );
		$indexable        = $this->post_type_archive_builder->build( $post_type, $indexable_before );

		return $this->save_indexable( $indexable, $indexable_before );
	}

	/**
	 * Creates an indexable for a system page.
	 *
	 * @param string         $object_sub_type The type of system page.
	 * @param Indexable|bool $indexable       Optional. An existing indexable to overwrite.
	 *
	 * @return Indexable The search result indexable.
	 */
	public function build_for_system_page( $object_sub_type, $indexable = false ) {
		$indexable_before = $this->ensure_indexable( $indexable );
		$indexable        = $this->system_page_builder->build( $object_sub_type, $indexable_before );

		return $this->save_indexable( $indexable, $indexable_before );
	}

	/**
	 * Ensures we have a valid indexable. Creates one if false is passed.
	 *
	 * @param Indexable|false $indexable The indexable.
	 *
	 * @return Indexable The indexable.
	 */
	private function ensure_indexable( $indexable ) {
		if ( ! $indexable ) {
			return $this->indexable_repository->query()->create();
		}

		return $indexable;
	}

	/**
	 * Saves and returns an indexable.
	 *
	 * @param Indexable      $indexable        The indexable.
	 * @param Indexable|null $indexable_before The indexable before possible changes.
	 *
	 * @return Indexable The indexable.
	 */
	private function save_indexable( $indexable, $indexable_before = null ) {
		if ( $indexable_before ) {
			/**
			 * Action: 'wpseo_save_indexable' - Allow developers to perform an action
			 * when the indexable is updated.
			 *
			 * @param Indexable The indexable before saving.
			 *
			 * @api Indexable The saved indexable.
			 */
			do_action( 'wpseo_save_indexable', $indexable, $indexable_before );
		}

		$indexable->save();

		return $indexable;
	}
}
