<?php

use GuzzleHttp\Psr7\ServerRequest;
use League\OAuth2\Server\Exception\OAuthServerException;
use Yoast\WP\SEO\OAuth\OAuthWrapper;
use Yoast\WP\SEO\OAuth\UserEntity;
use Yoast\WP\SEO\Routes\OAuth_Routes;

$oauth_wrapper = new OAuthWrapper();

$server_request = ServerRequest::fromGlobals();

try {
	$auth_request = $oauth_wrapper->server->validateAuthorizationRequest(
		$server_request
	);
	$auth_request->setUser(new UserEntity( get_current_user_id() ));
	/*
	// TODO: Create a page where user can select approve or disapprove.
	$auth_request->setAuthorizationApproved(true);
	$response = $oauth_wrapper->server->completeAuthorizationRequest($auth_request, new Response());
	wp_redirect("https://localhost:8000");*/
	$nonce = wp_create_nonce( 'wp_rest' );
	$query_url = add_query_arg(
		array(
			'response_type' => 'code',
			'client_id' => $auth_request->getClient()->getIdentifier(),
			'redirect_uri' => $auth_request->getRedirectUri(),
			'scope' => implode(',', array_map(function($scope_entity) {return $scope_entity->getIdentifier();}, $auth_request->getScopes())),
			'state' => $auth_request->getState(),
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
	print_r( $e );
}
