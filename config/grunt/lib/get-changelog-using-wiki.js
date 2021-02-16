/**
 * A note script which extracts the changelog for the specified verion and repository
 * this uses the Wiki yoast-cli php script. and expect that to be /tmp/Wiki
 *
 * @param {Object} repositoryanme  object.
 * @param {Object} verion     object.
 * 
 * @returns null
 */
const myArgs= process.argv
var keyToSend = ""
if (myArgs.length < 4) {
	console.log("misiging arguments: <repository name>  <version>" )
	return
};

const version = myArgs[3];

switch (myArgs[2]) {
	case 'wordpress-seo':
		keyToSend = "A\r\n";
		break;
	case 'wordpress-seo-premium':
		keyToSend = "B\r\n";
		break;
	case 'wpseo-news':
		keyToSend = "C\r\n";
		break;
	case 'wpseo-video':
		keyToSend = "D\r\n";
		break;
	case 'wpseo-news':
		keyToSend = "E\r\n";
		break;
	case 'wordpress-seo-local':
		keyToSend = "F\r\n";
		break;
	case 'yoast-acf-analysis':
		keyToSend = "G\r\n";
		break;
	case 'yoastseo-amp':
		keyToSend = "H\r\n";
		break;
	case 'javascript':
		keyToSend = "I\r\n";
		break;
	case 'YoastSEO.js-premium-configuration':
		keyToSend = "J\r\n";
		break;
	case 'yoast-test-helper':
		keyToSend = "K\r\n";
		break;
	case 'duplicate-post':
		keyToSend = "L\r\n";
		break;
	default:
		console.log('Sorry, ' + myArgs[2] + ' is not something I know how to select from yoast-cli changelog:create.');
		return
}

console.log (keyToSend);
const { spawn } = require('child_process');
const { exit } = require('process');
const yoastcli = spawn('/tmp/Wiki/yoast-cli/yoast-cli.php', ['changelog:create'], {cwd:"/tmp/Wiki/yoast-cli/"});
const timeout = setTimeout(function(){ yoastcli.kill()}, 30000);

yoastcli.stdout.on('data', (data) => {
  //console.log(`stdout: ${data}`);
  var menuitems = `${data}`
	console.log(menuitems)
	if (menuitems.match("Yoast Duplicate Post")){
   		yoastcli.stdin.setEncoding = 'utf-8';
  		yoastcli.stdin.write( keyToSend )
	}
	if (menuitems.match(version)){
		const value = menuitems.match(new RegExp( "(?<=\\[)(\\d)+(?=\\] " + version + ")", "gm" ) )
		if (value) {
			console.log( value[0])
			yoastcli.stdin.setEncoding = 'utf-8';
	    	yoastcli.stdin.write( value[0] + '\r\n' )
		}
 	}
});

yoastcli.stderr.on('data', (data) => {
  //console.error(`stderr: ${data}`);
  var menuitems = `${data}`
	console.log(menuitems)
	if (menuitems.match("Yoast Duplicate Post")){
   		yoastcli.stdin.setEncoding = 'utf-8';
  		yoastcli.stdin.write( keyToSend )
	}
	if (menuitems.match(version)){
		const value = menuitems.match(new RegExp( "(?<=\\[)(\\d)+(?=\\] " + version + ")", "gm" ) )
		if (value) {
			console.log( value[0])
			yoastcli.stdin.setEncoding = 'utf-8';
	    	yoastcli.stdin.write( value[0] + '\r\n' )
		}
 	}
});

yoastcli.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
  clearTimeout(timeout);
});