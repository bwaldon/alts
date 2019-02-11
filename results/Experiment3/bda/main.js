var fs = require('fs-extra');
var shell = require('shelljs');
var includes = require('./includes.js');
var models = includes.models;
var targetresults = JSON.stringify(includes.targetresults);
var controlresults = includes.controlresults;
var nottargetresults = includes.nottargetresults;
var symmetricresults = includes.symmetricresults;

var get_output = function(model) {
	var filename = model.alts + '_' + model.cost + '_' + model.nameability 
	var model_wppl = fs.readFileSync('./models/' + filename + '.txt', "utf8")
	if (model.cost == "3cost") {
		var inference_wppl = fs.readFileSync('./inference/3cost.txt', "utf8")
	} else {
		var inference_wppl = fs.readFileSync('./inference/6cost.txt', "utf8")
	}
	var script = "var itemData = " + targetresults + ";\n\n" + model_wppl + "\n" + inference_wppl
	var script_location = './scripts/' + filename + '_script.wppl'
	fs.writeFileSync(script_location, script)
	var results_destination_js = './results/' + model.alts + '_' + model.cost + '_' + model.nameability + '_results_js.txt'
	var command = 'webppl ' + script_location + ">" + results_destination_js
	shell.exec(command)
	console.log(command)
	var results_js = fs.readFileSync(results_destination_js,"utf8")
	results_json = results_js.replace(/([\_a-zA-Z0-9]+):/g, '"$1":');
	results_json = results_json.replace(/'/g, '"');
	var results_destination_json = './results/' + model.alts + '_' + model.cost + '_' + model.nameability + '_results_json.txt'
	fs.writeFileSync(results_destination_json, results_json)
}

models.map(get_output)






