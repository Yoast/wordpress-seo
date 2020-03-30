<?php
/**
 * Surface for the indexables.
 *
 * @package Yoast\YoastSEO\Surfaces
 */

namespace Yoast\WP\Free\Surfaces;

use Yoast\WP\Free\Surfaces\Values\Meta;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Integrations\Front_End_Integration;
use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

class Meta_Surface {

	/**
	 * @var ContainerInterface
	 */
	private $container;

	/**
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $context_memoizer;

	/**
	 * @var Indexable_Repository
	 */
	private $repository;

	/**
	 * @var Front_End_Integration
	 */
	private $front_end;

	/**
	 * Current_Page_Surface constructor.
	 *
	 * @param ContainerInterface         $container            The DI container.
	 * @param Meta_Tags_Context_Memoizer $context_memoizer     The meta tags context memoizer.
	 * @param Indexable_Repository       $indexable_repository The indexable repository.
	 * @param Front_End_Integration      $replace_vars         The replace vars helper.
	 */
	public function __construct(
		ContainerInterface $container,
		Meta_Tags_Context_Memoizer $context_memoizer,
		Indexable_Repository $indexable_repository,
		Front_End_Integration $front_end
	) {
		$this->container        = $container;
		$this->context_memoizer = $context_memoizer;
		$this->repository       = $indexable_repository;
		$this->front_end        = $front_end;
	}

	/**
	 * Returns the meta tags context for the current page.
	 *
	 * @return Meta_Tags_Context The meta tags context.
	 */
	public function for_current_page() {
		return $this->build_meta( $this->context_memoizer->for_current_page() );
	}

	/**
	 * Returns the meta tags context for the home page.
	 *
	 * @return Meta_Tags_Context The meta tags context.
	 */
	public function for_home_page() {
		$front_page_id = \get_option( 'page_on_front' );
		if ( \get_option( 'show_on_front' ) === 'page' && $front_page_id !== 0 ) {
			$indexable = $this->repository->find_by_id_and_type( $front_page_id, 'post' );
			return $this->build_meta( $this->context_memoizer->get( $indexable, 'Static_Home_Page' ) );
		}

		$indexable = $this->repository->find_for_home_page();
		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Home_Page' ) );
	}

	/**
	 * Returns the meta tags context for the posts page.
	 *
	 * @return Meta_Tags_Context The meta tags context.
	 */
	public function for_posts_page() {
		$posts_page_id = (int) \get_option( 'page_for_posts' );
		if ( $posts_page_id !== 0 ) {
			$indexable = $this->repository->find_by_id_and_type( $posts_page_id, 'post' );
			return $this->build_meta( $this->context_memoizer->get( $indexable, 'Static_Posts_Page' ) );
		}

		$indexable = $this->repository->find_for_home_page();
		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Home_Page' ) );
	}

	/**
	 * Returns the meta tags context for the date archive.
	 *
	 * @return Meta_Tags_Context The meta tags context.
	 */
	public function for_date_archive() {
		$indexable = $this->repository->find_for_date_archive();
		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Date_Archive' ) );
	}

	/**
	 * Returns the meta tags context for a post type archive.
	 *
	 * @param string $post_type Optional. The post type to get the archive meta for. Defaults to the current post type.
	 *
	 * @return Meta_Tags_Context The meta tags context.
	 */
	public function for_post_type_archive( $post_type = null ) {
		if ( $post_type === null ) {
			$post_type = \get_post_type();
		}

		$indexable = $this->repository->find_for_post_type_archive( $post_type );
		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Post_Type_Archive' ) );
	}

	/**
	 * Returns the meta tags context for the search result page.
	 *
	 * @return Meta_Tags_Context The meta tags context.
	 */
	public function for_search_result() {
		$indexable = $this->repository->find_for_system_page( 'search-result' );
		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Search_Result_Page' ) );
	}

	/**
	 * Returns the meta tags context for the search result page.
	 *
	 * @return Meta_Tags_Context The meta tags context.
	 */
	public function for_404() {
		$indexable = $this->repository->find_for_system_page( '404' );
		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Error_Page' ) );
	}

	/**
	 * Returns the meta tags context for a post.
	 *
	 * @param int $id The ID of the post.
	 *
	 * @return Meta_Tags_Context The meta tags context.
	 */
	public function for_post( $id ) {
		$indexable = $this->repository->find_by_id_and_type( $id, 'post' );
		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Post_Type' ) );
	}

	/**
	 * Returns the meta tags context for a term.
	 *
	 * @param int $id The ID of the term.
	 *
	 * @return Meta_Tags_Context The meta tags context.
	 */
	public function for_term( $id ) {
		$indexable = $this->repository->find_by_id_and_type( $id, 'term' );
		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Term_Archive' ) );
	}

	/**
	 * Returns the meta tags context for an author.
	 *
	 * @param int $id The ID of the author.
	 *
	 * @return Meta_Tags_Context The meta tags context.
	 */
	public function for_author( $id ) {
		$indexable = $this->repository->find_by_id_and_type( $id, 'author' );
		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Author_Archive' ) );
	}

	/**
	 * Creates a new meta value object
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return Meta The meta value
	 */
	private function build_meta( Meta_Tags_Context $context ) {
		return new Meta( $context, $this->container, $this->front_end );
	}
}
