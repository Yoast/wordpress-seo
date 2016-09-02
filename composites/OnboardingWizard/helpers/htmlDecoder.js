let decodeHTML = ( htmlText ) => {
	var txt = document.createElement( "textarea" );
	txt.innerHTML = htmlText;
	return txt.value;
};

export default decodeHTML;