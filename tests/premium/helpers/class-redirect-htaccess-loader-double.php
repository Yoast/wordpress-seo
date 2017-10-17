<?php
/**
 * @package WPSEO\Tests\Premium\Helpers
 */

/**
 * Test double for testing the result of the match_redirects function.
 */
class WPSEO_Redirect_HTAccess_Loader_Double extends WPSEO_Redirect_HTAccess_Loader {

	/**
	 * Matches the string (containing redirects) for the given regex.
	 *
	 * @param string $regex The regular expression to match redirects.
	 *
	 * @return mixed;
	 */
	public function match_with_given_regex( $regex ) {
		return $this->match_redirects( $regex );
	}

}
