"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts an array or object containing strings to an array of options.
 *
 * @param values The array or object.
 *
 * @returns The options.
 */
function arrayOrObjectToOptions(values) {
    var options = [];
    if (Array.isArray(values)) {
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            options.push({ label: value, value: value });
        }
        return options;
    }
    for (var _a = 0, _b = Object.entries(values); _a < _b.length; _a++) {
        var _c = _b[_a], label = _c[0], value = _c[1];
        options.push({ label: label, value: value });
    }
    return options;
}
exports.arrayOrObjectToOptions = arrayOrObjectToOptions;
