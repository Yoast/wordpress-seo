/**
 * Writes the assessor's `imageScope` option onto the researcher's config, so the image researches
 * (`imageCount`, `altTagCount`) can resolve which images to assess (see `getImagesInScope`).
 *
 * Applied per `assess()` call rather than at construction: the worker recreates assessors on
 * configuration changes while the researcher instance survives, and `addConfig` overwrites silently
 * for non-empty values, so re-applying is idempotent. Without the option no config is written, and
 * `getConfig( "imageScope" )` keeps returning `false` — today's tree-only behaviour.
 *
 * @param {Researcher}  researcher  The researcher to write the config to.
 * @param {Object}      [options]   The assessor options, possibly carrying `imageScope`.
 *
 * @returns {void}
 */
export default function applyImageScope( researcher, options ) {
	if ( options && options.imageScope ) {
		researcher.addConfig( "imageScope", options.imageScope );
	}
}
