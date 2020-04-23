<?php
/**
 * Presenter class for the indexation modal.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Indexation_List_Item_Presenter class.
 */
class Indexation_List_Item_Presenter extends Abstract_Presenter {

	/**
	 * The number of objects that need to be reindexed.
	 *
	 * @var int
	 */
	protected $total_unindexed;

	/**
	 * Indexation_List_Item_Presenter constructor.
	 *
	 * @param int $total_unindexed The number of objects that need to be indexed.
	 */
	public function __construct( $total_unindexed ) {
		$this->total_unindexed = $total_unindexed;
	}

	/**
	 * Presents the list item for the tools menu.
	 *
	 * @return string The list item HTML.
	 */
	public function present() {
		$output = \sprintf( '<li><strong>%s</strong><br/>', \esc_html__( 'Speeding up your site', 'wordpress-seo' ) );

		if ( $this->total_unindexed === 0 ) {
			$output .= '<span class="wpseo-checkmark-ok-icon"></span>' . \esc_html__( 'Great, your site has been optimized!', 'wordpress-seo' );
		}
		else {
			$output .= \sprintf(
				'<span id="yoast-indexation">' .
					'<button type="button" class="button yoast-open-indexation" data-title="%1$s">' .
						'%2$s' .
					'</button>' .
				'</span>',
				\esc_attr__( 'Speeding up your site', 'wordpress-seo' ),
				\esc_html__( 'Speed up your site', 'wordpress-seo' )
			);
		}

		$output .= '</li>';

		return $output;
	}
}
