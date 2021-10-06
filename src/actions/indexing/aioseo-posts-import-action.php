<?php

namespace Yoast\WP\SEO\Actions\Indexing;

use wpdb;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Helpers\Meta_Helper;

/**
 * Importing action for AIOSEO post data.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Posts_Import_Action implements Indexation_Action_Interface {

	/**
	 * The persistent cursor key.
	 */
	const IMPORT_CURSOR_VALUE = 'wpseo_aioseo_import_cursor';

	/**
	 * Represents the indexables repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The WordPress database instance.
	 *
	 * @var wpdb
	 */
	protected $wpdb;

	/**
	 * The Meta helper.
	 *
	 * @var Meta_Helper
	 */
	protected $meta;

	/**
	 * The map of aioseo to yoast meta.
	 *
	 * @var array
	 */
	protected $aioseo_to_yoast_map = [
		'title'               => 'title',
		'description'         => 'description',
		'og_title'            => 'open_graph_title',
		'og_description'      => 'open_graph_description',
		'twitter_title'       => 'twitter_title',
		'twitter_description' => 'twitter_description',
	];

	/**
	 * The map of yoast to post meta.
	 *
	 * @var array
	 */
	protected $yoast_to_postmeta = [
		'title'                  => 'title',
		'description'            => 'metadesc',
		'open_graph_title'       => 'opengraph-title',
		'open_graph_description' => 'opengraph-description',
		'twitter_title'          => 'twitter-title',
		'twitter_description'    => 'twitter-description',
	];

	/**
	 * The map from AiOSEO replace var to Yoast replace var.
	 *
	 * @var string[]
	 */
	protected $replace_var_map = [
		'#author_first_name' => '%%author_first_name%%',
		'#author_last_name'  => '%%author_last_name%%',
		'#author_name'       => '%%name%%',
		'#categories'        => '%%category%%',
		'#current_date'      => '%%currentdate%%',
		'#current_day'       => '%%currentday%%',
		'#current_month'     => '%%currentmonth%%',
		'#current_year'      => '%%currentyear%%',
		'#permalink'         => '%%permalink%%',
		'#post_content'      => '%%post_content%%',
		'#post_date'         => '%%date%%',
		'#post_day'          => '%%post_day%%',
		'#post_month'        => '%%post_month%%',
		'#post_title'        => '%%title%%',
		'#post_year'         => '%%post_year%%',
		'#post_excerpt_only' => '%%excerpt_only%%',
		'#post_excerpt'      => '%%excerpt%%',
		'#separator_sa'      => '%%sep%%',
		'#site_title'        => '%%sitename%%',
		'#tagline'           => '%%sitedesc%%',
		'#taxonomy_title'    => '%%category_title%%',
	];

	/**
	 * Aioseo_Posts_Import_Action constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexables repository.
	 * @param wpdb                 $wpdb                 The WordPress database instance.
	 * @param Meta_Helper          $meta                 The Meta helper.
	 */
	public function __construct( Indexable_Repository $indexable_repository, wpdb $wpdb, Meta_Helper $meta ) {
		$this->indexable_repository = $indexable_repository;
		$this->wpdb                 = $wpdb;
		$this->meta                 = $meta;
	}

	/**
	 * Returns the (limited) total number of unimported objects.
	 *
	 * @return int The (limited) total number of unimported objects.
	 */
	public function get_total_unindexed() {
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Reason: Is is already prepared.
		$indexables_to_create = $this->wpdb->get_col( $this->query() );

		$result = \count( $indexables_to_create );

		return $result;
	}

	/**
	 * Imports AIOSEO meta data and creates the respective Yoast indexables and postmeta.
	 *
	 * @return void
	 */
	public function index() {
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Reason: Is is already prepared.
		$aioseo_indexables = $this->wpdb->get_results( $this->query(), ARRAY_A );

		foreach ( $aioseo_indexables as $aioseo_indexable ) {
			$indexable = $this->indexable_repository->find_by_id_and_type( $aioseo_indexable['post_id'], 'post' );

			// Let's ensure that the current post id represents something that we want to index (eg. *not* shop_order).
			if ( ! \is_a( $indexable, 'Yoast\WP\SEO\Models\Indexable' ) ) {
				continue;
			}

			$indexable = $this->map( $indexable, $aioseo_indexable );

			$indexable->save();

			// To ensure that indexables can be rebuild after a reset, we have to store the data in the postmeta table too.
			$this->map_to_postmeta( $indexable );
		}

		if ( \get_site_option( static::IMPORT_CURSOR_VALUE, 0 ) < $aioseo_indexable['id'] ) {
			\update_site_option( static::IMPORT_CURSOR_VALUE, $aioseo_indexable['id'] );
		}
	}

	/**
	 * Maps AIOSEO meta data to Yoast meta data.
	 *
	 * @param Indexable $indexable        The Yoast indexable.
	 * @param array     $aioseo_indexable The AIOSEO indexable.
	 *
	 * @return Indexable[] The created indexables.
	 */
	public function map( $indexable, $aioseo_indexable ) {
		foreach ( $this->aioseo_to_yoast_map as $prop => $value ) {
			if ( ! empty( $indexable->{$value} ) ) {
				continue;
			}

			if ( ! empty( $aioseo_indexable[ $prop ] ) ) {
				$indexable->{$value} = $this->map_replace_vars( $aioseo_indexable[ $prop ] );
			}
		}

		return $indexable;
	}

	/**
	 * Creates postmeta from a Yoast indexable.
	 *
	 * @param Indexable $indexable The Yoast indexable.
	 *
	 * @return void.
	 */
	public function map_to_postmeta( $indexable ) {
		foreach ( $this->yoast_to_postmeta as $prop => $value ) {
			if ( empty( $indexable->{$prop} ) ) {
				continue;
			}

			$this->meta->set_value( $value, $indexable->{$prop}, $indexable->object_id );
		}
	}

	/**
	 * Maps the AiOSEO replace vars to our own replace vars.
	 *
	 * @param string $text The text to replace the replace vars in.
	 *
	 * @return string The text with the AiOSEO replace vars replaced with our own.
	 */
	private function map_replace_vars( $text ) {
		// Standard replace vars.
		foreach ( $this->replace_var_map as $aioseo_replace_var => $yoast_replace_var ) {
			$text = \str_replace( $aioseo_replace_var, $yoast_replace_var, $text );
		}

		// Custom fields.
		$text = \preg_replace( '/#custom_field-(\w+)/', '%%cf_$1%%', $text );

		// Custom taxonomies.
		return \preg_replace( '/#tax_name-(\w+)/', '%%ct_$1%%', $text );
	}

	/**
	 * Returns the number of objects that will be imported in a single importing pass.
	 *
	 * @return int The limit.
	 */
	public function get_limit() {
		/**
		 * Filter 'wpseo_aioseo_post_indexation_limit' - Allow filtering the number of posts indexed during each indexing pass.
		 *
		 * @api int The maximum number of posts indexed.
		 */
		$limit = \apply_filters( 'wpseo_aioseo_post_indexation_limit', 25 );

		if ( ! \is_int( $limit ) || $limit < 1 ) {
			$limit = 25;
		}

		return $limit;
	}

	/**
	 * Checks which AIOSEO indexables are to be imported next, if any.
	 *
	 * @return array The indexables to import.
	 */
	private function query() {
		$indexable_table = $this->wpdb->prefix . 'aioseo_posts';

		$cursor = \get_site_option( static::IMPORT_CURSOR_VALUE, 0 );
		$limit  = $this->get_limit();

		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		return $this->wpdb->prepare(
			"
			SELECT *
			FROM {$indexable_table}
			WHERE id > %d
			ORDER BY id
			LIMIT %d",
			$cursor,
			$limit
		);
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	}
}
