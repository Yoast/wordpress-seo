<?php

namespace Yoast\WP\SEO\Tests\WP\Sitemaps;

use OutOfBoundsException;
use WPSEO_Author_Sitemap_Provider;
use WPSEO_Options;
use Yoast\WP\SEO\Tests\WP\Doubles\Inc\Sitemaps_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Author_Sitemap_Provider_Test.
 *
 * @group sitemaps
 */
final class Author_Sitemap_Provider_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Author_Sitemap_Provider
	 */
	private static $class_instance;

	/**
	 * Sets up our double class.
	 *
	 * @return void
	 */
	public static function set_up_before_class() {
		parent::set_up_before_class();

		// Makes sure the author archives are enabled.
		WPSEO_Options::set( 'disable-author', false );

		self::$class_instance = new WPSEO_Author_Sitemap_Provider();
	}

	/**
	 * Tests if a user is excluded from the sitemap when there are no posts.
	 *
	 * Checks if an OutOfBoundsException is thrown, when there are no users in the sitemap.
	 *
	 * @covers WPSEO_Author_Sitemap_Provider::get_sitemap_links
	 *
	 * @return void
	 */
	public function test_author_excluded_from_sitemap_by_zero_posts() {
		$this->expectException( OutOfBoundsException::class );
		$this->expectExceptionMessage( 'Invalid sitemap page requested' );

		// Removes authors with no posts.
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', true );

		// Creates a user, without any posts.
		$this->factory->user->create( [ 'role' => 'author' ] );

		// Checks which users are in the sitemap, there should be none.
		self::$class_instance->get_sitemap_links( 'author', 10, 1 );
	}

	/**
	 * Tests if a user is NOT excluded from the sitemap when there are posts.
	 *
	 * @covers WPSEO_Author_Sitemap_Provider::get_sitemap_links
	 *
	 * @return void
	 */
	public function test_author_not_excluded_from_sitemap_non_zero_posts() {
		// Removes authors with no posts.
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', true );

		// Creates a user, without any posts.
		$user_id = $this->factory->user->create( [ 'role' => 'author' ] );

		// Creates posts.
		$this->factory->post->create_many( 3, [ 'post_author' => $user_id ] );

		// Checks which users are in the sitemap.
		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );

		// User should now be in the XML sitemap as user now has 3 posts.
		$this->assertCount( 1, $sitemap_links );

		// Makes sure it's the user we expected.
		$this->assertContains( \get_author_posts_url( $user_id ), \wp_list_pluck( $sitemap_links, 'loc' ) );
	}

	/**
	 * Tests if a user is NOT excluded from the sitemap when there are no posts.
	 *
	 * @covers WPSEO_Author_Sitemap_Provider::get_sitemap_links
	 *
	 * @return void
	 */
	public function test_author_not_excluded_from_sitemap_by_zero_posts() {
		// Doesn't remove authors with no posts.
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', false );

		// Adds three more users (of different types) without posts.
		$author_id = $this->factory->user->create( [ 'role' => 'author' ] );
		$admin_id  = $this->factory->user->create( [ 'role' => 'administrator' ] );
		$editor_id = $this->factory->user->create( [ 'role' => 'editor' ] );

		// Checks which users are in the sitemap.
		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );

		// There should be 3 users in the sitemap.
		$this->assertCount( 3, $sitemap_links );

		// Makes sure it are the users we expected.
		$sitemap_urls = \wp_list_pluck( $sitemap_links, 'loc' );
		$this->assertContains( \get_author_posts_url( $author_id ), $sitemap_urls );
		$this->assertContains( \get_author_posts_url( $admin_id ), $sitemap_urls );
		$this->assertContains( \get_author_posts_url( $editor_id ), $sitemap_urls );
	}

	/**
	 * Tests whether setting a user to not be visible in search results excludes user from XML sitemap.
	 *
	 * Checks if an OutOfBoundsException is thrown, when there are no users in the sitemap.
	 *
	 * @covers WPSEO_Author_Sitemap_Provider::get_sitemap_links
	 *
	 * @return void
	 */
	public function test_author_exclusion() {
		$this->expectException( OutOfBoundsException::class );
		$this->expectExceptionMessage( 'Invalid sitemap page requested' );

		// Creates a user with 3 posts.
		$user_id = $this->factory->user->create( [ 'role' => 'author' ] );
		$this->factory->post->create_many( 3, [ 'post_author' => $user_id ] );

		// Excludes the user from the sitemaps.
		\update_user_meta( $user_id, 'wpseo_noindex_author', 'on' );

		// Checks which authors are in the sitemap, there should be none.
		self::$class_instance->get_sitemap_links( 'author', 10, 1 );
	}

	/**
	 * Makes sure the filtered out entries do not cause a sitemap index link to return a 404.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_index_links
	 *
	 * @return void
	 */
	public function test_get_index_links_empty_sitemap() {
		// Doesn't remove authors with no posts.
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', false );

		// Makes sure the author archives are enabled.
		WPSEO_Options::set( 'disable-author', false );

		// Fetches the global sitemap.
		\set_query_var( 'sitemap', 'author' );

		// Sets the page to the second one, which should not contain an entry, and should not exist.
		\set_query_var( 'sitemap_n', '2' );

		// Loads the sitemap.
		$sitemaps = new Sitemaps_Double();
		$sitemaps->redirect( $GLOBALS['wp_the_query'] );

		// Expects an empty page (404) to be returned.
		$this->expectOutputString( '' );
	}

	/**
	 * Makes sure there is no sitemap when the author archives have been disabled.
	 *
	 * @covers WPSEO_Author_Sitemap_Provider::get_index_links
	 *
	 * @return void
	 */
	public function test_get_index_links_disabled_archive() {
		// Disables the author archive.
		WPSEO_Options::set( 'disable-author', true );

		// Fetches the global sitemap.
		\set_query_var( 'sitemap', 'author' );

		// Loads the sitemap.
		$sitemaps = new Sitemaps_Double();
		$sitemaps->redirect( $GLOBALS['wp_the_query'] );

		// Expects an empty page (404) to be returned.
		$this->expectOutputString( '' );

		// Cleanup.
		WPSEO_Options::set( 'disable-author', false );
	}

	/**
	 * Tests if there is no exception thrown on the second sitemap, when the amount of entries (users) exceeds
	 * the max entries limit (thus a second sitemap is created).
	 *
	 * @covers WPSEO_Author_Sitemap_Provider::get_sitemap_links
	 *
	 * @return void
	 */
	public function test_throw_no_exception_on_second_sitemap() {
		// Creates two users, without any posts.
		$author_id        = $this->factory->user->create( [ 'role' => 'author' ] );
		$second_author_id = $this->factory->user->create( [ 'role' => 'author' ] );
		$third_author_id  = $this->factory->user->create( [ 'role' => 'author' ] );

		// Creates posts.
		$this->factory->post->create_many( 3, [ 'post_author' => $author_id ] );
		$this->factory->post->create_many( 3, [ 'post_author' => $second_author_id ] );
		$this->factory->post->create_many( 3, [ 'post_author' => $third_author_id ] );

		// Collects the author links for the third sitemap.
		$third_sitemap_links = self::$class_instance->get_sitemap_links( 'author', 1, 3 );

		// Third user should be in the third sitemap, as the max_entries limit is 1 user.
		$this->assertCount( 1, $third_sitemap_links );
	}

	/**
	 * Tests whether the author sitemap is empty, when there are no users.
	 *
	 * Checks if an OutOfBoundsException is thrown, when there are no users in the sitemap.
	 *
	 * @covers WPSEO_Author_Sitemap_Provider::get_sitemap_links
	 *
	 * @return void
	 */
	public function test_no_users_empty_author_sitemap() {
		$this->expectException( OutOfBoundsException::class );
		$this->expectExceptionMessage( 'Invalid sitemap page requested' );

		// Checks which users are in the sitemap, there should be none.
		self::$class_instance->get_sitemap_links( 'author', 10, 1 );
	}

	/**
	 * Tests that the backfill (triggered by get_index_links) stamps `_yoast_wpseo_profile_updated`
	 * only for users that have published posts when `noindex-author-noposts-wpseo` is enabled.
	 *
	 * Mirrors the "Normal flow" preparation from PR #23256: delete the meta, render the index,
	 * then verify the set of stamped users matches the set that will appear in the sitemap.
	 *
	 * @covers WPSEO_Author_Sitemap_Provider::get_index_links
	 * @covers WPSEO_Author_Sitemap_Provider::update_user_meta
	 * @covers WPSEO_Author_Sitemap_Provider::apply_author_eligibility_filter
	 *
	 * @return void
	 */
	public function test_backfill_stamps_only_authors_with_posts_when_noposts_option_is_true() {
		// Removes authors with no posts from the sitemap.
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', true );

		// Creates one author with published posts and one without any.
		$author_with_posts_id    = $this->factory->user->create( [ 'role' => 'author' ] );
		$author_without_posts_id = $this->factory->user->create( [ 'role' => 'author' ] );
		$this->factory->post->create_many( 2, [ 'post_author' => $author_with_posts_id ] );

		// Resets meta so the backfill has a clean slate (user_register may have stamped it).
		\delete_user_meta( $author_with_posts_id, '_yoast_wpseo_profile_updated' );
		\delete_user_meta( $author_without_posts_id, '_yoast_wpseo_profile_updated' );

		// Renders the index, which triggers the backfill internally.
		self::$class_instance->get_index_links( 100 );

		// Only the author with posts should have been stamped.
		$this->assertNotEmpty( \get_user_meta( $author_with_posts_id, '_yoast_wpseo_profile_updated', true ) );
		$this->assertEmpty( \get_user_meta( $author_without_posts_id, '_yoast_wpseo_profile_updated', true ) );
	}

	/**
	 * Tests that the backfill stamps every user with the `edit_posts` capability — regardless of
	 * whether they have posts — when `noindex-author-noposts-wpseo` is disabled.
	 *
	 * Mirrors the "Enable the setting and repeat" branch of PR #23256.
	 *
	 * @covers WPSEO_Author_Sitemap_Provider::get_index_links
	 * @covers WPSEO_Author_Sitemap_Provider::update_user_meta
	 * @covers WPSEO_Author_Sitemap_Provider::apply_author_eligibility_filter
	 *
	 * @return void
	 */
	public function test_backfill_stamps_all_edit_posts_users_when_noposts_option_is_false() {
		// Allows authors with no posts in the sitemap.
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', false );

		$author_id     = $this->factory->user->create( [ 'role' => 'author' ] );
		$admin_id      = $this->factory->user->create( [ 'role' => 'administrator' ] );
		$subscriber_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );

		// Resets meta so the backfill has a clean slate.
		\delete_user_meta( $author_id, '_yoast_wpseo_profile_updated' );
		\delete_user_meta( $admin_id, '_yoast_wpseo_profile_updated' );
		\delete_user_meta( $subscriber_id, '_yoast_wpseo_profile_updated' );

		// Renders the index, which triggers the backfill internally.
		self::$class_instance->get_index_links( 100 );

		// Author and admin have `edit_posts` and should be stamped.
		$this->assertNotEmpty( \get_user_meta( $author_id, '_yoast_wpseo_profile_updated', true ) );
		$this->assertNotEmpty( \get_user_meta( $admin_id, '_yoast_wpseo_profile_updated', true ) );

		// Subscribers do not have `edit_posts` and should remain unstamped.
		$this->assertEmpty( \get_user_meta( $subscriber_id, '_yoast_wpseo_profile_updated', true ) );
	}

	/**
	 * Tests that the per-page author sitemap emits a `<lastmod>` equal to the backfill timestamp
	 * for a user whose meta was unset before the index render.
	 *
	 * Mirrors the PR #23256 step "Last Mods of authors sitemap should be the time of when you
	 * visit the root sitemap page" — i.e. fresh stamps from the immediately-preceding index render.
	 *
	 * @covers WPSEO_Author_Sitemap_Provider::get_index_links
	 * @covers WPSEO_Author_Sitemap_Provider::get_sitemap_links
	 * @covers WPSEO_Author_Sitemap_Provider::update_user_meta
	 *
	 * @return void
	 */
	public function test_sitemap_lastmod_reflects_backfill_time_when_option_is_true() {
		// Removes authors with no posts from the sitemap.
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', true );

		$author_id = $this->factory->user->create( [ 'role' => 'author' ] );
		$this->factory->post->create( [ 'post_author' => $author_id ] );

		// Resets meta to ensure the backfill writes a fresh stamp.
		\delete_user_meta( $author_id, '_yoast_wpseo_profile_updated' );

		$time_before = \time();
		self::$class_instance->get_index_links( 100 );
		$time_after = \time();

		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );

		// One author should be present.
		$this->assertCount( 1, $sitemap_links );

		// The author's <lastmod> value must match a stamp written during the backfill above.
		$stamp = (int) \get_user_meta( $author_id, '_yoast_wpseo_profile_updated', true );
		$this->assertGreaterThanOrEqual( $time_before, $stamp );
		$this->assertLessThanOrEqual( $time_after, $stamp );
		$this->assertSame( \gmdate( \DATE_W3C, $stamp ), $sitemap_links[0]['mod'] );
	}

	/**
	 * Tests the "first-publish freshness" property called out in the PR description: an author who
	 * has no posts at first index render gets no stamp; once they publish their first post, the
	 * next index render stamps them with the current time, and that stamp surfaces as their
	 * `<lastmod>` in the per-page sitemap.
	 *
	 * @covers WPSEO_Author_Sitemap_Provider::get_index_links
	 * @covers WPSEO_Author_Sitemap_Provider::get_sitemap_links
	 * @covers WPSEO_Author_Sitemap_Provider::update_user_meta
	 *
	 * @return void
	 */
	public function test_first_publish_triggers_fresh_lastmod_on_next_index_render() {
		// Removes authors with no posts from the sitemap.
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', true );

		$author_id = $this->factory->user->create( [ 'role' => 'author' ] );
		\delete_user_meta( $author_id, '_yoast_wpseo_profile_updated' );

		// First render — author has no posts, so the backfill must skip them.
		self::$class_instance->get_index_links( 100 );
		$this->assertEmpty(
			\get_user_meta( $author_id, '_yoast_wpseo_profile_updated', true ),
			'Author without posts should not be stamped on the first index render.',
		);

		// Author publishes their first post.
		$this->factory->post->create( [ 'post_author' => $author_id ] );

		// Second render — backfill should now stamp the author with a fresh timestamp.
		$time_before = \time();
		self::$class_instance->get_index_links( 100 );
		$time_after = \time();

		$stamp = (int) \get_user_meta( $author_id, '_yoast_wpseo_profile_updated', true );
		$this->assertGreaterThanOrEqual( $time_before, $stamp );
		$this->assertLessThanOrEqual( $time_after, $stamp );

		// Per-page sitemap should now contain the author with the fresh stamp.
		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );
		$this->assertCount( 1, $sitemap_links );
		$this->assertSame( \gmdate( \DATE_W3C, $stamp ), $sitemap_links[0]['mod'] );
	}
}
