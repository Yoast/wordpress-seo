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

		$onpage_option = new WPSEO_OnPage_Option();
		
		// If ryte is enabled
		if( $onpage_option->is_enabled() ) {

			switch ($onpage_option->get_status()) {
				case WPSEO_OnPage_Option::IS_NOT_INDEXABLE:
					// If development mode is on or the blog is not public, don't show this response.
					if (WPSEO_Utils::is_development_mode() || ('0' === get_option('blog_public'))) {
						break;
					}
					$this->is_not_indexable_response();
					break;
				case WPSEO_OnPage_Option::CANNOT_FETCH:
				case WPSEO_OnPage_Option::NOT_FETCHED:
					$this->unknown_indexability_response();
					break;
				case WPSEO_OnPage_Option::IS_INDEXABLE:
					$this->is_indexable_response();
					break;
				default:
					break;
			}

			$this->badge['color'] = 'red';
			$this->add_yoast_label();
		}
	}

	/**
	 * Adds the content for the "Cannot be indexed" response.
	 */
	protected function is_not_indexable_response() {
		$this->label = esc_html__('Your site cannot be found by search engines', 'wordpress-seo');
		$this->status = self::STATUS_CRITICAL;

		$this->description = esc_html__('Ryte offers a free indexability check for Yoast SEO users, and it has determined that your site cannot be found by search engines. If this site is live or about to become live, this should be fixed.', 'wordpress-seo');
		$this->description .= sprintf(
		/* translators: %1$s: opening tag of the link to the reading setting page, %2$s:closing tag of the link, %3$s: opening bold tag, %4$s: closing bold tag, %5$s: two line breaks */
			esc_html__('%5$s As a first step, %1$s go to your site\'s Reading Settings %2$s and make sure the option to discourage search engine visibility is %3$snot enabled%4$s, then re-analyze your site indexability. %5$s', 'wordpress-seo'),
			'<a href="' . esc_url('/wp-admin/options-reading.php') . '">',
			'</a>',
			'<b>',
			'</b>',
			'<br /><br />');
		$this->description .= sprintf(
		/* translators: %1$s: opening tag of the link to the Yoast knowledge base troubleshooting page, %2$s: closing tag of the link */
			esc_html__('If that did not help, %1$s read more about troubleshooting search engine visibility. %2$s', 'wordpress-seo'),
			'<a href="' . esc_url('https://kb.yoast.com/kb/your-site-isnt-indexable/') . ' "target="_blank">',
			'</a><br />');

		$this->add_analyze_site_button();
	}

	/**
	 * Adds the content for the "Cannot tell if it can be indexed" response.
	 */
	protected function unknown_indexability_response() {
		$this->label = esc_html__('Ryte cannot determine whether your site can be found by search engines', 'wordpress-seo');
		$this->status = self::STATUS_RECOMMENDED;

		$this->description = esc_html__('Ryte offers a free indexability check for Yoast SEO users, and right now it has trouble determining whether search engines can find your site. 
				 This could have several (legitimate) reasons, and is not a problem in itself, but if this is a live site, it is recommended that you figure out why the Ryte check failed.');

		$this->actions = sprintf(
		/* translators: %1$s: opening tag of the link to the Yoast knowledge base indexability check doesn't work page, %2$s: closing tag of the link */
			esc_html__('%1$s Read more about troubleshooting Ryte\'s search engine visibility %2$s' ),
			'<a href="' . esc_url('https://kb.yoast.com/kb/indexability-check-doesnt-work/') . '"target="_blank">',
			'</a><br /><br/>' );
		$this->add_analyze_site_button();
	}

	/**
	 * Adds the content for the "Can indexed" response.
	 */
	protected function is_indexable_response() {
		$this->label = esc_html__('Your site can be found by search engines', 'wordpress-seo');
		$this->status = self::STATUS_GOOD;

		$this->description = esc_html('Ryte offers a free indexability check for Yoast SEO users, and it shows that your site can be found by search engines.');
	}

	/**
	 * Adds the "Re-analyze site indexability" button to the actions.
	 */
	protected function add_analyze_site_button() {
		$this->actions .= sprintf(
		/* translators: %1$s: opening tag of the link to the Yoast Ryte website, %2$s: closing tag of the link */
			esc_html__('%1$s Re-analyze site indexability %2$s', 'wordpress-seo'),
			'<a class="landing-page button" href= "' . esc_url('https://yoa.st/rytelp') . '" target="_blank">',
			'</a>');
	}

	/**
	 * Adds a text to the bottom of the Site Health check to indicate it is a Yoast SEO Site Health Check.
	 */
	protected function add_yoast_label() {
		$this->actions .= sprintf(
		/* translators: %1$s: start of the paragraph, beginning with the Yoast icon, %2$s: opening tag of the small italic text, %3$s: closing tag of the small italic text and the paragraph.  */
			esc_html__('%1$s %2$s This issue was reported by the Yoast SEO plugin %3$s', 'wordpress-seo'),
			'<p><br /><img src="http://one.wordpress.test/wp-content/plugins/wordpress-seo/images/Yoast_Icon_RGB.png" height="20" width="20" align="left"> &nbsp',
			'<small><i>',
			'</i></small></p>'
		);
	}

}
