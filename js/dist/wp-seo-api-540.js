(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/* global jQuery, wpApiSettings */

(function ($, wpApiSettings) {
	var WpseoApi = function WpseoApi() {};

	WpseoApi.prototype = {
		get: function get(route, data, success, error) {
			this.request('GET', route, data, success, error);
		},

		post: function post(route, data, success, error) {
			this.request('POST', route, data, success, error);
		},

		put: function put(route, data, success, error) {
			this.request('PUT', route, data, success, error);
		},

		patch: function patch(route, data, success, error) {
			this.request('PATCH', route, data, success, error);
		},

		request: function request(method, route, data, success, error) {
			// If no data was passed along use the third argument as the success callback
			// and the fourth argument as the error callback.
			if ($.isFunction(data) && error === undefined) {
				error = success;
				success = data;
				data = undefined;
			}

			$.ajax({
				url: wpApiSettings.root + 'yoast/v1/' + route,
				method: method,
				beforeSend: function beforeSend(xhr) {
					xhr.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
				},
				data: data
			}).done(success).fail(error);
		}
	};

	window.wpseoApi = new WpseoApi();
})(jQuery, wpApiSettings);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFwaS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0FBRUEsQ0FBRSxVQUFXLENBQVgsRUFBYyxhQUFkLEVBQThCO0FBQy9CLEtBQUksV0FBVyxTQUFYLFFBQVcsR0FBWSxDQUUxQixDQUZEOztBQUlBLFVBQVMsU0FBVCxHQUFxQjtBQUNwQixPQUFLLGFBQVcsS0FBWCxFQUFrQixJQUFsQixFQUF3QixPQUF4QixFQUFpQyxLQUFqQyxFQUF5QztBQUM3QyxRQUFLLE9BQUwsQ0FBYyxLQUFkLEVBQXFCLEtBQXJCLEVBQTRCLElBQTVCLEVBQWtDLE9BQWxDLEVBQTJDLEtBQTNDO0FBQ0EsR0FIbUI7O0FBS3BCLFFBQU0sY0FBVyxLQUFYLEVBQWtCLElBQWxCLEVBQXdCLE9BQXhCLEVBQWlDLEtBQWpDLEVBQXlDO0FBQzlDLFFBQUssT0FBTCxDQUFjLE1BQWQsRUFBc0IsS0FBdEIsRUFBNkIsSUFBN0IsRUFBbUMsT0FBbkMsRUFBNEMsS0FBNUM7QUFDQSxHQVBtQjs7QUFTcEIsT0FBSyxhQUFXLEtBQVgsRUFBa0IsSUFBbEIsRUFBd0IsT0FBeEIsRUFBaUMsS0FBakMsRUFBeUM7QUFDN0MsUUFBSyxPQUFMLENBQWMsS0FBZCxFQUFxQixLQUFyQixFQUE0QixJQUE1QixFQUFrQyxPQUFsQyxFQUEyQyxLQUEzQztBQUNBLEdBWG1COztBQWFwQixTQUFPLGVBQVcsS0FBWCxFQUFrQixJQUFsQixFQUF3QixPQUF4QixFQUFpQyxLQUFqQyxFQUF5QztBQUMvQyxRQUFLLE9BQUwsQ0FBYyxPQUFkLEVBQXVCLEtBQXZCLEVBQThCLElBQTlCLEVBQW9DLE9BQXBDLEVBQTZDLEtBQTdDO0FBQ0EsR0FmbUI7O0FBaUJwQixXQUFTLGlCQUFXLE1BQVgsRUFBbUIsS0FBbkIsRUFBMEIsSUFBMUIsRUFBZ0MsT0FBaEMsRUFBeUMsS0FBekMsRUFBaUQ7QUFDekQ7QUFDQTtBQUNBLE9BQUssRUFBRSxVQUFGLENBQWMsSUFBZCxLQUF3QixVQUFVLFNBQXZDLEVBQW1EO0FBQ2xELFlBQVUsT0FBVjtBQUNBLGNBQVUsSUFBVjtBQUNBLFdBQVUsU0FBVjtBQUNBOztBQUVELEtBQUUsSUFBRixDQUFRO0FBQ1AsU0FBSyxjQUFjLElBQWQsR0FBcUIsV0FBckIsR0FBbUMsS0FEakM7QUFFUCxZQUFRLE1BRkQ7QUFHUCxnQkFBWSxvQkFBVyxHQUFYLEVBQWlCO0FBQzVCLFNBQUksZ0JBQUosQ0FBc0IsWUFBdEIsRUFBb0MsY0FBYyxLQUFsRDtBQUNBLEtBTE07QUFNUCxVQUFNO0FBTkMsSUFBUixFQU9JLElBUEosQ0FPVSxPQVBWLEVBT29CLElBUHBCLENBTzBCLEtBUDFCO0FBUUE7QUFsQ21CLEVBQXJCOztBQXFDQSxRQUFPLFFBQVAsR0FBa0IsSUFBSSxRQUFKLEVBQWxCO0FBQ0EsQ0EzQ0QsRUEyQ0ssTUEzQ0wsRUEyQ2EsYUEzQ2IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIGpRdWVyeSwgd3BBcGlTZXR0aW5ncyAqL1xuXG4oIGZ1bmN0aW9uICggJCwgd3BBcGlTZXR0aW5ncyApIHtcblx0bGV0IFdwc2VvQXBpID0gZnVuY3Rpb24gKCkge1xuXG5cdH07XG5cblx0V3BzZW9BcGkucHJvdG90eXBlID0ge1xuXHRcdGdldDogZnVuY3Rpb24gKCByb3V0ZSwgZGF0YSwgc3VjY2VzcywgZXJyb3IgKSB7XG5cdFx0XHR0aGlzLnJlcXVlc3QoICdHRVQnLCByb3V0ZSwgZGF0YSwgc3VjY2VzcywgZXJyb3IgKTtcblx0XHR9LFxuXG5cdFx0cG9zdDogZnVuY3Rpb24gKCByb3V0ZSwgZGF0YSwgc3VjY2VzcywgZXJyb3IgKSB7XG5cdFx0XHR0aGlzLnJlcXVlc3QoICdQT1NUJywgcm91dGUsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yICk7XG5cdFx0fSxcblxuXHRcdHB1dDogZnVuY3Rpb24gKCByb3V0ZSwgZGF0YSwgc3VjY2VzcywgZXJyb3IgKSB7XG5cdFx0XHR0aGlzLnJlcXVlc3QoICdQVVQnLCByb3V0ZSwgZGF0YSwgc3VjY2VzcywgZXJyb3IgKTtcblx0XHR9LFxuXG5cdFx0cGF0Y2g6IGZ1bmN0aW9uICggcm91dGUsIGRhdGEsIHN1Y2Nlc3MsIGVycm9yICkge1xuXHRcdFx0dGhpcy5yZXF1ZXN0KCAnUEFUQ0gnLCByb3V0ZSwgZGF0YSwgc3VjY2VzcywgZXJyb3IgKTtcblx0XHR9LFxuXG5cdFx0cmVxdWVzdDogZnVuY3Rpb24gKCBtZXRob2QsIHJvdXRlLCBkYXRhLCBzdWNjZXNzLCBlcnJvciApIHtcblx0XHRcdC8vIElmIG5vIGRhdGEgd2FzIHBhc3NlZCBhbG9uZyB1c2UgdGhlIHRoaXJkIGFyZ3VtZW50IGFzIHRoZSBzdWNjZXNzIGNhbGxiYWNrXG5cdFx0XHQvLyBhbmQgdGhlIGZvdXJ0aCBhcmd1bWVudCBhcyB0aGUgZXJyb3IgY2FsbGJhY2suXG5cdFx0XHRpZiAoICQuaXNGdW5jdGlvbiggZGF0YSApICYmIGVycm9yID09PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdGVycm9yICAgPSBzdWNjZXNzO1xuXHRcdFx0XHRzdWNjZXNzID0gZGF0YTtcblx0XHRcdFx0ZGF0YSAgICA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblxuXHRcdFx0JC5hamF4KCB7XG5cdFx0XHRcdHVybDogd3BBcGlTZXR0aW5ncy5yb290ICsgJ3lvYXN0L3YxLycgKyByb3V0ZSxcblx0XHRcdFx0bWV0aG9kOiBtZXRob2QsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICggeGhyICkge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCAnWC1XUC1Ob25jZScsIHdwQXBpU2V0dGluZ3Mubm9uY2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdH0gKS5kb25lKCBzdWNjZXNzICkuZmFpbCggZXJyb3IgKTtcblx0XHR9XG5cdH07XG5cblx0d2luZG93Lndwc2VvQXBpID0gbmV3IFdwc2VvQXBpKCk7XG59ICkoIGpRdWVyeSwgd3BBcGlTZXR0aW5ncyApO1xuIl19
