<?php

namespace Yoast\WP\SEO\Tests\WP\Llms_Txt\Infrastructure;

use WPSEO_Options;
use WPSEO_Taxonomy_Meta;
use WPSEO_Taxonomy_Sitemap_Provider;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Terms_Collector;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Tests taxonomy selection for llms.txt.
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Terms_Collector::get_terms_lists
 */
final class Terms_Collector_Test extends TestCase {

	/**
	 * Tests the ordering and limit after excluding a noindexed category.
	 *
	 * @return void
	 */
	public function test_noindexed_category_does_not_use_a_result_slot() {
		$term_ids = [];
		for ( $i = 1; $i <= 7; $i++ ) {
			$term_ids[] = $this->factory()->category->create( [ 'name' => 'Category ' . $i ] );
		}

		for ( $i = 7; $i >= 1; $i-- ) {
			$post_id = $this->factory()->post->create( [ 'post_status' => 'publish' ] );
			\wp_set_post_categories( $post_id, \array_slice( $term_ids, 0, $i ) );
		}

		WPSEO_Taxonomy_Meta::set_value( $term_ids[0], 'category', 'noindex', 'noindex' );
		WPSEO_Taxonomy_Meta::set_value( $term_ids[1], 'category', 'noindex', 'index' );

		$sitemap       = new WPSEO_Taxonomy_Sitemap_Provider();
		$sitemap_links = \array_column( $sitemap->get_sitemap_links( 'category', 100, 1 ), 'loc' );
		$this->assertNotContains( \get_category_link( $term_ids[0] ), $sitemap_links );
		$this->assertContains( \get_category_link( $term_ids[1] ), $sitemap_links );

		$expected = [ 'Categories' ];
		for ( $i = 1; $i <= 5; $i++ ) {
			$expected[] = '- [Category ' . ( $i + 1 ) . '](' . \get_category_link( $term_ids[ $i ] ) . ')';
		}
		$this->assertSame( \implode( \PHP_EOL, $expected ), $this->get_rendered_list( 'Categories' ) );
	}

	/**
	 * Tests individual and taxonomy-wide visibility for a custom taxonomy.
	 *
	 * @return void
	 */
	public function test_custom_taxonomy_visibility() {
		\register_taxonomy(
			'llms_topic',
			'post',
			[
				'public' => true,
				'label'  => 'Topics',
			],
		);
		WPSEO_Options::set( 'noindex-tax-llms_topic', false );
		$private_id = $this->factory()->term->create(
			[
				'taxonomy' => 'llms_topic',
				'name'     => 'Private Topic',
			],
		);
		$public_id  = $this->factory()->term->create(
			[
				'taxonomy' => 'llms_topic',
				'name'     => 'Public Topic',
			],
		);
		$post_id    = $this->factory()->post->create( [ 'post_status' => 'publish' ] );
		\wp_set_object_terms( $post_id, [ $private_id, $public_id ], 'llms_topic' );
		WPSEO_Taxonomy_Meta::set_value( $private_id, 'llms_topic', 'noindex', 'noindex' );

		$rendered = $this->get_rendered_list( 'Topics' );
		$this->assertStringNotContainsString( 'Private Topic', $rendered );
		$this->assertStringContainsString( 'Public Topic', $rendered );

		WPSEO_Options::set( 'noindex-tax-llms_topic', true );
		$this->assertSame( '', $this->get_rendered_list( 'Topics' ) );
		\unregister_taxonomy( 'llms_topic' );
	}

	/**
	 * Tests that a new selection uses the current term setting.
	 *
	 * @return void
	 */
	public function test_term_visibility_changes_are_reflected_in_new_selections() {
		$term_id = $this->factory()->category->create( [ 'name' => 'Changing Category' ] );
		$post_id = $this->factory()->post->create( [ 'post_status' => 'publish' ] );
		\wp_set_post_categories( $post_id, [ $term_id ] );

		$this->assertStringContainsString( 'Changing Category', $this->get_rendered_list( 'Categories' ) );
		WPSEO_Taxonomy_Meta::set_value( $term_id, 'category', 'noindex', 'noindex' );
		$this->assertStringNotContainsString( 'Changing Category', $this->get_rendered_list( 'Categories' ) );
		WPSEO_Taxonomy_Meta::set_value( $term_id, 'category', 'noindex', 'index' );
		$this->assertStringContainsString( 'Changing Category', $this->get_rendered_list( 'Categories' ) );
	}

	/**
	 * Returns the rendered list for a taxonomy label.
	 *
	 * @param string $label The taxonomy label.
	 *
	 * @return string The rendered list.
	 */
	private function get_rendered_list( string $label ): string {
		$collector = new Terms_Collector( \YoastSEO()->helpers->taxonomy );
		foreach ( $collector->get_terms_lists() as $list ) {
			$rendered = $list->render();
			if ( \strpos( $rendered, $label . \PHP_EOL ) === 0 ) {
				return $rendered;
			}
		}

		return '';
	}
}
