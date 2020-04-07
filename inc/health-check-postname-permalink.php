<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Represents the health check for the postname in the permalink.
 */
class WPSEO_Health_Check_Postname_Permalink extends WPSEO_Health_Check {

	/**
	 * The name of the test.
	 *
	 * @var string
	 */
	protected $test = 'yoast-health-check-postname-permalink';

	/**
	 * Runs the test.
	 */
	public function run() {
		if ( $this->has_postname_in_permalink() ) {
			$this->label          = esc_html__( 'Your permalink structure includes the post name', 'wordpress-seo' );
			$this->status         = self::STATUS_GOOD;
			$this->badge['color'] = 'blue';
			$this->description    = esc_html__( 'You do have your postname in the URL of your posts and pages.', 'wordpress-seo' );

			return;
		}

		$this->label          = esc_html__( 'You do not have your postname in the URL of your posts and pages', 'wordpress-seo' );
		$this->status         = self::STATUS_RECOMMENDED;
		$this->badge['color'] = 'red';

		$this->description = sprintf(
			/* translators: %s expands to '/%postname%/' */
			__( 'It\'s highly recommended to have your postname in the URL of your posts and pages. Consider setting your permalink structure to %s.', 'wordpress-seo' ),
			'<strong>/%postname%/</strong>'
		);

		$this->actions = sprintf(
			/* translators: %1$s is a link start tag to the permalink settings page, %2$s is the link closing tag. */
			__( 'You can fix this on the %1$sPermalink settings page%2$s.', 'wordpress-seo' ),
			'<a href="' . admin_url( 'options-permalink.php' ) . '">',
			'</a>'
		);
	}

	/**
	 * Check if the permalink uses %postname%.
	 *
	 * @return bool
	 */
	private function has_postname_in_permalink() {
		return ( strpos( get_option( 'permalink_structure' ), '%postname%' ) !== false );
	}
}
