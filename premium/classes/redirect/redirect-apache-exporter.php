<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * This exporter class will format the redirects for apache files.
 */
class WPSEO_Redirect_Apache_Exporter extends WPSEO_Redirect_File_Exporter {

	/**
	 * %1$s is the old URL
	 * %2$s is the new URL
	 * %3$s is the redirect type
	 *
	 * @var string
	 */
	protected $url_format = 'Redirect %3$s "%1$s" "%2$s"';

	/**
	 * %1$s is the old URL
	 * %2$s is the redirect type
	 *
	 * @var string
	 */
	protected $url_non_target_format = 'Redirect %2$s "%1$s"';

	/**
	 * %1$s is the old URL
	 * %2$s is the new URL
	 * %3$s is the redirect type
	 *
	 * @var string
	 */
	protected $regex_format = 'RedirectMatch %3$s %1$s %2$s';

	/**
	 * %1$s is the old URL
	 * %2$s is the redirect type
	 *
	 * @var string
	 */
	protected $regex_non_target_format = 'RedirectMatch %2$s %1$s';

	/**
	 * Overrides the parent method. This method will in case of URL redirects add slashes to the URL.
	 *
	 * @param WPSEO_Redirect $redirect The redirect data.
	 *
	 * @return string
	 */
	public function format( WPSEO_Redirect $redirect ) {

		// 4xx redirects don't have a target.
		$redirect_type = intval( $redirect->get_type() );
		if ( $redirect_type >= 400 && $redirect_type < 500 ) {
			return $this->format_non_target( $redirect );
		}

		if ( $redirect->get_format() === WPSEO_Redirect::FORMAT_PLAIN ) {
			return sprintf(
				$this->get_format( $redirect->get_format() ),
				$this->add_url_slash( $redirect->get_origin() ),
				$this->add_url_slash( $redirect->get_target() ),
				$redirect->get_type()
			);
		}

		return parent::format( $redirect );
	}

	/**
	 * Build the redirect output for non-target status codes (4xx)
	 *
	 * @param WPSEO_Redirect $redirect The redirect data.
	 *
	 * @return string
	 */
	public function format_non_target( WPSEO_Redirect $redirect ) {

		$target = $redirect->get_origin();
		if ( $redirect->get_format() === WPSEO_Redirect::FORMAT_PLAIN ) {
			$target = $this->add_url_slash( $target );
		}

		return sprintf(
			$this->get_non_target_format( $redirect->get_format() ),
			$target,
			$redirect->get_type()
		);
	}

	/**
	 * Get the format the redirect needs to output
	 *
	 * @param string $redirect_format The format of the redirect.
	 *
	 * @return string
	 */
	public function get_non_target_format( $redirect_format ) {
		if ( $redirect_format === WPSEO_Redirect::FORMAT_PLAIN ) {
			return $this->url_non_target_format;
		}

		return $this->regex_non_target_format;
	}

	/**
	 * Check if first character is a slash, adds a slash if it ain't so
	 *
	 * @param string $url The URL add the slashes to.
	 *
	 * @return string mixed
	 */
	private function add_url_slash( $url ) {
		$scheme = wp_parse_url( $url, PHP_URL_SCHEME );
		if ( substr( $url, 0, 1 ) !== '/' && empty( $scheme ) ) {
			$url = '/' . $url;
		}

		return $url;
	}
}
