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
	 * Runs the test.
	 */
	public function run() {
		if ( ! $this->has_page_comments() ) {
			return;
		}

		$this->label          = esc_html__( 'Paging comments enabled', 'wordpress-seo' );
		$this->status         = self::STATUS_RECOMMENDED;
		$this->badge['color'] = 'red';

		$this->description  = esc_html__( 'Paging comments is enabled. As this is not needed in 999 out of 1000 cases, we recommend you disable it.', 'wordpress-seo' );
		$this->description .= '<br />';
		$this->description .= sprintf(
			/* translators: %1$s resolves to the opening tag of the link to the comment setting page, %2$s resolves to the closing tag of the link */
			esc_html__( 'To fix this, uncheck the box in front of the "Break comments into pages..." on the %1$sComment settings page%2$s.', 'wordpress-seo' ),
			'<a href="' . esc_url( admin_url( 'options-discussion.php' ) ) . '">',
			'</a>'
		);

		$this->actions  = '<a href="' . esc_url( admin_url( 'options-discussion.php' ) ) . '">';
		$this->actions .= esc_html__( 'Go to the comment settings page', 'wordpress-seo' );
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
