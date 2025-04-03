declare namespace _default {
    export { hasClass };
    export { addClass };
    export { removeClass };
    export { removeClasses };
}
export default _default;
/**
 * Checks whether an element has a specific class.
 *
 * @param {HTMLElement} element The element to check for the class.
 * @param {string} className The class to look for.
 * @returns {boolean} Whether or not the class is present.
 */
declare function hasClass(element: HTMLElement, className: string): boolean;
/**
 * Adds a class to an element
 *
 * @param {HTMLElement} element The element to add the class to.
 * @param {string} className The class to add.
 * @returns {void}
 */
declare function addClass(element: HTMLElement, className: string): void;
/**
 * Removes a class from an element
 *
 * @param {HTMLElement} element The element to remove the class from.
 * @param {string} className The class to remove.
 * @returns {void}
 */
declare function removeClass(element: HTMLElement, className: string): void;
/**
 * Removes multiple classes from an element
 *
 * @param {HTMLElement} element The element to remove the classes from.
 * @param {Array} classes A list of classes to remove
 * @returns {void}
 */
declare function removeClasses(element: HTMLElement, classes: any[]): void;
