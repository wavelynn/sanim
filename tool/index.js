let fs = require('fs');
let path = require('path');
let request = require('request');

// unzip error
// Error: invalid distance too far back at Zlib._handle.onerror

// let unzip = require('unzip');
let mkdirp = require('mkdirp');
// let qcdn = require('@q/qcdn');
let decompress = require('decompress');

let sprite = require('node-sprite-generator')

// // get gift list from browser
// let giftList = []; 
// for( let p in HJ_JS_CONF.giftList ) {
// 	let item = HJ_JS_CONF.giftList[p];
// 	let property = item.property;
// 	if( property && property.gif ) {
// 		giftList.push({id: item.id, url: property.gif});
// 	}
// }

let giftList = [{"id":"2260","url":"http://static.huajiao.com/huajiao/gifteffect/10046_36.zip"},{"id":"2251","url":"http://static.huajiao.com/huajiao/gifteffect/10034_31.zip"},{"id":"3054","url":"http://static.huajiao.com/huajiao/gifteffect/90045_33.zip"},{"id":"1837","url":"http://static.huajiao.com/huajiao/gifteffect/90026_31.zip"},{"id":"2278","url":"http://static.huajiao.com/huajiao/gifteffect/10053_32.zip"},{"id":"2906","url":"http://static.huajiao.com/huajiao/gifteffect/90035_33.zip"},{"id":"2258","url":"http://static.huajiao.com/huajiao/gifteffect/10057_31.zip"},{"id":"2280","url":"http://static.huajiao.com/huajiao/gifteffect/90046_30.zip"},{"id":"1839","url":"http://static.huajiao.com/huajiao/gifteffect/90044_37.zip"},{"id":"2296","url":"http://static.huajiao.com/huajiao/gifteffect/90049_31.zip"},{"id":"2298","url":"http://static.huajiao.com/huajiao/gifteffect/90051_30.zip"},{"id":"2300","url":"http://static.huajiao.com/huajiao/gifteffect/90065_30.zip"},{"id":"2276","url":"http://static.huajiao.com/huajiao/gifteffect/90066_30.zip"},{"id":"2248","url":"http://static.huajiao.com/huajiao/gifteffect/90077_32.zip"},{"id":"3053","url":"http://static.huajiao.com/huajiao/gifteffect/10004_31.zip"},{"id":"2274","url":"http://static.huajiao.com/huajiao/gifteffect/10007_31.zip"},{"id":"1829","url":"http://static.huajiao.com/huajiao/gifteffect/10047_31.zip"},{"id":"3039","url":"http://static.huajiao.com/huajiao/gifteffect/20006_30.zip"},{"id":"2252","url":"http://static.huajiao.com/huajiao/gifteffect/10061_31.zip"},{"id":"3024","url":"http://static.huajiao.com/huajiao/gifteffect/20005_31.zip"},{"id":"2286","url":"http://static.huajiao.com/huajiao/gifteffect/90043_32.zip"},{"id":"2256","url":"http://static.huajiao.com/huajiao/gifteffect/10073_30.zip"},{"id":"2272","url":"http://static.huajiao.com/huajiao/gifteffect/90110_30.zip"},{"id":"2270","url":"http://static.huajiao.com/huajiao/gifteffect/90116_30.zip"},{"id":"2310","url":"http://static.huajiao.com/huajiao/gifteffect/90101_30.zip"},{"id":"2302","url":"http://static.huajiao.com/huajiao/gifteffect/90103_30.zip"},{"id":"2268","url":"http://static.huajiao.com/huajiao/gifteffect/90106_30.zip"},{"id":"2264","url":"http://static.huajiao.com/huajiao/gifteffect/90118_30.zip"},{"id":"2304","url":"http://static.huajiao.com/huajiao/gifteffect/90117_30.zip"},{"id":"2027","url":"http://static.huajiao.com/huajiao/gifteffect/90119_30.zip"},{"id":"2308","url":"http://static.huajiao.com/huajiao/gifteffect/90133_31.zip"},{"id":"2190","url":"http://static.huajiao.com/huajiao/gifteffect/90130_30.zip"},{"id":"2910","url":"http://static.huajiao.com/huajiao/gifteffect/10151_30.zip"},{"id":"2943","url":"http://static.huajiao.com/huajiao/gifteffect/10151_30.zip"},{"id":"2192","url":"http://static.huajiao.com/huajiao/gifteffect/10153_30.zip"},{"id":"2184","url":"http://static.huajiao.com/huajiao/gifteffect/90052_31.zip"},{"id":"2178","url":"http://static.huajiao.com/huajiao/gifteffect/90173_30.zip"},{"id":"2176","url":"http://static.huajiao.com/huajiao/gifteffect/90174_30.zip"},{"id":"2290","url":"http://static.huajiao.com/huajiao/gifteffect/90176_30.zip"},{"id":"2908","url":"http://static.huajiao.com/huajiao/gifteffect/90096_31.zip"},{"id":"2907","url":"http://static.huajiao.com/huajiao/gifteffect/90177_30.zip"},{"id":"2930","url":"http://static.huajiao.com/huajiao/gifteffect/10195_32.zip"},{"id":"2928","url":"http://static.huajiao.com/huajiao/gifteffect/10196_31.zip"},{"id":"2929","url":"http://static.huajiao.com/huajiao/gifteffect/10197_31.zip"},{"id":"2947","url":"http://static.huajiao.com/huajiao/gifteffect/10201_30.zip"},{"id":"2993","url":"http://static.huajiao.com/huajiao/gifteffect/10198_30.zip"},{"id":"2995","url":"http://static.huajiao.com/huajiao/gifteffect/10198_30.zip"},{"id":"2996","url":"http://static.huajiao.com/huajiao/gifteffect/10198_30.zip"},{"id":"2986","url":"http://static.huajiao.com/huajiao/gifteffect/10198_30.zip"},{"id":"2992","url":"http://static.huajiao.com/huajiao/gifteffect/10198_30.zip"},{"id":"2994","url":"http://static.huajiao.com/huajiao/gifteffect/10198_30.zip"},{"id":"2987","url":"http://static.huajiao.com/huajiao/gifteffect/10198_30.zip"},{"id":"2988","url":"http://static.huajiao.com/huajiao/gifteffect/10198_30.zip"},{"id":"2985","url":"http://static.huajiao.com/huajiao/gifteffect/10198_30.zip"},{"id":"2984","url":"http://static.huajiao.com/huajiao/gifteffect/10198_30.zip"},{"id":"2989","url":"http://static.huajiao.com/huajiao/gifteffect/10198_30.zip"},{"id":"2991","url":"http://static.huajiao.com/huajiao/gifteffect/10198_30.zip"},{"id":"2998","url":"http://static.huajiao.com/huajiao/gifteffect/90177_30.zip"},{"id":"3000","url":"http://static.huajiao.com/huajiao/gifteffect/90177_30.zip"},{"id":"3001","url":"http://static.huajiao.com/huajiao/gifteffect/90177_30.zip"},{"id":"3018","url":"http://static.huajiao.com/huajiao/gifteffect/10197_31.zip"},{"id":"3017","url":"http://static.huajiao.com/huajiao/gifteffect/10197_31.zip"},{"id":"3027","url":"http://static.huajiao.com/huajiao/gifteffect/10032_32.zip"},{"id":"3035","url":"http://static.huajiao.com/huajiao/gifteffect/10214_30.zip"},{"id":"3033","url":"http://static.huajiao.com/huajiao/gifteffect/10151_30.zip"},{"id":"3034","url":"http://static.huajiao.com/huajiao/gifteffect/10151_30.zip"},{"id":"3032","url":"http://static.huajiao.com/huajiao/gifteffect/10151_30.zip"},{"id":"3037","url":"http://static.huajiao.com/huajiao/gifteffect/10212_30.zip"},{"id":"3031","url":"http://static.huajiao.com/huajiao/gifteffect/10151_30.zip"},{"id":"3036","url":"http://static.huajiao.com/huajiao/gifteffect/10213_30.zip"},{"id":"3048","url":"http://static.huajiao.com/huajiao/gifteffect/10211_30.zip"},{"id":"3041","url":"http://static.huajiao.com/huajiao/gifteffect/10215_30.zip"},{"id":"3047","url":"http://static.huajiao.com/huajiao/gifteffect/10217_30.zip"},{"id":"3052","url":"http://static.huajiao.com/huajiao/gifteffect/10213_30.zip"},{"id":"3050","url":"http://static.huajiao.com/huajiao/gifteffect/10211_30.zip"},{"id":"3060","url":"http://static.huajiao.com/huajiao/gifteffect/90130_30.zip"},{"id":"3061","url":"http://static.huajiao.com/huajiao/gifteffect/10221_30.zip"},{"id":"3062","url":"http://static.huajiao.com/huajiao/gifteffect/10222_30.zip"}];

// mkdir -p directory
mkdirp.sync('./zip/');
mkdirp.sync('./img/');
mkdirp.sync('./sprite/');
mkdirp.sync('./css/');


function process(giftList, i, ret ) {
	i = i || 0;
	ret = ret || {};
	if( i >= giftList.length ) {
		return ;
	}

	let item = giftList[i];
	let id = item.id, url = item.url;

	let file = url.substring(url.lastIndexOf('/')+1);
	let filename = file.split('.')[0];

	let zipfile = `./zip/${file}`;
	let spritePath = `sprite/${filename}.png`;

	let zipstream = fs.createWriteStream(zipfile);
	request(url).pipe(zipstream);

	
	zipstream.on('error', err => {
		console.log(err);
	});
	zipstream.on('close', () => {

		decompress(zipfile, `./img/`).then(function() {

			sprite({
				src: [`./img/${filename}/*.png`], 
				spritePath,
				
				// stylesheetPath needed
				stylesheet: 'scss',
				stylesheetPath: `css/${filename}.scss`, 
				layout: 'vertical', 
				layoutOptions: {
					padding: 0, 
					scaling: 1
				}
			}, (err) => {
				if( err ) {
					console.log(`sprite error ${id} ${url}: `, err);
					return ;
				}

				process(giftList, i+1, ret);

				// // upload cdn if needed
				// qcdn.upload(spritePath).then(data => {
				// 	ret[id] = data[spritePath];
					
				// 	console.log(`${filename} ${id} ${data[spritePath]}`);
					
				// 	process(giftList, i+1, ret);

				// }).catch(err => {
				// 	console.log(`upload error: ${id}, ${url}, ${err}`);
				// });
			});
		});
	});
}

let ret = {};
process(giftList, 0, ret);