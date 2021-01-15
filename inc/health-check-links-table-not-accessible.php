<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

use Yoast\WP\SEO\Config\Migration_Status;

/**
 * Represents the health check when the links table is not accessible.
 */
class WPSEO_Health_Check_Link_Table_Not_Accessible extends WPSEO_Health_Check {

	/**
	 * The name of the test.
	 *
	 * @var string
	 */
	protected $test = 'yoast-health-check-links-table-not-accessible';

	/**
	 * Runs the test.
	 */
	public function run() {
		if ( ! $this->is_text_link_counter_enabled() ) {
			return;
		}

		if ( YoastSEO()->classes->get( Migration_Status::class )->is_version( 'free', WPSEO_VERSION ) ) {
			$this->label          = esc_html__( 'The text link counter is working as expected', 'wordpress-seo' );
			$this->status         = self::STATUS_GOOD;
			$this->badge['color'] = 'blue';
			$this->description    = sprintf(
				/* translators: 1: Link to the Yoast SEO blog, 2: Link closing tag. */
				esc_html__( 'The text link counter helps you improve your site structure. %1$sFind out how the text link counter can enhance your SEO%2$s.', 'wordpress-seo' ),
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3zw' ) . '" target="_blank">',
				WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
			);

			return;
		}

		$this->label          = esc_html__( 'The text link counter feature is not working as expected', 'wordpress-seo' );
		$this->status         = self::STATUS_RECOMMENDED;
		$this->badge['color'] = 'red';

		$this->description = sprintf(
			/* translators: 1: Yoast SEO. */
			esc_html__( 'For this feature to work, %1$s needs to create a table in your database. We were unable to create this table automatically.', 'wordpress-seo' ),
			'Yoast SEO'
		);

		$this->actions = sprintf(
			/* translators: 1: Link to the Yoast help center, 2: Link closing tag. */
			esc_html__( '%1$sFind out how to solve this problem on our help center%2$s.', 'wordpress-seo' ),
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3zv' ) . '" target="_blank">',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
		);
	}

	/**
	 * Checks whether the text link counter feature is enabled.
	 *
	 * @return bool Whether the text link counter feature is enabled.
	 */
	protected function is_text_link_counter_enabled() {
		return WPSEO_Options::get( 'enable_text_link_counter' );
	}
}
