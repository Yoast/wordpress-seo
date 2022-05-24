<?php

namespace Yoast\WP\SEO\OAuth\Presenters;

use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Class Authorize_Presenter.
 */
class Authorize_Presenter extends Abstract_Presenter {

	/**
	 * The name of the client of the Authorization request.
	 *
	 * @var string
	 */
	protected $client_name;

	/**
	 * The scopes of the Authorization request.
	 *
	 * @var string[]
	 */
	protected $scopes;

	/**
	 * The URL to send the POST request to after accepting/not accepting the authorization request.
	 *
	 * @var string
	 */
	protected $query_url;

	/**
	 * Construct an Authorize_Presenter.
	 *
	 * @param string   $client_name The name of the client for the authorization request.
	 * @param string[] $scopes An array of scopes in the authorization request.
	 * @param string   $query_url The query URL to return to when accepting/not accepting the authorization request.
	 */
	public function __construct( $client_name, $scopes, $query_url ) {
		$this->client_name = $client_name;
		$this->scopes      = $scopes;
		$this->query_url   = $query_url;
	}

	/**
	 * Display the authorization page.
	 *
	 * @return void
	 */
	public function present() {
		$nonce = wp_create_nonce( 'wp_rest' );
		?>
			<h1>OAuth authorization</h1>
			<p>Do you want to authorize <?php echo esc_html( $this->client_name ); ?> with scopes
				"<?php echo esc_html( implode( ', ', $this->scopes ) ); ?>"?</p>
			<form method="POST" action="<?php echo esc_attr( $this->query_url ); ?>">
				<input type="hidden" name="_wpnonce" value="<?php echo esc_attr( $nonce ); ?>">
				<input type="hidden" name="accepted" value="yes">
				<input type="submit" value="yes">
			</form>
			<form method="POST" action="<?php echo esc_attr( $this->query_url ); ?>">
				<input type="hidden" name="_wpnonce" value="<?php echo esc_attr( $nonce ); ?>">
				<input type="hidden" name="accepted" value="no">
				<input type="submit" value="No">
			</form>
		<?php
	}
}
