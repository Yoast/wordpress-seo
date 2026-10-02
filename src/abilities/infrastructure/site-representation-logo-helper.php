<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\Helpers\Image_Helper;

/**
 * Resolves the site representation logos to their attachments.
 */
class Site_Representation_Logo_Helper {

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	private $image_helper;

	/**
	 * Constructor.
	 *
	 * @param Image_Helper $image_helper The image helper.
	 */
	public function __construct( Image_Helper $image_helper ) {
		$this->image_helper = $image_helper;
	}

	/**
	 * Returns the attachment ID of a logo URL, or 0 when the logo is cleared or not in the media library.
	 *
	 * The schema reads the logo by its ID while the first-time configuration shows it by its URL, so deriving
	 * the ID keeps both pointing to the same image.
	 *
	 * @param string $url The logo URL.
	 *
	 * @return int The attachment ID.
	 */
	public function get_logo_id( string $url ): int {
		if ( $url === '' ) {
			return 0;
		}

		// The ID can come back as a string when it is read from the indexables.
		return (int) $this->image_helper->get_attachment_by_url( $url );
	}
}
