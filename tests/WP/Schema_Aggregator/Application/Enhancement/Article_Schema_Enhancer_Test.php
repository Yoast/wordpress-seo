<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Schema_Aggregator\Application\Enhancement;

use WP_Post;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Article_Config;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration tests for Article_Schema_Enhancer.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer::enhance
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Abstract_Schema_Enhancer::trim_content_to_max_length
 */
final class Article_Schema_Enhancer_Test extends TestCase {

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
	 * @var Article_Schema_Enhancer
	 */
	private $instance;

	/**
	 * Holds the config.
	 *
	 * @var Article_Config
	 */
	private $config;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance               = new Article_Schema_Enhancer();
		$this->config                 = new Article_Config();
		$this->indexable_post_watcher = \YoastSEO()->classes->get( Indexable_Post_Watcher::class );
		$this->indexable_repository   = \YoastSEO()->classes->get( Indexable_Repository::class );

		$this->instance->set_article_config( $this->config );

		// Delete all indexables before each test to ensure a clean slate.
		global $wpdb;
		$table = Model::get_table_name( 'Indexable' );
		$wpdb->query( "DELETE FROM {$table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
	}

	/**
	 * Tests enhance() adds description from excerpt for Article type.
	 *
	 * @return void
	 */
	public function test_enhance_adds_description_from_excerpt_for_article() {
		$post = $this->factory()->post->create_and_get(
			[
				'post_title'   => 'Test Article',
				'post_type'    => 'post',
				'post_status'  => 'publish',
				'post_excerpt' => 'This is a test excerpt for the article.',
				'post_content' => 'This is the full article content.',
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => 'Article',
			'name'  => 'Test Article',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'mainEntity' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayHasKey( 'description', $enhanced_data );
		$this->assertSame( 'This is a test excerpt for the article.', $enhanced_data['description'] );
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

	/**
	 * Tests enhance() adds both description and articleBody when filter is enabled.
	 *
	 * @return void
	 */
	public function test_enhance_adds_article_body_when_no_excerpt() {
		// Enable articleBody even when excerpt exists.
		\add_filter( 'wpseo_article_enhance_body_when_excerpt_exists', '__return_true' );

		$post = $this->factory()->post->create_and_get(
			[
				'post_title'   => 'Test Article',
				'post_type'    => 'post',
				'post_status'  => 'publish',
				'post_excerpt' => 'Test excerpt',
				'post_content' => 'This is the full article content that should appear as articleBody.',
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => 'Article',
			'name'  => 'Test Article',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'mainEntity' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayHasKey( 'description', $enhanced_data );
		$this->assertArrayHasKey( 'articleBody', $enhanced_data );
		$this->assertSame( 'This is the full article content that should appear as articleBody.', $enhanced_data['articleBody'] );

		// Clean up filter.
		\remove_filter( 'wpseo_article_enhance_body_when_excerpt_exists', '__return_true' );
	}

	/**
	 * Tests enhance() adds keywords from tags.
	 *
	 * @return void
	 */
	public function test_enhance_adds_keywords_from_tags() {
		$post = $this->factory()->post->create_and_get(
			[
				'post_title'  => 'Test Article',
				'post_type'   => 'post',
				'post_status' => 'publish',
			]
		);

		// Create and assign tags.
		$tag1 = $this->factory()->tag->create( [ 'name' => 'SEO' ] );
		$tag2 = $this->factory()->tag->create( [ 'name' => 'WordPress' ] );
		\wp_set_post_tags( $post->ID, [ $tag1, $tag2 ] );

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => 'Article',
			'name'  => 'Test Article',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'mainEntity' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayHasKey( 'keywords', $enhanced_data );
		$this->assertSame( 'SEO, WordPress', $enhanced_data['keywords'] );
	}

	/**
	 * Tests enhance() adds keywords from categories when filter is enabled.
	 *
	 * @return void
	 */
	public function test_enhance_adds_keywords_from_categories_when_enabled() {
		// Enable categories as keywords.
		\add_filter( 'wpseo_article_enhance_config_categories_as_keywords', '__return_true' );

		$post = $this->factory()->post->create_and_get(
			[
				'post_title'  => 'Test Article',
				'post_type'   => 'post',
				'post_status' => 'publish',
			]
		);

		// Create and assign category.
		$category = $this->factory()->category->create( [ 'name' => 'Technology' ] );
		\wp_set_post_categories( $post->ID, [ $category ] );

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => 'Article',
			'name'  => 'Test Article',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'mainEntity' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayHasKey( 'keywords', $enhanced_data );
		$this->assertStringContainsString( 'Technology', $enhanced_data['keywords'] );

		// Clean up filter.
		\remove_filter( 'wpseo_article_enhance_config_categories_as_keywords', '__return_true' );
	}

	/**
	 * Tests enhance() works with NewsArticle type.
	 *
	 * @return void
	 */
	public function test_enhance_works_with_news_article_type() {
		$post = $this->factory()->post->create_and_get(
			[
				'post_title'   => 'Test News Article',
				'post_type'    => 'post',
				'post_status'  => 'publish',
				'post_excerpt' => 'Breaking news excerpt.',
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => 'NewsArticle',
			'name'  => 'Test News Article',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'mainEntity' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayHasKey( 'description', $enhanced_data );
		$this->assertSame( 'Breaking news excerpt.', $enhanced_data['description'] );
	}

	/**
	 * Tests enhance() works with BlogPosting type.
	 *
	 * @return void
	 */
	public function test_enhance_works_with_blog_posting_type() {
		$post = $this->factory()->post->create_and_get(
			[
				'post_title'   => 'Test Blog Post',
				'post_type'    => 'post',
				'post_status'  => 'publish',
				'post_excerpt' => 'Blog post excerpt.',
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => 'BlogPosting',
			'name'  => 'Test Blog Post',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'mainEntity' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayHasKey( 'description', $enhanced_data );
		$this->assertSame( 'Blog post excerpt.', $enhanced_data['description'] );
	}

	/**
	 * Tests enhance() works with Article in array of types.
	 *
	 * @return void
	 */
	public function test_enhance_works_with_article_in_type_array() {
		$post = $this->factory()->post->create_and_get(
			[
				'post_title'   => 'Test Article',
				'post_type'    => 'post',
				'post_status'  => 'publish',
				'post_excerpt' => 'Article with multiple types.',
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => [ 'Article', 'WebPage' ],
			'name'  => 'Test Article',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'mainEntity' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayHasKey( 'description', $enhanced_data );
		$this->assertSame( 'Article with multiple types.', $enhanced_data['description'] );
	}

	/**
	 * Tests enhance() does not override existing description.
	 *
	 * @return void
	 */
	public function test_enhance_does_not_override_existing_description() {
		$post = $this->factory()->post->create_and_get(
			[
				'post_title'   => 'Test Article',
				'post_type'    => 'post',
				'post_status'  => 'publish',
				'post_excerpt' => 'This should not be used.',
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type'       => 'Article',
			'name'        => 'Test Article',
			'description' => 'Existing description',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'mainEntity' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertSame( 'Existing description', $enhanced_data['description'] );
	}

	/**
	 * Tests enhance() does not override existing articleBody.
	 *
	 * @return void
	 */
	public function test_enhance_does_not_override_existing_article_body() {
		$post = $this->factory()->post->create_and_get(
			[
				'post_title'   => 'Test Article',
				'post_type'    => 'post',
				'post_status'  => 'publish',
				'post_content' => 'This should not be used.',
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type'       => 'Article',
			'name'        => 'Test Article',
			'articleBody' => 'Existing article body',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'mainEntity' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertSame( 'Existing article body', $enhanced_data['articleBody'] );
	}

	/**
	 * Tests enhance() does not override existing keywords.
	 *
	 * @return void
	 */
	public function test_enhance_does_not_override_existing_keywords() {
		$post = $this->factory()->post->create_and_get(
			[
				'post_title'  => 'Test Article',
				'post_type'   => 'post',
				'post_status' => 'publish',
			]
		);

		// Create and assign tags.
		$tag = $this->factory()->tag->create( [ 'name' => 'SEO' ] );
		\wp_set_post_tags( $post->ID, [ $tag ] );

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type'    => 'Article',
			'name'     => 'Test Article',
			'keywords' => 'Existing, Keywords',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'mainEntity' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertSame( 'Existing, Keywords', $enhanced_data[0]['keywords'] );
	}

	/**
	 * Tests enhance() returns unchanged schema when no enhancements possible.
	 *
	 * @return void
	 */
	public function test_enhance_returns_unchanged_when_no_enhancements_possible() {
		$post = $this->factory()->post->create_and_get(
			[
				'post_title'  => 'Test Article',
				'post_type'   => 'post',
				'post_status' => 'publish',
			]
		);

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => 'WebPage',
			'name'  => 'Test Article',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'mainEntity' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertSame( $schema_data, $enhanced_data );
	}

	/**
	 * Tests enhance() with disabled enhancements.
	 *
	 * @return void
	 */
	public function test_enhance_respects_disabled_enhancements() {
		// Disable all enhancements.
		\add_filter( 'wpseo_article_enhance_use_excerpt', '__return_false' );
		\add_filter( 'wpseo_article_enhance_article_body', '__return_false' );
		\add_filter( 'wpseo_article_enhance_keywords', '__return_false' );

		$post = $this->factory()->post->create_and_get(
			[
				'post_title'   => 'Test Article',
				'post_type'    => 'post',
				'post_status'  => 'publish',
				'post_excerpt' => 'This should not be added.',
				'post_content' => 'This should not be added.',
			]
		);

		// Create and assign tags.
		$tag = $this->factory()->tag->create( [ 'name' => 'SEO' ] );
		\wp_set_post_tags( $post->ID, [ $tag ] );

		$indexable = \current( $this->get_indexables_for( $post ) );

		$schema_data  = [
			'@type' => 'Article',
			'name'  => 'Test Article',
		];
		$schema_piece = new Schema_Piece( $schema_data, 'mainEntity' );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayNotHasKey( 'description', $enhanced_data );
		$this->assertArrayNotHasKey( 'articleBody', $enhanced_data );
		$this->assertArrayNotHasKey( 'keywords', $enhanced_data );

		// Clean up filters.
		\remove_filter( 'wpseo_article_enhance_use_excerpt', '__return_false' );
		\remove_filter( 'wpseo_article_enhance_article_body', '__return_false' );
		\remove_filter( 'wpseo_article_enhance_keywords', '__return_false' );
	}
}
