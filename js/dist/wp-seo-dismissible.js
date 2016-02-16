(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* jshint -W097 */
/* global wpseoMakeDismissible */
'use strict';
/**
 * Make notices dismissible
 *
 * This file should only be included in WordPress versions < 4.2, which don't have dismissible notices.
 * Before adding a dismiss button to notices with an `is-dismissible` class, a check is performed to see
 * if no such button has been added yet.
 */
jQuery(document).ready( function() {
	wpseoMakeDismissible();
});

},{}]},{},[1]);
