<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Editors\Framework\Seo\Posts;

use WPSEO_Meta;
use Yoast\WP\SEO\Editors\Domain\Seo\Keywords;
use Yoast\WP\SEO\Editors\Domain\Seo\Seo_Plugin_Data_Interface;
use Yoast\WP\SEO\Editors\Framework\Seo\Keywords_Interface;
use Yoast\WP\SEO\Helpers\Meta_Helper;

/**
 * Describes if the keyword SEO data.
 */
class Keywords_Data_Provider extends Abstract_Post_Seo_Data_Provider implements Keywords_Interface {

	/**
	 *  The meta helper.
	 *
	 * @var Meta_Helper $meta_helper
	 */
	private $meta_helper;

	/**
	 * The constructor.
	 *
	 * @param Meta_Helper $meta_helper The meta helper.
	 */
	public function __construct( Meta_Helper $meta_helper ) {
		$this->meta_helper = $meta_helper;
	}

	/**
	 * Counts the number of given keywords used for other posts other than the given post_id.
	 *
	 * @return array<string> The keyword and the associated posts that use it.
	 */
	public function get_focus_keyword_usage(): array {
		$keyword = $this->meta_helper->get_value( 'focuskw', $this->post->ID );
		$usage   = [ $keyword => $this->get_keyword_usage_for_current_post( $keyword ) ];

		/**
		 * Allows enhancing the array of posts' that share their focus keywords with the post's related keywords.
		 *
		 * @param array<string> $usage   The array of posts' ids that share their focus keywords with the post.
		 * @param int   $post_id The id of the post we're finding the usage of related keywords for.
		 */
		return \apply_filters( 'wpseo_posts_for_related_keywords', $usage, $this->post->ID );
	}

	/**
	 * Retrieves the post types for the given post IDs.
	 *
	 * @param array<string|array<string>> $post_ids_per_keyword An associative array with keywords as keys and an array of post ids where those keywords are used.
	 * @return array<string|array<string>> The post types for the given post IDs.
	 */
	public function get_post_types_for_all_ids( $post_ids_per_keyword ) {
		$post_type_per_keyword_result = [];
		foreach ( $post_ids_per_keyword as $keyword => $post_ids ) {
			$post_type_per_keyword_result[ $keyword ] = WPSEO_Meta::post_types_for_ids( $post_ids );
		}

		return $post_type_per_keyword_result;
	}

	/**
	 * Gets the keyword usage for the current post and the specified keyword.
	 *
	 * @param string $keyword The keyword to check the usage of.
	 *
	 * @return array<string> The post IDs which use the passed keyword.
	 */
	private function get_keyword_usage_for_current_post( $keyword ) {
		return WPSEO_Meta::keyword_usage( $keyword, $this->post->ID );
	}

	/**
	 * Method to return the Keyword domain object with SEO data.
	 *
	 * @return Seo_Plugin_Data_Interface The specific seo data.
	 */
	public function get_data(): Seo_Plugin_Data_Interface {
		$keyword_usage = $this->get_focus_keyword_usage();
		return new Keywords( $keyword_usage, $this->get_post_types_for_all_ids( $keyword_usage ) );
	}
}
