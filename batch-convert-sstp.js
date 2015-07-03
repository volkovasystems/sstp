var fs = require( "fs" );
var _ = require( "lodash" );
var convertToPath = require( "./svg-shape-to-path.js" ).convertToPath;
var path = require( "path" );

var batchConvertSSTP = function batchConvertSSTP( inputDirectory, outputDirectory ){
	if( !fs.existsSync( outputDirectory ) ){
		fs.mkdirSync( outputDirectory );
	}

	if( fs.existsSync( inputDirectory )
		&& fs.statSync( inputDirectory ).isDirectory( ) )
	{
		_( fs.readdirSync( inputDirectory ) )
			.filter( function onEachFile( filePath ){
				return ( /\.svg$/ ).test( filePath );
			} )
			.map( function onEachSVGFile( svgFilePath ){
				return {
					"inputFilePath": path.resolve( ".", inputDirectory, svgFilePath ),
					"svgFilePath": svgFilePath
				};
			} )
			.each( function onEachSVGFile( svgFileData ){
				var outputFilePath = path.resolve( ".", outputDirectory, svgFileData.svgFilePath );

				convertToPath( svgFileData.inputFilePath, outputFilePath );
			} );
	}
};

exports.batchConvertSSTP = batchConvertSSTP;