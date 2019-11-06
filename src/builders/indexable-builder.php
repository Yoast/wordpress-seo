<?php
/**
 * Builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\Free\Builders;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Repositories\Indexable_Repository;

/**
 * Formats the author meta to indexable format.
 */
class Indexable_Builder {

	/**
	 * @var Indexable_Author_Builder
	 */
	private $author_builder;

	/**
	 * @var Indexable_Post_Builder
	 */
	private $post_builder;

	/**
	 * @var Indexable_Term_Builder
	 */
	private $term_builder;

	/**
	 * @var Indexable_Home_Page_Builder
	 */
	private $home_page_builder;

	/**
	 * @var Indexable_Post_Type_Archive_Builder
	 */
	private $post_type_archive_builder;

	/**
	 * @var Indexable_Date_Archive_Builder
	 */
	private $date_archive_builder;

	/**
	 * @var Indexable_System_Page_Builder
	 */
	private $system_page_builder;

	/**
	 * @var Indexable_Hierarchy_Builder
	 */
	private $hierarchy_builder;

	/**
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
	 */
	public function __construct(
		Indexable_Author_Builder $author_builder,
		Indexable_Post_Builder $post_builder,
		Indexable_Term_Builder $term_builder,
		Indexable_Home_Page_Builder $home_page_builder,
		Indexable_Post_Type_Archive_Builder $post_type_archive_builder,
		Indexable_Date_Archive_Builder $date_archive_builder,
		Indexable_System_Page_Builder $system_page_builder,
		Indexable_Hierarchy_Builder $hierarchy_builder
	) {
		$this->author_builder            = $author_builder;
		$this->post_builder              = $post_builder;
		$this->term_builder              = $term_builder;
		$this->home_page_builder         = $home_page_builder;
		$this->post_type_archive_builder = $post_type_archive_builder;
		$this->date_archive_builder      = $date_archive_builder;
		$this->system_page_builder       = $system_page_builder;
		$this->hierarchy_builder         = $hierarchy_builder;
	}

	/**
	 * @required
	 *
	 * Sets the indexable repository. Done to avoid circular dependencies.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function set_indexable_repository( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Creates an indexable by its ID and type.
	 *
	 * @param int       $object_id   The indexable object ID.
	 * @param string    $object_type The indexable object type.
	 * @param Indexable $indexable   Optional. An existing indexable to overwrite.
	 *
	 * @return bool|Indexable Instance of indexable.
	 *
	 * @throws \Exception If the object_id could not be found.
	 */
	public function build_for_id_and_type( $object_id, $object_type, $indexable = false ) {
		$indexable = $this->ensure_indexable( $indexable );

		switch ( $object_type ) {
			case 'post':
				$indexable = $this->post_builder->build( $object_id, $indexable );
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

		$indexable->save();

		if ( in_array( $object_type, [ 'post', 'term' ], true ) ) {
			$this->hierarchy_builder->build( $indexable );
		}

		return $indexable;
	}

	/**
	 * Creates an indexable for the homepage.
	 *
	 * @param Indexable $indexable Optional. An existing indexable to overwrite.
	 *
	 * @return Indexable The home page indexable.
	 */
	public function build_for_home_page( $indexable = false ) {
		$indexable = $this->ensure_indexable( $indexable );
		$indexable = $this->home_page_builder->build( $indexable );

		return $this->save_indexable( $indexable );
	}

	/**
	 * Creates an indexable for the date archive.
	 *
	 * @param Indexable $indexable Optional. An existing indexable to overwrite.
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
	 * @param string    $post_type The post type.
	 * @param Indexable $indexable Optional. An existing indexable to overwrite.
	 *
	 * @return Indexable The post type archive indexable.
	 */
	public function build_for_post_type_archive( $post_type, $indexable = false ) {
		$indexable = $this->ensure_indexable( $indexable );
		$indexable = $this->post_type_archive_builder->build( $post_type, $indexable );

		return $this->save_indexable( $indexable );
	}

	/**
	 * Creates an indexable for a system page.
	 *
	 * @param string    $object_sub_type The type of system page.
	 * @param Indexable $indexable       Optional. An existing indexable to overwrite.
	 *
	 * @return Indexable The search result indexable.
	 */
	public function build_for_system_page( $object_sub_type, $indexable = false ) {
		$indexable = $this->ensure_indexable( $indexable );
		$indexable = $this->system_page_builder->build( $object_sub_type, $indexable );

		return $this->save_indexable( $indexable );
	}

	/**
	 * Ensures we have a valid indexable. Creates one if false is passed.
	 *
	 * @param Indexable|false $indexable The indexable.
	 *
	 * @return Indexable The indexable;
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
	 * @param Indexable $indexable The indexable.
	 *
	 * @return Indexable The indexable.
	 */
	private function save_indexable( $indexable ) {
		$indexable->save();
		return $indexable;
	}
}
