<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Apache_Redirect_File
 */
class WPSEO_Redirect_File_Apache extends WPSEO_Redirect_File {

	/**
	 * %1$s is the redirect type
	 * %2$s is the old url
	 * %3$s is the new url
	 *
	 * @var string
	 */
	protected $url_format   = 'Redirect "%1$s" "%2$s" %3$s';

	/**
	 * %1$s is the redirect type
	 * %2$s is the regex
	 * %3$s is the new url
	 *
	 * @var string
	 */
	protected $regex_format = 'RedirectMatch %1$s %2$s %3$s';

	/**
	 * Overrides the parent method. This method will in case of url redirects add slashes to the url.
	 *
	 * @param WPSEO_Redirect $redirect The redirect data.
	 *
	 * @return string
	 */
	public function format( WPSEO_Redirect $redirect ) {
		if ( $redirect->get_format() === WPSEO_Redirect::FORMAT_PLAIN ) {
			$redirect = new WPSEO_Redirect(
				$this->add_url_slash( $redirect->get_origin() ),
				$this->add_url_slash( $redirect->get_target() ),
				$redirect->get_type(),
				$redirect->get_format()
			);
		}

		return parent::format( $redirect );
	}

	/**
	 * Check if first character is a slash, adds a slash if it ain't so
	 *
	 * @param string $url The url add the slashes to.
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
