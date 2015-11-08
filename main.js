var css = require('css');
var fs = require('fs');
var _ = require('underscore');
var sugar = require('sugar');


var dict = require('./dict.json');

main();

function main() {
	var file = openFile('style.css');
	var filtered = filterComments(file);
	outputFile(filtered, 'output.js');
	var freqs = countFreq(filtered);
	outputFile(freqs, 'outzip.js');
}

function openFile(url) {
	var text = fs.readFileSync(url,'utf8');

	var obj = css.parse(text,  { source: 'style.css' });
	return obj;
}

function filterComments (obj) {
	var filtered_rules = _.filter(obj.stylesheet.rules, function(rule){ return rule.type == 'rule'; });
	return filtered_rules;
}

function countFreq(obj) {
	var words = [];
	obj.each(function(rule) {
		words.add(rule.selectors);
		rule.declarations.each(function(dec) {
			words.add([dec.property, dec.value]);
		});
	});

	var freqs = {};
	words.each(function(word) {
		freqs[word] ? freqs[word]+=1 : freqs[word] = 1;
	});
	//for(property in my_Object)
	return freqs;
}


function outputFile(obj, url) {
	fs.writeFileSync(url, JSON.stringify(obj, null, 2));
}




//console.log(filtered_rules);
