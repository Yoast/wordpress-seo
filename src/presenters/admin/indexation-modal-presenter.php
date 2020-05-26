<?php
/**
 * Presenter class for the indexation modal.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Indexation_Modal_Presenter class.
 */
class Indexation_Modal_Presenter extends Abstract_Presenter {

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
				\esc_html__( 'All your content is already indexed, there is no need to index it again.', 'wordpress-seo' )
			);
		}
		else {
			$progress = \sprintf(
				/* translators: 1: expands to a <span> containing the number of items recalculated. 2: expands to a <strong> containing the total number of items. */
				\esc_html__( 'Object %1$s of %2$s processed.', 'wordpress-seo' ),
				'<span id="yoast-indexation-current-count">0</span>',
				\sprintf( '<strong id="yoast-indexation-total-count">%d</strong>', $this->total_unindexed )
			);

			$inner_text  = '<div id="yoast-indexation-progress-bar" class="wpseo-progressbar"></div>';
			$inner_text .= \sprintf( '<p>%s</p>', $progress );
		}

		$blocks[] = \sprintf(
			'<div><p>%s</p>%s</div>',
			\esc_html__( 'We\'re processing all of your content to speed it up! This may take a few minutes.', 'wordpress-seo' ),
			$inner_text
		);

		return \sprintf(
			'<div id="yoast-indexation-wrapper" class="hidden">%s<button id="yoast-indexation-stop" type="button" class="button">%s</button></div>',
			\implode( '<hr />', $blocks ),
			\esc_html__( 'Stop indexing', 'wordpress-seo' )
		);
	}
}
