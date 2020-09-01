<?php
/**
 * Presenter class for the link count indexing tool.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Link_Count_Indexing_List_Item_Presenter class
 */
class Link_Count_Indexing_List_Item_Presenter extends Abstract_Presenter {

	/**
	 * The number of objects that need to be reindexed.
	 *
	 * @var int
	 */
	protected $total_unindexed;

	/**
	 * Link_Count_Indexing_List_Item_Presenter constructor.
	 *
	 * @param int $total_unindexed The number of objects that need to be indexed.
	 */
	public function __construct( $total_unindexed ) {
		$this->total_unindexed = $total_unindexed;
	}

	/**
	 * @inheritDoc
	 */
	public function present() {
		$list_item = '<li><strong>' . esc_html__( 'Text link counter', 'wordpress-seo' ) . '</strong><br/>';

		if ( $this->total_unindexed === 0 ) {
			$list_item .= '<span class="wpseo-checkmark-ok-icon"></span>' . esc_html__( 'Good job! All the links in your texts have been counted.', 'wordpress-seo' );
		}
		else {
			$list_item .= sprintf(
				'<span id="yoast-link-indexing"><button type="button" class="button yoast-open-indexation" data-title="%1$s" data-settings="yoastLinkIndexingData">%1$s</button></span>',
				esc_attr__( 'Count links in your texts', 'wordpress-seo' )
			);
		}

		$list_item .= '</li>';

		return $list_item;
	}
}
