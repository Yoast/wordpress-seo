<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Schema_Aggregator\Application\Enhancement;

use WP_Post;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Person_Config;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration tests for Person_Schema_Enhancer.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer::enhance
 */
final class Person_Schema_Enhancer_Test extends TestCase {

	/**
	 * Holds the indexable post watcher.
	 *
	 * @var Indexable_Post_Watcher
	 */
	private $indexable_post_watcher;

	/**
	 * Holds the indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * Holds the instance.
	 *
	 * @var Person_Schema_Enhancer
	 */
	private $instance;

	/**
	 * Holds the config.
	 *
	 * @var Person_Config
	 */
	private $config;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance               = new Person_Schema_Enhancer();
		$this->config                 = new Person_Config();
		$this->indexable_post_watcher = \YoastSEO()->classes->get( Indexable_Post_Watcher::class );
		$this->indexable_repository   = \YoastSEO()->classes->get( Indexable_Repository::class );

		$this->instance->set_person_config( $this->config );

		// Delete all indexables before each test to ensure a clean slate.
		global $wpdb;
		$table = Model::get_table_name( 'Indexable' );
		$wpdb->query( "DELETE FROM {$table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
	}

	/**
	 * Tests enhance() adds jobTitle from user meta for Person type.
	 *
	 * @return void
	 */
	public function test_enhance_adds_job_title_from_user_meta() {
		$user_id = $this->factory()->user->create(
			[
				'user_login' => 'testauthor',
				'role'       => 'author',
			]
		);

		\update_user_meta( $user_id, 'job_title', 'Senior Developer' );

		$post = $this->factory()->post->create_and_get(
			[
				'post_title'  => 'Test Post',
				'post_type'   => 'post',
				'post_status' => 'publish',
				'post_author' => $user_id,
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => 'Person',
			'name'  => 'Test Author',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'author' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayHasKey( 'jobTitle', $enhanced_data );
		$this->assertSame( 'Senior Developer', $enhanced_data['jobTitle'] );
	}

	/**
	 * Tests enhance() does not override existing jobTitle.
	 *
	 * @return void
	 */
	public function test_enhance_does_not_override_existing_job_title() {
		$user_id = $this->factory()->user->create(
			[
				'user_login' => 'testauthor',
				'role'       => 'author',
			]
		);

		\update_user_meta( $user_id, 'job_title', 'Senior Developer' );

		$post = $this->factory()->post->create_and_get(
			[
				'post_title'  => 'Test Post',
				'post_type'   => 'post',
				'post_status' => 'publish',
				'post_author' => $user_id,
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type'    => 'Person',
			'name'     => 'Test Author',
			'jobTitle' => 'Existing Job Title',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'author' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertSame( 'Existing Job Title', $enhanced_data['jobTitle'] );
	}

	/**
	 * Tests enhance() does not add jobTitle when user meta is empty.
	 *
	 * @return void
	 */
	public function test_enhance_does_not_add_job_title_when_empty() {
		$user_id = $this->factory()->user->create(
			[
				'user_login' => 'testauthor',
				'role'       => 'author',
			]
		);

		// Set empty job title.
		\update_user_meta( $user_id, 'job_title', '' );

		$post = $this->factory()->post->create_and_get(
			[
				'post_title'  => 'Test Post',
				'post_type'   => 'post',
				'post_status' => 'publish',
				'post_author' => $user_id,
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => 'Person',
			'name'  => 'Test Author',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'author' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayNotHasKey( 'jobTitle', $enhanced_data );
	}

	/**
	 * Tests enhance() does not add jobTitle when user meta does not exist.
	 *
	 * @return void
	 */
	public function test_enhance_does_not_add_job_title_when_meta_not_exists() {
		$user_id = $this->factory()->user->create(
			[
				'user_login' => 'testauthor',
				'role'       => 'author',
			]
		);

		$post = $this->factory()->post->create_and_get(
			[
				'post_title'  => 'Test Post',
				'post_type'   => 'post',
				'post_status' => 'publish',
				'post_author' => $user_id,
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => 'Person',
			'name'  => 'Test Author',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'author' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayNotHasKey( 'jobTitle', $enhanced_data );
	}

	/**
	 * Tests enhance() trims whitespace from job title.
	 *
	 * @return void
	 */
	public function test_enhance_trims_whitespace_from_job_title() {
		$user_id = $this->factory()->user->create(
			[
				'user_login' => 'testauthor',
				'role'       => 'author',
			]
		);

		\update_user_meta( $user_id, 'job_title', '  Senior Developer  ' );

		$post = $this->factory()->post->create_and_get(
			[
				'post_title'  => 'Test Post',
				'post_type'   => 'post',
				'post_status' => 'publish',
				'post_author' => $user_id,
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => 'Person',
			'name'  => 'Test Author',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'author' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayHasKey( 'jobTitle', $enhanced_data );
		$this->assertSame( 'Senior Developer', $enhanced_data['jobTitle'] );
	}

	/**
	 * Tests enhance() ignores non-Person types.
	 *
	 * @return void
	 */
	public function test_enhance_ignores_non_person_types() {
		$user_id = $this->factory()->user->create(
			[
				'user_login' => 'testauthor',
				'role'       => 'author',
			]
		);

		\update_user_meta( $user_id, 'job_title', 'Senior Developer' );

		$post = $this->factory()->post->create_and_get(
			[
				'post_title'  => 'Test Post',
				'post_type'   => 'post',
				'post_status' => 'publish',
				'post_author' => $user_id,
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => 'Organization',
			'name'  => 'Test Org',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'publisher' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayNotHasKey( 'jobTitle', $enhanced_data );
	}

	/**
	 * Tests enhance() with disabled enhancement.
	 *
	 * @return void
	 */
	public function test_enhance_respects_disabled_enhancement() {
		// Disable person_job_title enhancement.
		\add_filter( 'wpseo_person_enhance_person_job_title', '__return_false' );

		$user_id = $this->factory()->user->create(
			[
				'user_login' => 'testauthor',
				'role'       => 'author',
			]
		);

		\update_user_meta( $user_id, 'job_title', 'Senior Developer' );

		$post = $this->factory()->post->create_and_get(
			[
				'post_title'  => 'Test Post',
				'post_type'   => 'post',
				'post_status' => 'publish',
				'post_author' => $user_id,
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => 'Person',
			'name'  => 'Test Author',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'author' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayNotHasKey( 'jobTitle', $enhanced_data );

		// Clean up filter.
		\remove_filter( 'wpseo_person_enhance_person_job_title', '__return_false' );
	}

	/**
	 * Gets all indexable records for a post.
	 *
	 * @param WP_Post $post The post to get indexables for.
	 *
	 * @return Indexable[] The indexables for the post.
	 */
	private function get_indexables_for( $post ) {
		$orm = Model::of_type( 'Indexable' );

		return $orm
			->where( 'object_id', $post->ID )
			->where( 'object_type', 'post' )
			->where( 'object_sub_type', $post->post_type )
			->find_many();
	}
}
