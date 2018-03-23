<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * When saving something, bust the frontend cache for that thing.
 */
class WPSEO_Frontend_Cache_Buster implements WPSEO_WordPress_Integration {
	/**
	 * The cache group we're saving things to.
	 *
	 * @var string
	 */
	private $cache_group = 'yoast-seo-frontend-cache';

	/**
	 * Hooks on all the needed hooks.
	 */
	public function register_hooks() {
		add_action( 'wpseo_saved_postdata', array( $this, 'bust_post_cache' ) );
		add_action( 'wpseo_save_tax_meta', array( $this, 'bust_term_cache' ), 10, 2 );
		add_action( 'update_user_meta', array( $this, 'bust_author_cache' ), 10, 3 );
	}

	/**
	 * Busts the cache for a post after we've saved our data.
	 */
	public function bust_post_cache() {
		$post_id = (int) $_POST['ID'];
		$url     = get_permalink( $post_id );

		$this->bust_cache( $url );
	}

	/**
	 * Clear author sitemap cache when settings are changed.
	 *
	 * @param int    $meta_id The ID of the meta option changed.
	 * @param int    $object_id The ID of the user.
	 * @param string $meta_key The key of the meta field changed.
	 */
	public function bust_author_cache( $meta_id, $object_id, $meta_key ) {
		if ( '_yoast_wpseo_profile_updated' === $meta_key ) {
			$url = get_author_posts_url( $object_id );
			$this->bust_cache( $url );
		}
	}

	/**
	 * Busts the cache for a term after we've saved our data.
	 *
	 * @param int    $term_id  The ID of the term saved.
	 * @param string $taxonomy The taxonomy of the term saved/
	 */
	public function bust_term_cache( $term_id, $taxonomy ) {
		$url = get_term_link( $term_id, $taxonomy );

		$this->bust_cache( $url );
	}

	/**
	 * Busts the cache for a specific URL.
	 *
	 * @param string $url The URL to bust the cache for.
	 */
	private function bust_cache( $url ) {
		$cache_key = md5( $url );
		wp_cache_delete( $cache_key, $this->cache_group );
	}
}