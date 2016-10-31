var verbsBeginningWithGeRegex = /^((ge)\S+t($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>]))/ig;
var verbsBeginningWithErVerEntBeZerRegex = /^((be|ent|er|her|ver|zer)\S+t($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>]))/ig;
var verbsWithGeInMiddleRegex = /(ab|an|auf|aus|vor|wieder|zurück)(ge)\S+t($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
var verbsWithErVerEntBeZerInMiddleRegex = /(ab|an|auf|aus|vor|wieder|zurück)(be|ent|er|her|ver|zer)\S+t($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
var verbsEndingWithIertRegex = /\S+iert($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
var exceptionsRegex = /\S+(apparat|arbeit|dienst|haft|halt|kraft|not|pflicht|schaft|schrift|tät|wert|zeit)($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;

var verbsBeginningWithGe = function( word ) {
	return word.match( verbsBeginningWithGeRegex ) || [];
};

var verbsBeginningWithErVerEntBeZer = function( word ) {
	return word.match( verbsBeginningWithErVerEntBeZerRegex ) || [];
};

var verbsWithGeInMiddle = function( word ) {
	return word.match( verbsWithGeInMiddleRegex ) || [];
};

var verbsWithErVerEntBeZerInMiddle = function( word ) {
	return word.match( verbsWithErVerEntBeZerInMiddleRegex ) || [];
};

var verbsEndingWithIert = function( word ) {
	return word.match( verbsEndingWithIertRegex ) || [];
};

var exceptions = function( word ) {
	return word.match( exceptionsRegex ) || [];
};

module.exports = function() {
	return {
		verbsBeginningWithGe: verbsBeginningWithGe,
		verbsBeginningWithErVerEntBeZer: verbsBeginningWithErVerEntBeZer,
		verbsWithGeInMiddle: verbsWithGeInMiddle,
		verbsWithErVerEntBeZerInMiddle: verbsWithErVerEntBeZerInMiddle,
		verbsEndingWithIert: verbsEndingWithIert,
		exceptions: exceptions,
	};
};
