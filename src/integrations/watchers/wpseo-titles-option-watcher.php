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
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'update_option_wpseo_titles', [ $this, 'check_wpseo_titles' ], 10, 2 );
	}

	/**
	 * Checks the WPSEO title option values to see if we should rebuild any indexables.
	 *
	 * @param array $old_options The old options.
	 * @param array $new_options The new options.
	 *
	 * @return void
	 */
	public function check_wpseo_titles( $old_options, $new_options ) {
		if ( ! \is_array( $old_options ) || ! \is_array( $new_options ) ) {
			return;
		}

		$changed_values = \array_diff_assoc( $old_options, $new_options );
		$this->check_and_build_author_archive( $changed_values );
		$this->check_and_build_date_archive( $changed_values );

		$public_post_types          = $this->post_type_helper->get_public_post_types();
		$term_archive_prefix        = 'noindex-tax-';
		$post_type_prefix           = 'noindex-';
		$post_type_archive_prefixes = [
			'title-ptarchive-',
			'metadesc-ptarchive-',
			'bctitle-ptarchive-',
			'noindex-ptarchive-',
		];

		// Match the changes with what they represent.
		$post_type_archives_rebuild = [];
		foreach ( $changed_values as $option_key => $value ) {
			/*
			 * Is this change a term archive?
			 * Check if the option_key starts with the term archive prefix.
			 */
			if ( \strpos( $option_key, $term_archive_prefix ) === 0 ) {
				// The remainder of the option_key is the term archive's object_sub_type.
				$object_sub_type = \substr( $option_key, \strlen( $term_archive_prefix ) );
				$this->build_indexables_for_object_type_and_object_sub_type( 'term', $object_sub_type );
				continue;
			}

			// Is this change a post type archive?
			$object_sub_type = false;
			foreach ( $post_type_archive_prefixes as $post_type_archive_prefix ) {
				if ( \strpos( $option_key, $post_type_archive_prefix ) === 0 ) {
					$object_sub_type = \substr( $option_key, \strlen( $post_type_archive_prefix ) );
					break;
				}
			}

			/*
			 * Post type archives only need to be rebuilt once, even if multiple post type archive options were changed.
			 * If the option_key is a post type archive and it is not already built.
			 */
			if ( $object_sub_type !== false && ! \in_array( $object_sub_type, $post_type_archives_rebuild, true ) ) {
				$this->build_post_type_archive_indexable( $object_sub_type );
				$post_type_archives_rebuild[] = $object_sub_type;
				continue;
			}

			// Is this change for a post type? This should be the last to be checked since the prefix is the least specific.
			$object_sub_type = false;
			foreach ( $public_post_types as $public_post_type ) {
				if ( ( $post_type_prefix . $public_post_type ) === $option_key ) {
					$object_sub_type = $public_post_type;
					break;
				}
			}
			if ( $object_sub_type !== false ) {
				$this->build_indexables_for_object_type_and_object_sub_type( 'post', $object_sub_type );
				continue;
			}
		}
	}

	/**
	 * Builds the author archive indexable when changes are detected.
	 *
	 * @param array $changed_values The WPSEO title option changes.
	 *
	 * @return void
	 */
	protected function check_and_build_author_archive( array $changed_values ) {
		if (
			! \array_key_exists( 'noindex-author-wpseo', $changed_values ) &&
			! \array_key_exists( 'noindex-author-noposts-wpseo', $changed_values )
		) {
			return;
		}

		$this->build_indexables_for_object_type( 'user' );
	}

	/**
	 * Builds the date archive indexable when changes are detected.
	 *
	 * @param array $changed_values The WPSEO title option changes.
	 *
	 * @return void
	 */
	protected function check_and_build_date_archive( array $changed_values ) {
		if ( ! \array_key_exists( 'noindex-archive-wpseo', $changed_values ) ) {
			return;
		}

		$this->build_indexables_for_object_type( 'date-archive' );
	}

	/**
	 * Builds the post type archive indexable.
	 *
	 * @param string $post_type The post type.
	 *
	 * @return void
	 */
	protected function build_post_type_archive_indexable( $post_type ) {
		try {
			$indexable = $this->repository->find_for_post_type_archive( $post_type, false );
			$this->builder->build_for_post_type_archive( $post_type, $indexable );
		} catch ( Exception $exception ) { // @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
			// Do nothing.
		}
	}

	/**
	 * Builds the indexables for an object type.
	 *
	 * @param string $object_type The object type.
	 *
	 * @return void
	 */
	protected function build_indexables_for_object_type( $object_type ) {
		try {
			$indexables = $this->repository->find_by_object_type( $object_type );
			foreach ( $indexables as $indexable ) {
				$this->builder->build_for_id_and_type( $indexable->object_id, $object_type, $indexable );
			}
		} catch ( Exception $exception ) { // @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
			// Do nothing.
		}
	}

	/**
	 * Builds the indexables that have the given object sub type.
	 *
	 * @param string $object_type     The object type.
	 * @param string $object_sub_type The object sub type.
	 *
	 * @return void
	 */
	protected function build_indexables_for_object_type_and_object_sub_type( $object_type, $object_sub_type ) {
		try {
			$indexables = $this->repository->find_by_object_type_and_object_sub_type( $object_type, $object_sub_type );
			foreach ( $indexables as $indexable ) {
				$this->builder->build_for_id_and_type( $indexable->object_id, $object_type, $indexable );
			}
		} catch ( Exception $exception ) { // @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
			// Do nothing.
		}
	}
}
