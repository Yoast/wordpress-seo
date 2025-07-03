<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Llms_Txt\Infrastructure\Content;

use WP_Post;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Domain\content\Post_Collection_Interface;
use Yoast\WP\SEO\Llms_Txt\Domain\Content_Types\Content_Type_Entry;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * The class that handles the manual post collection. Based on either indexables or WP_Query.
 */
class Manual_Post_Collection implements Post_Collection_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The meta surface.
	 *
	 * @var Meta_Surface
	 */
	private $meta;

	/**
	 * Constructor.
	 *
	 * @param Options_Helper       $options_helper       The options helper.
	 * @param Indexable_Helper     $indexable_helper     The indexable helper.
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 * @param Meta_Surface         $meta                 The meta surface.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Indexable_Helper $indexable_helper,
		Indexable_Repository $indexable_repository,
		Meta_Surface $meta
	) {
		$this->options_helper       = $options_helper;
		$this->indexable_helper     = $indexable_helper;
		$this->indexable_repository = $indexable_repository;
		$this->meta                 = $meta;
	}

	/**
	 * The post method to get all relevant content type entries
	 *
	 * @param string $post_type The post type.
	 * @param int    $limit     The maximum number of posts to return.
	 *
	 * @return array<int, array<Content_Type_Entry>> The posts that are relevant for the LLMs.txt.
	 */
	public function get_posts( string $post_type, int $limit ): array {
		$posts = [];
		$pages = [
			'about_us_page',
			'contact_page',
			'terms_page',
			'privacy_policy_page',
			'shop_page',
		];

		foreach ( $pages as $page ) {
			if ( ! empty( $this->options_helper->get( $page ) ) ) {
				$page_id = $this->options_helper->get( $page );
				if ( $this->indexable_helper->should_index_indexables() ) {
					$posts[] = $this->get_content_type_entry_for_indexable( $page_id );
				}
				else {
					$posts[] = $this->get_content_type_entry_wp_query( $page_id );
				}
			}
		}

		if ( ! empty( $this->options_helper->get( 'other_included_pages' ) ) ) {
			foreach ( $this->options_helper->get( 'other_included_pages' ) as $page_id ) {
				if ( $this->indexable_helper->should_index_indexables() ) {
					$posts[] = $this->get_content_type_entry_for_indexable( $page_id );
				}
				else {
					$posts[] = $this->get_content_type_entry_wp_query( $page_id );
				}
			}
		}

		return \array_slice( $posts, 0, $limit );
	}

	/**
	 * Gets the content entries with WP query.
	 *
	 * @param int $page_id The id of the page.
	 *
	 * @return Content_Type_Entry The content type entry.
	 */
	public function get_content_type_entry_wp_query( int $page_id ): Content_Type_Entry {
		$page = \get_post( $page_id );

		return new Content_Type_Entry(
			$page->ID,
			$page->post_title,
			\get_permalink( $page->ID ),
			$page->post_excerpt
		);
	}

	/**
	 * Gets the content entries with indexables.
	 *
	 * @param int $page_id The id of the page.
	 *
	 * @return Content_Type_Entry The content type entry.
	 */
	public function get_content_type_entry_for_indexable( int $page_id ): ?Content_Type_Entry {
		$indexable = $this->indexable_repository->find_by_id_and_type( $page_id, 'post' );
		if ( $indexable->is_public ) {
			$indexable_meta = $this->meta->for_indexable( $indexable );
			if ( $indexable_meta->post instanceof WP_Post ) {
				return new Content_Type_Entry(
					$indexable_meta->post->ID,
					$indexable_meta->post->post_title,
					$indexable_meta->canonical,
					$indexable_meta->post->post_excerpt
				);
			}
		}
	}
}
