<?php
/**
 * Watcher for the wpseo_titles option to save the meta data to the indexables table.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use Exception;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Watches the wpseo_titles option to save the meta data to the indexables table.
 */
class WPSEO_Titles_Option_Watcher implements Integration_Interface {

	/**
	 * @inheritdoc
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The indexable builder.
	 *
	 * @var Indexable_Builder
	 */
	protected $builder;

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * WPSEO_Titles_Option_Watcher constructor.
	 *
	 * @param Indexable_Repository $repository       The repository to use.
	 * @param Indexable_Builder    $builder          The post builder to use.
	 * @param Post_Type_Helper     $post_type_helper The post type helper.
	 */
	public function __construct( Indexable_Repository $repository, Indexable_Builder $builder, Post_Type_Helper $post_type_helper ) {
		$this->repository       = $repository;
		$this->builder          = $builder;
		$this->post_type_helper = $post_type_helper;
	}

	/**
	 * @inheritdoc
	 */
	public function register_hooks() {
		add_action( 'update_option_wpseo_titles', [ $this, 'check_ptarchive_option' ], 10, 2 );
		add_action( 'update_option_wpseo_titles', [ $this, 'check_post_type_option' ], 10, 2 );
		add_action( 'update_option_wpseo_titles', [ $this, 'check_author_archive_option' ], 10, 2 );
		add_action( 'update_option_wpseo_titles', [ $this, 'check_authors_without_posts_option' ], 10, 2 );
		add_action( 'update_option_wpseo_titles', [ $this, 'check_date_archive_option' ], 10, 2 );
	}

	/**
	 * Checks if post type archive indexables need to be rebuilt based on the wpseo_titles option values.
	 *
	 * @param array $old_value The old value of the option.
	 * @param array $new_value The new value of the option.
	 *
	 * @return void
	 */
	public function check_ptarchive_option( $old_value, $new_value ) {
		$relevant_keys = [ 'title-ptarchive-', 'metadesc-ptarchive-', 'bctitle-ptarchive-', 'noindex-ptarchive-' ];

		if ( ! is_array( $old_value ) || ! is_array( $new_value ) ) {
			return;
		}

		$keys               = array_unique( array_merge( array_keys( $old_value ), array_keys( $new_value ) ) );
		$post_types_rebuild = [];

		foreach ( $keys as $key ) {
			$post_type = false;
			// Check if it's a key relevant to post type archives.
			foreach ( $relevant_keys as $relevant_key ) {
				if ( strpos( $key, $relevant_key ) === 0 ) {
					$post_type = substr( $key, strlen( $relevant_key ) );
					break;
				}
			}

			// Ignore this post type if it's not a relevant key.
			if ( $post_type === false ) {
				continue;
			}

			// Ignore this post type if it already built.
			if ( in_array( $post_type, $post_types_rebuild, true ) ) {
				continue;
			}

			// Rebuild if the option value has changed.
			if ( $this->has_option_value_changed( $old_value, $new_value, $key ) ) {
				$this->build_ptarchive_indexable( $post_type );
				$post_types_rebuild[] = $post_type;
			}
		}
	}

	/**
	 * Checks if post type indexables need to be rebuilt based on the wpseo_titles option values.
	 *
	 * @param array $old_value The old value of the option.
	 * @param array $new_value The new value of the option.
	 *
	 * @return void
	 */
	public function check_post_type_option( $old_value, $new_value ) {
		if ( ! is_array( $old_value ) || ! is_array( $new_value ) ) {
			return;
		}

		$post_types = $this->post_type_helper->get_public_post_types();

		foreach ( $post_types as $post_type ) {
			$key = 'noindex-' . $post_type;

			if ( $this->has_option_value_changed( $old_value, $new_value, $key ) ) {
				$this->build_post_type_indexables( $post_type );
			}
		}
	}

	/**
	 * Checks if author archive indexables need to be rebuilt based on the wpseo_titles option values.
	 *
	 * @param array $old_value The old value of the option.
	 * @param array $new_value The new value of the option.
	 *
	 * @return void
	 */
	public function check_author_archive_option( $old_value, $new_value ) {
		if ( ! is_array( $old_value ) || ! is_array( $new_value ) ) {
			return;
		}

		if ( $this->has_option_value_changed( $old_value, $new_value, 'noindex-author-wpseo' ) ) {
			$this->build_author_archive_indexable();
		}
	}

	/**
	 * Checks if author archive indexables need to be rebuilt based on the wpseo_titles option values for authors
	 * without posts.
	 *
	 * @param array $old_value The old value of the option.
	 * @param array $new_value The new value of the option.
	 *
	 * @return void
	 */
	public function check_authors_without_posts_option( $old_value, $new_value ) {
		if ( ! is_array( $old_value ) || ! is_array( $new_value ) ) {
			return;
		}

		if ( $this->has_option_value_changed( $old_value, $new_value, 'noindex-author-noposts-wpseo' ) ) {
			$this->build_author_archive_indexable();
		}
	}

	/**
	 * Checks if date archive indexables need to be rebuilt based on the wpseo_titles option values.
	 *
	 * @param array $old_value The old value of the option.
	 * @param array $new_value The new value of the option.
	 *
	 * @return void
	 */
	public function check_date_archive_option( $old_value, $new_value ) {
		if ( ! is_array( $old_value ) || ! is_array( $new_value ) ) {
			return;
		}

		if ( $this->has_option_value_changed( $old_value, $new_value, 'noindex-archive-wpseo' ) ) {
			$this->build_date_archive_indexable();
		}
	}

	/**
	 * Checks if the option value was set but now isn't, is set but wasn't, or has changed.
	 *
	 * @param array  $old_value The old value of the option.
	 * @param array  $new_value The new value of the option.
	 * @param string $key       The option value key.
	 *
	 * @return bool Whether or not the relevant option value has changed.
	 */
	public function has_option_value_changed( $old_value, $new_value, $key ) {
		$old_value_exists = isset( $old_value[ $key ] );
		$new_value_exists = isset( $new_value[ $key ] );

		// When a value was AND is not there. This makes the logic below work.
		if ( ! $old_value_exists && ! $new_value_exists ) {
			return false;
		}

		// When a value was not there.
		if ( ! $old_value_exists ) {
			return true;
		}

		// When a value is not there.
		if ( ! $new_value_exists ) {
			return true;
		}

		// When the value is changed.
		if ( $old_value[ $key ] !== $new_value[ $key ] ) {
			return true;
		}

		return false;
	}

	/**
	 * Builds the post type archive indexable.
	 *
	 * @param string $post_type The post type.
	 *
	 * @return void
	 */
	public function build_ptarchive_indexable( $post_type ) {
		$indexable = $this->repository->find_for_post_type_archive( $post_type, false );
		$indexable = $this->builder->build_for_post_type_archive( $post_type, $indexable );
		$indexable->save();
	}

	/**
	 * Builds the post type indexables.
	 *
	 * @param string $post_type The post type.
	 *
	 * @return void
	 */
	public function build_post_type_indexables( $post_type ) {
		try {
			$indexables = $this->repository->find_by_object_sub_type( $post_type );

			foreach ( $indexables as $indexable ) {
				$indexable = $this->builder->build_for_id_and_type( $indexable->object_id, 'post', $indexable );
				$indexable->save();
			}
		} catch ( Exception $exception ) { // @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
			// Do nothing.
		}
	}

	/**
	 * Builds the author archive indexables.
	 *
	 * @return void
	 */
	public function build_author_archive_indexable() {
		try {
			$indexables = $this->repository->find_by_object_type( 'user' );

			foreach ( $indexables as $indexable ) {
				$indexable = $this->builder->build_for_id_and_type( $indexable->object_id, 'user', $indexable );
				$indexable->save();
			}
		} catch ( Exception $exception ) { // @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
			// Do nothing.
		}
	}

	/**
	 * Builds the date archive indexables.
	 *
	 * @return void
	 */
	public function build_date_archive_indexable() {
		try {
			$indexables = $this->repository->find_by_object_type( 'date-archive' );

			foreach ( $indexables as $indexable ) {
				$indexable = $this->builder->build_for_id_and_type( $indexable->object_id, 'date-archive', $indexable );
				$indexable->save();
			}
		} catch ( Exception $exception ) { // @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
			// Do nothing.
		}
	}
}
