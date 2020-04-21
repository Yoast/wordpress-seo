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
		$output = \sprintf( '<li><strong>%s</strong><br/>', \esc_html__( 'Content indexation', 'wordpress-seo' ) );

		if ( $this->total_unindexed === 0 ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: `message_already_indexed` is considered a safe method.
			$output .= '<span class="wpseo-checkmark-ok-icon"></span>' . \esc_html__( 'Good job! All your site\'s content has been indexed.', 'wordpress-seo' );
		}
		else {
			$output .= \sprintf(
				'<span id="yoast-indexation">' .
					'<a id="yoast-open-indexation" href="#TB_inline?width=600&height=175&inlineId=yoast-indexation-wrapper" title="%1$s" class="btn button yoast-js-index-links yoast-js-run-indexation--all thickbox">' .
						'%1$s' .
					'</a>' .
				'</span>',
				\esc_attr__( 'Index your content', 'wordpress-seo' )
			);
		}

		$output .= '</li>';

		return $output;
	}
}
