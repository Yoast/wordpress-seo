<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Frontend
 */

/**
 * Unit Test Class.
 */
class WPSEO_Handle_404_Test extends WPSEO_UnitTestCase {

	/**
	 * Sets the handle 404 object.
	 *
	 * @return void;
	 */
	public function setUp() {
		parent::setUp();

		// Reset permalink structure.
		$this->set_permalink_structure( '/%postname%/' );
		create_initial_taxonomies();
	}

	/**
	 * Tests main feeds.
	 */
	public function test_main_feeds() {
		// Go to default feed.
		$this->go_to( get_feed_link() );

		$this->assertQueryTrue( 'is_feed' );

		// Go to comment feed.
		$this->go_to( get_feed_link( 'comments_rss2' ) );

		$this->assertQueryTrue( 'is_comment_feed', 'is_feed' );
	}

	/**
	 * Tests post comments feed.
	 */
	public function test_post_feed() {
		$post      = $this->factory->post->create_and_get();
		$feed_link = get_post_comments_feed_link( $post->ID );

		// Go to post comments feed.
		$this->go_to( $feed_link );

		// Verify the query object is the feed.
		$this->assertQueryTrue( 'is_comment_feed', 'is_feed', 'is_singular', 'is_single' );

		// Delete post.
		wp_delete_post( $post->ID );

		// Go to (deleted) post comments feed.
		$this->go_to( $feed_link );

		// It should be 404.
		$this->assertQueryTrue( 'is_404' );
	}

	/**
	 * Tests category feed.
	 */
	public function test_category_feed() {
		$this->run_test_on_term_feed( 'category' );
	}

	/**
	 * Tests tag feed.
	 */
	public function test_tag_feed() {
		$this->run_test_on_term_feed( 'post_tag' );
	}

	/**
	 * Tests search feed.
	 */
	public function test_search_feed() {
		// Go to search feed.
		$this->go_to( get_search_feed_link( 'Lorem' ) );

		$this->assertQueryTrue( 'is_feed', 'is_search' );

		// Go to search (query string) feed.
		$this->go_to( '/?s=Lorem&feed=rss2' );

		$this->assertQueryTrue( 'is_feed', 'is_search' );
	}

	/**
	 * Tests feed with query string.
	 */
	public function test_query_string_feed() {
		$this->go_to( '/?feed=rss2' );

		$this->assertQueryTrue( 'is_feed' );
	}

	/**
	 * Runs tests for term feed.
	 *
	 * @param string $taxonomy The taxonomy to test.
	 */
	private function run_test_on_term_feed( $taxonomy ) {
		$term = $this->factory->term->create_and_get(
			array( 'taxonomy' => $taxonomy )
		);

		$is_taxonomy = 'is_tax';
		if ( $taxonomy === 'category' ) {
			$is_taxonomy = 'is_category';
		}
		elseif ( $taxonomy === 'post_tag' ) {
			$is_taxonomy = 'is_tag';
		}

		$feed_link = get_term_feed_link( $term->term_id, $term->taxonomy );

		// Go to term feed.
		$this->go_to( $feed_link );

		// Verify the query object is the feed.
		$this->assertQueryTrue( 'is_feed', 'is_archive', $is_taxonomy );

		// Delete term.
		wp_delete_term( $term->term_id, $term->taxonomy );

		// Go to term feed again.
		$this->go_to( $feed_link );

		// It should be 404.
		$this->assertQueryTrue( 'is_404' );
	}
}
