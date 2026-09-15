# Yoast SEO — security review focus

`composer check-branch-cs` (yoastcs = WPCS + WordPressVIPMinimum, **errors only**) already gates
many classes deterministically in CI. Don't re-derive those — just confirm none was silenced with
`phpcs:ignore`. Spend review budget on what CS is blind to: authorization, SSRF, crypto/secrets,
and the OAuth token code.

## Already gated by CS as errors (block the branch check) — defer, don't re-flag
- Unescaped output — `WordPress.Security.EscapeOutput`; wrong-context escaper —
  `WordPressVIPMinimum.Security.ProperEscapingFunction`.
- Unsanitized/unvalidated superglobal input — `WordPress.Security.ValidatedSanitizedInput`
  (`$_GET/$_POST/$_REQUEST/…` need `wp_unslash()` + sanitize).
- Unprepared SQL / placeholder misuse — `WordPress.DB.PreparedSQL[Placeholders]` (require
  `$wpdb->prepare()` with `%d/%s/%i`).
- `eval()`, `create_function()`, `extract()` — hard errors.
- Also flagged: missing nonce verification on superglobal processing
  (`WordPress.Security.NonceVerification`), unsafe redirect (`SafeRedirect`), unknown capability
  strings (`WordPress.WP.Capabilities`; allow-listed: `wpseo_manage_options`,
  `wpseo_manage_network_options`).
Only re-raise these if a `phpcs:ignore` / `// @codingStandardsIgnore` is suppressing them.

## CS only WARNS (an errors-only check passes) — treat misuse as a finding
- `unserialize()`/`serialize()` object injection — prefer `json_*`; never on untrusted input.
- Direct `$wpdb` calls — fine if prepared; prefer the ORM. `curl`/remote `file_get_contents`
  instead of `wp_remote_*`; `@` error suppression.

## CS is BLIND here — primary focus
**Access control (high → critical).** No sniff checks that a capability check *exists* or is the
*right* one. Flag any state change or non-public read without `current_user_can(<cap>)`. Caps:
`wpseo_manage_options` (settings), `edit_posts`/`edit_pages`/`edit_others_posts`/`publish_posts`
(content), `activate_plugins` (importers). `is_user_logged_in()` is not authorization. Check
object ownership/scoping (IDOR), not just the capability.

**REST/AJAX surfaces.** Every `src/routes/**` and `src/**/user-interface/**` route (ns `yoast/v1`)
needs a real `permission_callback` calling `current_user_can()`. `__return_true` = public;
acceptable only if the handler itself authenticates — e.g. the AI callback verifies
`code_challenge === hash('sha256', stored_verifier)` before storing tokens
(`src/ai-authorization/user-interface/callback-route.php`). REST is CSRF-safe via the core
`wp_rest` cookie nonce — don't double-flag REST.

**OAuth / tokens / crypto — crown jewels, raise severity.** In `src/ai-authorization/**` and
`src/myyoast-client/**`:
- Never log/echo/URL-embed or put in exceptions any token, JWT, code verifier, client secret, or
  private key; mark such params `#[SensitiveParameter]`.
- Tokens/keys at rest go through `…\MyYoast_Client\Infrastructure\Crypto\Encryption` (libsodium
  secretbox; key HKDF-derived from `AUTH_KEY`). Flag raw tokens in options/usermeta/transients/
  logs; keep `sodium_memzero()` wiping.
- Validate PKCE `code_challenge`/`state` against the stored verifier before persisting tokens;
  don't bypass DPoP proof/nonce checks or the `private_key_jwt` assertion. Preserve RFC 8707
  audience / per-resource token binding — never reuse a token across resource servers.

**SSRF & remote calls.** Remote AI calls use `wp_remote_post/get` to the fixed host
`https://ai.yoa.st` (recognize as safe); flag any user-controlled request host/path and any
`'sslverify' => false` / `CURLOPT_SSL_VERIFYPEER` disabled.

**Filesystem (CS excludes `file_system_operations`).** Direct `fopen`/`file_put_contents`/
`readfile`/`move_uploaded_file` is unchecked — flag user input in file paths (path traversal),
missing `basename()`, and double extensions.

**PHP footguns with no WP sniff.** LFI/RFI via `include`/`require` with dynamic paths; variable
variables (`$$x`); `call_user_func[_array]`/`preg_replace_callback` with user-controlled
callables; `phar://` on filesystem functions; type-juggling auth (`==`, `in_array()` without
strict `true`); non-constant-time secret compare (use `hash_equals()`); insecure randomness
(`rand`/`mt_rand`/`uniqid`) for tokens — use `random_bytes`/`random_int`/`wp_generate_password`;
weak hashing (`md5`/`sha1`) for passwords/secrets — use `wp_hash_password`/`hash_hmac('sha256',…)`;
`mail()`/`header()` CRLF injection.

## Approved internal patterns (recognize — don't flag)
`Yoast\WP\SEO\Helpers\Sanitization_Helper`; presenter `escape_value()`/`present()`
(`Abstract_Presenter`); the ORM (`Yoast\WP\Lib\ORM`, `Model::of_type()->where()`);
`…\Crypto\Encryption`; the fixed-host `API_Client` over `wp_remote_*`.

## WP.org Plugin Directory compliance
No obfuscated/packed PHP; no executing remotely-fetched code. No phoning home or third-party
JS/CSS CDNs without explicit user consent (web fonts excepted); use WP-bundled libraries (jQuery,
SimplePie). Sanitize/validate settings before `update_option()`, gated behind a capability check.
