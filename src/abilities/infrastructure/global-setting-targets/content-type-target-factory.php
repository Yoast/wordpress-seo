<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;

/**
 * Creates the targets of the default SEO settings of the content types, one per post type.
 */
class Content_Type_Target_Factory {

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Post_Type_Helper $post_type_helper The post type helper.
	 * @param Options_Helper   $options_helper   The options helper.
	 */
	public function __construct( Post_Type_Helper $post_type_helper, Options_Helper $options_helper ) {
		$this->post_type_helper = $post_type_helper;
		$this->options_helper   = $options_helper;
	}

	/**
	 * Creates the target of a content type, whether or not it has default SEO settings.
	 *
	 * @param string $post_type The post type of the content type.
	 *
	 * @return Content_Type_Target The target.
	 */
	public function create( string $post_type ): Content_Type_Target {
		return new Content_Type_Target( $post_type, $this->post_type_helper, $this->options_helper );
	}

	/**
	 * Creates the targets of all content types with default SEO settings.
	 *
	 * Media is always included, like on the settings page, as it is left out of the indexable post types while its
	 * pages are redirected to the media file.
	 *
	 * @return array<Content_Type_Target> The targets.
	 */
	public function create_all(): array {
		$post_types = $this->post_type_helper->get_indexable_post_types();
		if ( ! \in_array( 'attachment', $post_types, true ) ) {
			$post_types[] = 'attachment';
		}

		$targets = [];
		foreach ( $post_types as $post_type ) {
			$targets[] = new Content_Type_Target( $post_type, $this->post_type_helper, $this->options_helper, true );
		}

		return $targets;
	}
}
