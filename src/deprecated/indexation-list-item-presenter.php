<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use WPSEO_Shortlinker;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Presenter class for the indexation list item.
 *
 * @deprecated 15.1
 * @codeCoverageIgnore
 */
class Indexation_List_Item_Presenter extends Abstract_Presenter {

	/**
	 * Represents the indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The number of objects that need to be reindexed.
	 *
	 * @var int
	 */
	protected $total_unindexed;

	/**
	 * Indexation_List_Item_Presenter constructor.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @param int              $total_unindexed  The number of objects that need to be indexed.
	 * @param Indexable_Helper $indexable_helper The indexable helper.
	 */
	public function __construct(
		$total_unindexed,
		Indexable_Helper $indexable_helper
	) {
		$this->total_unindexed  = $total_unindexed;
		$this->indexable_helper = $indexable_helper;
	}

	/**
	 * Presents the list item for the tools menu.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return string The list item HTML.
	 */
	public function present() {
		$output  = \sprintf( '<li><strong>%s</strong>', \esc_html__( 'SEO Data', 'wordpress-seo' ) );
		$output .= \sprintf(
			'<p><a href="%1$s" target="_blank">%2$s</a>%3$s</p>',
			\esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3-z' ) ),
			\sprintf(
				/* translators: 1: Expands to Yoast SEO. */
				\esc_html__( '%1$s creates and maintains an index of all of your site\'s SEO data in order to speed up your site', 'wordpress-seo' ),
				'Yoast SEO'
			),
			\sprintf(
				/* translators: 1: Expands to Yoast SEO. */
				\esc_html__( '. To build your index, %1$s needs to process all of your content.', 'wordpress-seo' ),
				'Yoast SEO'
			)
		);

		/**
		 * Filter 'wpseo_shutdown_indexation_limit' - Allow filtering the amount of objects that can be indexed during shutdown.
		 *
		 * @api int The maximum number of objects indexed.
		 */
		$shutdown_limit = \apply_filters( 'wpseo_shutdown_indexation_limit', 25 );

		if ( $this->total_unindexed === 0 || $this->total_unindexed < $shutdown_limit ) {
			$output .= '<span class="wpseo-checkmark-ok-icon"></span>' . \esc_html__( 'Great, your site has been optimized!', 'wordpress-seo' );
		}
		else {

			$should_index = $this->indexable_helper->should_index_indexables();
			$disabled     = ( $should_index ) ? '' : 'disabled';

			$output .= \sprintf(
				'<span id="yoast-indexation">' .
				'<button type="button" class="button yoast-open-indexation" data-title="%1$s" data-settings="yoastIndexationData" ' .
				'%3$s>' .
				'%2$s' .
				'</button>' .
				'</span>',
				\esc_attr__( 'Speeding up your site', 'wordpress-seo' ),
				\esc_html__( 'Start processing and speed up your site now', 'wordpress-seo' ),
				$disabled
			);

			if ( ! $should_index ) {
				$output .= '<p>';
				$output .= \esc_html__( 'This button to index your website is disabled for non-production environments.', 'wordpress-seo' );
				$output .= '</p>';
			}
		}

		$output .= '</li>';

		return $output;
	}
}
