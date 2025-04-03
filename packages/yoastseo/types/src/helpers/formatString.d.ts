/**
 * Formats a string with named parameters as defined in the given parameter mapping.
 *
 * E.g. `"Hello %par_1% and %par_2%"` plus the map `{ par_1: "world", par_2: "you!" }`
 * gives: `"Hello world and you!"`.
 *
 * @param {string} string           The string to be formatted.
 * @param {Object} formatMap        The mapping in the form of parameter - value pairs.
 * @param {string} [delimiter="%%"] The string used to delimit parameters in the to be formatted string.
 *
 * @returns {string} The formatted string.
 */
export default function _default(string: string, formatMap: Object, delimiter?: string | undefined): string;
