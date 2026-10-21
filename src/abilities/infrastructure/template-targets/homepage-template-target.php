<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets;

use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Template_Target_Exception;

/**
 * The homepage, when it shows the latest posts. A static homepage is a page, whose SEO data is set on that page.
 */
class Homepage_Template_Target extends Abstract_Template_Target {

	/**
	 * The name of the target.
	 *
	 * @var string
	 */
	public const NAME = 'homepage';

	/**
	 * Returns the name of the target.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return self::NAME;
	}

	/**
	 * Returns whether the homepage shows the latest posts.
	 *
	 * @return bool Whether the target is enabled.
	 */
	public function is_enabled(): bool {
		return $this->get_static_front_page_id() === 0;
	}

	/**
	 * Returns the URL of the homepage.
	 *
	 * @return string The URL.
	 */
	public function get_url(): string {
		return \home_url( '/' );
	}

	/**
	 * Ensures the homepage shows the latest posts.
	 *
	 * @return void
	 *
	 * @throws Unavailable_Template_Target_Exception When the homepage is a static page.
	 */
	public function ensure_available(): void {
		$front_page_id = $this->get_static_front_page_id();
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
		throw new Unavailable_Template_Target_Exception( 'yoast_seo_static_homepage', $message );
	}

	/**
	 * Returns the ID of the static front page.
	 *
	 * @return int The ID of the static front page, or 0 when the homepage shows the latest posts.
	 */
	private function get_static_front_page_id(): int {
		if ( \get_option( 'show_on_front' ) !== 'page' ) {
			return 0;
		}

		return (int) \get_option( 'page_on_front' );
	}
}
