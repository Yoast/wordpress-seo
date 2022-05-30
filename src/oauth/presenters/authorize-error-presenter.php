<?php

namespace Yoast\WP\SEO\OAuth\Presenters;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;
use YoastSEO_Vendor\League\OAuth2\Server\Exception\OAuthServerException;

/**
 * Class Authorize_Error_Presenter.
 */
class Authorize_Error_Presenter extends Abstract_Presenter {

	/**
	 * The Exception to present on the Authorization page.
	 *
	 * @var OAuthServerException
	 */
	protected $error;

	/**
	 * Construct an Authorize_Error_Presenter.
	 *
	 * @param OAuthServerException $error The Exception to present on the page.
	 */
	public function __construct( $error ) {
		$this->error = $error;
	}

	/**
	 * Present the Exception on the Authorization page.
	 *
	 * @return void
	 */
	public function present() {
		?>
		<h1>OAuth authorization</h1>
		<p>An error occurred while processing the OAuth request:</p>
		<p><strong>Error</strong>: <?php echo esc_html( $this->error->getMessage() ); ?></p>
		<?php if ( $this->error->getHint() !== null ) : ?>
			<p><strong>Hint</strong>: <?php echo esc_html( $this->error->getHint() ); ?></p>
			<?php
		endif;
	}
}
