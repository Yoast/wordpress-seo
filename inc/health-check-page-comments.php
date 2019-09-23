<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Represents the health check for paginated comments.
 */
class WPSEO_Health_Check_Page_Comments extends WPSEO_Health_Check {

	/**
	 * The name of the test.
	 *
	 * @var string
	 */
	protected $test = 'yoast-health-check-page-comments';

	/**
	 * Name of the test.
	 *
	 * @var string
	 */
	protected $name = 'yoast_health_check_page_comments';

	/**
	 * Runs the test.
	 */
	public function run() {
		if ( ! $this->has_page_comments() ) {
			return;
		}

		$this->label          = __( 'Paging comments enabled', 'wordpress-seo' );
		$this->status         = self::STATUS_RECOMMENDED;
		$this->badge['color'] = 'red';

		$this->description  = __( 'Paging comments is enabled, this is not needed in 999 out of 1000 cases, we recommend to disable it.', 'wordpress-seo' );
		$this->description .= '<br />';
		$this->description .= sprintf(
			/* translators: %1$s resolves to the opening tag of the link to the comment setting page, %2$s resolves to the closing tag of the link */
			__( 'To fix this uncheck the box in front of the "Break comments into pages..." on the %1$sComment settings page%2$s.', 'wordpress-seo' ),
			'<a href="' . esc_url( admin_url( 'options-discussion.php' ) ) . '">',
			'</a>'
		);

		$this->actions  = '<a href="' . esc_url( admin_url( 'options-discussion.php' ) ) . '">';
		$this->actions .= __( 'Go to the comment settings page', 'wordpress-seo' );
		$this->actions .= '</a>';
	}

	/**
	 * Are page comments enabled.
	 *
	 * @return bool True when page comments are enabled.
	 */
	protected function has_page_comments() {
		return '1' === get_option( 'page_comments' );
	}
}
