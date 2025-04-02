declare namespace _default {
    export { getType };
    export { isSameType };
}
export default _default;
/**
 * Gets the parsed type name of subjects.
 *
 * @param {array|object|string|number} subject The subject to get the parsed type from.
 * @returns {string} The parsed type name.
 */
export function getType(subject: array | object | string | number): string;
/**
 * Validates the type of subjects. Throws an error if the type is invalid.
 *
 * @param {object} subject The object containing all subjects.
 * @param {string} expectedType The expected type.
 * @returns {boolean} Returns true if types matches expected type. Otherwise returns false.
 */
export function isSameType(subject: object, expectedType: string): boolean;
