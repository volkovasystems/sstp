var argv = require( "yargs" ).argv;
var fs = require( "fs" );

var batchConvertSSTP = require( "./batch-convert-sstp" ).batchConvertSSTP;
var convertToPath = require( "./svg-shape-to-path.js" ).convertToPath;

if( fs.existsSync( argv.input ) ){
	if( fs.statSync( argv.input ).isDirectory( ) ){
		batchConvertSSTP( argv.input, argv.output );

	}else if( fs.statSync( argv.input ).isFile( ) ){
		convertToPath( argv.input, argv.output );
	}
}


