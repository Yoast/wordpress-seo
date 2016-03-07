(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* jshint strict:true */
/* global ajaxurl */
/* global wpseo_export_nonce */
jQuery( document ).ready( function( $ ) {
		'use strict';
		$( '#export-button' ).click( function( ev ) {
				$.post( ajaxurl, {
						action: 'wpseo_export',
						_wpnonce: wpseo_export_nonce,
						include_taxonomy: $( '#include_taxonomy_meta' ).is( ':checked' )
					}, function( resp ) {
						resp = JSON.parse( resp );
						var dclass = 'error';
						if ( resp.status === 'success' ) {
							dclass = 'updated';
						}
						$( '#wpseo-title' ).append( '<div class="' + dclass + ' settings-error"><p><strong>' + resp.msg + '</strong></p></div>' );
					}
				);
				ev.preventDefault();
			}
		);
	}
);

},{}]},{},[1]);
