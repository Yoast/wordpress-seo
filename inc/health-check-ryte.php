<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Represents the health check for Ryte.
 */
class WPSEO_Health_Check_Ryte extends WPSEO_Health_Check {

	/**
	 * The name of the test.
	 *
	 * @var string
	 */
	protected $test = 'yoast-health-check-ryte';

	/**
	 * Runs the test.
	 */
	public function run() {
		$this->label          = esc_html__( 'Your site cannot be found by search engines', 'wordpress-seo' );
		$this->status         = self::STATUS_RECOMMENDED;
		$this->badge['color'] = 'red';

		$this->description = esc_html__( 'Ryte offers a free indexability check for Yoast SEO users, and it has determined that your site cannot be found by search engines. If this site is live or about to become live, this should be fixed.', 'wordpress-seo' );
		$this->description .= '<br /><br />';
		$this->description .= sprintf(
		/* translators: %1$s resolves to the opening tag of the link to the reading setting page, %2$s resolves to the closing tag of the link, %3$s resolves to the opening bold tag, %4$s resolves to the closing bold tag. */
			esc_html__( 'As a first step, %1$s go to your site\'s Reading Settings %2$s and make sure the option to discourage search engine visibility is %3$snot enabled%4$s, then re-analyze your site indexability.', 'wordpress-seo' ),
			'<a href="' . esc_url( '/wp-admin/options-reading.php' ) . '">',
			'</a>',
			'<b>',
			'</b>' );
		$this->description .= '<br /><br />';
		$this->description .= sprintf(
		/* translators: %1$s resolves to the opening tag of the link to the Yoast knowledge base troubleshooting page, %2$s resolves to the closing tag of the link */
			esc_html__( 'If that did not help, %1$s read more about troubleshooting search engine visibility. %2$s', 'wordpress-seo' ),
			'<a href="' . esc_url( 'https://kb.yoast.com/kb/your-site-isnt-indexable/' ) . '">',
			'</a>' );
	}
}
