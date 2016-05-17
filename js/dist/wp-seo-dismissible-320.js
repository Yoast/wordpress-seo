(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* jshint -W097 */
/* global wpseoMakeDismissible */

/**
 * Make notices dismissible
 *
 * This file should only be included in WordPress versions < 4.2, which don't have dismissible notices.
 * Before adding a dismiss button to notices with an `is-dismissible` class, a check is performed to see
 * if no such button has been added yet.
 */
jQuery(document).ready( function() {
	'use strict';
	wpseoMakeDismissible();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWRpc21pc3NpYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGpzaGludCAtVzA5NyAqL1xuLyogZ2xvYmFsIHdwc2VvTWFrZURpc21pc3NpYmxlICovXG5cbi8qKlxuICogTWFrZSBub3RpY2VzIGRpc21pc3NpYmxlXG4gKlxuICogVGhpcyBmaWxlIHNob3VsZCBvbmx5IGJlIGluY2x1ZGVkIGluIFdvcmRQcmVzcyB2ZXJzaW9ucyA8IDQuMiwgd2hpY2ggZG9uJ3QgaGF2ZSBkaXNtaXNzaWJsZSBub3RpY2VzLlxuICogQmVmb3JlIGFkZGluZyBhIGRpc21pc3MgYnV0dG9uIHRvIG5vdGljZXMgd2l0aCBhbiBgaXMtZGlzbWlzc2libGVgIGNsYXNzLCBhIGNoZWNrIGlzIHBlcmZvcm1lZCB0byBzZWVcbiAqIGlmIG5vIHN1Y2ggYnV0dG9uIGhhcyBiZWVuIGFkZGVkIHlldC5cbiAqL1xualF1ZXJ5KGRvY3VtZW50KS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0d3BzZW9NYWtlRGlzbWlzc2libGUoKTtcbn0pO1xuIl19
