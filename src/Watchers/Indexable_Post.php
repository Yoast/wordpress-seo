<?php

namespace Yoast\YoastSEO\Watchers;

use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\Yoast_Model;
use Yoast\YoastSEO\Models\Indexable;

class Indexable_Post implements Integration {
	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wp_insert_post', array( $this, 'save_meta' ), PHP_INT_MAX, 1 );
		\add_action( 'delete_post', array( $this, 'delete_meta' ) );
	}

	/**
	 * Deletes the meta when a post is deleted.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return void
	 */
	public function delete_meta( $post_id ) {
		$indexable = $this->get_indexable( $post_id, false );
		if ( $indexable instanceof Yoast_Model ) {
			$indexable->delete();
		}
	}

	/**
	 * Saves post meta.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return void
	 */
	public function save_meta( $post_id ) {
		if ( ! $this->is_post_indexable( $post_id ) ) {
			return;
		}

		$indexable = $this->get_indexable( $post_id );
		$indexable->permalink = $this->get_permalink( $post_id );

		// Implement filling of meta values.
		$post_meta = $this->get_meta_data( $post_id );

		foreach ( $this->get_meta_lookup() as $meta_key => $indexable_key ) {
			$indexable->{$indexable_key} = $this->get_meta_value( $post_meta, $meta_key );
		}

		$indexable->robots_noindex = $this->get_robots_noindex( $post_meta['_yoast_wpseo_meta-robots-noindex'][0] );

		// Set additional meta-robots values.
		$meta_robots = explode( ',', $post_meta['_yoast_wpseo_meta-robots-adv'][0] );
		foreach ( $this->get_robots_options() as $meta_robots_option ) {
			$indexable->{'robots_' . $meta_robots_option} = in_array( $meta_robots_option, $meta_robots, true ) ? 1 : null;
		}

		$this->set_link_count( $post_id, $indexable );

		$indexable->save();
	}

	/**
	 * @param $post_id
	 *
	 * @return bool
	 */
	protected function is_post_indexable( $post_id ) {
		if ( \wp_is_post_revision( $post_id ) ) {
			return false;
		}

		if ( \wp_is_post_autosave( $post_id ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Fetches the indexable for a post.
	 *
	 * @param int  $post_id     Post to fetch indexable for.
	 * @param bool $auto_create Optional. Create the indexable if it does not exist.
	 *
	 * @return bool|Indexable
	 */
	protected function get_indexable( $post_id, $auto_create = true ) {
		$post_type = $this->get_post_type( $post_id );
		$indexable = Yoast_Model::of_type( 'Indexable' )
								->where( 'object_id', $post_id )
								->where( 'object_type', 'post' )
								->where( 'object_sub_type', $post_type )
								->find_one();

		if ( $auto_create && ! $indexable ) {
			/** @var Indexable $indexable */
			$indexable                  = Yoast_Model::of_type( 'Indexable' )->create();
			$indexable->object_id       = $post_id;
			$indexable->object_type     = 'post';
			$indexable->object_sub_type = $post_type;
		}

		return $indexable;
	}

	/**
	 * @param $post_id
	 * @param $indexable
	 */
	protected function set_link_count( $post_id, $indexable ) {
		try {
			$seo_meta = Yoast_Model::of_type( 'SEO_Meta' )
								   ->where( 'object_id', $post_id )
								   ->find_one();

			if ( $seo_meta ) {
				$indexable->internal_link_count = $seo_meta->internal_link_count;
				$indexable->incoming_link_count = $seo_meta->incoming_link_count;
			}
		} catch ( \Exception $exception ) {
		}
	}

	/**
	 * Determines the value to use for the indexable.
	 *
	 * @param array  $post_meta Meta list.
	 * @param string $source    Meta key from the list.
	 * @param null   $default   Default value if not set in meta data.
	 *
	 * @return mixed The value of the indexable entry to use.
	 */
	protected function get_meta_value( $post_meta, $source, $default = null ) {
		if ( ! isset( $post_meta[ $source ] ) ) {
			return $default;
		}

		return $post_meta[ $source ][0];
	}

	/**
	 * Converts the meta robots noindex value to the indexable value.
	 *
	 * @param int $value Meta value to convert.
	 *
	 * @return bool|null True for noindex, false for index, null for default of parent/type.
	 */
	protected function get_robots_noindex( $value ) {
		$value = (int) $value;

		switch ( $value ) {
			case 1:
				return true;
			case 2:
				return false;
		}

		return null;
	}

	/**
	 * @param $post_id
	 *
	 * @return mixed
	 */
	protected function get_meta_data( $post_id ) {
		return \get_post_meta( $post_id );
	}

	/**
	 * @param $post_id
	 *
	 * @return false|string
	 */
	protected function get_permalink( $post_id ) {
		return \get_permalink( $post_id );
	}

	/**
	 * @param $post_id
	 *
	 * @return false|string
	 */
	protected function get_post_type( $post_id ) {
		return \get_post_type( $post_id );
	}

	/**
	 * @return array
	 */
	protected function get_meta_lookup() {
		return array(
			'_yoast_wpseo_canonical'            => 'canonical',
			'_yoast_wpseo_content_score'        => 'content_score',
			'_yoast_wpseo_meta-robots-nofollow' => 'robots_nofollow',
			'_yoast_wpseo_title'                => 'title',
			'_yoast_wpseo_metadesc'             => 'description',
			'_yoast_wpseo_bctitle'              => 'breadcrumb_title',

			'_yst_is_cornerstone' => 'cornerstone',

			'_yoast_wpseo_opengraph-title'       => 'og_title',
			'_yoast_wpseo_opengraph-image'       => 'og_image',
			'_yoast_wpseo_opengraph-description' => 'og_description',

			'_yoast_wpseo_twitter-title'       => 'twitter_title',
			'_yoast_wpseo_twitter-image'       => 'twitter_image',
			'_yoast_wpseo_twitter-description' => 'twitter_description',
		);
	}

	/**
	 * @return array
	 */
	protected function get_robots_options() {
		return array( 'noimageindex', 'noarchive', 'nosnippet' );
	}
}
