<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets;

use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Woocommerce_Helper;

/**
 * Creates the targets of the content type archives, one per post type.
 */
class Post_Type_Archive_Target_Factory {

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * The WooCommerce helper.
	 *
	 * @var Woocommerce_Helper
	 */
	private $woocommerce_helper;

	/**
	 * Constructor.
	 *
	 * @param Post_Type_Helper   $post_type_helper   The post type helper.
	 * @param Woocommerce_Helper $woocommerce_helper The WooCommerce helper.
	 */
	public function __construct( Post_Type_Helper $post_type_helper, Woocommerce_Helper $woocommerce_helper ) {
		$this->post_type_helper   = $post_type_helper;
		$this->woocommerce_helper = $woocommerce_helper;
	}

	/**
	 * Creates the target of the archive of a content type, whether or not that archive has global settings.
	 *
	 * @param string $post_type The post type of the content type.
	 *
	 * @return Post_Type_Archive_Target The target.
	 */
	public function create( string $post_type ): Post_Type_Archive_Target {
		return new Post_Type_Archive_Target( $post_type, $this->post_type_helper, $this->woocommerce_helper );
	}

	/**
	 * Creates the targets of the content type archives that have global settings.
	 *
	 * @return array<Post_Type_Archive_Target> The targets.
	 */
	public function create_all(): array {
		$targets = [];

		foreach ( \array_keys( $this->post_type_helper->get_indexable_post_archives() ) as $post_type ) {
			$target = $this->create( $post_type );

			try {
				$target->ensure_available();
			} catch ( Unavailable_Global_Setting_Target_Exception $exception ) {
				// The target tells which archives have no global settings, like the WooCommerce Shop page.
				continue;
			}

			$targets[] = $target;
		}

		return $targets;
	}
}
