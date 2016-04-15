<?php
/**
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
	protected $url_format   = 'Redirect %3$s "%1$s" "%2$s"';

	/**
	 * %1$s is the old URL
	 * %2$s is the new URL
	 * %3$s is the redirect type
	 *
	 * @var string
	 */
	protected $regex_format = 'RedirectMatch %3$s %1$s %2$s';

	/**
	 * Overrides the parent method. This method will in case of URL redirects add slashes to the URL.
	 *
	 * @param WPSEO_Redirect $redirect The redirect data.
	 *
	 * @return string
	 */
	public function format( WPSEO_Redirect $redirect ) {
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
	 * Check if first character is a slash, adds a slash if it ain't so
	 *
	 * @param string $url The URL add the slashes to.
	 *
	 * @return string mixed
	 */
	private function add_url_slash( $url ) {
		$scheme = parse_url( $url, PHP_URL_SCHEME );
		if ( $url[0] !== '/' && empty( $scheme ) ) {
			$url = '/' . $url;
		}

		return $url;
	}
}
