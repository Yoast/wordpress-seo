<?php

namespace Yoast\WP\SEO\OAuth;

use YoastSEO_Vendor\GuzzleHttp\Psr7\ServerRequest;
use YoastSEO_Vendor\League\OAuth2\Server\Exception\OAuthServerException;
use Yoast\WP\SEO\Models\User;
use Yoast\WP\SEO\Routes\OAuth_Routes;


class Authorize {

	protected $oauth_wrapper;

	public function __construct( OAuthWrapper $oauth_wrapper ) {
		$this->oauth_wrapper = $oauth_wrapper;
	}

	public function handle_authorization_request() {
		$server_request = ServerRequest::fromGlobals();

		try {
			$authorization_server = $this->oauth_wrapper->get_authorization_server();
			$auth_request = $authorization_server->validateAuthorizationRequest(
				$server_request
			);
			$auth_request->setUser(new User( get_current_user_id() ));
			$nonce = wp_create_nonce( 'wp_rest' );
			$query_url = add_query_arg(
				array(
					'response_type' => 'code',
					'client_id' => $auth_request->getClient()->getIdentifier(),
					'redirect_uri' => $auth_request->getRedirectUri(),
					'scope' => implode(',', array_map(function($scope_entity) {return $scope_entity->getIdentifier();}, $auth_request->getScopes())),
					'state' => $auth_request->getState(),
					'code_challenge' => $auth_request->getCodeChallenge(),
					'code_challenge_method' => $auth_request->getCodeChallengeMethod(),
				),
				get_rest_url( null, OAuth_Routes::FULL_AUTHORIZE_ROUTE)
			);
			?>
			<h1>OAuth authorization</h1>
			<p>Do you want to authorize <?php echo esc_html($auth_request->getClient()->getName()); ?> with scopes
				"<?php echo implode(', ', array_map(function($scope_entity) {return $scope_entity->getIdentifier();}, $auth_request->getScopes())) ?>"?</p>
			<form method="POST" action="<?php echo esc_attr( $query_url ); ?>">
				<input type="hidden" name="_wpnonce" value="<?php echo esc_attr($nonce); ?>">
				<input type="hidden" name="accepted" value="yes">
				<input type="submit" value="yes">
			</form>
			<form method="POST" action="<?php echo esc_attr( $query_url ); ?>">
				<input type="hidden" name="_wpnonce" value="<?php echo esc_attr($nonce); ?>">
				<input type="hidden" name="accepted" value="no">
				<input type="submit" value="No">
			</form>
			<?php
		} catch ( OAuthServerException $e ) {
			?>
			<h1>OAuth authorization</h1>
			<p>An error occurred while processing the OAuth request:</p>
			<p><strong>Error</strong>: <?php echo esc_html( $e->getMessage() ); ?></p>
			<?php if ( $e->getHint() !== null ): ?>
				<p><strong>Hint</strong>: <?php echo esc_html( $e->getHint() ); ?></p>
			<?php endif;
		}

	}
}
