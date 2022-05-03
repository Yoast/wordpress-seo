/* eslint-disable max-statements, require-jsdoc, complexity, camelcase, prefer-const, no-labels, no-constant-condition, no-lone-blocks, max-depth, no-return-assign, max-len, no-bitwise, no-unused-vars */
/*
 * Snowball JavaScript Library v0.5
 * http://snowball.tartarus.org/
 * https://github.com/mazko/jssnowball
 *
 * Copyright 20.12.2015 15:03:09, Oleg Mazko
 * http://www.opensource.org/licenses/bsd-license.html
 *
 * BSD 3-Clause License
 *
 * Copyright (c) 2018, Oleg Mazko
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * * Neither the name of the copyright holder nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *
 */
class StringBuffer {
	get b() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$b" ) ? this._$esjava$b : this._$esjava$b = "";
	}

	set b( v ) {
		this._$esjava$b = v;
	}

	length$esjava$0() {
		return this.b.length;
	}

	replace$esjava$3( start, end, str ) {
		if ( start === 0 && end === this.b.length ) {
			this.b = str;
		} else {
			const left = this.b.substring( 0, start ), right = this.b.substring( end );
			this.b = left + str + right;
		}
	}

	substring$esjava$2( start, end ) {
		return this.b.substring( start, end );
	}

	charAt$esjava$1( index ) {
		return this.b.charCodeAt( index );
	}

	subSequence$esjava$2( start, end ) {
		throw new Error( "NotImpl: CharSequence::subSequence" );
	}

	toString$esjava$0() {
		return this.b;
	}

	length( ...args ) {
		switch ( args.length ) {
			case 0:
				return this.length$esjava$0( ...args );
		}
		return super.length( ...args );
	}

	replace( ...args ) {
		switch ( args.length ) {
			case 3:
				return this.replace$esjava$3( ...args );
		}
		return super.replace( ...args );
	}

	substring( ...args ) {
		switch ( args.length ) {
			case 2:
				return this.substring$esjava$2( ...args );
		}
		return super.substring( ...args );
	}

	charAt( ...args ) {
		switch ( args.length ) {
			case 1:
				return this.charAt$esjava$1( ...args );
		}
		return super.charAt( ...args );
	}

	subSequence( ...args ) {
		switch ( args.length ) {
			case 2:
				return this.subSequence$esjava$2( ...args );
		}
		return super.subSequence( ...args );
	}

	toString( ...args ) {
		switch ( args.length ) {
			case 0:
				return this.toString$esjava$0( ...args );
		}
		return super.toString( ...args );
	}
}
class Among {
	static toCharArray$esjava$1( s ) {
		const sLength = s.length;
		const charArr = new Array( sLength );
		for ( let i = 0; i < sLength; i++ ) {
			charArr[ i ] = s.charCodeAt( i );
		}
		return charArr;
	}

	constructor( s, substring_i, result, methodname, methodobject ) {
		this.s_size = s.length;
		this.s = Among.toCharArray$esjava$1( s );
		this.substring_i = substring_i;
		this.result = result;
		this.methodobject = methodobject;
		this.method = methodname ? methodobject[ methodname ] : null;
	}

	get s_size() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$s_size" ) ? this._$esjava$s_size : this._$esjava$s_size = 0;
	}

	set s_size( v ) {
		this._$esjava$s_size = v;
	}

	get s() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$s" ) ? this._$esjava$s : this._$esjava$s = null;
	}

	set s( v ) {
		this._$esjava$s = v;
	}

	get substring_i() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$substring_i" ) ? this._$esjava$substring_i : this._$esjava$substring_i = 0;
	}

	set substring_i( v ) {
		this._$esjava$substring_i = v;
	}

	get result() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$result" ) ? this._$esjava$result : this._$esjava$result = 0;
	}

	set result( v ) {
		this._$esjava$result = v;
	}

	get method() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$method" ) ? this._$esjava$method : this._$esjava$method = null;
	}

	set method( v ) {
		this._$esjava$method = v;
	}

	get methodobject() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$methodobject" ) ? this._$esjava$methodobject : this._$esjava$methodobject = null;
	}

	set methodobject( v ) {
		this._$esjava$methodobject = v;
	}
}

class SnowballProgram {
	constructor() {
		this.current = new StringBuffer();
		this.setCurrent$esjava$1( "" );
	}

	setCurrent$esjava$1( value ) {
		this.current.replace( 0, this.current.length(), value );
		this.cursor = 0;
		this.limit = this.current.length();
		this.limit_backward = 0;
		this.bra = this.cursor;
		this.ket = this.limit;
	}

	getCurrent$esjava$0() {
		const result = this.current.toString();
		this.current = new StringBuffer();
		return result;
	}

	get current() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$current" ) ? this._$esjava$current : this._$esjava$current = null;
	}

	set current( v ) {
		this._$esjava$current = v;
	}

	get cursor() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$cursor" ) ? this._$esjava$cursor : this._$esjava$cursor = 0;
	}

	set cursor( v ) {
		this._$esjava$cursor = v;
	}

	get limit() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$limit" ) ? this._$esjava$limit : this._$esjava$limit = 0;
	}

	set limit( v ) {
		this._$esjava$limit = v;
	}

	get limit_backward() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$limit_backward" ) ? this._$esjava$limit_backward : this._$esjava$limit_backward = 0;
	}

	set limit_backward( v ) {
		this._$esjava$limit_backward = v;
	}

	get bra() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$bra" ) ? this._$esjava$bra : this._$esjava$bra = 0;
	}

	set bra( v ) {
		this._$esjava$bra = v;
	}

	get ket() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$ket" ) ? this._$esjava$ket : this._$esjava$ket = 0;
	}

	set ket( v ) {
		this._$esjava$ket = v;
	}

	copy_from$esjava$1( other ) {
		this.current = other.current;
		this.cursor = other.cursor;
		this.limit = other.limit;
		this.limit_backward = other.limit_backward;
		this.bra = other.bra;
		this.ket = other.ket;
	}

	in_grouping$esjava$3( s, min, max ) {
		if ( this.cursor >= this.limit ) {
			return false;
		}
		let ch = this.current.charAt( this.cursor );
		if ( ch > max || ch < min ) {
			return false;
		}
		ch -= min;
		if ( ( s[ ch >> 3 ] & 0X1 << ( ch & 0X7 ) ) === 0 ) {
			return false;
		}
		this.cursor++;
		return true;
	}

	in_grouping_b$esjava$3( s, min, max ) {
		if ( this.cursor <= this.limit_backward ) {
			return false;
		}
		let ch = this.current.charAt( this.cursor - 1 );
		if ( ch > max || ch < min ) {
			return false;
		}
		ch -= min;
		if ( ( s[ ch >> 3 ] & 0X1 << ( ch & 0X7 ) ) === 0 ) {
			return false;
		}
		this.cursor--;
		return true;
	}

	out_grouping$esjava$3( s, min, max ) {
		if ( this.cursor >= this.limit ) {
			return false;
		}
		let ch = this.current.charAt( this.cursor );
		if ( ch > max || ch < min ) {
			this.cursor++;
			return true;
		}
		ch -= min;
		if ( ( s[ ch >> 3 ] & 0X1 << ( ch & 0X7 ) ) === 0 ) {
			this.cursor++;
			return true;
		}
		return false;
	}

	out_grouping_b$esjava$3( s, min, max ) {
		if ( this.cursor <= this.limit_backward ) {
			return false;
		}
		let ch = this.current.charAt( this.cursor - 1 );
		if ( ch > max || ch < min ) {
			this.cursor--;
			return true;
		}
		ch -= min;
		if ( ( s[ ch >> 3 ] & 0X1 << ( ch & 0X7 ) ) === 0 ) {
			this.cursor--;
			return true;
		}
		return false;
	}

	in_range$esjava$2( min, max ) {
		if ( this.cursor >= this.limit ) {
			return false;
		}
		const ch = this.current.charAt( this.cursor );
		if ( ch > max || ch < min ) {
			return false;
		}
		this.cursor++;
		return true;
	}

	in_range_b$esjava$2( min, max ) {
		if ( this.cursor <= this.limit_backward ) {
			return false;
		}
		const ch = this.current.charAt( this.cursor - 1 );
		if ( ch > max || ch < min ) {
			return false;
		}
		this.cursor--;
		return true;
	}

	out_range$esjava$2( min, max ) {
		if ( this.cursor >= this.limit ) {
			return false;
		}
		const ch = this.current.charAt( this.cursor );
		if ( ! ( ch > max || ch < min ) ) {
			return false;
		}
		this.cursor++;
		return true;
	}

	out_range_b$esjava$2( min, max ) {
		if ( this.cursor <= this.limit_backward ) {
			return false;
		}
		const ch = this.current.charAt( this.cursor - 1 );
		if ( ! ( ch > max || ch < min ) ) {
			return false;
		}
		this.cursor--;
		return true;
	}

	eq_s$esjava$2( s_size, s ) {
		if ( this.limit - this.cursor < s_size ) {
			return false;
		}
		let i;
		for ( i = 0; i !== s_size; i++ ) {
			if ( this.current.charAt( this.cursor + i ) !== s.charCodeAt( i ) ) {
				return false;
			}
		}
		this.cursor += s_size;
		return true;
	}

	eq_s_b$esjava$2( s_size, s ) {
		if ( this.cursor - this.limit_backward < s_size ) {
			return false;
		}
		let i;
		for ( i = 0; i !== s_size; i++ ) {
			if ( this.current.charAt( this.cursor - s_size + i ) !== s.charCodeAt( i ) ) {
				return false;
			}
		}
		this.cursor -= s_size;
		return true;
	}

	eq_v$esjava$1( s ) {
		return this.eq_s$esjava$2( s.length(), s.toString() );
	}

	eq_v_b$esjava$1( s ) {
		return this.eq_s_b$esjava$2( s.length(), s.toString() );
	}

	find_among$esjava$2( v, v_size ) {
		let i = 0;
		let j = v_size;
		const c = this.cursor;
		const l = this.limit;
		let common_i = 0;
		let common_j = 0;
		let first_key_inspected = false;
		while ( true ) {
			const k = i + ( j - i >> 1 );
			let diff = 0;
			let common = common_i < common_j ? common_i : common_j;
			const w = v[ k ];
			let i2;
			for ( i2 = common; i2 < w.s_size; i2++ ) {
				if ( c + common === l ) {
					diff = -1;
					break;
				}
				diff = this.current.charAt( c + common ) - w.s[ i2 ];
				if ( diff !== 0 ) {
					break;
				}
				common++;
			}
			if ( diff < 0 ) {
				j = k;
				common_j = common;
			} else {
				i = k;
				common_i = common;
			}
			if ( j - i <= 1 ) {
				if ( i > 0 ) {
					break;
				}
				if ( j === i ) {
					break;
				}
				if ( first_key_inspected ) {
					break;
				}
				first_key_inspected = true;
			}
		}
		while ( true ) {
			const w = v[ i ];
			if ( common_i >= w.s_size ) {
				this.cursor = c + w.s_size;
				if ( w.method === null ) {
					return w.result;
				}
				let res;
				res = w.method.call( w.methodobject );
				this.cursor = c + w.s_size;
				if ( res ) {
					return w.result;
				}
			}
			i = w.substring_i;
			if ( i < 0 ) {
				return 0;
			}
		}
	}

	find_among_b$esjava$2( v, v_size ) {
		let i = 0;
		let j = v_size;
		const c = this.cursor;
		const lb = this.limit_backward;
		let common_i = 0;
		let common_j = 0;
		let first_key_inspected = false;
		while ( true ) {
			const k = i + ( j - i >> 1 );
			let diff = 0;
			let common = common_i < common_j ? common_i : common_j;
			const w = v[ k ];
			let i2;
			for ( i2 = w.s_size - 1 - common; i2 >= 0; i2-- ) {
				if ( c - common === lb ) {
					diff = -1;
					break;
				}
				diff = this.current.charAt( c - 1 - common ) - w.s[ i2 ];
				if ( diff !== 0 ) {
					break;
				}
				common++;
			}
			if ( diff < 0 ) {
				j = k;
				common_j = common;
			} else {
				i = k;
				common_i = common;
			}
			if ( j - i <= 1 ) {
				if ( i > 0 ) {
					break;
				}
				if ( j === i ) {
					break;
				}
				if ( first_key_inspected ) {
					break;
				}
				first_key_inspected = true;
			}
		}
		while ( true ) {
			const w = v[ i ];
			if ( common_i >= w.s_size ) {
				this.cursor = c - w.s_size;
				if ( w.method === null ) {
					return w.result;
				}
				let res;
				res = w.method.call( w.methodobject );
				this.cursor = c - w.s_size;
				if ( res ) {
					return w.result;
				}
			}
			i = w.substring_i;
			if ( i < 0 ) {
				return 0;
			}
		}
	}

	replace_s$esjava$3( c_bra, c_ket, s ) {
		const adjustment = s.length - ( c_ket - c_bra );
		this.current.replace( c_bra, c_ket, s );
		this.limit += adjustment;
		if ( this.cursor >= c_ket ) {
			this.cursor += adjustment;
		} else if ( this.cursor > c_bra ) {
			this.cursor = c_bra;
		}
		return adjustment;
	}

	slice_check$esjava$0() {
		if ( this.bra < 0 || this.bra > this.ket || this.ket > this.limit || this.limit > this.current.length() ) {
			throw new Error( "Snowball: faulty slice operation" );
		}
	}

	slice_from$esjava$1( s ) {
		this.slice_check$esjava$0();
		this.replace_s$esjava$3( this.bra, this.ket, s );
	}

	slice_del$esjava$0() {
		this.slice_from$esjava$1( "" );
	}

	insert$esjava$3( c_bra, c_ket, s ) {
		const adjustment = this.replace_s$esjava$3( c_bra, c_ket, s );
		if ( c_bra <= this.bra ) {
			this.bra += adjustment;
		}
		if ( c_bra <= this.ket ) {
			this.ket += adjustment;
		}
	}

	slice_to$esjava$1( s ) {
		this.slice_check$esjava$0();
		s.replace( 0, s.length(), this.current.substring( this.bra, this.ket ) );
		return s;
	}

	setCurrent( ...args ) {
		switch ( args.length ) {
			case 1:
				return this.setCurrent$esjava$1( ...args );
		}
		return super.setCurrent( ...args );
	}

	getCurrent( ...args ) {
		switch ( args.length ) {
			case 0:
				return this.getCurrent$esjava$0( ...args );
		}
		return super.getCurrent( ...args );
	}

	copy_from( ...args ) {
		switch ( args.length ) {
			case 1:
				return this.copy_from$esjava$1( ...args );
		}
		return super.copy_from( ...args );
	}

	in_grouping( ...args ) {
		switch ( args.length ) {
			case 3:
				return this.in_grouping$esjava$3( ...args );
		}
		return super.in_grouping( ...args );
	}

	in_grouping_b( ...args ) {
		switch ( args.length ) {
			case 3:
				return this.in_grouping_b$esjava$3( ...args );
		}
		return super.in_grouping_b( ...args );
	}

	out_grouping( ...args ) {
		switch ( args.length ) {
			case 3:
				return this.out_grouping$esjava$3( ...args );
		}
		return super.out_grouping( ...args );
	}

	out_grouping_b( ...args ) {
		switch ( args.length ) {
			case 3:
				return this.out_grouping_b$esjava$3( ...args );
		}
		return super.out_grouping_b( ...args );
	}

	in_range( ...args ) {
		switch ( args.length ) {
			case 2:
				return this.in_range$esjava$2( ...args );
		}
		return super.in_range( ...args );
	}

	in_range_b( ...args ) {
		switch ( args.length ) {
			case 2:
				return this.in_range_b$esjava$2( ...args );
		}
		return super.in_range_b( ...args );
	}

	out_range( ...args ) {
		switch ( args.length ) {
			case 2:
				return this.out_range$esjava$2( ...args );
		}
		return super.out_range( ...args );
	}

	out_range_b( ...args ) {
		switch ( args.length ) {
			case 2:
				return this.out_range_b$esjava$2( ...args );
		}
		return super.out_range_b( ...args );
	}

	eq_s( ...args ) {
		switch ( args.length ) {
			case 2:
				return this.eq_s$esjava$2( ...args );
		}
		return super.eq_s( ...args );
	}

	eq_s_b( ...args ) {
		switch ( args.length ) {
			case 2:
				return this.eq_s_b$esjava$2( ...args );
		}
		return super.eq_s_b( ...args );
	}

	eq_v( ...args ) {
		switch ( args.length ) {
			case 1:
				return this.eq_v$esjava$1( ...args );
		}
		return super.eq_v( ...args );
	}

	eq_v_b( ...args ) {
		switch ( args.length ) {
			case 1:
				return this.eq_v_b$esjava$1( ...args );
		}
		return super.eq_v_b( ...args );
	}

	find_among( ...args ) {
		switch ( args.length ) {
			case 2:
				return this.find_among$esjava$2( ...args );
		}
		return super.find_among( ...args );
	}

	find_among_b( ...args ) {
		switch ( args.length ) {
			case 2:
				return this.find_among_b$esjava$2( ...args );
		}
		return super.find_among_b( ...args );
	}

	replace_s( ...args ) {
		switch ( args.length ) {
			case 3:
				return this.replace_s$esjava$3( ...args );
		}
		return super.replace_s( ...args );
	}

	slice_check( ...args ) {
		switch ( args.length ) {
			case 0:
				return this.slice_check$esjava$0( ...args );
		}
		return super.slice_check( ...args );
	}

	slice_from( ...args ) {
		switch ( args.length ) {
			case 1:
				return this.slice_from$esjava$1( ...args );
		}
		return super.slice_from( ...args );
	}

	slice_del( ...args ) {
		switch ( args.length ) {
			case 0:
				return this.slice_del$esjava$0( ...args );
		}
		return super.slice_del( ...args );
	}

	insert( ...args ) {
		switch ( args.length ) {
			case 3:
				return this.insert$esjava$3( ...args );
		}
		return super.insert( ...args );
	}

	slice_to( ...args ) {
		switch ( args.length ) {
			case 1:
				return this.slice_to$esjava$1( ...args );
		}
		return super.slice_to( ...args );
	}
}

class SnowballStemmer extends SnowballProgram {
	stem$esjava$0() {
		throw "NotImpl < stem$esjava$0 >";
	}

	stem( ...args ) {
		switch ( args.length ) {
			case 0:
				return this.stem$esjava$0( ...args );
		}
		return super.stem( ...args );
	}
}

class TurkishStemmer extends SnowballStemmer {
	constructor( morphologyData ) {
		super();
		TurkishStemmer.morphologyData = morphologyData.externalStemmer;
	}

	static get methodObject() {
		delete TurkishStemmer.methodObject;
		return TurkishStemmer.methodObject = null;
	}

	static get a_0() {
		delete TurkishStemmer.a_0;
		return TurkishStemmer.a_0 = [
			new Among( TurkishStemmer.morphologyData.a_0.SuffixM, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_0.SuffixN, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_0.SuffixMiz, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_0.SuffixNiz, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_0.SuffixMuz, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_0.SuffixNuz, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_0.SuffixMuzDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_0.SuffixNuzDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_0.SuffixMizUndotted, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_0.SuffixNizUndotted, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_1() {
		delete TurkishStemmer.a_1;
		return TurkishStemmer.a_1 = [
			new Among( TurkishStemmer.morphologyData.a_1.SuffixLeri, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_1.SuffixLariUndotted, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_2() {
		delete TurkishStemmer.a_2;
		return TurkishStemmer.a_2 = [
			new Among( TurkishStemmer.morphologyData.a_2.SuffixNi, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_2.SuffixNu, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_2.SuffixNuDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_2.SuffixNiUndotted, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_3() {
		delete TurkishStemmer.a_3;
		return TurkishStemmer.a_3 = [
			new Among( TurkishStemmer.morphologyData.a_3.SuffixInDotted, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_3.SuffixUn, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_3.SuffixUnDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_3.SuffixInUndotted, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_4() {
		delete TurkishStemmer.a_4;
		return TurkishStemmer.a_4 = [
			new Among( TurkishStemmer.morphologyData.a_4.SuffixA, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_4.SuffixE, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_5() {
		delete TurkishStemmer.a_5;
		return TurkishStemmer.a_5 = [
			new Among( TurkishStemmer.morphologyData.a_5.SuffixNa, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_5.SuffixNe, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_6() {
		delete TurkishStemmer.a_6;
		return TurkishStemmer.a_6 = [
			new Among( TurkishStemmer.morphologyData.a_6.SuffixDa, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_6.SuffixTa, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_6.SuffixDe, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_6.SuffixTe, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_7() {
		delete TurkishStemmer.a_7;
		return TurkishStemmer.a_7 = [
			new Among( TurkishStemmer.morphologyData.a_7.SuffixNda, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_7.SuffixNde, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_8() {
		delete TurkishStemmer.a_8;
		return TurkishStemmer.a_8 = [
			new Among( TurkishStemmer.morphologyData.a_8.SuffixDan, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_8.SuffixTan, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_8.SuffixDen, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_8.SuffixTen, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_9() {
		delete TurkishStemmer.a_9;
		return TurkishStemmer.a_9 = [
			new Among( TurkishStemmer.morphologyData.a_9.SuffixNdan, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_9.SuffixNden, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_10() {
		delete TurkishStemmer.a_10;
		return TurkishStemmer.a_10 = [
			new Among( TurkishStemmer.morphologyData.a_10.SuffixLa, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_10.SuffixLe, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_11() {
		delete TurkishStemmer.a_11;
		return TurkishStemmer.a_11 = [
			new Among( TurkishStemmer.morphologyData.a_11.SuffixCa, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_11.SuffixCe, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_12() {
		delete TurkishStemmer.a_12;
		return TurkishStemmer.a_12 = [
			new Among( TurkishStemmer.morphologyData.a_12.SuffixImDotted, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_12.SuffixUm, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_12.SuffixUmDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_12.SuffixImUndotted, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_13() {
		delete TurkishStemmer.a_13;
		return TurkishStemmer.a_13 = [
			new Among( TurkishStemmer.morphologyData.a_13.SuffixSin, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_13.SuffixSun, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_13.SuffixSunDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_13.SuffixSinUndotted, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_14() {
		delete TurkishStemmer.a_14;
		return TurkishStemmer.a_14 = [
			new Among( TurkishStemmer.morphologyData.a_14.SuffixIzDotted, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_14.SuffixUz, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_14.SuffixUzDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_14.SuffixIzUndotted, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_15() {
		delete TurkishStemmer.a_15;
		return TurkishStemmer.a_15 = [
			new Among( TurkishStemmer.morphologyData.a_15.SuffixSiniz, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_15.SuffixSunuz, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_15.SuffixSunuzDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_15.SuffixSinizUndotted, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_16() {
		delete TurkishStemmer.a_16;
		return TurkishStemmer.a_16 = [
			new Among( TurkishStemmer.morphologyData.a_16.SuffixLar, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_16.SuffixLer, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_17() {
		delete TurkishStemmer.a_17;
		return TurkishStemmer.a_17 = [
			new Among( TurkishStemmer.morphologyData.a_17.SuffixNiz, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_17.SuffixNuz, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_17.SuffixNuzDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_17.SuffixNizUndotted, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_18() {
		delete TurkishStemmer.a_18;
		return TurkishStemmer.a_18 = [
			new Among( TurkishStemmer.morphologyData.a_18.SuffixDir, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_18.SuffixTir, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_18.SuffixDur, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_18.SuffixTur, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_18.SuffixDurDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_18.SuffixTurDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_18.SuffixDirUndotted, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_18.SuffixTirUndotted, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_19() {
		delete TurkishStemmer.a_19;
		return TurkishStemmer.a_19 = [
			new Among( TurkishStemmer.morphologyData.a_19.SuffixCasinaUndotted, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_19.SuffixCesine, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_20() {
		delete TurkishStemmer.a_20;
		return TurkishStemmer.a_20 = [
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDi, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTi, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDik, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTik, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDuk, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTuk, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDukDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTukDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDikUndotted, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTikUndotted, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDim, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTim, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDum, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTum, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDumDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTumDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDimUndotted, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTimUndotted, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDin, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTin, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDun, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTun, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDunDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTunDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDinUndotted, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTinUndotted, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDu, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTu, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDuDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTuDieresis, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixDiUndotted, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_20.SuffixTiUndotted, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_21() {
		delete TurkishStemmer.a_21;
		return TurkishStemmer.a_21 = [
			new Among( TurkishStemmer.morphologyData.a_21.SuffixSa, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_21.SuffixSe, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_21.SuffixSak, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_21.SuffixSek, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_21.SuffixSam, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_21.SuffixSem, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_21.SuffixSan, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_21.SuffixSen, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_22() {
		delete TurkishStemmer.a_22;
		return TurkishStemmer.a_22 = [
			new Among( TurkishStemmer.morphologyData.a_22.SuffixMisCedilla, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_22.SuffixMusCedilla, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_22.SuffixMusDieresisCedilla, -1, -1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_22.SuffixMisUndottedCedilla, -1, -1, "", TurkishStemmer.methodObject ),
		];
	}

	static get a_23() {
		delete TurkishStemmer.a_23;
		return TurkishStemmer.a_23 = [
			new Among( TurkishStemmer.morphologyData.a_23.SuffixB, -1, 1, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_23.SuffixC, -1, 2, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_23.SuffixD, -1, 3, "", TurkishStemmer.methodObject ),
			new Among( TurkishStemmer.morphologyData.a_23.SuffixGSoft, -1, 4, "", TurkishStemmer.methodObject ),
		];
	}

	static get g_vowel() {
		delete TurkishStemmer.g_vowel;
		return TurkishStemmer.g_vowel = [
			17,
			65,
			16,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			32,
			8,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
		];
	}

	static get g_U() {
		delete TurkishStemmer.g_U;
		return TurkishStemmer.g_U = [
			1,
			16,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			8,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
		];
	}

	static get g_vowel1() {
		delete TurkishStemmer.g_vowel1;
		return TurkishStemmer.g_vowel1 = [
			1,
			64,
			16,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
		];
	}

	static get g_vowel2() {
		delete TurkishStemmer.g_vowel2;
		return TurkishStemmer.g_vowel2 = [
			17,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			130,
		];
	}

	static get g_vowel3() {
		delete TurkishStemmer.g_vowel3;
		return TurkishStemmer.g_vowel3 = [
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
		];
	}

	static get g_vowel4() {
		delete TurkishStemmer.g_vowel4;
		return TurkishStemmer.g_vowel4 = [ 17 ];
	}

	static get g_vowel5() {
		delete TurkishStemmer.g_vowel5;
		return TurkishStemmer.g_vowel5 = [ 65 ];
	}

	static get g_vowel6() {
		delete TurkishStemmer.g_vowel6;
		return TurkishStemmer.g_vowel6 = [ 65 ];
	}

	get B_continue_stemming_noun_suffixes() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$B_continue_stemming_noun_suffixes" ) ? this._$esjava$B_continue_stemming_noun_suffixes : this._$esjava$B_continue_stemming_noun_suffixes = false;
	}

	set B_continue_stemming_noun_suffixes( v ) {
		this._$esjava$B_continue_stemming_noun_suffixes = v;
	}

	get I_strlen() {
		return Object.prototype.hasOwnProperty.call( this, "_$esjava$I_strlen" ) ? this._$esjava$I_strlen : this._$esjava$I_strlen = 0;
	}

	set I_strlen( v ) {
		this._$esjava$I_strlen = v;
	}

	r_check_vowel_harmony$esjava$0() {
		let v_1;
		let v_2;
		let v_3;
		let v_4;
		let v_5;
		let v_6;
		let v_7;
		let v_8;
		let v_9;
		let v_10;
		let v_11;
		v_1 = this.limit - this.cursor;
		golab0:
		while ( true ) {
			v_2 = this.limit - this.cursor;
			lab1:
			do {
				if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel, 97, 305 ) ) {
					break lab1;
				}
				this.cursor = this.limit - v_2;
				break golab0;
			} while ( false );
			this.cursor = this.limit - v_2;
			if ( this.cursor <= this.limit_backward ) {
				return false;
			}
			this.cursor--;
		}
		lab2:
		do {
			v_3 = this.limit - this.cursor;
			lab3:
			do {
				if ( ! this.eq_s_b$esjava$2( 1, "a" ) ) {
					break lab3;
				}
				golab4:
				while ( true ) {
					v_4 = this.limit - this.cursor;
					lab5:
					do {
						if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel1, 97, 305 ) ) {
							break lab5;
						}
						this.cursor = this.limit - v_4;
						break golab4;
					} while ( false );
					this.cursor = this.limit - v_4;
					if ( this.cursor <= this.limit_backward ) {
						break lab3;
					}
					this.cursor--;
				}
				break lab2;
			} while ( false );
			this.cursor = this.limit - v_3;
			lab6:
			do {
				if ( ! this.eq_s_b$esjava$2( 1, "e" ) ) {
					break lab6;
				}
				golab7:
				while ( true ) {
					v_5 = this.limit - this.cursor;
					lab8:
					do {
						if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel2, 101, 252 ) ) {
							break lab8;
						}
						this.cursor = this.limit - v_5;
						break golab7;
					} while ( false );
					this.cursor = this.limit - v_5;
					if ( this.cursor <= this.limit_backward ) {
						break lab6;
					}
					this.cursor--;
				}
				break lab2;
			} while ( false );
			this.cursor = this.limit - v_3;
			lab9:
			do {
				if ( ! this.eq_s_b$esjava$2( 1, "\u0131" ) ) {
					break lab9;
				}
				golab10:
				while ( true ) {
					v_6 = this.limit - this.cursor;
					lab11:
					do {
						if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel3, 97, 305 ) ) {
							break lab11;
						}
						this.cursor = this.limit - v_6;
						break golab10;
					} while ( false );
					this.cursor = this.limit - v_6;
					if ( this.cursor <= this.limit_backward ) {
						break lab9;
					}
					this.cursor--;
				}
				break lab2;
			} while ( false );
			this.cursor = this.limit - v_3;
			lab12:
			do {
				if ( ! this.eq_s_b$esjava$2( 1, "i" ) ) {
					break lab12;
				}
				golab13:
				while ( true ) {
					v_7 = this.limit - this.cursor;
					lab14:
					do {
						if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel4, 101, 105 ) ) {
							break lab14;
						}
						this.cursor = this.limit - v_7;
						break golab13;
					} while ( false );
					this.cursor = this.limit - v_7;
					if ( this.cursor <= this.limit_backward ) {
						break lab12;
					}
					this.cursor--;
				}
				break lab2;
			} while ( false );
			this.cursor = this.limit - v_3;
			lab15:
			do {
				if ( ! this.eq_s_b$esjava$2( 1, "o" ) ) {
					break lab15;
				}
				golab16:
				while ( true ) {
					v_8 = this.limit - this.cursor;
					lab17:
					do {
						if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel5, 111, 117 ) ) {
							break lab17;
						}
						this.cursor = this.limit - v_8;
						break golab16;
					} while ( false );
					this.cursor = this.limit - v_8;
					if ( this.cursor <= this.limit_backward ) {
						break lab15;
					}
					this.cursor--;
				}
				break lab2;
			} while ( false );
			this.cursor = this.limit - v_3;
			lab18:
			do {
				if ( ! this.eq_s_b$esjava$2( 1, "\u00F6" ) ) {
					break lab18;
				}
				golab19:
				while ( true ) {
					v_9 = this.limit - this.cursor;
					lab20:
					do {
						if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel6, 246, 252 ) ) {
							break lab20;
						}
						this.cursor = this.limit - v_9;
						break golab19;
					} while ( false );
					this.cursor = this.limit - v_9;
					if ( this.cursor <= this.limit_backward ) {
						break lab18;
					}
					this.cursor--;
				}
				break lab2;
			} while ( false );
			this.cursor = this.limit - v_3;
			lab21:
			do {
				if ( ! this.eq_s_b$esjava$2( 1, "u" ) ) {
					break lab21;
				}
				golab22:
				while ( true ) {
					v_10 = this.limit - this.cursor;
					lab23:
					do {
						if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel5, 111, 117 ) ) {
							break lab23;
						}
						this.cursor = this.limit - v_10;
						break golab22;
					} while ( false );
					this.cursor = this.limit - v_10;
					if ( this.cursor <= this.limit_backward ) {
						break lab21;
					}
					this.cursor--;
				}
				break lab2;
			} while ( false );
			this.cursor = this.limit - v_3;
			if ( ! this.eq_s_b$esjava$2( 1, "\u00FC" ) ) {
				return false;
			}
			golab24:
			while ( true ) {
				v_11 = this.limit - this.cursor;
				lab25:
				do {
					if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel6, 246, 252 ) ) {
						break lab25;
					}
					this.cursor = this.limit - v_11;
					break golab24;
				} while ( false );
				this.cursor = this.limit - v_11;
				if ( this.cursor <= this.limit_backward ) {
					return false;
				}
				this.cursor--;
			}
		} while ( false );
		this.cursor = this.limit - v_1;
		return true;
	}

	r_mark_suffix_with_optional_n_consonant$esjava$0() {
		let v_1;
		let v_2;
		let v_3;
		let v_4;
		let v_5;
		let v_6;
		let v_7;
		lab0:
		do {
			v_1 = this.limit - this.cursor;
			lab1:
			do {
				v_2 = this.limit - this.cursor;
				if ( ! this.eq_s_b$esjava$2( 1, "n" ) ) {
					break lab1;
				}
				this.cursor = this.limit - v_2;
				if ( this.cursor <= this.limit_backward ) {
					break lab1;
				}
				this.cursor--;
				v_3 = this.limit - this.cursor;
				if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel, 97, 305 ) ) {
					break lab1;
				}
				this.cursor = this.limit - v_3;
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			{
				v_4 = this.limit - this.cursor;
				lab2:
				do {
					v_5 = this.limit - this.cursor;
					if ( ! this.eq_s_b$esjava$2( 1, "n" ) ) {
						break lab2;
					}
					this.cursor = this.limit - v_5;
					return false;
				} while ( false );
				this.cursor = this.limit - v_4;
			}
			v_6 = this.limit - this.cursor;
			if ( this.cursor <= this.limit_backward ) {
				return false;
			}
			this.cursor--;
			v_7 = this.limit - this.cursor;
			if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel, 97, 305 ) ) {
				return false;
			}
			this.cursor = this.limit - v_7;
			this.cursor = this.limit - v_6;
		} while ( false );
		return true;
	}

	r_mark_suffix_with_optional_s_consonant$esjava$0() {
		let v_1;
		let v_2;
		let v_3;
		let v_4;
		let v_5;
		let v_6;
		let v_7;
		lab0:
		do {
			v_1 = this.limit - this.cursor;
			lab1:
			do {
				v_2 = this.limit - this.cursor;
				if ( ! this.eq_s_b$esjava$2( 1, "s" ) ) {
					break lab1;
				}
				this.cursor = this.limit - v_2;
				if ( this.cursor <= this.limit_backward ) {
					break lab1;
				}
				this.cursor--;
				v_3 = this.limit - this.cursor;
				if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel, 97, 305 ) ) {
					break lab1;
				}
				this.cursor = this.limit - v_3;
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			{
				v_4 = this.limit - this.cursor;
				lab2:
				do {
					v_5 = this.limit - this.cursor;
					if ( ! this.eq_s_b$esjava$2( 1, "s" ) ) {
						break lab2;
					}
					this.cursor = this.limit - v_5;
					return false;
				} while ( false );
				this.cursor = this.limit - v_4;
			}
			v_6 = this.limit - this.cursor;
			if ( this.cursor <= this.limit_backward ) {
				return false;
			}
			this.cursor--;
			v_7 = this.limit - this.cursor;
			if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel, 97, 305 ) ) {
				return false;
			}
			this.cursor = this.limit - v_7;
			this.cursor = this.limit - v_6;
		} while ( false );
		return true;
	}

	r_mark_suffix_with_optional_y_consonant$esjava$0() {
		let v_1;
		let v_2;
		let v_3;
		let v_4;
		let v_5;
		let v_6;
		let v_7;
		lab0:
		do {
			v_1 = this.limit - this.cursor;
			lab1:
			do {
				v_2 = this.limit - this.cursor;
				if ( ! this.eq_s_b$esjava$2( 1, "y" ) ) {
					break lab1;
				}
				this.cursor = this.limit - v_2;
				if ( this.cursor <= this.limit_backward ) {
					break lab1;
				}
				this.cursor--;
				v_3 = this.limit - this.cursor;
				if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel, 97, 305 ) ) {
					break lab1;
				}
				this.cursor = this.limit - v_3;
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			{
				v_4 = this.limit - this.cursor;
				lab2:
				do {
					v_5 = this.limit - this.cursor;
					if ( ! this.eq_s_b$esjava$2( 1, "y" ) ) {
						break lab2;
					}
					this.cursor = this.limit - v_5;
					return false;
				} while ( false );
				this.cursor = this.limit - v_4;
			}
			v_6 = this.limit - this.cursor;
			if ( this.cursor <= this.limit_backward ) {
				return false;
			}
			this.cursor--;
			v_7 = this.limit - this.cursor;
			if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel, 97, 305 ) ) {
				return false;
			}
			this.cursor = this.limit - v_7;
			this.cursor = this.limit - v_6;
		} while ( false );
		return true;
	}

	r_mark_suffix_with_optional_U_vowel$esjava$0() {
		let v_1;
		let v_2;
		let v_3;
		let v_4;
		let v_5;
		let v_6;
		let v_7;
		lab0:
		do {
			v_1 = this.limit - this.cursor;
			lab1:
			do {
				v_2 = this.limit - this.cursor;
				if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_U, 105, 305 ) ) {
					break lab1;
				}
				this.cursor = this.limit - v_2;
				if ( this.cursor <= this.limit_backward ) {
					break lab1;
				}
				this.cursor--;
				v_3 = this.limit - this.cursor;
				if ( ! this.out_grouping_b$esjava$3( TurkishStemmer.g_vowel, 97, 305 ) ) {
					break lab1;
				}
				this.cursor = this.limit - v_3;
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			{
				v_4 = this.limit - this.cursor;
				lab2:
				do {
					v_5 = this.limit - this.cursor;
					if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_U, 105, 305 ) ) {
						break lab2;
					}
					this.cursor = this.limit - v_5;
					return false;
				} while ( false );
				this.cursor = this.limit - v_4;
			}
			v_6 = this.limit - this.cursor;
			if ( this.cursor <= this.limit_backward ) {
				return false;
			}
			this.cursor--;
			v_7 = this.limit - this.cursor;
			if ( ! this.out_grouping_b$esjava$3( TurkishStemmer.g_vowel, 97, 305 ) ) {
				return false;
			}
			this.cursor = this.limit - v_7;
			this.cursor = this.limit - v_6;
		} while ( false );
		return true;
	}

	r_mark_possessives$esjava$0() {
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_0, 10 ) === 0 ) {
			return false;
		}
		if ( ! this.r_mark_suffix_with_optional_U_vowel$esjava$0() ) {
			return false;
		}
		return true;
	}

	r_mark_sU$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_U, 105, 305 ) ) {
			return false;
		}
		if ( ! this.r_mark_suffix_with_optional_s_consonant$esjava$0() ) {
			return false;
		}
		return true;
	}

	r_mark_lArI$esjava$0() {
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_1, 2 ) === 0 ) {
			return false;
		}
		return true;
	}

	r_mark_yU$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_U, 105, 305 ) ) {
			return false;
		}
		if ( ! this.r_mark_suffix_with_optional_y_consonant$esjava$0() ) {
			return false;
		}
		return true;
	}

	r_mark_nU$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_2, 4 ) === 0 ) {
			return false;
		}
		return true;
	}

	r_mark_nUn$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_3, 4 ) === 0 ) {
			return false;
		}
		if ( ! this.r_mark_suffix_with_optional_n_consonant$esjava$0() ) {
			return false;
		}
		return true;
	}

	r_mark_yA$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_4, 2 ) === 0 ) {
			return false;
		}
		if ( ! this.r_mark_suffix_with_optional_y_consonant$esjava$0() ) {
			return false;
		}
		return true;
	}

	r_mark_nA$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_5, 2 ) === 0 ) {
			return false;
		}
		return true;
	}

	r_mark_DA$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_6, 4 ) === 0 ) {
			return false;
		}
		return true;
	}

	r_mark_ndA$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_7, 2 ) === 0 ) {
			return false;
		}
		return true;
	}

	r_mark_DAn$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_8, 4 ) === 0 ) {
			return false;
		}
		return true;
	}

	r_mark_ndAn$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_9, 2 ) === 0 ) {
			return false;
		}
		return true;
	}

	r_mark_ylA$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_10, 2 ) === 0 ) {
			return false;
		}
		if ( ! this.r_mark_suffix_with_optional_y_consonant$esjava$0() ) {
			return false;
		}
		return true;
	}

	r_mark_ki$esjava$0() {
		if ( ! this.eq_s_b$esjava$2( 2, "ki" ) ) {
			return false;
		}
		return true;
	}

	r_mark_ncA$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_11, 2 ) === 0 ) {
			return false;
		}
		if ( ! this.r_mark_suffix_with_optional_n_consonant$esjava$0() ) {
			return false;
		}
		return true;
	}

	r_mark_yUm$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_12, 4 ) === 0 ) {
			return false;
		}
		if ( ! this.r_mark_suffix_with_optional_y_consonant$esjava$0() ) {
			return false;
		}
		return true;
	}

	r_mark_sUn$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_13, 4 ) === 0 ) {
			return false;
		}
		return true;
	}

	r_mark_yUz$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_14, 4 ) === 0 ) {
			return false;
		}
		if ( ! this.r_mark_suffix_with_optional_y_consonant$esjava$0() ) {
			return false;
		}
		return true;
	}

	r_mark_sUnUz$esjava$0() {
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_15, 4 ) === 0 ) {
			return false;
		}
		return true;
	}

	r_mark_lAr$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_16, 2 ) === 0 ) {
			return false;
		}
		return true;
	}

	r_mark_nUz$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_17, 4 ) === 0 ) {
			return false;
		}
		return true;
	}

	r_mark_DUr$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_18, 8 ) === 0 ) {
			return false;
		}
		return true;
	}

	r_mark_cAsInA$esjava$0() {
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_19, 2 ) === 0 ) {
			return false;
		}
		return true;
	}

	r_mark_yDU$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_20, 32 ) === 0 ) {
			return false;
		}
		if ( ! this.r_mark_suffix_with_optional_y_consonant$esjava$0() ) {
			return false;
		}
		return true;
	}

	r_mark_ysA$esjava$0() {
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_21, 8 ) === 0 ) {
			return false;
		}
		if ( ! this.r_mark_suffix_with_optional_y_consonant$esjava$0() ) {
			return false;
		}
		return true;
	}

	r_mark_ymUs_$esjava$0() {
		if ( ! this.r_check_vowel_harmony$esjava$0() ) {
			return false;
		}
		if ( this.find_among_b$esjava$2( TurkishStemmer.a_22, 4 ) === 0 ) {
			return false;
		}
		if ( ! this.r_mark_suffix_with_optional_y_consonant$esjava$0() ) {
			return false;
		}
		return true;
	}

	r_mark_yken$esjava$0() {
		if ( ! this.eq_s_b$esjava$2( 3, "ken" ) ) {
			return false;
		}
		if ( ! this.r_mark_suffix_with_optional_y_consonant$esjava$0() ) {
			return false;
		}
		return true;
	}

	r_stem_nominal_verb_suffixes$esjava$0() {
		let v_1;
		let v_2;
		let v_3;
		let v_4;
		let v_5;
		let v_6;
		let v_7;
		let v_8;
		let v_9;
		let v_10;
		this.ket = this.cursor;
		this.B_continue_stemming_noun_suffixes = true;
		lab0:
		do {
			v_1 = this.limit - this.cursor;
			lab1:
			do {
				lab2:
				do {
					v_2 = this.limit - this.cursor;
					lab3:
					do {
						if ( ! this.r_mark_ymUs_$esjava$0() ) {
							break lab3;
						}
						break lab2;
					} while ( false );
					this.cursor = this.limit - v_2;
					lab4:
					do {
						if ( ! this.r_mark_yDU$esjava$0() ) {
							break lab4;
						}
						break lab2;
					} while ( false );
					this.cursor = this.limit - v_2;
					lab5:
					do {
						if ( ! this.r_mark_ysA$esjava$0() ) {
							break lab5;
						}
						break lab2;
					} while ( false );
					this.cursor = this.limit - v_2;
					if ( ! this.r_mark_yken$esjava$0() ) {
						break lab1;
					}
				} while ( false );
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			lab6:
			do {
				if ( ! this.r_mark_cAsInA$esjava$0() ) {
					break lab6;
				}
				lab7:
				do {
					v_3 = this.limit - this.cursor;
					lab8:
					do {
						if ( ! this.r_mark_sUnUz$esjava$0() ) {
							break lab8;
						}
						break lab7;
					} while ( false );
					this.cursor = this.limit - v_3;
					lab9:
					do {
						if ( ! this.r_mark_lAr$esjava$0() ) {
							break lab9;
						}
						break lab7;
					} while ( false );
					this.cursor = this.limit - v_3;
					lab10:
					do {
						if ( ! this.r_mark_yUm$esjava$0() ) {
							break lab10;
						}
						break lab7;
					} while ( false );
					this.cursor = this.limit - v_3;
					lab11:
					do {
						if ( ! this.r_mark_sUn$esjava$0() ) {
							break lab11;
						}
						break lab7;
					} while ( false );
					this.cursor = this.limit - v_3;
					lab12:
					do {
						if ( ! this.r_mark_yUz$esjava$0() ) {
							break lab12;
						}
						break lab7;
					} while ( false );
					this.cursor = this.limit - v_3;
				} while ( false );
				if ( ! this.r_mark_ymUs_$esjava$0() ) {
					break lab6;
				}
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			lab13:
			do {
				if ( ! this.r_mark_lAr$esjava$0() ) {
					break lab13;
				}
				this.bra = this.cursor;
				this.slice_del$esjava$0();
				v_4 = this.limit - this.cursor;
				lab14:
				do {
					this.ket = this.cursor;
					lab15:
					do {
						v_5 = this.limit - this.cursor;
						lab16:
						do {
							if ( ! this.r_mark_DUr$esjava$0() ) {
								break lab16;
							}
							break lab15;
						} while ( false );
						this.cursor = this.limit - v_5;
						lab17:
						do {
							if ( ! this.r_mark_yDU$esjava$0() ) {
								break lab17;
							}
							break lab15;
						} while ( false );
						this.cursor = this.limit - v_5;
						lab18:
						do {
							if ( ! this.r_mark_ysA$esjava$0() ) {
								break lab18;
							}
							break lab15;
						} while ( false );
						this.cursor = this.limit - v_5;
						if ( ! this.r_mark_ymUs_$esjava$0() ) {
							this.cursor = this.limit - v_4;
							break lab14;
						}
					} while ( false );
				} while ( false );
				this.B_continue_stemming_noun_suffixes = false;
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			lab19:
			do {
				if ( ! this.r_mark_nUz$esjava$0() ) {
					break lab19;
				}
				lab20:
				do {
					v_6 = this.limit - this.cursor;
					lab21:
					do {
						if ( ! this.r_mark_yDU$esjava$0() ) {
							break lab21;
						}
						break lab20;
					} while ( false );
					this.cursor = this.limit - v_6;
					if ( ! this.r_mark_ysA$esjava$0() ) {
						break lab19;
					}
				} while ( false );
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			lab22:
			do {
				lab23:
				do {
					v_7 = this.limit - this.cursor;
					lab24:
					do {
						if ( ! this.r_mark_sUnUz$esjava$0() ) {
							break lab24;
						}
						break lab23;
					} while ( false );
					this.cursor = this.limit - v_7;
					lab25:
					do {
						if ( ! this.r_mark_yUz$esjava$0() ) {
							break lab25;
						}
						break lab23;
					} while ( false );
					this.cursor = this.limit - v_7;
					lab26:
					do {
						if ( ! this.r_mark_sUn$esjava$0() ) {
							break lab26;
						}
						break lab23;
					} while ( false );
					this.cursor = this.limit - v_7;
					if ( ! this.r_mark_yUm$esjava$0() ) {
						break lab22;
					}
				} while ( false );
				this.bra = this.cursor;
				this.slice_del$esjava$0();
				v_8 = this.limit - this.cursor;
				lab27:
				do {
					this.ket = this.cursor;
					if ( ! this.r_mark_ymUs_$esjava$0() ) {
						this.cursor = this.limit - v_8;
						break lab27;
					}
				} while ( false );
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			if ( ! this.r_mark_DUr$esjava$0() ) {
				return false;
			}
			this.bra = this.cursor;
			this.slice_del$esjava$0();
			v_9 = this.limit - this.cursor;
			lab28:
			do {
				this.ket = this.cursor;
				lab29:
				do {
					v_10 = this.limit - this.cursor;
					lab30:
					do {
						if ( ! this.r_mark_sUnUz$esjava$0() ) {
							break lab30;
						}
						break lab29;
					} while ( false );
					this.cursor = this.limit - v_10;
					lab31:
					do {
						if ( ! this.r_mark_lAr$esjava$0() ) {
							break lab31;
						}
						break lab29;
					} while ( false );
					this.cursor = this.limit - v_10;
					lab32:
					do {
						if ( ! this.r_mark_yUm$esjava$0() ) {
							break lab32;
						}
						break lab29;
					} while ( false );
					this.cursor = this.limit - v_10;
					lab33:
					do {
						if ( ! this.r_mark_sUn$esjava$0() ) {
							break lab33;
						}
						break lab29;
					} while ( false );
					this.cursor = this.limit - v_10;
					lab34:
					do {
						if ( ! this.r_mark_yUz$esjava$0() ) {
							break lab34;
						}
						break lab29;
					} while ( false );
					this.cursor = this.limit - v_10;
				} while ( false );
				if ( ! this.r_mark_ymUs_$esjava$0() ) {
					this.cursor = this.limit - v_9;
					break lab28;
				}
			} while ( false );
		} while ( false );
		this.bra = this.cursor;
		this.slice_del$esjava$0();
		return true;
	}

	r_stem_suffix_chain_before_ki$esjava$0() {
		let v_1;
		let v_2;
		let v_3;
		let v_4;
		let v_5;
		let v_6;
		let v_7;
		let v_8;
		let v_9;
		let v_10;
		let v_11;
		this.ket = this.cursor;
		if ( ! this.r_mark_ki$esjava$0() ) {
			return false;
		}
		lab0:
		do {
			v_1 = this.limit - this.cursor;
			lab1:
			do {
				if ( ! this.r_mark_DA$esjava$0() ) {
					break lab1;
				}
				this.bra = this.cursor;
				this.slice_del$esjava$0();
				v_2 = this.limit - this.cursor;
				lab2:
				do {
					this.ket = this.cursor;
					lab3:
					do {
						v_3 = this.limit - this.cursor;
						lab4:
						do {
							if ( ! this.r_mark_lAr$esjava$0() ) {
								break lab4;
							}
							this.bra = this.cursor;
							this.slice_del$esjava$0();
							v_4 = this.limit - this.cursor;
							lab5:
							do {
								if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
									this.cursor = this.limit - v_4;
									break lab5;
								}
							} while ( false );
							break lab3;
						} while ( false );
						this.cursor = this.limit - v_3;
						if ( ! this.r_mark_possessives$esjava$0() ) {
							this.cursor = this.limit - v_2;
							break lab2;
						}
						this.bra = this.cursor;
						this.slice_del$esjava$0();
						v_5 = this.limit - this.cursor;
						lab6:
						do {
							this.ket = this.cursor;
							if ( ! this.r_mark_lAr$esjava$0() ) {
								this.cursor = this.limit - v_5;
								break lab6;
							}
							this.bra = this.cursor;
							this.slice_del$esjava$0();
							if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
								this.cursor = this.limit - v_5;
								break lab6;
							}
						} while ( false );
					} while ( false );
				} while ( false );
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			lab7:
			do {
				if ( ! this.r_mark_nUn$esjava$0() ) {
					break lab7;
				}
				this.bra = this.cursor;
				this.slice_del$esjava$0();
				v_6 = this.limit - this.cursor;
				lab8:
				do {
					this.ket = this.cursor;
					lab9:
					do {
						v_7 = this.limit - this.cursor;
						lab10:
						do {
							if ( ! this.r_mark_lArI$esjava$0() ) {
								break lab10;
							}
							this.bra = this.cursor;
							this.slice_del$esjava$0();
							break lab9;
						} while ( false );
						this.cursor = this.limit - v_7;
						lab11:
						do {
							this.ket = this.cursor;
							lab12:
							do {
								v_8 = this.limit - this.cursor;
								lab13:
								do {
									if ( ! this.r_mark_possessives$esjava$0() ) {
										break lab13;
									}
									break lab12;
								} while ( false );
								this.cursor = this.limit - v_8;
								if ( ! this.r_mark_sU$esjava$0() ) {
									break lab11;
								}
							} while ( false );
							this.bra = this.cursor;
							this.slice_del$esjava$0();
							v_9 = this.limit - this.cursor;
							lab14:
							do {
								this.ket = this.cursor;
								if ( ! this.r_mark_lAr$esjava$0() ) {
									this.cursor = this.limit - v_9;
									break lab14;
								}
								this.bra = this.cursor;
								this.slice_del$esjava$0();
								if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
									this.cursor = this.limit - v_9;
									break lab14;
								}
							} while ( false );
							break lab9;
						} while ( false );
						this.cursor = this.limit - v_7;
						if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
							this.cursor = this.limit - v_6;
							break lab8;
						}
					} while ( false );
				} while ( false );
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			if ( ! this.r_mark_ndA$esjava$0() ) {
				return false;
			}
			lab15:
			do {
				v_10 = this.limit - this.cursor;
				lab16:
				do {
					if ( ! this.r_mark_lArI$esjava$0() ) {
						break lab16;
					}
					this.bra = this.cursor;
					this.slice_del$esjava$0();
					break lab15;
				} while ( false );
				this.cursor = this.limit - v_10;
				lab17:
				do {
					if ( ! this.r_mark_sU$esjava$0() ) {
						break lab17;
					}
					this.bra = this.cursor;
					this.slice_del$esjava$0();
					v_11 = this.limit - this.cursor;
					lab18:
					do {
						this.ket = this.cursor;
						if ( ! this.r_mark_lAr$esjava$0() ) {
							this.cursor = this.limit - v_11;
							break lab18;
						}
						this.bra = this.cursor;
						this.slice_del$esjava$0();
						if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
							this.cursor = this.limit - v_11;
							break lab18;
						}
					} while ( false );
					break lab15;
				} while ( false );
				this.cursor = this.limit - v_10;
				if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
					return false;
				}
			} while ( false );
		} while ( false );
		return true;
	}

	r_stem_noun_suffixes$esjava$0() {
		let v_1;
		let v_2;
		let v_3;
		let v_4;
		let v_5;
		let v_6;
		let v_7;
		let v_8;
		let v_9;
		let v_10;
		let v_11;
		let v_12;
		let v_13;
		let v_14;
		let v_15;
		let v_16;
		let v_17;
		let v_18;
		let v_19;
		let v_20;
		let v_21;
		let v_22;
		let v_23;
		let v_24;
		let v_25;
		let v_26;
		let v_27;
		lab0:
		do {
			v_1 = this.limit - this.cursor;
			lab1:
			do {
				this.ket = this.cursor;
				if ( ! this.r_mark_lAr$esjava$0() ) {
					break lab1;
				}
				this.bra = this.cursor;
				this.slice_del$esjava$0();
				v_2 = this.limit - this.cursor;
				lab2:
				do {
					if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
						this.cursor = this.limit - v_2;
						break lab2;
					}
				} while ( false );
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			lab3:
			do {
				this.ket = this.cursor;
				if ( ! this.r_mark_ncA$esjava$0() ) {
					break lab3;
				}
				this.bra = this.cursor;
				this.slice_del$esjava$0();
				v_3 = this.limit - this.cursor;
				lab4:
				do {
					lab5:
					do {
						v_4 = this.limit - this.cursor;
						lab6:
						do {
							this.ket = this.cursor;
							if ( ! this.r_mark_lArI$esjava$0() ) {
								break lab6;
							}
							this.bra = this.cursor;
							this.slice_del$esjava$0();
							break lab5;
						} while ( false );
						this.cursor = this.limit - v_4;
						lab7:
						do {
							this.ket = this.cursor;
							lab8:
							do {
								v_5 = this.limit - this.cursor;
								lab9:
								do {
									if ( ! this.r_mark_possessives$esjava$0() ) {
										break lab9;
									}
									break lab8;
								} while ( false );
								this.cursor = this.limit - v_5;
								if ( ! this.r_mark_sU$esjava$0() ) {
									break lab7;
								}
							} while ( false );
							this.bra = this.cursor;
							this.slice_del$esjava$0();
							v_6 = this.limit - this.cursor;
							lab10:
							do {
								this.ket = this.cursor;
								if ( ! this.r_mark_lAr$esjava$0() ) {
									this.cursor = this.limit - v_6;
									break lab10;
								}
								this.bra = this.cursor;
								this.slice_del$esjava$0();
								if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
									this.cursor = this.limit - v_6;
									break lab10;
								}
							} while ( false );
							break lab5;
						} while ( false );
						this.cursor = this.limit - v_4;
						this.ket = this.cursor;
						if ( ! this.r_mark_lAr$esjava$0() ) {
							this.cursor = this.limit - v_3;
							break lab4;
						}
						this.bra = this.cursor;
						this.slice_del$esjava$0();
						if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
							this.cursor = this.limit - v_3;
							break lab4;
						}
					} while ( false );
				} while ( false );
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			lab11:
			do {
				this.ket = this.cursor;
				lab12:
				do {
					v_7 = this.limit - this.cursor;
					lab13:
					do {
						if ( ! this.r_mark_ndA$esjava$0() ) {
							break lab13;
						}
						break lab12;
					} while ( false );
					this.cursor = this.limit - v_7;
					if ( ! this.r_mark_nA$esjava$0() ) {
						break lab11;
					}
				} while ( false );
				lab14:
				do {
					v_8 = this.limit - this.cursor;
					lab15:
					do {
						if ( ! this.r_mark_lArI$esjava$0() ) {
							break lab15;
						}
						this.bra = this.cursor;
						this.slice_del$esjava$0();
						break lab14;
					} while ( false );
					this.cursor = this.limit - v_8;
					lab16:
					do {
						if ( ! this.r_mark_sU$esjava$0() ) {
							break lab16;
						}
						this.bra = this.cursor;
						this.slice_del$esjava$0();
						v_9 = this.limit - this.cursor;
						lab17:
						do {
							this.ket = this.cursor;
							if ( ! this.r_mark_lAr$esjava$0() ) {
								this.cursor = this.limit - v_9;
								break lab17;
							}
							this.bra = this.cursor;
							this.slice_del$esjava$0();
							if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
								this.cursor = this.limit - v_9;
								break lab17;
							}
						} while ( false );
						break lab14;
					} while ( false );
					this.cursor = this.limit - v_8;
					if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
						break lab11;
					}
				} while ( false );
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			lab18:
			do {
				this.ket = this.cursor;
				lab19:
				do {
					v_10 = this.limit - this.cursor;
					lab20:
					do {
						if ( ! this.r_mark_ndAn$esjava$0() ) {
							break lab20;
						}
						break lab19;
					} while ( false );
					this.cursor = this.limit - v_10;
					if ( ! this.r_mark_nU$esjava$0() ) {
						break lab18;
					}
				} while ( false );
				lab21:
				do {
					v_11 = this.limit - this.cursor;
					lab22:
					do {
						if ( ! this.r_mark_sU$esjava$0() ) {
							break lab22;
						}
						this.bra = this.cursor;
						this.slice_del$esjava$0();
						v_12 = this.limit - this.cursor;
						lab23:
						do {
							this.ket = this.cursor;
							if ( ! this.r_mark_lAr$esjava$0() ) {
								this.cursor = this.limit - v_12;
								break lab23;
							}
							this.bra = this.cursor;
							this.slice_del$esjava$0();
							if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
								this.cursor = this.limit - v_12;
								break lab23;
							}
						} while ( false );
						break lab21;
					} while ( false );
					this.cursor = this.limit - v_11;
					if ( ! this.r_mark_lArI$esjava$0() ) {
						break lab18;
					}
				} while ( false );
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			lab24:
			do {
				this.ket = this.cursor;
				if ( ! this.r_mark_DAn$esjava$0() ) {
					break lab24;
				}
				this.bra = this.cursor;
				this.slice_del$esjava$0();
				v_13 = this.limit - this.cursor;
				lab25:
				do {
					this.ket = this.cursor;
					lab26:
					do {
						v_14 = this.limit - this.cursor;
						lab27:
						do {
							if ( ! this.r_mark_possessives$esjava$0() ) {
								break lab27;
							}
							this.bra = this.cursor;
							this.slice_del$esjava$0();
							v_15 = this.limit - this.cursor;
							lab28:
							do {
								this.ket = this.cursor;
								if ( ! this.r_mark_lAr$esjava$0() ) {
									this.cursor = this.limit - v_15;
									break lab28;
								}
								this.bra = this.cursor;
								this.slice_del$esjava$0();
								if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
									this.cursor = this.limit - v_15;
									break lab28;
								}
							} while ( false );
							break lab26;
						} while ( false );
						this.cursor = this.limit - v_14;
						lab29:
						do {
							if ( ! this.r_mark_lAr$esjava$0() ) {
								break lab29;
							}
							this.bra = this.cursor;
							this.slice_del$esjava$0();
							v_16 = this.limit - this.cursor;
							lab30:
							do {
								if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
									this.cursor = this.limit - v_16;
									break lab30;
								}
							} while ( false );
							break lab26;
						} while ( false );
						this.cursor = this.limit - v_14;
						if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
							this.cursor = this.limit - v_13;
							break lab25;
						}
					} while ( false );
				} while ( false );
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			lab31:
			do {
				this.ket = this.cursor;
				lab32:
				do {
					v_17 = this.limit - this.cursor;
					lab33:
					do {
						if ( ! this.r_mark_nUn$esjava$0() ) {
							break lab33;
						}
						break lab32;
					} while ( false );
					this.cursor = this.limit - v_17;
					if ( ! this.r_mark_ylA$esjava$0() ) {
						break lab31;
					}
				} while ( false );
				this.bra = this.cursor;
				this.slice_del$esjava$0();
				v_18 = this.limit - this.cursor;
				lab34:
				do {
					lab35:
					do {
						v_19 = this.limit - this.cursor;
						lab36:
						do {
							this.ket = this.cursor;
							if ( ! this.r_mark_lAr$esjava$0() ) {
								break lab36;
							}
							this.bra = this.cursor;
							this.slice_del$esjava$0();
							if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
								break lab36;
							}
							break lab35;
						} while ( false );
						this.cursor = this.limit - v_19;
						lab37:
						do {
							this.ket = this.cursor;
							lab38:
							do {
								v_20 = this.limit - this.cursor;
								lab39:
								do {
									if ( ! this.r_mark_possessives$esjava$0() ) {
										break lab39;
									}
									break lab38;
								} while ( false );
								this.cursor = this.limit - v_20;
								if ( ! this.r_mark_sU$esjava$0() ) {
									break lab37;
								}
							} while ( false );
							this.bra = this.cursor;
							this.slice_del$esjava$0();
							v_21 = this.limit - this.cursor;
							lab40:
							do {
								this.ket = this.cursor;
								if ( ! this.r_mark_lAr$esjava$0() ) {
									this.cursor = this.limit - v_21;
									break lab40;
								}
								this.bra = this.cursor;
								this.slice_del$esjava$0();
								if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
									this.cursor = this.limit - v_21;
									break lab40;
								}
							} while ( false );
							break lab35;
						} while ( false );
						this.cursor = this.limit - v_19;
						if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
							this.cursor = this.limit - v_18;
							break lab34;
						}
					} while ( false );
				} while ( false );
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			lab41:
			do {
				this.ket = this.cursor;
				if ( ! this.r_mark_lArI$esjava$0() ) {
					break lab41;
				}
				this.bra = this.cursor;
				this.slice_del$esjava$0();
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			lab42:
			do {
				if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
					break lab42;
				}
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			lab43:
			do {
				this.ket = this.cursor;
				lab44:
				do {
					v_22 = this.limit - this.cursor;
					lab45:
					do {
						if ( ! this.r_mark_DA$esjava$0() ) {
							break lab45;
						}
						break lab44;
					} while ( false );
					this.cursor = this.limit - v_22;
					lab46:
					do {
						if ( ! this.r_mark_yU$esjava$0() ) {
							break lab46;
						}
						break lab44;
					} while ( false );
					this.cursor = this.limit - v_22;
					if ( ! this.r_mark_yA$esjava$0() ) {
						break lab43;
					}
				} while ( false );
				this.bra = this.cursor;
				this.slice_del$esjava$0();
				v_23 = this.limit - this.cursor;
				lab47:
				do {
					this.ket = this.cursor;
					lab48:
					do {
						v_24 = this.limit - this.cursor;
						lab49:
						do {
							if ( ! this.r_mark_possessives$esjava$0() ) {
								break lab49;
							}
							this.bra = this.cursor;
							this.slice_del$esjava$0();
							v_25 = this.limit - this.cursor;
							lab50:
							do {
								this.ket = this.cursor;
								if ( ! this.r_mark_lAr$esjava$0() ) {
									this.cursor = this.limit - v_25;
									break lab50;
								}
							} while ( false );
							break lab48;
						} while ( false );
						this.cursor = this.limit - v_24;
						if ( ! this.r_mark_lAr$esjava$0() ) {
							this.cursor = this.limit - v_23;
							break lab47;
						}
					} while ( false );
					this.bra = this.cursor;
					this.slice_del$esjava$0();
					this.ket = this.cursor;
					if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
						this.cursor = this.limit - v_23;
						break lab47;
					}
				} while ( false );
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_1;
			this.ket = this.cursor;
			lab51:
			do {
				v_26 = this.limit - this.cursor;
				lab52:
				do {
					if ( ! this.r_mark_possessives$esjava$0() ) {
						break lab52;
					}
					break lab51;
				} while ( false );
				this.cursor = this.limit - v_26;
				if ( ! this.r_mark_sU$esjava$0() ) {
					return false;
				}
			} while ( false );
			this.bra = this.cursor;
			this.slice_del$esjava$0();
			v_27 = this.limit - this.cursor;
			lab53:
			do {
				this.ket = this.cursor;
				if ( ! this.r_mark_lAr$esjava$0() ) {
					this.cursor = this.limit - v_27;
					break lab53;
				}
				this.bra = this.cursor;
				this.slice_del$esjava$0();
				if ( ! this.r_stem_suffix_chain_before_ki$esjava$0() ) {
					this.cursor = this.limit - v_27;
					break lab53;
				}
			} while ( false );
		} while ( false );
		return true;
	}

	r_post_process_last_consonants$esjava$0() {
		let among_var;
		this.ket = this.cursor;
		among_var = this.find_among_b$esjava$2( TurkishStemmer.a_23, 4 );
		if ( among_var === 0 ) {
			return false;
		}
		this.bra = this.cursor;
		switch ( among_var ) {
			case 0:
				return false;
			case 1:
				this.slice_from$esjava$1( "p" );
				break;
			case 2:
				this.slice_from$esjava$1( "\u00E7" );
				break;
			case 3:
				this.slice_from$esjava$1( "t" );
				break;
			case 4:
				this.slice_from$esjava$1( "k" );
				break;
		}
		return true;
	}

	r_append_U_to_stems_ending_with_d_or_g$esjava$0() {
		let v_1;
		let v_2;
		let v_3;
		let v_4;
		let v_5;
		let v_6;
		let v_7;
		let v_8;
		let v_9;
		let v_10;
		let v_11;
		let v_12;
		let v_13;
		let v_14;
		let v_15;
		v_1 = this.limit - this.cursor;
		lab0:
		do {
			v_2 = this.limit - this.cursor;
			lab1:
			do {
				if ( ! this.eq_s_b$esjava$2( 1, "d" ) ) {
					break lab1;
				}
				break lab0;
			} while ( false );
			this.cursor = this.limit - v_2;
			if ( ! this.eq_s_b$esjava$2( 1, "g" ) ) {
				return false;
			}
		} while ( false );
		this.cursor = this.limit - v_1;
		lab2:
		do {
			v_3 = this.limit - this.cursor;
			lab3:
			do {
				v_4 = this.limit - this.cursor;
				golab4:
				while ( true ) {
					v_5 = this.limit - this.cursor;
					lab5:
					do {
						if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel, 97, 305 ) ) {
							break lab5;
						}
						this.cursor = this.limit - v_5;
						break golab4;
					} while ( false );
					this.cursor = this.limit - v_5;
					if ( this.cursor <= this.limit_backward ) {
						break lab3;
					}
					this.cursor--;
				}
				lab6:
				do {
					v_6 = this.limit - this.cursor;
					lab7:
					do {
						if ( ! this.eq_s_b$esjava$2( 1, "a" ) ) {
							break lab7;
						}
						break lab6;
					} while ( false );
					this.cursor = this.limit - v_6;
					if ( ! this.eq_s_b$esjava$2( 1, "\u0131" ) ) {
						break lab3;
					}
				} while ( false );
				this.cursor = this.limit - v_4;
				{
					const c = this.cursor;
					this.insert$esjava$3( this.cursor, this.cursor, "\u0131" );
					this.cursor = c;
				}
				break lab2;
			} while ( false );
			this.cursor = this.limit - v_3;
			lab8:
			do {
				v_7 = this.limit - this.cursor;
				golab9:
				while ( true ) {
					v_8 = this.limit - this.cursor;
					lab10:
					do {
						if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel, 97, 305 ) ) {
							break lab10;
						}
						this.cursor = this.limit - v_8;
						break golab9;
					} while ( false );
					this.cursor = this.limit - v_8;
					if ( this.cursor <= this.limit_backward ) {
						break lab8;
					}
					this.cursor--;
				}
				lab11:
				do {
					v_9 = this.limit - this.cursor;
					lab12:
					do {
						if ( ! this.eq_s_b$esjava$2( 1, "e" ) ) {
							break lab12;
						}
						break lab11;
					} while ( false );
					this.cursor = this.limit - v_9;
					if ( ! this.eq_s_b$esjava$2( 1, "i" ) ) {
						break lab8;
					}
				} while ( false );
				this.cursor = this.limit - v_7;
				{
					const c = this.cursor;
					this.insert$esjava$3( this.cursor, this.cursor, "i" );
					this.cursor = c;
				}
				break lab2;
			} while ( false );
			this.cursor = this.limit - v_3;
			lab13:
			do {
				v_10 = this.limit - this.cursor;
				golab14:
				while ( true ) {
					v_11 = this.limit - this.cursor;
					lab15:
					do {
						if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel, 97, 305 ) ) {
							break lab15;
						}
						this.cursor = this.limit - v_11;
						break golab14;
					} while ( false );
					this.cursor = this.limit - v_11;
					if ( this.cursor <= this.limit_backward ) {
						break lab13;
					}
					this.cursor--;
				}
				lab16:
				do {
					v_12 = this.limit - this.cursor;
					lab17:
					do {
						if ( ! this.eq_s_b$esjava$2( 1, "o" ) ) {
							break lab17;
						}
						break lab16;
					} while ( false );
					this.cursor = this.limit - v_12;
					if ( ! this.eq_s_b$esjava$2( 1, "u" ) ) {
						break lab13;
					}
				} while ( false );
				this.cursor = this.limit - v_10;
				{
					const c = this.cursor;
					this.insert$esjava$3( this.cursor, this.cursor, "u" );
					this.cursor = c;
				}
				break lab2;
			} while ( false );
			this.cursor = this.limit - v_3;
			v_13 = this.limit - this.cursor;
			golab18:
			while ( true ) {
				v_14 = this.limit - this.cursor;
				lab19:
				do {
					if ( ! this.in_grouping_b$esjava$3( TurkishStemmer.g_vowel, 97, 305 ) ) {
						break lab19;
					}
					this.cursor = this.limit - v_14;
					break golab18;
				} while ( false );
				this.cursor = this.limit - v_14;
				if ( this.cursor <= this.limit_backward ) {
					return false;
				}
				this.cursor--;
			}
			lab20:
			do {
				v_15 = this.limit - this.cursor;
				lab21:
				do {
					if ( ! this.eq_s_b$esjava$2( 1, "\u00F6" ) ) {
						break lab21;
					}
					break lab20;
				} while ( false );
				this.cursor = this.limit - v_15;
				if ( ! this.eq_s_b$esjava$2( 1, "\u00FC" ) ) {
					return false;
				}
			} while ( false );
			this.cursor = this.limit - v_13;
			{
				const c = this.cursor;
				this.insert$esjava$3( this.cursor, this.cursor, "\u00FC" );
				this.cursor = c;
			}
		} while ( false );
		return true;
	}

	r_more_than_one_syllable_word$esjava$0() {
		let v_1;
		let v_3;
		v_1 = this.cursor;
		{
			let v_2 = 2;
			replab0:
			while ( true ) {
				v_3 = this.cursor;
				lab1:
				do {
					golab2:
					while ( true ) {
						lab3:
						do {
							if ( ! this.in_grouping$esjava$3( TurkishStemmer.g_vowel, 97, 305 ) ) {
								break lab3;
							}
							break golab2;
						} while ( false );
						if ( this.cursor >= this.limit ) {
							break lab1;
						}
						this.cursor++;
					}
					v_2--;
					continue replab0;
				} while ( false );
				this.cursor = v_3;
				break replab0;
			}
			if ( v_2 > 0 ) {
				return false;
			}
		}
		this.cursor = v_1;
		return true;
	}

	r_is_reserved_word$esjava$0() {
		let v_1;
		let v_2;
		let v_4;
		lab0:
		do {
			v_1 = this.cursor;
			lab1:
			do {
				v_2 = this.cursor;
				golab2:
				while ( true ) {
					lab3:
					do {
						if ( ! this.eq_s$esjava$2( 2, "ad" ) ) {
							break lab3;
						}
						break golab2;
					} while ( false );
					if ( this.cursor >= this.limit ) {
						break lab1;
					}
					this.cursor++;
				}
				this.I_strlen = 2;
				if ( ! ( this.I_strlen === this.limit ) ) {
					break lab1;
				}
				this.cursor = v_2;
				break lab0;
			} while ( false );
			this.cursor = v_1;
			v_4 = this.cursor;
			golab4:
			while ( true ) {
				lab5:
				do {
					if ( ! this.eq_s$esjava$2( 5, "soyad" ) ) {
						break lab5;
					}
					break golab4;
				} while ( false );
				if ( this.cursor >= this.limit ) {
					return false;
				}
				this.cursor++;
			}
			this.I_strlen = 5;
			if ( ! ( this.I_strlen === this.limit ) ) {
				return false;
			}
			this.cursor = v_4;
		} while ( false );
		return true;
	}

	r_postlude$esjava$0() {
		let v_1;
		let v_2;
		let v_3;
		{
			v_1 = this.cursor;
			lab0:
			do {
				if ( ! this.r_is_reserved_word$esjava$0() ) {
					break lab0;
				}
				return false;
			} while ( false );
			this.cursor = v_1;
		}
		this.limit_backward = this.cursor;
		this.cursor = this.limit;
		v_2 = this.limit - this.cursor;
		lab1:
		do {
			if ( ! this.r_append_U_to_stems_ending_with_d_or_g$esjava$0() ) {
				break lab1;
			}
		} while ( false );
		this.cursor = this.limit - v_2;
		v_3 = this.limit - this.cursor;
		lab2:
		do {
			if ( ! this.r_post_process_last_consonants$esjava$0() ) {
				break lab2;
			}
		} while ( false );
		this.cursor = this.limit - v_3;
		this.cursor = this.limit_backward;
		return true;
	}

	stem$esjava$0() {
		let v_1;
		let v_2;
		if ( ! this.r_more_than_one_syllable_word$esjava$0() ) {
			return false;
		}
		this.limit_backward = this.cursor;
		this.cursor = this.limit;
		v_1 = this.limit - this.cursor;
		lab0:
		do {
			if ( ! this.r_stem_nominal_verb_suffixes$esjava$0() ) {
				break lab0;
			}
		} while ( false );
		this.cursor = this.limit - v_1;
		if ( ! this.B_continue_stemming_noun_suffixes ) {
			return false;
		}
		v_2 = this.limit - this.cursor;
		lab1:
		do {
			if ( ! this.r_stem_noun_suffixes$esjava$0() ) {
				break lab1;
			}
		} while ( false );
		this.cursor = this.limit - v_2;
		this.cursor = this.limit_backward;
		if ( ! this.r_postlude$esjava$0() ) {
			return false;
		}
		return true;
	}

	stem( ...args ) {
		switch ( args.length ) {
			case 0:
				return this.stem$esjava$0( ...args );
		}
		return super.stem( ...args );
	}
}

export default TurkishStemmer;
