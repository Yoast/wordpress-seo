<?php

namespace Yoast\WP\SEO\Tests\WP\Inc;

use stdClass;
use WPSEO_Options;
use Yoast\WP\Lib\Model;
use Yoast\WP\Lib\ORM;
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
				WHERE %i LIKE %s
				AND %i = 'yes'",
				[ $wpdb->options, 'option_name', 'wpseo_sitemap_%', 'autoload' ]
			)
		);

		$number_of_sitemap_options_no_autoload = $wpdb->query(
			$wpdb->prepare(
				"SELECT *
				FROM %i
				WHERE %i LIKE %s
				AND %i = 'no'",
				[ $wpdb->options, 'option_name', 'wpseo_sitemap_%', 'autoload' ]
			)
		);
		$this->assertEquals( 0, $number_of_sitemap_options );
		$this->assertEquals( 1, $number_of_sitemap_options_no_autoload );
	}

	public function test_upgrade_49() {
		\wp_create_user( 'test_user', 'test password', 'test@test.org' );

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

		\update_user_option( 1, Yoast_Notification_Center::STORAGE_KEY, \array_values( $notifications ) );

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

		\update_user_option( 2, Yoast_Notification_Center::STORAGE_KEY, \array_values( $notifications ) );

		$instance = $this->get_instance();

		$instance->upgrade_49();

		$user_id1_notifications = \get_user_option( Yoast_Notification_Center::STORAGE_KEY, 1 );
		$user_id2_notification  = \get_user_option( Yoast_Notification_Center::STORAGE_KEY, 2 );

		$this->assertEquals( 2, \count( $user_id1_notifications ) );
		$this->assertEquals( 1, \count( $user_id2_notification ) );
	}

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
				WHERE %i = "_yst_content_links_processed"',
				[ $wpdb->postmeta, 'meta_key' ]
			)
		);

		$this->assertEquals( 0, $number_of_rows );
	}

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
				WHERE %i LIKE %s
				AND %i = "yes"',
				[ $wpdb->options, 'option_name', 'wpseo_sitemap_%', 'autoload' ]
			)
		);

		$this->assertEquals( 0, $number_of_sitemap_options );
	}

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
				WHERE %i = %s',
				[ $wpdb->usermeta, 'meta_key', 'wp_yoast_promo_hide_premium_upsell_admin_block' ]
			)
		);

		$this->assertEquals( 0, $number_of_rows );
		$this->assertNull( $center->get_notification_by_id( 'wpseo-dismiss-wordpress-upgrade' ) );
	}

	public function test_clean_up_private_taxonomies_for_141() {
		global $wpdb;

		$indexables_table = Model::get_table_name( 'Indexable' );
		$taxonomy         = 'wpseo_tax';

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
				'UPDATE %i SET is_public = false WHERE %i = %d',
				[ $indexables_table, 'object_id', $result->object_id ]
			)
		);

		$instance = $this->get_instance();
		$instance->clean_up_private_taxonomies_for_141();

		$private_taxonomy_indexables = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT id FROM %i
				WHERE object_type = 'term'
				AND object_sub_type = %s",
				[ $indexables_table, $taxonomy ]
			)
		);

		$this->assertEmpty( $private_taxonomy_indexables );
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
