<?php
/**
 * WordPress Post watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\YoastSEO\Watchers;

use Yoast\YoastSEO\Exceptions\No_Indexable_Found;
use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\Yoast_Model;
use Yoast\YoastSEO\Models\Indexable;

/**
 * Fills the Indexable according to Post data.
 */
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
		try {
			$indexable = $this->get_indexable( $post_id, false );
			$indexable->delete();
		} catch ( No_Indexable_Found $exception ) {
			return;
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

		try {
			$indexable = $this->get_indexable( $post_id );
		} catch ( No_Indexable_Found $exception ) {
			return;
		}

		$indexable->permalink = $this->get_permalink( $post_id );

		foreach ( $this->get_meta_lookup() as $meta_key => $indexable_key ) {
			$indexable->{$indexable_key} = $this->get_meta_value( $meta_key, $post_id );
		}

		$indexable->primary_focus_keyword_score = $this->get_keyword_score(
			$this->get_meta_value( 'focuskw', $post_id ),
			$this->get_meta_value( 'linkdex', $post_id )
		);

		$indexable->is_robots_noindex = $this->get_robots_noindex( $this->get_meta_value( 'meta-robots-noindex', $post_id ) );

		// Set additional meta-robots values.
		$nonidex_advanced = $this->get_meta_value( 'meta-robots-adv', $post_id );
		$meta_robots      = explode( ',', $nonidex_advanced );
		foreach ( $this->get_robots_options() as $meta_robots_option ) {
			$indexable->{'is_robots_' . $meta_robots_option} = in_array( $meta_robots_option, $meta_robots, true ) ? 1 : null;
		}

		$indexable = $this->set_link_count( $post_id, $indexable );

		$indexable->save();

		if ( ! empty( $indexable->id ) ) {
			$indexable_post_meta = new Indexable_Post_Meta( $indexable->id );

			foreach ( $this->social_meta_lookup() as $meta_key => $indexable_key ) {
				$indexable_post_meta->set_meta( $meta_key, $this->get_meta_value( $meta_key, $post_id ) );

			}
		}
	}

	/**
	 * Determines if the post can be indexed
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $post_id Post ID to check.
	 *
	 * @return bool True if the post can be indexed.
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
	 * @return Indexable
	 *
	 * @throws No_Indexable_Found Exception when no Indexable entry could be found.
	 */
	protected function get_indexable( $post_id, $auto_create = true ) {
		$post_type = $this->get_post_type( $post_id );
		$indexable = Yoast_Model::of_type( 'Indexable' )
								->where( 'object_id', $post_id )
								->where( 'object_type', 'post' )
								->where( 'object_sub_type', $post_type )
								->find_one();

		if ( $auto_create && ! $indexable ) {
			/**
			 * Indexable instance for the post.
			 *
			 * @var Indexable $indexable
			 */
			$indexable                  = Yoast_Model::of_type( 'Indexable' )->create();
			$indexable->object_id       = $post_id;
			$indexable->object_type     = 'post';
			$indexable->object_sub_type = $post_type;
		}

		if ( ! $indexable ) {
			throw No_Indexable_Found::from_post_id( $post_id );
		}

		return $indexable;
	}

	/**
	 * Updates the link count from existing data.
	 *
	 * @param int       $post_id   Post ID to use.
	 * @param Indexable $indexable Indexable to store the values on.
	 *
	 * @return Indexable
	 */
	protected function set_link_count( $post_id, $indexable ) {
		try {
			$seo_meta = Yoast_Model::of_type( 'SEO_Meta' )
								   ->where( 'object_id', $post_id )
								   ->find_one();

			if ( $seo_meta ) {
				$indexable->link_count          = $seo_meta->internal_link_count;
				$indexable->incoming_link_count = $seo_meta->incoming_link_count;
			}
		} catch ( \Exception $exception ) {
			return $indexable;
		}

		return $indexable;
	}

	/**
	 * Retrieves the current value for the meta field.
	 *
	 * @param string $meta_key Meta key to fetch.
	 * @param int    $post_id  Post to fetch it from.
	 *
	 * @return mixed The value of the indexable entry to use.
	 */
	protected function get_meta_value( $meta_key, $post_id ) {
		return \WPSEO_Meta::get_value( $meta_key, $post_id );
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
	 * Helper function to fetch post meta data from WordPress.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $post_id Post to use.
	 *
	 * @return array|null Data found for the supplied post.
	 */
	protected function get_meta_data( $post_id ) {
		return \get_post_meta( $post_id );
	}

	/**
	 * Retrieves the permalink for a post.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $post_id The post to fetch the permalink of.
	 *
	 * @return false|string The permalink.
	 */
	protected function get_permalink( $post_id ) {
		return \get_permalink( $post_id );
	}

	/**
	 * Retrieves the post type of a post.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $post_id The post to retrieve the type of.
	 *
	 * @return false|string The post type.
	 */
	protected function get_post_type( $post_id ) {
		return \get_post_type( $post_id );
	}

	/**
	 * Retrieves the lookup table.
	 *
	 * @return array Lookup table for the meta fields.
	 */
	protected function get_meta_lookup() {
		return array(
			'focuskw'       => 'primary_focus_keyword',
			'content_score' => 'readability_score',

			'canonical'            => 'canonical',
			'meta-robots-nofollow' => 'is_robots_nofollow',
			'title'                => 'title',
			'metadesc'             => 'description',
			'bctitle'              => 'breadcrumb_title',

			'is_cornerstone' => 'is_cornerstone',
		);
	}

	/**
	 * Retrieves the robot options to search for.
	 *
	 * @return array List of robots values.
	 */
	protected function get_robots_options() {
		return array( 'noimageindex', 'noarchive', 'nosnippet' );
	}

	/**
	 * Determines the focus keyword score.
	 *
	 * @param string $keyword The focus keyword that is set.
	 * @param int    $score   The score saved on the meta data.
	 *
	 * @return null|int Score to use.
	 */
	protected function get_keyword_score( $keyword, $score ) {
		if ( empty( $keyword ) ) {
			return null;
		}

		return $score;
	}

	/**
	 * Lookup table for the social meta fields.
	 *
	 * @return array The social meta fields.
	 */
	protected function social_meta_lookup() {
		return array(
			'opengraph-title'       => 'og_title',
			'opengraph-image'       => 'og_image',
			'opengraph-description' => 'og_description',

			'twitter-title'       => 'twitter_title',
			'twitter-image'       => 'twitter_image',
			'twitter-description' => 'twitter_description',
		);
	}
}
