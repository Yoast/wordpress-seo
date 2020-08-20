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
			$this->label          = esc_html__( 'Comments are displayed on a single page', 'wordpress-seo' );
			$this->status         = self::STATUS_GOOD;
			$this->badge['color'] = 'blue';
			$this->description    = esc_html__( 'Comments on your posts are displayed on a single page. This is just like we\'d suggest it. You\'re doing well!', 'wordpress-seo' );
			return;
		}

		$this->label          = esc_html__( 'Comments break into multiple pages', 'wordpress-seo' );
		$this->status         = self::STATUS_RECOMMENDED;
		$this->badge['color'] = 'red';
		$this->description    = esc_html__( 'Comments on your posts break into multiple pages. As this is not needed in 999 out of 1000 cases, we recommend you disable it. To fix this, uncheck "Break comments into pages..." on the Discussion Settings page.', 'wordpress-seo' );
		$this->actions        = sprintf(
			/* translators: 1: Opening tag of the link to the discussion settings page, 2: Link closing tag. */
			esc_html__( '%1$sGo to the Discussion Settings page%2$s', 'wordpress-seo' ),
			'<a href="' . esc_url( admin_url( 'options-discussion.php' ) ) . '">',
			'</a>'
		);
	}

	/**
	 * Are page comments enabled.
	 *
	 * @return bool True when page comments are enabled.
	 */
	protected function has_page_comments() {
		return get_option( 'page_comments' ) === '1';
	}
}
