<?php

namespace Yoast\WP\SEO\Presenters;

use Yoast\WP\SEO\Helpers\Robots_Txt_Helper;

/**
 * Presenter class for the robots.txt file helper.
 */
class Robots_Txt_Presenter extends Abstract_Presenter {

	const YOAST_OUTPUT_BEFORE_COMMENT = "# START YOAST INTERNAL SEARCH BLOCK\n# Added by Yoast SEO (see yoa.st/robots-txt-additions for more info).\n# ---------------------------\n";

	const YOAST_OUTPUT_AFTER_COMMENT = "# ---------------------------\n# END YOAST INTERNAL SEARCH BLOCK";

	/**
	 * Text to be outputted for the allow directive.
	 *
	 * @var string
	 */
	const ALLOW_DIRECTIVE = 'Allow';

	/**
	 * Text to be outputted for the disallow directive.
	 *
	 * @var string
	 */
	const DISALLOW_DIRECTIVE = 'Disallow';

	/**
	 * Text to be outputted for the user-agent rule.
	 *
	 * @var string
	 */
	const USER_AGENT_FIELD = 'User-agent';

	/**
	 * Text to be outputted for the sitemap rule.
	 *
	 * @var string
	 */
	const SITEMAP_FIELD = 'Sitemap';

	/**
	 * Holds the Robots_Txt_Helper.
	 *
	 * @var Robots_Txt_Helper
	 */
	protected $robots_txt_helper;

	/**
	 * Constructor.
	 *
	 * @param Robots_Txt_Helper $robots_txt_helper The robots txt helper.
	 */
	public function __construct( Robots_Txt_Helper $robots_txt_helper ) {
		$this->robots_txt_helper = $robots_txt_helper;
	}

	/**
	 * Generate content to be placed in a robots.txt file.
	 *
	 * @return string Content to be placed in a robots.txt file.
	 */
	public function present() {
		$registered_disallow_directives = $this->robots_txt_helper->get_disallow_directives();
		$registered_allow_directives    = $this->robots_txt_helper->get_allow_directives();
		$registered_sitemaps            = $this->robots_txt_helper->get_sitemap_rules();

		$user_agents = \array_unique( \array_merge( \array_keys( $registered_disallow_directives ), \array_keys( $registered_allow_directives ) ) );
		$output_str  = self::YOAST_OUTPUT_BEFORE_COMMENT;
		if ( count( $user_agents ) > 0 ) {
			foreach ( $user_agents as $user_agent ) {
				$output_str .= self::USER_AGENT_FIELD . ': ' . $user_agent . "\n";
				if ( \array_key_exists( $user_agent, $registered_disallow_directives ) ) {
					foreach ( $registered_disallow_directives[ $user_agent ] as $disallow_directive ) {
						$output_str .= self::DISALLOW_DIRECTIVE . ': ' . $disallow_directive . "\n";
					}
				}
				if ( \array_key_exists( $user_agent, $registered_allow_directives ) ) {
					foreach ( $registered_allow_directives[ $user_agent ] as $allow_directive ) {
						$output_str .= self::ALLOW_DIRECTIVE . ': ' . $allow_directive . "\n";
					}
				}
				$output_str .= "\n";
			}
		}
		else {
			$output_str .= "User-agent: *\nDisallow:\n\n";
		}

		foreach ( $registered_sitemaps as $sitemap ) {
			$output_str .= self::SITEMAP_FIELD . ': ' . $sitemap . "\n";
		}
		return $output_str . self::YOAST_OUTPUT_AFTER_COMMENT;
	}
}
