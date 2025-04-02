declare namespace _default {
    export { showTrace };
}
export default _default;
/**
 * Shows and error trace of the error message in the console if the console is available.
 *
 * @param {string} [errorMessage=""] The error message.
 * @returns {void}
 */
export function showTrace(errorMessage?: string | undefined): void;
