<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Models\Indexable;

/**
 * A helper object to map indexable data to postmeta.
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Indexable_To_Postmeta_Helper {

	/**
	 * The Meta helper.
	 *
	 * @var Meta_Helper
	 */
	public $meta;

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
	 * Indexable_To_Postmeta_Helper constructor.
	 *
	 * @param Meta_Helper $meta The Meta helper.
	 */
	public function __construct( Meta_Helper $meta ) {
		$this->meta = $meta;
	}

	/**
	 * Creates postmeta from a Yoast indexable.
	 *
	 * @param Indexable $indexable The Yoast indexable.
	 *
	 * @return void.
	 */
	public function map_to_postmeta( $indexable ) {
		foreach ( $this->yoast_to_postmeta as $indexable_column => $post_meta_key ) {
			if ( empty( $indexable->{$indexable_column} ) ) {
				continue;
			}

			$this->meta->set_value( $post_meta_key, $indexable->{$indexable_column}, $indexable->object_id );
		}
	}
}
