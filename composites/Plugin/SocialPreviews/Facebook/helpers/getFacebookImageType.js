function getRatio( width, height ) {
	return ( width / height );
}

export default function getFacebookImageType( width, height ) {
	const imageRatio = getRatio( width, height );

	if ( imageRatio === 1 || width <= 158 ) {
		return "square";
	}
	if ( width >= 500 && imageRatio > 1 ) {
		return "landscape";
	}
	if ( width > && imageRatio < 1 ) {
		return "portrait";
	}
};

//
// An image has a minimum width of 500px to be a landscape image. When the ratio is 1:1 it will be a square image.
//
//
// 	When portrait the max-height will be 236 pixels.
//  Max-width of landscape = 500px
// 	If the width is lower than 158 px a square image is rendered.


