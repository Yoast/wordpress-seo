<?php

namespace Yoast\WP\SEO\Tests\WP\Inc;

use stdClass;
use WPSEO_Options;
use Yoast\WP\Lib\Model;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Post_Builder;
use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\WP\Doubles\Inc\Upgrade_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;
use Yoast_Notification;
use Yoast_Notification_Center;

/**
 * Unit Test Class.
 *
 * @group upgrades
 */
final class Upgrade_Test extends TestCase {

	/**
	 * The indexables table name.
	 *
	 * @var string
	 */
	private $indexables_table;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->indexables_table = Model::get_table_name( 'Indexable' );
	}

	/**
	 * Tear down the class which was tested.
	 *
	 * @return void
	 */
	public function tear_down() {
		parent::tear_down();

		$notification_center = Yoast_Notification_Center::get();
		$notification_center->deactivate_hook();
	}

	/**
	 * Retrieves the instance to test against.
	 *
	 * @return Upgrade_Double
	 */
	protected function get_instance() {
		return new Upgrade_Double();
	}

	/**
	 * Tests if the option is fetched from the database.
	 *
	 * @covers WPSEO_Upgrade::get_option_from_database
	 *
	 * @return void
	 */
	public function test_get_option_from_database() {

		$content = [
			'a' => 'b',
			'c' => true,
			3   => new stdClass(),
		];

		$instance = $this->get_instance();

		\update_option( 'some_option', $content );

		$this->assertEquals( $content, $instance->get_option_from_database( 'some_option' ) );
	}

	/**
	 * Tests that option filters are not applied on option retrieval.
	 *
	 * @covers WPSEO_Upgrade::get_option_from_database
	 *
	 * @return void
	 */
	public function test_get_option_from_database_no_filters_applied() {
		// Tests if the option is fetched from the database.
		$content = [
			'a' => 'b',
			'c' => true,
			3   => new stdClass(),
		];

		$instance = $this->get_instance();

		\update_option( 'some_option', $content );

		\add_filter( 'pre_option_some_option', [ $this, 'return_override' ] );

		$this->assertEquals( $this->return_override(), \get_option( 'some_option' ) );
		$this->assertEquals( $content, $instance->get_option_from_database( 'some_option' ) );

		\remove_filter( 'pre_option_some_option', [ $this, 'return_override' ] );
	}

	/**
	 * Tests to make sure non-existing option returns an empty array.
	 *
	 * @covers WPSEO_Upgrade::get_option_from_database
	 *
	 * @return void
	 */
	public function test_get_option_from_database_non_existent() {
		$instance = $this->get_instance();
		$this->assertEquals( [], $instance->get_option_from_database( 'non_existent_option' ) );
	}

	/**
	 * Tests to make sure invalid keys are removed upon cleanup.
	 *
	 * @covers WPSEO_Upgrade::cleanup_option_data
	 *
	 * @return void
	 */
	public function test_cleanup_option_data() {
		// Testing the sanitization of the options framework.
		$instance = $this->get_instance();

		$original = [
			'invalid_key' => true,
			'version'     => \WPSEO_VERSION,
		];

		// Set option with invalid keys in the database.
		$this->set_option_in_database( 'wpseo', $original );

		// The key should be present on the option.
		$this->assertArrayHasKey( 'invalid_key', \get_option( 'wpseo' ) );

		// Cleaning up the option.
		$instance->cleanup_option_data( 'wpseo' );

		// Make sure the key has been removed.
		$this->assertArrayNotHasKey( 'invalid_key', \get_option( 'wpseo' ) );
	}

	/**
	 * Tests to make sure non-existing options are not saved.
	 *
	 * @covers WPSEO_Upgrade::cleanup_option_data
	 *
	 * @return void
	 */
	public function test_cleanup_option_data_no_data() {
		$instance = $this->get_instance();

		$instance->cleanup_option_data( 'random_option' );

		$this->assertNull( \get_option( 'random_option', null ) );
	}

	/**
	 * Tests to make sure a valid setting is being saved.
	 *
	 * @covers WPSEO_Upgrade::save_option_setting
	 *
	 * @return void
	 */
	public function test_save_option_setting() {
		// Only set the new data if found on the source.
		$source = [
			'company_name' => 'value1',
		];

		$instance = $this->get_instance();

		$previous = WPSEO_Options::get( 'company_name' );

		// Save the option.
		$instance->save_option_setting( $source, 'company_name' );

		$this->assertNotEquals( $previous, WPSEO_Options::get( 'company_name' ) );
		$this->assertEquals( $source['company_name'], WPSEO_Options::get( 'company_name' ) );
	}

	/**
	 * Tests to make sure an option is not saved if the source misses the needed key.
	 *
	 * @covers WPSEO_Upgrade::save_option_setting
	 *
	 * @return void
	 */
	public function test_save_option_setting_not_set() {
		// Only set the new data if found on the source.
		$source = [
			'key1' => 'value1',
		];

		$instance = $this->get_instance();

		$expected = WPSEO_Options::get( 'version' );

		$instance->save_option_setting( $source, 'version' );

		$this->assertEquals( $expected, WPSEO_Options::get( 'version' ) );
	}

	/**
	 * Tests to make sure triggers are being called in the finish up method.
	 *
	 * @covers WPSEO_Upgrade::finish_up
	 *
	 * @return void
	 */
	public function test_finish_up() {
		$instance = $this->get_instance();

		\delete_option( 'wpseo' );
		\delete_option( 'wpseo_titles' );
		\delete_option( 'wpseo_social' );

		$instance->finish_up();

		$this->assertEquals( \WPSEO_VERSION, WPSEO_Options::get( 'version' ) );
		$this->assertTrue( \has_action( 'shutdown', 'flush_rewrite_rules' ) > 0 );

		// Ensure options exist.
		$this->assertNotEmpty( \get_option( 'wpseo' ) );
		$this->assertNotEmpty( \get_option( 'wpseo_titles' ) );
		$this->assertNotEmpty( \get_option( 'wpseo_social' ) );
	}

	/**
	 * Tests the upgrade_36 upgrade routine.
	 *
	 * @covers WPSEO_Upgrade::upgrade_36
	 *
	 * @return void
	 */
	public function test_upgrade_36() {
		global $wpdb;

		\add_option( 'wpseo_sitemap_test', 'test', '', 'yes' );
		\add_option( 'wpseo_sitemap_test_no_autoload', 'test no autoload', '', 'no' );

		$instance = $this->get_instance();
		$instance->upgrade_36();

		$number_of_sitemap_options = $wpdb->query(
			$wpdb->prepare(
				"SELECT *
				FROM %i
				WHERE option_name LIKE %s
				AND autoload IN ('on', 'yes')",
				[ $wpdb->options, 'wpseo_sitemap_%' ]
			)
		);

		$number_of_sitemap_options_no_autoload = $wpdb->query(
			$wpdb->prepare(
				"SELECT *
				FROM %i
				WHERE option_name LIKE %s
				AND autoload IN ('off', 'no')",
				[ $wpdb->options, 'wpseo_sitemap_%' ]
			)
		);
		$this->assertEquals( 0, $number_of_sitemap_options );
		$this->assertEquals( 1, $number_of_sitemap_options_no_autoload );
	}

	/**
	 * Tests the upgrade_49 upgrade routine.
	 *
	 * @covers WPSEO_Upgrade::upgrade_49
	 *
	 * @return void
	 */
	public function test_upgrade_49() {
		$user_id       = $this->factory->user->create(
			[
				'user_login'   => 'User_Login',
				'display_name' => 'User_Nicename',
			]
		);
		$other_user_id = $this->factory->user->create(
			[
				'user_login'   => 'Other_User_Login',
				'display_name' => 'Other_User_Nicename',
			]
		);

		$notifications = [
			[
				'options' => [
					'id'           => 'wpseo-dismiss-about',
					'is_dismissed' => false,
				],
				'message' => 'Notification 1',
			],
			[
				'options' => [ 'is_dismissed' => false ],
				'message' => 'Notification 2',
			],
			[
				'options' => [
					'id'           => 'not-wpseo-dismiss-about',
					'is_dismissed' => false,
				],
				'message' => 'Notification 3',
			],
		];

		\update_user_option( $user_id, Yoast_Notification_Center::STORAGE_KEY, \array_values( $notifications ) );

		$notifications = [
			[
				'options' => [
					'id'           => 'wpseo-dismiss-about',
					'is_dismissed' => false,
				],
				'message' => 'Notification 4',
			],
			[
				'options' => [ 'is_dismissed' => false ],
				'message' => 'Notification 5',
			],
		];

		\update_user_option( $other_user_id, Yoast_Notification_Center::STORAGE_KEY, \array_values( $notifications ) );

		$instance = $this->get_instance();

		$instance->upgrade_49();

		$user_id1_notifications = \get_user_option( Yoast_Notification_Center::STORAGE_KEY, $user_id );
		$user_id2_notification  = \get_user_option( Yoast_Notification_Center::STORAGE_KEY, $other_user_id );

		$this->assertEquals( 2, \count( $user_id1_notifications ) );
		$this->assertEquals( 1, \count( $user_id2_notification ) );
	}

	/**
	 * Tests the upgrade_50 upgrade routine.
	 *
	 * @covers WPSEO_Upgrade::upgrade_50
	 *
	 * @return void
	 */
	public function test_upgrade_50() {
		global $wpdb;

		$post_id1 = self::factory()->post->create();
		\add_post_meta( $post_id1, '_yst_content_links_processed', true );
		$post_id2 = self::factory()->post->create();
		\add_post_meta( $post_id2, '_yst_content_links_processed', false );

		$instance = $this->get_instance();

		$instance->upgrade_50();

		$number_of_rows = $wpdb->query(
			$wpdb->prepare(
				'SELECT *
				FROM %i
				WHERE meta_key = "_yst_content_links_processed"',
				[ $wpdb->postmeta ]
			)
		);

		$this->assertEquals( 0, $number_of_rows );
	}

	/**
	 * Tests the upgrade_90 upgrade routine.
	 *
	 * @covers WPSEO_Upgrade::upgrade_90
	 *
	 * @return void
	 */
	public function test_upgrade_90() {
		global $wpdb;
		$instance = $this->get_instance();

		\add_option( 'wpseo_sitemap_test', 'test', '', 'yes' );
		\add_option( 'wpseo_sitemap_test_no_autoload', 'test no autoload', '', 'no' );

		$instance->upgrade_90();
		$number_of_sitemap_options = $wpdb->query(
			$wpdb->prepare(
				'SELECT *
				FROM %i
				WHERE option_name LIKE %s',
				[ $wpdb->options, 'wpseo_sitemap_%' ]
			)
		);

		$this->assertEquals( 0, $number_of_sitemap_options );
	}

	/**
	 * Tests the upgrade_125 upgrade routine.
	 *
	 * @covers WPSEO_Upgrade::upgrade_125
	 *
	 * @return void
	 */
	public function test_upgrade_125() {
		global $wpdb;

		$admin_id_1 = self::factory()->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin_id_1 );

		$admin_role = \get_role( 'administrator' );

		$admin_role->add_cap( 'wpseo_manage_options', true );

		$notification = new Yoast_Notification(
			'This is a test notification.',
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => 'wpseo-dismiss-wordpress-upgrade',
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);

		$center = Yoast_Notification_Center::get();
		$center->add_notification( $notification );

		\add_user_meta( 1, 'wp_yoast_promo_hide_premium_upsell_admin_block', 'test', true );

		$instance = $this->get_instance();
		$instance->upgrade_125();

		$number_of_rows = $wpdb->query(
			$wpdb->prepare(
				'SELECT *
				FROM %i
				WHERE meta_key = %s',
				[ $wpdb->usermeta, 'wp_yoast_promo_hide_premium_upsell_admin_block' ]
			)
		);

		$this->assertEquals( 0, $number_of_rows );
		$this->assertNull( $center->get_notification_by_id( 'wpseo-dismiss-wordpress-upgrade' ) );
	}

	/**
	 * Tests the clean_up_private_taxonomies_for_141 method.
	 *
	 * @covers WPSEO_Upgrade::clean_up_private_taxonomies_for_141
	 *
	 * @return void
	 */
	public function test_clean_up_private_taxonomies_for_141() {
		global $wpdb;

		$taxonomy = 'wpseo_tax';

		\register_taxonomy( $taxonomy, 'post' );

		$term_id = self::factory()->term->create( [ 'taxonomy' => $taxonomy ] );

		$term_builder = new Indexable_Term_Builder(
			\YoastSEO()->helpers->taxonomy,
			\YoastSEO()->classes->get( Indexable_Builder_Versions::class ),
			\YoastSEO()->helpers->post
		);

		$term_builder->set_social_image_helpers(
			\YoastSEO()->helpers->image,
			\YoastSEO()->helpers->open_graph->image,
			\YoastSEO()->helpers->twitter->image
		);

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$result = $term_builder->build( $term_id, $indexable );

		// We need to change the taxonomy visibility after we have created the term indexable, as
		// we don't create them for private taxonomies anymore.
		\register_taxonomy( $taxonomy, 'post', [ 'public' => false ] );

		$wpdb->query(
			$wpdb->prepare(
				'UPDATE %i SET is_public = false WHERE object_id = %d',
				[ $this->indexables_table, $result->object_id ]
			)
		);

		$instance = $this->get_instance();
		$instance->clean_up_private_taxonomies_for_141();

		$private_taxonomy_indexables = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT id FROM %i
				WHERE object_type = 'term'
				AND object_sub_type = %s",
				[ $this->indexables_table, $taxonomy ]
			)
		);

		$this->assertEmpty( $private_taxonomy_indexables );
	}

	/**
	 * Tests the upgrade_74 routine.
	 *
	 * @covers WPSEO_Upgrade::upgrade_74
	 *
	 * @return void
	 */
	public function test_upgrade_74() {
		global $wpdb;

		\add_option( 'wpseo_sitemap_video_cache_validator', 'test no autoload', '', 'no' );

		$instance = $this->get_instance();
		$instance->upgrade_74();

		$number_of_sitemap_validators = $wpdb->query(
			$wpdb->prepare(
				'SELECT *
				FROM %i
				WHERE option_name LIKE %s',
				[ $wpdb->options, 'wpseo_sitemap%validator%' ]
			)
		);

		$this->assertEquals( 0, $number_of_sitemap_validators );
	}

	/**
	 * Tests the remove_indexable_rows_for_non_public_post_types method.
	 *
	 * @covers WPSEO_Upgrade::remove_indexable_rows_for_non_public_post_types
	 *
	 * @return void
	 */
	public function test_remove_indexable_rows_for_non_public_post_types() {
		global $wpdb;

		$post_id = self::factory()->post->create();

		$post_builder = new Indexable_Post_Builder(
			\YoastSEO()->helpers->post,
			\YoastSEO()->helpers->post_type,
			\YoastSEO()->classes->get( Indexable_Builder_Versions::class ),
			\YoastSEO()->helpers->meta
		);

		$post_builder->set_social_image_helpers(
			\YoastSEO()->helpers->image,
			\YoastSEO()->helpers->open_graph->image,
			\YoastSEO()->helpers->twitter->image
		);

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$post_builder->build( $post_id, $indexable );

		// We simulate an attachmentindexable (which is a non-indexable post type) by changing the object_sub_type to attachment.
		$wpdb->query(
			$wpdb->prepare(
				"UPDATE %i
				SET object_sub_type = 'attachment'
				WHERE object_id = %s",
				[ $this->indexables_table, $post_id ]
			)
		);
		$indexables_for_non_public_posts = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT *
				FROM %i
				WHERE object_id = %s',
				[ $this->indexables_table, $post_id ]
			)
		);
		$instance                        = $this->get_instance();
		$instance->remove_indexable_rows_for_non_public_post_types();

		$indexables_for_non_public_posts = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT *
				FROM %i
				WHERE object_id = %s',
				[ $this->indexables_table, $post_id ]
			)
		);

		$this->assertEmpty( $indexables_for_non_public_posts );
	}

	/**
	 * Tests the remove_indexable_rows_for_non_public_post_types method in case no public post types are present.
	 *
	 * @covers WPSEO_Upgrade::remove_indexable_rows_for_non_public_post_types
	 *
	 * @return void
	 */
	public function test_remove_indexable_rows_for_non_public_post_types_when_no_public_post_types() {
		global $wpdb;

		$post_id = self::factory()->post->create();

		$post_builder = new Indexable_Post_Builder(
			\YoastSEO()->helpers->post,
			\YoastSEO()->helpers->post_type,
			\YoastSEO()->classes->get( Indexable_Builder_Versions::class ),
			\YoastSEO()->helpers->meta
		);

		$post_builder->set_social_image_helpers(
			\YoastSEO()->helpers->image,
			\YoastSEO()->helpers->open_graph->image,
			\YoastSEO()->helpers->twitter->image
		);

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$post_builder->build( $post_id, $indexable );

		\add_filter( 'wpseo_indexable_forced_included_post_types', [ $this, 'override_public_post_types' ] );

		$instance = $this->get_instance();
		$instance->remove_indexable_rows_for_non_public_post_types();

		$indexables_for_non_public_posts = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT *
				FROM %i
				WHERE object_id = %s',
				[ $this->indexables_table, $post_id ]
			)
		);

		$this->assertEmpty( $indexables_for_non_public_posts );
	}

	/**
	 * Tests the remove_indexable_rows_for_non_public_taxonomies method.
	 *
	 * @covers WPSEO_Upgrade::remove_indexable_rows_for_non_public_taxonomies
	 *
	 * @return void
	 */
	public function test_remove_indexable_rows_for_non_public_taxonomies() {
		global $wpdb;

		$taxonomy = 'wpseo_tax';

		\register_taxonomy( $taxonomy, 'post' );

		$term_id = self::factory()->term->create( [ 'taxonomy' => $taxonomy ] );

		$term_builder = new Indexable_Term_Builder(
			\YoastSEO()->helpers->taxonomy,
			\YoastSEO()->classes->get( Indexable_Builder_Versions::class ),
			\YoastSEO()->helpers->post
		);

		$term_builder->set_social_image_helpers(
			\YoastSEO()->helpers->image,
			\YoastSEO()->helpers->open_graph->image,
			\YoastSEO()->helpers->twitter->image
		);

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$term_builder->build( $term_id, $indexable );

		// We need to change the taxonomy visibility after we have created the term indexable, as
		// we don't create them for private taxonomies anymore.
		\register_taxonomy( $taxonomy, 'post', [ 'public' => false ] );

		$wpdb->query(
			$wpdb->prepare(
				"UPDATE %i
				SET is_public = false
				WHERE object_type = 'term'
				AND object_sub_type = %s",
				[ $this->indexables_table, $taxonomy ]
			)
		);

		$instance = $this->get_instance();
		$instance->remove_indexable_rows_for_non_public_taxonomies();

		$private_taxonomy_indexables = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT id FROM %i
				WHERE object_type = 'term'
				AND object_sub_type = %s",
				[ $this->indexables_table, $taxonomy ]
			)
		);

		$this->assertEmpty( $private_taxonomy_indexables );
	}

	/**
	 * Tests the remove_indexable_rows_for_non_public_taxonomies method in case no public taxonomies are present.
	 *
	 * @covers WPSEO_Upgrade::remove_indexable_rows_for_non_public_taxonomies
	 *
	 * @return void
	 */
	public function test_remove_indexable_rows_for_non_public_taxonomies_when_no_public_taxonomies() {
		global $wpdb;

		$taxonomy = 'wpseo_tax';

		\register_taxonomy( $taxonomy, 'post' );

		$term_id = self::factory()->term->create( [ 'taxonomy' => $taxonomy ] );

		$term_builder = new Indexable_Term_Builder(
			\YoastSEO()->helpers->taxonomy,
			\YoastSEO()->classes->get( Indexable_Builder_Versions::class ),
			\YoastSEO()->helpers->post
		);

		$term_builder->set_social_image_helpers(
			\YoastSEO()->helpers->image,
			\YoastSEO()->helpers->open_graph->image,
			\YoastSEO()->helpers->twitter->image
		);

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$term_builder->build( $term_id, $indexable );

		\add_filter( 'wpseo_indexable_excluded_taxonomies', [ $this, 'override_excluded_taxonomies' ] );

		// We need to change the taxonomy visibility after we have created the term indexable, as
		// we don't create them for private taxonomies anymore.
		\register_taxonomy( $taxonomy, 'post', [ 'public' => false ] );

		$wpdb->query(
			$wpdb->prepare(
				"UPDATE %i
				SET is_public = false
				WHERE object_type = 'term'
				AND object_sub_type = %s",
				[ $this->indexables_table, $taxonomy ]
			)
		);

		$instance = $this->get_instance();
		$instance->remove_indexable_rows_for_non_public_taxonomies();

		$private_taxonomy_indexables = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT id FROM %i
				WHERE object_type = 'term'
				AND object_sub_type = %s",
				[ $this->indexables_table, $taxonomy ]
			)
		);

		$this->assertEmpty( $private_taxonomy_indexables );
	}

	/**
	 * Tests the deduplicate_unindexed_indexable_rows method.
	 *
	 * @covers WPSEO_Upgrade::deduplicate_unindexed_indexable_rows
	 *
	 * @return void
	 */
	public function test_deduplicate_unindexed_indexable_rows() {
		global $wpdb;

		$wpdb->query(
			$wpdb->prepare(
				"INSERT INTO %i (object_id, object_type, post_status)
				VALUES
				(1, 'post', 'unindexed'),
				(1, 'post', 'unindexed'),
				(1, 'post', 'unindexed'),
				(1, 'term', 'unindexed'),
				(1, 'term', 'unindexed'),
				(1, 'term', 'unindexed'),
				(1, 'user', 'unindexed'),
				(1, 'user', 'unindexed'),
				(1, 'user', 'unindexed')",
				[ $this->indexables_table ]
			)
		);

		$instance = $this->get_instance();
		$instance->deduplicate_unindexed_indexable_rows();

		$posts = $wpdb->query(
			$wpdb->prepare(
				"SELECT *
				FROM %i
				WHERE object_id = 1
				AND object_type = 'post'
				AND post_status = 'unindexed'",
				[ $this->indexables_table ]
			)
		);
		$terms = $wpdb->query(
			$wpdb->prepare(
				"SELECT *
				FROM %i
				WHERE object_id = 1
				AND object_type = 'user'
				AND post_status = 'unindexed'",
				[ $this->indexables_table ]
			)
		);
		$users = $wpdb->query(
			$wpdb->prepare(
				"SELECT *
				FROM %i
				WHERE object_id = 1
				AND object_type = 'user'
				AND post_status = 'unindexed'",
				[ $this->indexables_table ]
			)
		);
		$this->assertEquals( 1, $posts );
		$this->assertEquals( 1, $terms );
		$this->assertEquals( 1, $users );
	}

	/**
	 * Tests the clean_unindexed_indexable_rows_with_no_object_id method.
	 *
	 * @covers WPSEO_Upgrade::clean_unindexed_indexable_rows_with_no_object_id
	 *
	 * @return void
	 */
	public function test_clean_unindexed_indexable_rows_with_no_object_id() {
		global $wpdb;

		$wpdb->query(
			$wpdb->prepare(
				"INSERT INTO %i (object_id, object_type, post_status)
				VALUES
				(NULL, 'post', 'unindexed'),
				(NULL, 'term', 'unindexed'),
				(NULL, 'user', 'unindexed'),
				(NULL, 'system-page', 'unindexed'),
				(1, 'post', 'unindexed'),
				(2, 'user', 'draft'),
				(3, 'system-page', 'unindexed')",
				[ $this->indexables_table ]
			)
		);

		$instance = $this->get_instance();
		$instance->clean_unindexed_indexable_rows_with_no_object_id();

		$null_ids = $wpdb->query(
			$wpdb->prepare(
				"SELECT *
				FROM %i
				WHERE object_id IS NULL
				AND object_type IN ( 'post', 'term', 'user' )
				AND post_status = 'unindexed'",
				[ $this->indexables_table ]
			)
		);

		$this->assertEquals( 0, $null_ids );
	}

	/**
	 * Tests the test_remove_indexable_rows_for_disabled_authors_archive method.
	 *
	 * @covers WPSEO_Upgrade::remove_indexable_rows_for_disabled_authors_archive
	 *
	 * @return void
	 */
	public function test_remove_indexable_rows_for_disabled_authors_archive() {
		global $wpdb;
		$options_helper = \YoastSEO()->helpers->options;
		$wpdb->query(
			$wpdb->prepare(
				"INSERT INTO %i (object_id, object_type, post_status)
				VALUES
				(1, 'user', 'publish'),
				(2, 'user', 'publish'),
				(3, 'user', 'publish')",
				[ $this->indexables_table ]
			)
		);

		$options_helper->set( 'disable-author', true );

		$instance = $this->get_instance();
		$instance->remove_indexable_rows_for_disabled_authors_archive();

		$user_indexables = $wpdb->query(
			$wpdb->prepare(
				"SELECT *
				FROM %i
				WHERE object_type = 'user'",
				[ $this->indexables_table ]
			)
		);

		$this->assertEquals( 0, $user_indexables );
	}

	/**
	 * Tests the get_indexable_deduplication_query_for_type method.
	 *
	 * @covers WPSEO_Upgrade::get_indexable_deduplication_query_for_type
	 *
	 * @return void
	 */
	public function test_get_indexable_deduplication_query_for_type() {
		global $wpdb;

		$wpdb->query(
			$wpdb->prepare(
				"INSERT INTO %i (object_id, object_type, post_status)
				VALUES
				(1, 'user', 'unindexed'),
				(1, 'user', 'unindexed'),
				(1, 'user', 'unindexed'),
				(1, 'term', 'unindexed'),
				(1, 'term', 'unindexed'),
				(1, 'term', 'unindexed'),
				(1, 'post', 'unindexed'),
				(1, 'post', 'unindexed'),
				(1, 'post', 'unindexed'),
				(2, 'post', 'unindexed'),
				(3, 'post', 'unindexed'),
				(3, 'post', 'unindexed'),
				(3, 'term', 'publish')",
				[ $this->indexables_table ]
			)
		);

		$duplicates = $wpdb->get_results(
			$wpdb->prepare(
				"
				SELECT
					MAX(id) as newest_id,
					object_id,
					object_type
				FROM
					%i
				WHERE
					post_status = 'unindexed'
					AND object_type IN ( 'term', 'post', 'user' )
				GROUP BY
					object_id,
					object_type
				HAVING
					count(*) > 1",
				[ $this->indexables_table ]
			),
			\ARRAY_A
		);

		$posts_ids = \array_column(
			\array_filter(
				$duplicates,
				static function ( $duplicate ) {
					return $duplicate['object_type'] === 'post';
				}
			),
			'newest_id'
		);
		$terms_ids = \array_column(
			\array_filter(
				$duplicates,
				static function ( $duplicate ) {
					return $duplicate['object_type'] === 'term';
				}
			),
			'newest_id'
		);

		$users_ids   = \array_column(
			\array_filter(
				$duplicates,
				static function ( $duplicate ) {
					return $duplicate['object_type'] === 'user';
				}
			),
			'newest_id'
		);
		$instance    = $this->get_instance();
		$posts_query = $instance->get_indexable_deduplication_query_for_type( 'post', $duplicates, $wpdb );
		$terms_query = $instance->get_indexable_deduplication_query_for_type( 'term', $duplicates, $wpdb );
		$users_query = $instance->get_indexable_deduplication_query_for_type( 'user', $duplicates, $wpdb );

		$this->assertStringContainsString( 'object_type = \'post\'', $posts_query );
		$this->assertStringContainsString( '`object_id` IN ( 1, 3 )', $posts_query );
		$this->assertStringContainsString( 'AND id NOT IN ( ' . \implode( ', ', $posts_ids ) . ' )', $posts_query );

		$this->assertStringContainsString( 'object_type = \'term\'', $terms_query );
		$this->assertStringContainsString( '`object_id` IN ( 1 )', $terms_query );
		$this->assertStringContainsString( 'AND id NOT IN ( ' . \implode( ', ', $terms_ids ) . ' )', $terms_query );

		$this->assertStringContainsString( 'object_type = \'user\'', $users_query );
		$this->assertStringContainsString( '`object_id` IN ( 1 )', $users_query );
		$this->assertStringContainsString( 'AND id NOT IN ( ' . \implode( ', ', $users_ids ) . ' )', $users_query );
	}

	/**
	 * Filter used to override the public post types.
	 *
	 * @return array<string> An empty array to override the public post types.
	 */
	public function override_public_post_types() {
		return [];
	}

	/**
	 * Filter used to override the excluded taxonomies.
	 *
	 * @param array<string> $excluded_taxonomies The excluded taxonomies.
	 *
	 * @return array<string> The excluded taxonomies with all the taxonomies.
	 */
	public function override_excluded_taxonomies( $excluded_taxonomies ) {
		return \array_merge( $excluded_taxonomies, [ 'wpseo_tax', 'category', 'post_tag', 'post_format' ] );
	}

	/**
	 * Provides a filter return value.
	 *
	 * @return string Return value.
	 */
	public function return_override() {
		return 'override';
	}

	/**
	 * Sets an option directly to the database, avoiding the Options framework.
	 *
	 * @param string $option_name  Option to save.
	 * @param mixed  $option_value Option data to save.
	 *
	 * @return void
	 */
	private function set_option_in_database( $option_name, $option_value ) {
		global $wpdb;

		$wpdb->update(
			$wpdb->options,
			[
				'option_name'  => $option_name,
				// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize -- Reason: There's no security risk, because users don't interact with tests.
				'option_value' => \serialize( $option_value ),
			],
			[ 'option_name' => $option_name ]
		);
	}
}
