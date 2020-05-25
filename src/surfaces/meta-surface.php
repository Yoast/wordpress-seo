<?php
/**
 * Surface for the indexables.
 *
 * @package Yoast\YoastSEO\Surfaces
 */

namespace Yoast\WP\SEO\Surfaces;

use Yoast\WP\SEO\Surfaces\Values\Meta;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Wrappers\WP_Rewrite_Wrapper;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Meta_Surface class.
 */
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
	 * @var WP_Rewrite_Wrapper
	 */
	private $wp_rewrite_wrapper;

	/**
	 * Meta_Surface constructor.
	 *
	 * @param ContainerInterface         $container            The DI container.
	 * @param Meta_Tags_Context_Memoizer $context_memoizer     The meta tags context memoizer.
	 * @param Indexable_Repository       $indexable_repository The indexable repository.
	 * @param WP_Rewrite_Wrapper         $wp_rewrite_wrapper   The WP rewrite wrapper.
	 */
	public function __construct(
		ContainerInterface $container,
		Meta_Tags_Context_Memoizer $context_memoizer,
		Indexable_Repository $indexable_repository,
		WP_Rewrite_Wrapper $wp_rewrite_wrapper
	) {
		$this->container          = $container;
		$this->context_memoizer   = $context_memoizer;
		$this->repository         = $indexable_repository;
		$this->wp_rewrite_wrapper = $wp_rewrite_wrapper;
	}

	/**
	 * Returns the meta tags context for the current page.
	 *
	 * @return Meta The meta values.
	 */
	public function for_current_page() {
		return $this->build_meta( $this->context_memoizer->for_current_page() );
	}

	/**
	 * Returns the meta tags context for the home page.
	 *
	 * @return Meta|false The meta values. False if none could be found.
	 */
	public function for_home_page() {
		$front_page_id = \get_option( 'page_on_front' );
		if ( \get_option( 'show_on_front' ) === 'page' && $front_page_id !== 0 ) {
			$indexable = $this->repository->find_by_id_and_type( $front_page_id, 'post' );

			if ( ! $indexable ) {
				return false;
			}

			return $this->build_meta( $this->context_memoizer->get( $indexable, 'Static_Home_Page' ) );
		}

		$indexable = $this->repository->find_for_home_page();

		if ( ! $indexable ) {
			return false;
		}

		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Home_Page' ) );
	}

	/**
	 * Returns the meta tags context for the posts page.
	 *
	 * @return Meta|false The meta values. False if none could be found.
	 */
	public function for_posts_page() {
		$posts_page_id = (int) \get_option( 'page_for_posts' );
		if ( $posts_page_id !== 0 ) {
			$indexable = $this->repository->find_by_id_and_type( $posts_page_id, 'post' );

			if ( ! $indexable ) {
				return false;
			}

			return $this->build_meta( $this->context_memoizer->get( $indexable, 'Static_Posts_Page' ) );
		}

		$indexable = $this->repository->find_for_home_page();

		if ( ! $indexable ) {
			return false;
		}


		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Home_Page' ) );
	}

	/**
	 * Returns the meta tags context for a post type archive.
	 *
	 * @param string $post_type Optional. The post type to get the archive meta for. Defaults to the current post type.
	 *
	 * @return Meta|false The meta values. False if none could be found.
	 */
	public function for_post_type_archive( $post_type = null ) {
		if ( $post_type === null ) {
			$post_type = \get_post_type();
		}

		$indexable = $this->repository->find_for_post_type_archive( $post_type );

		if ( ! $indexable ) {
			return false;
		}

		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Post_Type_Archive' ) );
	}

	/**
	 * Returns the meta tags context for the search result page.
	 *
	 * @return Meta|false The meta values. False if none could be found.
	 */
	public function for_search_result() {
		$indexable = $this->repository->find_for_system_page( 'search-result' );

		if ( ! $indexable ) {
			return false;
		}

		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Search_Result_Page' ) );
	}

	/**
	 * Returns the meta tags context for the search result page.
	 *
	 * @return Meta|false The meta values. False if none could be found.
	 */
	public function for_404() {
		$indexable = $this->repository->find_for_system_page( '404' );

		if ( ! $indexable ) {
			return false;
		}


		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Error_Page' ) );
	}

	/**
	 * Returns the meta tags context for a post.
	 *
	 * @param int $id The ID of the post.
	 *
	 * @return Meta|false The meta values. False if none could be found.
	 */
	public function for_post( $id ) {
		$indexable = $this->repository->find_by_id_and_type( $id, 'post' );

		if ( ! $indexable ) {
			return false;
		}


		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Post_Type' ) );
	}

	/**
	 * Returns the meta tags context for a term.
	 *
	 * @param int $id The ID of the term.
	 *
	 * @return Meta|false The meta values. False if none could be found.
	 */
	public function for_term( $id ) {
		$indexable = $this->repository->find_by_id_and_type( $id, 'term' );

		if ( ! $indexable ) {
			return false;
		}


		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Term_Archive' ) );
	}

	/**
	 * Returns the meta tags context for an author.
	 *
	 * @param int $id The ID of the author.
	 *
	 * @return Meta|false The meta values. False if none could be found.
	 */
	public function for_author( $id ) {
		$indexable = $this->repository->find_by_id_and_type( $id, 'user' );

		if ( ! $indexable ) {
			return false;
		}

		return $this->build_meta( $this->context_memoizer->get( $indexable, 'Author_Archive' ) );
	}

	/**
	 * Returns the meta tags context for a url.
	 *
	 * @param string $url The url of the page. Required to be relative to the site url.
	 *
	 * @return Meta|false The meta values. False if none could be found.
	 */
	public function for_url( $url ) {
		$url_parts  = \wp_parse_url( $url );
		$site_parts = \wp_parse_url( \site_url() );
		if ( $url_parts['host'] !== $site_parts['host'] ) {
			return false;
		}
		// Ensure the scheme is consistent with values in the DB.
		$url = $site_parts['scheme'] . '://' . $url_parts['host'] . $url_parts['path'];

		if ( $this->is_date_archive_url( $url ) ) {
			$indexable = $this->repository->find_for_date_archive();
		}
		else {
			$indexable = $this->repository->find_by_permalink( $url );
		}

		// If we still don't have an indexable abort, the WP globals could be anything so we can't use the unknown indexable.
		if ( ! $indexable ) {
			return false;
		}
		$page_type = '';

		switch ( $indexable->object_type ) {
			case 'post':
				$front_page_id = (int) \get_option( 'page_on_front' );
				if ( $indexable->object_id === $front_page_id ) {
					$page_type = 'Static_Home_Page';
					break;
				}
				$posts_page_id = (int) \get_option( 'page_for_posts' );
				if ( $indexable->object_id === $posts_page_id ) {
					$page_type = 'Static_Posts_Page';
					break;
				}
				$page_type = 'Post_Type';
				break;
			case 'term':
				$page_type = 'Term_Archive';
				break;
			case 'user':
				$page_type = 'Author_Archive';
				break;
			case 'home-page':
				$page_type = 'Home_Page';
				break;
			case 'post-type-archive':
				$page_type = 'Post_Type_Archive';
				break;
			case 'date-archive':
				$page_type = 'Date_Archive';
				break;
			case 'system-page':
				if ( $indexable->object_sub_type === 'search-result' ) {
					$page_type = 'Search_Result_Page';
				}
				if ( $indexable->object_sub_type === '404' ) {
					$page_type = 'Error_Page';
				}
		}

		if ( empty( $page_type ) ) {
			return false;
		}

		return $this->build_meta( $this->context_memoizer->get( $indexable, $page_type ) );
	}

	/**
	 * Checks if a given URL is a date archive URL.
	 *
	 * @param string $url The url.
	 *
	 * @return boolean
	 */
	protected function is_date_archive_url( $url ) {
		$path = \wp_parse_url( $url, \PHP_URL_PATH );
		$path = \ltrim( $path, '/' );

		$wp_rewrite   = $this->wp_rewrite_wrapper->get();
		$date_rewrite = $wp_rewrite->generate_rewrite_rules( $wp_rewrite->get_date_permastruct(), \EP_DATE );
		$date_rewrite = \apply_filters( 'date_rewrite_rules', $date_rewrite );

		foreach ( (array) $date_rewrite as $match => $query ) {
			if ( \preg_match( "#^$match#", $path ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Creates a new meta value object
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return Meta The meta value
	 */
	protected function build_meta( Meta_Tags_Context $context ) {
		return new Meta( $context, $this->container );
	}
}
