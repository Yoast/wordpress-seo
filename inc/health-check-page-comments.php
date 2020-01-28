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
			$this->label          = esc_html__( 'Paging comments is properly disabled', 'wordpress-seo' );
			$this->status         = self::STATUS_GOOD;
			$this->badge['color'] = 'blue';
			$this->description    = esc_html__( 'Paging comments is disabled. As this is not needed in 999 out of 1000 cases, we recommend to keep it disabled.', 'wordpress-seo' );
			$this->add_yoast_signature();
			return;
		}

		$this->label          = esc_html__( 'Paging comments is enabled', 'wordpress-seo' );
		$this->status         = self::STATUS_RECOMMENDED;
		$this->badge['color'] = 'red';
		$this->description    = esc_html__(
			'Paging comments is enabled. As this is not needed in 999 out of 1000 cases, we recommend you disable it.
								To fix this, uncheck the box in front of "Break comments into pages..." on the Discussion Settings page.',
			'wordpress-seo'
		);
		$this->actions        = sprintf(
			/* translators: 1: Opening tag of the link to the discussion settings page, 2: Link closing tag. */
			esc_html__( '%1$sGo to the Discussion Settings page%2$s', 'wordpress-seo' ),
			'<a href="' . esc_url( admin_url( 'options-discussion.php' ) ) . '">',
			'</a>'
		);
		$this->add_yoast_signature();
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
