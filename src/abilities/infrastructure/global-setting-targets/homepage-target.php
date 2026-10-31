<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets;

use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;

/**
 * The homepage, when it shows the latest posts. A static homepage is a page, whose SEO data is set on that page.
 */
class Homepage_Target extends Abstract_Global_Setting_Target {

	/**
	 * The name of the target.
	 *
	 * @var string
	 */
	public const NAME = 'homepage';

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Constructor.
	 *
	 * @param Current_Page_Helper $current_page_helper The current page helper.
	 */
	public function __construct( Current_Page_Helper $current_page_helper ) {
		$this->current_page_helper = $current_page_helper;
	}

	/**
	 * Returns the name of the target.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return self::NAME;
	}

	/**
	 * Ensures the homepage shows the latest posts.
	 *
	 * Unlike disabled archives, a static homepage is refused rather than reported as disabled: its settings are hidden
	 * on the settings page too, and its live SEO data belongs to the page.
	 *
	 * @return void
	 *
	 * @throws Unavailable_Global_Setting_Target_Exception When the homepage is a static page.
	 */
	public function ensure_available(): void {
		$front_page_id = $this->current_page_helper->get_front_page_id();
		if ( $front_page_id === 0 ) {
			return;
		}

		$message = \sprintf(
			/* translators: 1: the ID of a page, 2: the name of an ability. */
			\__( 'The homepage of this site is a static page (ID %1$d), so its SEO data is set on that page with the %2$s ability instead.', 'wordpress-seo' ),
			$front_page_id,
			'yoast-seo/update-post-seo-data',
		);

		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- This is an exception message, not output.
		throw new Unavailable_Global_Setting_Target_Exception( 'yoast_seo_static_homepage', $message );
	}
}
