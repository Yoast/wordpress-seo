<?php
/**
 * Presenter class for the warning that is given when the Category URLs (stripcategorybase) option is touched.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

/**
 * Indexation_Permalink_Warning_Presenter class.
 */
class Indexation_Permalink_Warning_Presenter extends Indexation_Warning_Presenter {

	/**
	 * Represents the reason that the permalink settings are changed.
	 */
	const REASON_PERMALINK_SETTINGS = 'permalink_settings_changed';

	/**
	 * Represents the reason that the category base is changed.
	 */
	const REASON_CATEGORY_BASE_PREFIX = 'category_base_changed';

	/**
	 * Presents the warning that your site's content is not fully indexed.
	 *
	 * @return string The warning HTML.
	 */
	public function present() {
		$output  = '<div id="yoast-indexation-warning" class="notice notice-success">';
		$output .= '<p>';
		$output .= $this->get_text_for_reason( $this->options_helper->get( 'indexables_indexation_reason' ) );
		$output .= '</p>';
		$output .= $this->get_estimate();
		$output .= $this->get_action( \__( 'Start processing and speed up your site now', 'wordpress-seo' ) );
		$output .= '<hr />';
		$output .= '<p>';
		$output .= $this->get_dismiss_button();
		$output .= '</p>';
		$output .= '</div>';

		return $output;
	}

	/**
	 * Determines which text to show as reason for the indexation.
	 *
	 * @param string $reason The saved reason.
	 *
	 * @return string The text to show as reason.
	 */
	protected function get_text_for_reason( $reason ) {
		switch ( $reason ) {
			case static::REASON_CATEGORY_BASE_PREFIX:
				$text = \esc_html__( 'Because of a change in your category URL setting, some of your SEO data need to be reprocessed.', 'wordpress-seo' );
				break;

			case static::REASON_PERMALINK_SETTINGS:
			default:
				$text = \esc_html__( 'Because of a change in your permalink structure, some of your SEO data need to be reprocessed.', 'wordpress-seo' );
				break;
		}

		/**
		 * Filter: 'wpseo_indexables_indexation_alert' - Allow developers to filter the reason of the indexation
		 *
		 * @api string $text The text to show as reason.
		 *
		 * @param string $reason The reason value.
		 */
		return (string) \apply_filters( 'wpseo_indexables_indexation_alert', $text, $reason );
	}
}
