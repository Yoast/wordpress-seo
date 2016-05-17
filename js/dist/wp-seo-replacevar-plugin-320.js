(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global wpseoReplaceVarsL10n */
(function() {
	'use strict';

	/**
	 * variable replacement plugin for wordpress.
	 */
	var YoastReplaceVarPlugin = function( app ) {
		this._app = app;

		this.replaceVars = wpseoReplaceVarsL10n.replace_vars;

		this._app.registerPlugin( 'replaceVariablePlugin', { status: 'ready' } );

		this.registerModifications();
	};

	/**
	 * Registers the modifications for the plugin.
	 */
	YoastReplaceVarPlugin.prototype.registerModifications = function() {
		var callback = this.replaceVariablesPlugin.bind( this );

		this._app.registerModification( 'content', callback, 'replaceVariablePlugin', 10 );
		this._app.registerModification( 'title', callback, 'replaceVariablePlugin', 10 );
		this._app.registerModification( 'snippet_title', callback, 'replaceVariablePlugin', 10 );
		this._app.registerModification( 'snippet_meta', callback, 'replaceVariablePlugin', 10 );
		this._app.registerModification( 'primary_category', callback, 'replaceVariablePlugin', 10 );

		//modifications applied on the getData from the scrapers to use templates
		this._app.registerModification( 'data_page_title', callback, 'replaceVariablePlugin', 10);
		this._app.registerModification( 'data_meta_desc', callback, 'replaceVariablePlugin', 10);
	};

	/**
	 * runs the different replacements on the data-string
	 * @param {String} data
	 * @returns {string}
	 */
	YoastReplaceVarPlugin.prototype.replaceVariablesPlugin = function( data ) {
		if( typeof data !== 'undefined' ) {
			data = this.titleReplace( data );
			data = this.termtitleReplace( data );
			data = this.defaultReplace( data );
			data = this.parentReplace( data );
			data = this.replaceSeparators( data );
			data = this.excerptReplace( data );
			data = this.primaryCategoryReplace( data );
		}
		return data;
	};

	/**
	 * Replaces %%title%% with the title
	 * @param {String} data
	 * @returns {string}
	 */
	YoastReplaceVarPlugin.prototype.titleReplace = function( data ) {
		var title = this._app.rawData.title;

		data = data.replace( /%%title%%/g, title );

		return data;
	};

	/**
	 * Replaces %%term_title%% with the title of the term
	 * @param {String} data the data to replace the term_title var
	 * @returns {String} the data with the replaced variables
	 */
	YoastReplaceVarPlugin.prototype.termtitleReplace = function( data ) {
		var term_title = this._app.rawData.name;

		data = data.replace( /%%term_title%%/g, term_title);

		return data;
	};

	/**
	 * Replaces %%parent_title%% with the selected value from selectbox (if available on page).
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.parentReplace = function( data ) {
		var parentId = document.getElementById( 'parent_id' );

		if ( parentId !== null && typeof parentId.options !== 'undefined' && parentId.options[ parentId.selectedIndex ].text !== wpseoReplaceVarsL10n.no_parent_text ) {
			data = data.replace( /%%parent_title%%/, parentId.options[ parentId.selectedIndex ].text );
		}
		return data;
	};

	/**
	 * Replaces separators in the string.
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.replaceSeparators = function( data ) {
		return data.replace( /%%sep%%(\s+%%sep%%)*/g, this.replaceVars.sep );
	};

	/**
	 * replaces the excerpts strings with strings for the excerpts, if not empty.
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.excerptReplace = function( data ) {
		if ( typeof this._app.rawData.excerpt !== 'undefined' ) {
			data = data.replace( /%%excerpt_only%%/g, this._app.rawData.excerpt );
			data = data.replace( /%%excerpt%%/g, this._app.rawData.excerpt );
		}
		return data;
	};

	YoastReplaceVarPlugin.prototype.primaryCategoryReplace = function( data ) {
		var primary_category = ( typeof this._app.rawData.primaryCategory !== 'undefined' ) ? this._app.rawData.primaryCategory : '';
		return data.replace( /%%primary_category%%/g, primary_category );
	};

	/**
	 * replaces default variables with the values stored in the wpseoMetaboxL10n object.
	 *
	 * @param {String} textString
	 * @return {String}
	 */
	YoastReplaceVarPlugin.prototype.defaultReplace = function( textString ) {
		var focusKeyword = this._app.rawData.keyword;

		return textString.replace( /%%sitedesc%%/g, this.replaceVars.sitedesc )
			.replace( /%%sitename%%/g, this.replaceVars.sitename )
			.replace( /%%term_title%%/g, this.replaceVars.term_title )
			.replace( /%%term_description%%/g, this.replaceVars.term_description )
			.replace( /%%category_description%%/g, this.replaceVars.category_description )
			.replace( /%%tag_description%%/g, this.replaceVars.tag_description )
			.replace( /%%searchphrase%%/g, this.replaceVars.searchphrase )
			.replace( /%%date%%/g, this.replaceVars.date )
			.replace( /%%id%%/g, this.replaceVars.id )
			.replace( /%%page%%/g, this.replaceVars.page )
			.replace( /%%currenttime%%/g, this.replaceVars.currenttime )
			.replace( /%%currentdate%%/g, this.replaceVars.currentdate )
			.replace( /%%currentday%%/g, this.replaceVars.currentday )
			.replace( /%%currentmonth%%/g, this.replaceVars.currentmonth )
			.replace( /%%currentyear%%/g, this.replaceVars.currentyear )
			.replace( /%%focuskw%%/g, focusKeyword );
	};

	window.YoastReplaceVarPlugin = YoastReplaceVarPlugin;
}());

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLXJlcGxhY2V2YXItcGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgd3BzZW9SZXBsYWNlVmFyc0wxMG4gKi9cbihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qKlxuXHQgKiB2YXJpYWJsZSByZXBsYWNlbWVudCBwbHVnaW4gZm9yIHdvcmRwcmVzcy5cblx0ICovXG5cdHZhciBZb2FzdFJlcGxhY2VWYXJQbHVnaW4gPSBmdW5jdGlvbiggYXBwICkge1xuXHRcdHRoaXMuX2FwcCA9IGFwcDtcblxuXHRcdHRoaXMucmVwbGFjZVZhcnMgPSB3cHNlb1JlcGxhY2VWYXJzTDEwbi5yZXBsYWNlX3ZhcnM7XG5cblx0XHR0aGlzLl9hcHAucmVnaXN0ZXJQbHVnaW4oICdyZXBsYWNlVmFyaWFibGVQbHVnaW4nLCB7IHN0YXR1czogJ3JlYWR5JyB9ICk7XG5cblx0XHR0aGlzLnJlZ2lzdGVyTW9kaWZpY2F0aW9ucygpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgdGhlIG1vZGlmaWNhdGlvbnMgZm9yIHRoZSBwbHVnaW4uXG5cdCAqL1xuXHRZb2FzdFJlcGxhY2VWYXJQbHVnaW4ucHJvdG90eXBlLnJlZ2lzdGVyTW9kaWZpY2F0aW9ucyA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjYWxsYmFjayA9IHRoaXMucmVwbGFjZVZhcmlhYmxlc1BsdWdpbi5iaW5kKCB0aGlzICk7XG5cblx0XHR0aGlzLl9hcHAucmVnaXN0ZXJNb2RpZmljYXRpb24oICdjb250ZW50JywgY2FsbGJhY2ssICdyZXBsYWNlVmFyaWFibGVQbHVnaW4nLCAxMCApO1xuXHRcdHRoaXMuX2FwcC5yZWdpc3Rlck1vZGlmaWNhdGlvbiggJ3RpdGxlJywgY2FsbGJhY2ssICdyZXBsYWNlVmFyaWFibGVQbHVnaW4nLCAxMCApO1xuXHRcdHRoaXMuX2FwcC5yZWdpc3Rlck1vZGlmaWNhdGlvbiggJ3NuaXBwZXRfdGl0bGUnLCBjYWxsYmFjaywgJ3JlcGxhY2VWYXJpYWJsZVBsdWdpbicsIDEwICk7XG5cdFx0dGhpcy5fYXBwLnJlZ2lzdGVyTW9kaWZpY2F0aW9uKCAnc25pcHBldF9tZXRhJywgY2FsbGJhY2ssICdyZXBsYWNlVmFyaWFibGVQbHVnaW4nLCAxMCApO1xuXHRcdHRoaXMuX2FwcC5yZWdpc3Rlck1vZGlmaWNhdGlvbiggJ3ByaW1hcnlfY2F0ZWdvcnknLCBjYWxsYmFjaywgJ3JlcGxhY2VWYXJpYWJsZVBsdWdpbicsIDEwICk7XG5cblx0XHQvL21vZGlmaWNhdGlvbnMgYXBwbGllZCBvbiB0aGUgZ2V0RGF0YSBmcm9tIHRoZSBzY3JhcGVycyB0byB1c2UgdGVtcGxhdGVzXG5cdFx0dGhpcy5fYXBwLnJlZ2lzdGVyTW9kaWZpY2F0aW9uKCAnZGF0YV9wYWdlX3RpdGxlJywgY2FsbGJhY2ssICdyZXBsYWNlVmFyaWFibGVQbHVnaW4nLCAxMCk7XG5cdFx0dGhpcy5fYXBwLnJlZ2lzdGVyTW9kaWZpY2F0aW9uKCAnZGF0YV9tZXRhX2Rlc2MnLCBjYWxsYmFjaywgJ3JlcGxhY2VWYXJpYWJsZVBsdWdpbicsIDEwKTtcblx0fTtcblxuXHQvKipcblx0ICogcnVucyB0aGUgZGlmZmVyZW50IHJlcGxhY2VtZW50cyBvbiB0aGUgZGF0YS1zdHJpbmdcblx0ICogQHBhcmFtIHtTdHJpbmd9IGRhdGFcblx0ICogQHJldHVybnMge3N0cmluZ31cblx0ICovXG5cdFlvYXN0UmVwbGFjZVZhclBsdWdpbi5wcm90b3R5cGUucmVwbGFjZVZhcmlhYmxlc1BsdWdpbiA9IGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdGlmKCB0eXBlb2YgZGF0YSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRkYXRhID0gdGhpcy50aXRsZVJlcGxhY2UoIGRhdGEgKTtcblx0XHRcdGRhdGEgPSB0aGlzLnRlcm10aXRsZVJlcGxhY2UoIGRhdGEgKTtcblx0XHRcdGRhdGEgPSB0aGlzLmRlZmF1bHRSZXBsYWNlKCBkYXRhICk7XG5cdFx0XHRkYXRhID0gdGhpcy5wYXJlbnRSZXBsYWNlKCBkYXRhICk7XG5cdFx0XHRkYXRhID0gdGhpcy5yZXBsYWNlU2VwYXJhdG9ycyggZGF0YSApO1xuXHRcdFx0ZGF0YSA9IHRoaXMuZXhjZXJwdFJlcGxhY2UoIGRhdGEgKTtcblx0XHRcdGRhdGEgPSB0aGlzLnByaW1hcnlDYXRlZ29yeVJlcGxhY2UoIGRhdGEgKTtcblx0XHR9XG5cdFx0cmV0dXJuIGRhdGE7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlcGxhY2VzICUldGl0bGUlJSB3aXRoIHRoZSB0aXRsZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZGF0YVxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHQgKi9cblx0WW9hc3RSZXBsYWNlVmFyUGx1Z2luLnByb3RvdHlwZS50aXRsZVJlcGxhY2UgPSBmdW5jdGlvbiggZGF0YSApIHtcblx0XHR2YXIgdGl0bGUgPSB0aGlzLl9hcHAucmF3RGF0YS50aXRsZTtcblxuXHRcdGRhdGEgPSBkYXRhLnJlcGxhY2UoIC8lJXRpdGxlJSUvZywgdGl0bGUgKTtcblxuXHRcdHJldHVybiBkYXRhO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXBsYWNlcyAlJXRlcm1fdGl0bGUlJSB3aXRoIHRoZSB0aXRsZSBvZiB0aGUgdGVybVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSB0aGUgZGF0YSB0byByZXBsYWNlIHRoZSB0ZXJtX3RpdGxlIHZhclxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSB0aGUgZGF0YSB3aXRoIHRoZSByZXBsYWNlZCB2YXJpYWJsZXNcblx0ICovXG5cdFlvYXN0UmVwbGFjZVZhclBsdWdpbi5wcm90b3R5cGUudGVybXRpdGxlUmVwbGFjZSA9IGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdHZhciB0ZXJtX3RpdGxlID0gdGhpcy5fYXBwLnJhd0RhdGEubmFtZTtcblxuXHRcdGRhdGEgPSBkYXRhLnJlcGxhY2UoIC8lJXRlcm1fdGl0bGUlJS9nLCB0ZXJtX3RpdGxlKTtcblxuXHRcdHJldHVybiBkYXRhO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXBsYWNlcyAlJXBhcmVudF90aXRsZSUlIHdpdGggdGhlIHNlbGVjdGVkIHZhbHVlIGZyb20gc2VsZWN0Ym94IChpZiBhdmFpbGFibGUgb24gcGFnZSkuXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9XG5cdCAqL1xuXHRZb2FzdFJlcGxhY2VWYXJQbHVnaW4ucHJvdG90eXBlLnBhcmVudFJlcGxhY2UgPSBmdW5jdGlvbiggZGF0YSApIHtcblx0XHR2YXIgcGFyZW50SWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ3BhcmVudF9pZCcgKTtcblxuXHRcdGlmICggcGFyZW50SWQgIT09IG51bGwgJiYgdHlwZW9mIHBhcmVudElkLm9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmIHBhcmVudElkLm9wdGlvbnNbIHBhcmVudElkLnNlbGVjdGVkSW5kZXggXS50ZXh0ICE9PSB3cHNlb1JlcGxhY2VWYXJzTDEwbi5ub19wYXJlbnRfdGV4dCApIHtcblx0XHRcdGRhdGEgPSBkYXRhLnJlcGxhY2UoIC8lJXBhcmVudF90aXRsZSUlLywgcGFyZW50SWQub3B0aW9uc1sgcGFyZW50SWQuc2VsZWN0ZWRJbmRleCBdLnRleHQgKTtcblx0XHR9XG5cdFx0cmV0dXJuIGRhdGE7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlcGxhY2VzIHNlcGFyYXRvcnMgaW4gdGhlIHN0cmluZy5cblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IGRhdGFcblx0ICogQHJldHVybnMge1N0cmluZ31cblx0ICovXG5cdFlvYXN0UmVwbGFjZVZhclBsdWdpbi5wcm90b3R5cGUucmVwbGFjZVNlcGFyYXRvcnMgPSBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRyZXR1cm4gZGF0YS5yZXBsYWNlKCAvJSVzZXAlJShcXHMrJSVzZXAlJSkqL2csIHRoaXMucmVwbGFjZVZhcnMuc2VwICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIHJlcGxhY2VzIHRoZSBleGNlcnB0cyBzdHJpbmdzIHdpdGggc3RyaW5ncyBmb3IgdGhlIGV4Y2VycHRzLCBpZiBub3QgZW1wdHkuXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9XG5cdCAqL1xuXHRZb2FzdFJlcGxhY2VWYXJQbHVnaW4ucHJvdG90eXBlLmV4Y2VycHRSZXBsYWNlID0gZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0aWYgKCB0eXBlb2YgdGhpcy5fYXBwLnJhd0RhdGEuZXhjZXJwdCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRkYXRhID0gZGF0YS5yZXBsYWNlKCAvJSVleGNlcnB0X29ubHklJS9nLCB0aGlzLl9hcHAucmF3RGF0YS5leGNlcnB0ICk7XG5cdFx0XHRkYXRhID0gZGF0YS5yZXBsYWNlKCAvJSVleGNlcnB0JSUvZywgdGhpcy5fYXBwLnJhd0RhdGEuZXhjZXJwdCApO1xuXHRcdH1cblx0XHRyZXR1cm4gZGF0YTtcblx0fTtcblxuXHRZb2FzdFJlcGxhY2VWYXJQbHVnaW4ucHJvdG90eXBlLnByaW1hcnlDYXRlZ29yeVJlcGxhY2UgPSBmdW5jdGlvbiggZGF0YSApIHtcblx0XHR2YXIgcHJpbWFyeV9jYXRlZ29yeSA9ICggdHlwZW9mIHRoaXMuX2FwcC5yYXdEYXRhLnByaW1hcnlDYXRlZ29yeSAhPT0gJ3VuZGVmaW5lZCcgKSA/IHRoaXMuX2FwcC5yYXdEYXRhLnByaW1hcnlDYXRlZ29yeSA6ICcnO1xuXHRcdHJldHVybiBkYXRhLnJlcGxhY2UoIC8lJXByaW1hcnlfY2F0ZWdvcnklJS9nLCBwcmltYXJ5X2NhdGVnb3J5ICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIHJlcGxhY2VzIGRlZmF1bHQgdmFyaWFibGVzIHdpdGggdGhlIHZhbHVlcyBzdG9yZWQgaW4gdGhlIHdwc2VvTWV0YWJveEwxMG4gb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gdGV4dFN0cmluZ1xuXHQgKiBAcmV0dXJuIHtTdHJpbmd9XG5cdCAqL1xuXHRZb2FzdFJlcGxhY2VWYXJQbHVnaW4ucHJvdG90eXBlLmRlZmF1bHRSZXBsYWNlID0gZnVuY3Rpb24oIHRleHRTdHJpbmcgKSB7XG5cdFx0dmFyIGZvY3VzS2V5d29yZCA9IHRoaXMuX2FwcC5yYXdEYXRhLmtleXdvcmQ7XG5cblx0XHRyZXR1cm4gdGV4dFN0cmluZy5yZXBsYWNlKCAvJSVzaXRlZGVzYyUlL2csIHRoaXMucmVwbGFjZVZhcnMuc2l0ZWRlc2MgKVxuXHRcdFx0LnJlcGxhY2UoIC8lJXNpdGVuYW1lJSUvZywgdGhpcy5yZXBsYWNlVmFycy5zaXRlbmFtZSApXG5cdFx0XHQucmVwbGFjZSggLyUldGVybV90aXRsZSUlL2csIHRoaXMucmVwbGFjZVZhcnMudGVybV90aXRsZSApXG5cdFx0XHQucmVwbGFjZSggLyUldGVybV9kZXNjcmlwdGlvbiUlL2csIHRoaXMucmVwbGFjZVZhcnMudGVybV9kZXNjcmlwdGlvbiApXG5cdFx0XHQucmVwbGFjZSggLyUlY2F0ZWdvcnlfZGVzY3JpcHRpb24lJS9nLCB0aGlzLnJlcGxhY2VWYXJzLmNhdGVnb3J5X2Rlc2NyaXB0aW9uIClcblx0XHRcdC5yZXBsYWNlKCAvJSV0YWdfZGVzY3JpcHRpb24lJS9nLCB0aGlzLnJlcGxhY2VWYXJzLnRhZ19kZXNjcmlwdGlvbiApXG5cdFx0XHQucmVwbGFjZSggLyUlc2VhcmNocGhyYXNlJSUvZywgdGhpcy5yZXBsYWNlVmFycy5zZWFyY2hwaHJhc2UgKVxuXHRcdFx0LnJlcGxhY2UoIC8lJWRhdGUlJS9nLCB0aGlzLnJlcGxhY2VWYXJzLmRhdGUgKVxuXHRcdFx0LnJlcGxhY2UoIC8lJWlkJSUvZywgdGhpcy5yZXBsYWNlVmFycy5pZCApXG5cdFx0XHQucmVwbGFjZSggLyUlcGFnZSUlL2csIHRoaXMucmVwbGFjZVZhcnMucGFnZSApXG5cdFx0XHQucmVwbGFjZSggLyUlY3VycmVudHRpbWUlJS9nLCB0aGlzLnJlcGxhY2VWYXJzLmN1cnJlbnR0aW1lIClcblx0XHRcdC5yZXBsYWNlKCAvJSVjdXJyZW50ZGF0ZSUlL2csIHRoaXMucmVwbGFjZVZhcnMuY3VycmVudGRhdGUgKVxuXHRcdFx0LnJlcGxhY2UoIC8lJWN1cnJlbnRkYXklJS9nLCB0aGlzLnJlcGxhY2VWYXJzLmN1cnJlbnRkYXkgKVxuXHRcdFx0LnJlcGxhY2UoIC8lJWN1cnJlbnRtb250aCUlL2csIHRoaXMucmVwbGFjZVZhcnMuY3VycmVudG1vbnRoIClcblx0XHRcdC5yZXBsYWNlKCAvJSVjdXJyZW50eWVhciUlL2csIHRoaXMucmVwbGFjZVZhcnMuY3VycmVudHllYXIgKVxuXHRcdFx0LnJlcGxhY2UoIC8lJWZvY3Vza3clJS9nLCBmb2N1c0tleXdvcmQgKTtcblx0fTtcblxuXHR3aW5kb3cuWW9hc3RSZXBsYWNlVmFyUGx1Z2luID0gWW9hc3RSZXBsYWNlVmFyUGx1Z2luO1xufSgpKTtcbiJdfQ==
