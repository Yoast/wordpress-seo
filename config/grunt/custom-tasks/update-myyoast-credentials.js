/*
 * ABOUT MYYOAST SOFTWARE STATEMENTS AND INITIAL ACCESS TOKENS
 * ==========================================================
 *
 * This file owns two kinds of credentials:
 *
 *   1. The `FALLBACK_SOFTWARE_STATEMENT` and `FALLBACK_INITIAL_ACCESS_TOKEN`
 *      constants just below, which ship in this public repo as a
 *      versionless ("v0") fallback for builds that cannot reach MyYoast.
 *
 *   2. The freshly-signed, per-release SS + IAT pair the task fetches at
 *      build time and bakes into `Issuer_Config.php`. After a CI
 *      production release, the rewritten `Issuer_Config.php` is also
 *      committed back to trunk, so per-release values land in this
 *      public repo too.
 *
 * Both kinds of values are committed to the public repository on
 * purpose. Everything below applies equally to both — the only
 * difference between them is the `software_version` claim ("0" for the
 * fallback, e.g. "27.5" for a release).
 *
 * Yes, an initial access token (IAT) is a credential for an otherwise
 * private MyYoast API. We are not pretending otherwise. What makes it
 * safe to publish *these particular IATs* is that they are tied to a
 * collection of policies that MyYoast enforces. This limits what they
 * can be used for, plus the fact that we *need* them to be public for
 * the OAuth flow to work at all.
 *
 *
 * What these IATs can and cannot do
 * ---------------------------------
 *
 * MyYoast scopes each IAT to a single capability: calling the Dynamic
 * Client Registration endpoint, *and only when paired with the matching
 * software statement (SS) that MyYoast itself signed alongside it*. An
 * IAT cannot be used to read user data, write user data, mint access
 * tokens for arbitrary scopes, or authenticate as a user. It cannot
 * register an arbitrary OAuth client either, because the registration
 * request is rejected unless it carries a valid, MyYoast-signed SS.
 *
 * MyYoast only signs software statements for software combinations it
 * wants anyone on the public internet to be able to register. Every SS
 * Yoast SEO ships pins, among other claims:
 *   - software_id ("yoast/wordpress-seo"), software_version
 *   - client_name = "Yoast SEO" + the matching client_uri / tos_uri /
 *     policy_uri / logo_uri (so the user-visible consent screen is locked
 *     to Yoast SEO branding)
 *   - token_endpoint_auth_method = "private_key_jwt" (so any client
 *     registered with this pair must authenticate with a key it owns,
 *     not a shared client_secret)
 *
 * In short: anyone who finds an IAT in the public repo can use it to
 * register exactly the kind of client we already wanted them to be able
 * to register — a Yoast SEO instance running on their own WordPress
 * site. They cannot use it to impersonate Yoast, exfiltrate data, or
 * attack other users.
 *
 *
 * Why these credentials have to be public
 * ---------------------------------------
 *
 * Every WordPress site running Yoast SEO needs to register itself with
 * MyYoast as an OAuth client during normal operation. There are
 * millions of such sites, run by people we will never know in advance.
 * The SS+IAT pair therefore ships inside the plugin artifact on
 * wordpress.org, which is itself a public download. There is no
 * meaningful difference between "in the plugin zip on wordpress.org"
 * and "in this source repo" — both are world-readable.
 *
 * Putting it here, in source, makes the security model auditable. The
 * alternative (some kind of obfuscation or runtime fetch) would only
 * give the appearance of secrecy without the substance.
 *
 * The other alternative would have been to make the registration
 * endpoint fully anonymous — i.e. drop the IAT requirement entirely for
 * this specific class of registrations. We chose not to. Keeping the
 * IAT in place lets MyYoast use a single, standardized DCR endpoint for
 * *every* kind of client (publicly-registerable third-party clients
 * like Yoast SEO, plus first-party and second-party clients that have
 * very different IAT policies or SS claims — different client names,
 * different policy/tos URIs, fewer branding restrictions, etc.). The
 * IAT is what tells MyYoast which "kind" of registration is being
 * performed. Without it we would either have to fork the endpoint or
 * weaken the policy guarantees that protect the first/second-party
 * paths.
 *
 *
 * Fallback vs. per-release
 * ------------------------
 *
 * On real CI releases the build fetches a fresh, per-version SS + IAT
 * pair from MyYoast and rewrites the constants in `Issuer_Config.php`
 * before the artifact is zipped (see the task body below). After a
 * CI production release the rewritten file is committed back to
 * trunk, so trunk's `git blame` shows which release shipped which SS.
 *
 * The `FALLBACK_*` constants below ship instead when the fetch is not
 * possible: PR builds, dev builds, forks, and the (unlikely) case of a
 * MyYoast outage during a release.
 *
 * Staging and development WordPress sites override the SS+IAT entirely
 * at runtime via the `wpseo_myyoast_software_statement` and
 * `wpseo_myyoast_initial_access_token` filters (the Yoast test-helper
 * plugin uses these), so they are not constrained to use either of the
 * baked-in values.
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  *** PLEASE DO NOT FILE A SECURITY REPORT ON THE SOLE GROUNDS   *** │
 * │  *** THAT THESE CREDENTIALS ARE PUBLICLY ACCESSIBLE.            *** │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * That is by design and the rationale above explains why. If, having read
 * that rationale, you still believe something here is wrong, please do file
 * a security report through the project's normal disclosure channel;
 * reports about anything else are always welcome.
 *
 *
 * Rotation
 * --------
 *
 * The fallback v0 SS + IAT below are rotated by running
 * `npx grunt sign-v0-myyoast-credentials` against MyYoast and committing
 * the new pair below. There is no automation for this; it is a manual
 * step performed by someone with MyYoast service-account access.
 *
 * Per-release values rotate automatically: every CI release
 * fetches a fresh pair from MyYoast.
 *
 *
 * Shape of the values
 * -------------------
 *
 * Every software statement is a JWT — three base64url-encoded segments
 * separated by dots. Every initial access token is an opaque bearer
 * token string. Both are validated against `SAFE_CREDENTIAL_PATTERN`
 * (see below) before being spliced into the PHP source, so a malformed
 * or hostile value cannot inject PHP into `Issuer_Config.php` even if
 * MyYoast itself were compromised.
 */
const FALLBACK_SOFTWARE_STATEMENT   = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCIsImtpZCI6IjMwNTI3ZTlhLWZhMWYtNDhkZS05ZjIzLWUyZGE5MzY0NDE3NiJ9.eyJzb2Z0d2FyZV9pZCI6InlvYXN0L3dvcmRwcmVzcy1zZW8iLCJjbGllbnRfbmFtZSI6IllvYXN0IFNFTyIsImxvZ29fdXJpIjoiaHR0cHM6Ly95b2FzdC5jb20vYXBwL3VwbG9hZHMvMjAyNS8xMS9wcmVtaXVtLnN2ZyIsImNsaWVudF91cmkiOiJodHRwczovL3lvYXN0LmNvbS93b3JkcHJlc3MvcGx1Z2lucy9zZW8vIiwidG9zX3VyaSI6Imh0dHBzOi8veW9hc3QuY29tL3Rlcm1zLW9mLXNlcnZpY2UvIiwicG9saWN5X3VyaSI6Imh0dHBzOi8veW9hc3QuY29tL3ByaXZhY3ktcG9saWN5LyIsImNvbnRhY3RzIjpbInN1cHBvcnRAeW9hc3QuY29tIl0sInNvZnR3YXJlX3ZlcnNpb24iOiIwIiwiY2xlYW51cF93aGVuX2luYWN0aXZlIjp0cnVlLCJ0b2tlbl9lbmRwb2ludF9hdXRoX21ldGhvZCI6InByaXZhdGVfa2V5X2p3dCIsImlzcyI6Imh0dHBzOi8vbXkueW9hc3QuY29tIiwiYXVkIjoiaHR0cHM6Ly9teS55b2FzdC5jb20iLCJqdGkiOiI1MzYzMTM2Mi02ZGE1LTQ0YzktYmI0Mi0wNWZhNzlkMmM1ZmUiLCJpYXQiOjE3Nzc4OTYyODB9.bNC5iqTdmgjtVNf6LcWs5rwtIL3NPe_eip116E220P2M-5mvfr05l0nkNkLXw--taLoSMGS5czzKsOLL0mzpBw";
const FALLBACK_INITIAL_ACCESS_TOKEN = "8rRr8F0Srp_4SCTWsTZJ096hUg0E1p_tbqydOnP2Mbm";

const ISSUER_CONFIG_PATH = "src/myyoast-client/infrastructure/oidc/issuer-config.php";

const SS_PATTERN  = /(private const SOFTWARE_STATEMENT = ')([^']*)(';)/;
const IAT_PATTERN = /(private const INITIAL_ACCESS_TOKEN = ')[^']*(';)/;

/*
 * Whitelist of characters allowed inside a baked credential. We rewrite a PHP
 * single-quoted string literal, so any value that escapes those quotes or
 * introduces backslash escape sequences would change the meaning of the file.
 *
 * The characters allowed below cover:
 *   - JWTs (base64url alphabet plus the dot separator, plus optional `=`
 *     padding even though base64url usually omits it)
 *   - opaque bearer tokens MyYoast might return (alphanumerics, dot, dash,
 *     underscore, tilde — RFC 6750 / URL-safe base64 + a few extras)
 *
 * Anything else — including single quotes, backslashes, dollar signs,
 * whitespace, control characters, angle brackets — is rejected. This makes
 * it structurally impossible for a malformed or hostile credential to
 * inject PHP into Issuer_Config.
 */
const SAFE_CREDENTIAL_PATTERN = /^[A-Za-z0-9._\-~=]+$/;

const DEFAULT_ENDPOINT = "https://my.yoast.com/api/oauth/software-statements";
const FETCH_TIMEOUT_MS = 30000;

/*
 * The claims the plugin asks MyYoast to sign into the software statement.
 * MyYoast's signSoftwareStatement endpoint accepts these as the request body
 * and bakes them into the SS JWT. The runtime DCR request from the plugin
 * (Client_Registration::do_register) sends the SS along with the per-install
 * `redirect_uris` and `jwks` — those are NOT in the SS, by design.
 */
const SOFTWARE_STATEMENT_CLAIMS = {
	softwareId: "yoast/wordpress-seo",
	clientName: "Yoast SEO",
	logoUri: "https://yoast.com/app/uploads/2025/11/premium.svg",
	clientUri: "https://yoast.com/wordpress/plugins/seo/",
	tosUri: "https://yoast.com/terms-of-service/",
	policyUri: "https://yoast.com/privacy-policy/",
	contacts: [ "support@yoast.com" ],
	cleanupWhenInactive: true,
	tokenEndpointAuthMethod: "private_key_jwt",
};

const FALLBACK_SOFTWARE_VERSION = "0";

/**
 * Reads `Issuer_Config.php`, extracts the SOFTWARE_STATEMENT JWT, and decodes
 * its `software_version` claim.
 *
 * Used to short-circuit credential fetches when the file is already baked
 * with credentials matching the current build's plugin version. This avoids
 * re-issuing identical SS+IAT pairs when `update-myyoast-credentials` runs
 * twice during a release (once standalone before the version-bump commit,
 * once again as part of `grunt artifact`), and also keeps `git blame` on
 * the committed `Issuer_Config.php` consistent with what ships in the
 * artifact.
 *
 * Returns an empty string when the constant is empty, the JWT is malformed,
 * or the payload lacks a `software_version` claim. The caller treats those
 * cases as "no version present" and proceeds with a normal fetch/fallback.
 *
 * Does NOT verify the JWT signature — this is a build-time hint, not a
 * security check. The signature is verified server-side by MyYoast at DCR
 * time.
 *
 * @param {Object} grunt The Grunt instance, used for `grunt.file.read`.
 *
 * @returns {string} The decoded `software_version` claim, or `""` if it
 *                   cannot be determined.
 */
function readBakedSoftwareVersion( grunt ) {
	const contents = grunt.file.read( ISSUER_CONFIG_PATH );
	const match    = SS_PATTERN.exec( contents );
	if ( ! match ) {
		return "";
	}
	const jwt = match[ 2 ];
	if ( jwt === "" ) {
		return "";
	}

	const segments = jwt.split( "." );
	if ( segments.length !== 3 ) {
		return "";
	}

	try {
		const payload = JSON.parse( Buffer.from( segments[ 1 ], "base64url" ).toString( "utf8" ) );
		if ( typeof payload.software_version !== "string" ) {
			return "";
		}
		return payload.software_version;
	} catch ( error ) {
		return "";
	}
}

/**
 * Attempts to fetch a fresh software statement + initial access token bound
 * to the current plugin version from MyYoast's signSoftwareStatement endpoint.
 *
 * Endpoint contract: POST /api/oauth/software-statements (admin-only,
 * Bearer-authenticated). Request body is `SignSoftwareStatementDto` and the
 * 200 response is `{ softwareStatement, kid, initialAccessToken }`.
 *
 * @param {string} endpoint The API endpoint URL.
 * @param {string} token    The service-account bearer token.
 * @param {string} version  The plugin version, sent as the `softwareVersion`
 *                          claim request.
 *
 * @returns {Promise<{ softwareStatement: string, initialAccessToken: string }>}
 *          The fetched pair on success.
 *
 * @throws {Error} If the request fails, returns non-200, or returns a
 *                 malformed response. The caller is expected to catch and
 *                 fall back.
 */
async function fetchCredentials( endpoint, token, version ) {
	const controller = new AbortController();
	const timeout    = setTimeout( () => controller.abort(), FETCH_TIMEOUT_MS );

	try {
		const response = await fetch(
			endpoint,
			{
				method: "POST",
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(
					{
						...SOFTWARE_STATEMENT_CLAIMS,
						softwareVersion: version,
					}
				),
				signal: controller.signal,
			}
		);

		if ( ! response.ok ) {
			throw new Error( "MyYoast credential endpoint returned HTTP " + response.status );
		}

		const body               = await response.json();
		const softwareStatement  = body.softwareStatement;
		const initialAccessToken = body.initialAccessToken;

		if ( typeof softwareStatement !== "string" || softwareStatement === "" ) {
			throw new Error( "MyYoast response missing or empty `softwareStatement`" );
		}
		if ( typeof initialAccessToken !== "string" || initialAccessToken === "" ) {
			throw new Error( "MyYoast response missing or empty `initialAccessToken`" );
		}

		return { softwareStatement, initialAccessToken };
	} finally {
		clearTimeout( timeout );
	}
}

module.exports = function( grunt ) {
	/**
	 * Asserts that a credential value is composed only of characters that are
	 * safe to splice into a PHP single-quoted string literal.
	 *
	 * A passing value cannot terminate the string early (no `'`), introduce
	 * escape sequences (no `\`), interpolate variables (no `$` — though PHP
	 * single-quoted strings don't interpolate, we forbid it for defense in
	 * depth), introduce newlines (no `\r` / `\n`), or open PHP tags (no `<`).
	 *
	 * @param {string} label The human-readable name of the value being checked,
	 *                       used in the error message.
	 * @param {string} value The credential value to validate.
	 *
	 * @returns {void}
	 *
	 * @throws Will call `grunt.fail.fatal` and abort the build if the value
	 *         contains anything outside the safe-credential alphabet.
	 */
	function assertSafeCredential( label, value ) {
		if ( typeof value !== "string" || value === "" ) {
			grunt.fail.fatal(
				"Refusing to bake " + label + ": value is empty or not a string."
			);
		}
		if ( ! SAFE_CREDENTIAL_PATTERN.test( value ) ) {
			grunt.fail.fatal(
				"Refusing to bake " + label + ": value contains characters " +
				"that are not safe to splice into a PHP single-quoted string. " +
				"Allowed alphabet: A-Z a-z 0-9 . _ - ~ =. " +
				"This guard exists so a malformed or hostile credential cannot " +
				"inject PHP into Issuer_Config."
			);
		}
	}

	/**
	 * Rewrites the SOFTWARE_STATEMENT and INITIAL_ACCESS_TOKEN constants in
	 * `Issuer_Config` with the supplied values.
	 *
	 * Validates each value against `SAFE_CREDENTIAL_PATTERN` first; aborts the
	 * build on any value that could change the meaning of the rewritten file.
	 * Uses a function replacement (not a string replacement) so that `$` in a
	 * credential value cannot be interpreted as a regex backreference token.
	 *
	 * @param {string} softwareStatement  The software statement JWT.
	 * @param {string} initialAccessToken The initial access token.
	 *
	 * @returns {void}
	 */
	function bakeInto( softwareStatement, initialAccessToken ) {
		assertSafeCredential( "software statement", softwareStatement );
		assertSafeCredential( "initial access token", initialAccessToken );

		const original = grunt.file.read( ISSUER_CONFIG_PATH );

		if ( ! SS_PATTERN.test( original ) ) {
			grunt.fail.fatal(
				"Could not locate the SOFTWARE_STATEMENT constant in " + ISSUER_CONFIG_PATH +
				". Has its declaration shape changed?"
			);
		}
		if ( ! IAT_PATTERN.test( original ) ) {
			grunt.fail.fatal(
				"Could not locate the INITIAL_ACCESS_TOKEN constant in " + ISSUER_CONFIG_PATH +
				". Has its declaration shape changed?"
			);
		}

		const updated = original
			.replace( SS_PATTERN,  ( _match, prefix, _oldValue, suffix ) => prefix + softwareStatement + suffix )
			.replace( IAT_PATTERN, ( _match, prefix, suffix ) => prefix + initialAccessToken + suffix );

		grunt.file.write( ISSUER_CONFIG_PATH, updated );
	}

	grunt.registerTask(
		"update-myyoast-credentials",
		"Bakes a fresh MyYoast software statement and initial access token into Issuer_Config, with a public-by-design fallback when the fetch is not possible. Skips when the baked SS already matches the current plugin version, unless --force-myyoast-credentials is passed.",
		async function() {
			const done = this.async();

			const token    = process.env.MYYOAST_SERVICE_ACCOUNT_TOKEN || "";
			const endpoint = process.env.MYYOAST_CREDENTIAL_ENDPOINT || DEFAULT_ENDPOINT;
			const version  = grunt.config.data.pluginVersion;
			const force    = grunt.option( "force-myyoast-credentials" ) === true;

			const bakedVersion = readBakedSoftwareVersion( grunt );
			if ( ! force && bakedVersion !== "" && version && bakedVersion === version ) {
				grunt.log.ok(
					"Issuer_Config already carries credentials for software_version=" + bakedVersion +
					"; skipping fetch. Pass --force-myyoast-credentials to override."
				);
				return done();
			}

			if ( token === "" ) {
				grunt.log.warn(
					"MYYOAST_SERVICE_ACCOUNT_TOKEN is not set; baking the public v0 fallback credentials. " +
					"This is expected for PR builds, dev builds, and forks."
				);
				bakeInto( FALLBACK_SOFTWARE_STATEMENT, FALLBACK_INITIAL_ACCESS_TOKEN );
				return done();
			}

			if ( ! version ) {
				grunt.fail.fatal(
					"MYYOAST_SERVICE_ACCOUNT_TOKEN is set but pluginVersion is not configured " +
					"in Grunt (`grunt.config.data.pluginVersion`). Run a Grunt alias that " +
					"populates package.json's yoast.pluginVersion first (e.g. `grunt set-version`), " +
					"or unset MYYOAST_SERVICE_ACCOUNT_TOKEN to use the v0 fallback."
				);
				return done();
			}

			try {
				const { softwareStatement, initialAccessToken } = await fetchCredentials(
					endpoint,
					token,
					version
				);
				grunt.log.ok(
					"Fetched fresh MyYoast credentials for software_version=" + version +
					" from " + endpoint + "; baking into Issuer_Config."
				);
				bakeInto( softwareStatement, initialAccessToken );
			} catch ( error ) {
				grunt.log.warn(
					"MyYoast credential fetch from " + endpoint + " failed (" + error.message +
					"); baking the public v0 fallback credentials instead."
				);
				bakeInto( FALLBACK_SOFTWARE_STATEMENT, FALLBACK_INITIAL_ACCESS_TOKEN );
			}

			return done();
		}
	);

	grunt.registerTask(
		"sign-v0-myyoast-credentials",
		"Asks MyYoast to sign a versionless (v0) software statement + initial access token, then prints them so they can be pasted into the FALLBACK_* constants in this file. Does NOT modify Issuer_Config — this is the manual fallback-rotation flow.",
		async function() {
			const done = this.async();

			const token    = process.env.MYYOAST_SERVICE_ACCOUNT_TOKEN || "";
			const endpoint = process.env.MYYOAST_CREDENTIAL_ENDPOINT || DEFAULT_ENDPOINT;

			if ( token === "" ) {
				grunt.fail.fatal(
					"MYYOAST_SERVICE_ACCOUNT_TOKEN must be set to sign a v0 fallback. " +
					"Obtain a service-account bearer token for the target MyYoast environment first."
				);
				return done();
			}

			try {
				const { softwareStatement, initialAccessToken } = await fetchCredentials(
					endpoint,
					token,
					FALLBACK_SOFTWARE_VERSION
				);
				assertSafeCredential( "software statement", softwareStatement );
				assertSafeCredential( "initial access token", initialAccessToken );

				grunt.log.ok(
					"Signed a v0 fallback pair against " + endpoint + ". " +
					"Paste the values below into FALLBACK_SOFTWARE_STATEMENT and " +
					"FALLBACK_INITIAL_ACCESS_TOKEN at the top of this file, then commit."
				);
				grunt.log.writeln( "" );
				grunt.log.writeln( "const FALLBACK_SOFTWARE_STATEMENT   = " + JSON.stringify( softwareStatement ) + ";" );
				grunt.log.writeln( "const FALLBACK_INITIAL_ACCESS_TOKEN = " + JSON.stringify( initialAccessToken ) + ";" );
			} catch ( error ) {
				grunt.fail.fatal(
					"Failed to sign a v0 fallback (" + error.message + ")."
				);
			}

			return done();
		}
	);
};
