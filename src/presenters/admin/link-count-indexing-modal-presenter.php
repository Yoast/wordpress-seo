<?php
/**
 * Presenter class for the indexation modal.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Link_Count_Indexing_Modal_Presenter class.
 */
class Link_Count_Indexing_Modal_Presenter extends Abstract_Presenter {

	/**
	 * The number of objects that need to be reindexed.
	 *
	 * @var int
	 */
	protected $total_unindexed;

	/**
	 * Indexation_Modal constructor.
	 *
	 * @param int $total_unindexed The number of objects that need to be indexed.
	 */
	public function __construct( $total_unindexed ) {
		$this->total_unindexed = $total_unindexed;
	}

	/**
	 * Presents the modal.
	 *
	 * @return string The modal HTML.
	 */
	public function present() {
		$blocks = [];

		if ( $this->total_unindexed === 0 ) {
			$inner_text = \sprintf(
				'<p>%s</p>',
				\esc_html__( 'All your texts are already counted, there is no need to count them again.', 'wordpress-seo' )
			);
		}
		else {
			$progress = \sprintf(
				/* translators: 1: expands to a <span> containing the number of items recalculated. 2: expands to a <strong> containing the total number of items. */
				\esc_html__( 'Text %1$s of %2$s processed.', 'wordpress-seo' ),
				'<span id="yoast-link-indexing-current-count">0</span>',
				\sprintf( '<strong id="yoast-link-indexing-total-count">%d</strong>', $this->total_unindexed )
			);

			$inner_text  = '<div id="yoast-link-indexing-progress-bar" class="wpseo-progressbar"></div>';
			$inner_text .= \sprintf( '<p>%s</p>', $progress );
		}

		$blocks[] = \sprintf(
			'<div><p>%s</p>%s</div>',
			\esc_html__( 'Counting links in your texts', 'wordpress-seo' ),
			$inner_text
		);

		return \sprintf(
			'<div id="yoast-link-indexing-modal" class="hidden">%s<button id="yoast-link-indexing-stop" type="button" class="button">%s</button></div>',
			\implode( '<hr />', $blocks ),
			\esc_html__( 'Stop counting', 'wordpress-seo' )
		);
	}
}
