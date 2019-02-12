var fs = require('fs-extra');
var shell = require('shelljs');
var includes = require('./includes.js');
var models = includes.models;
var targetresults = JSON.stringify(includes.targetresults);
var controlresults = JSON.stringify(includes.controlresults);
var nottargetresults = JSON.stringify(includes.nottargetresults);
var symmetricresults = JSON.stringify(includes.symmetricresults);

var conditions = [{"id":"target","results":targetresults},{"id":"nottarget","results":nottargetresults},{"id":"symmetric","results":symmetricresults},{"id":"control","results":controlresults}]

var get_output = function(model) {
	var modelname = model.alts + '_' + model.cost + '_' + model.nameability 
	var model_wppl = fs.readFileSync('./models/' + modelname + '.txt', "utf8")
	if (model.cost == "3cost") {
		var inference_wppl = fs.readFileSync('./inference/3cost.txt', "utf8")
	} else {
		var inference_wppl = fs.readFileSync('./inference/6cost.txt', "utf8")
	}
	var inference = function(c) {
		var script = "var resultsfileName = 'results/" + modelname + "/" + c.id + ".json'\n var itemData = " + c.results + ";\n\n" + model_wppl + "\n" + inference_wppl
		var script_location = './scripts/' + c.id + "/" + modelname + '_script.wppl'
		fs.writeFileSync(script_location, script)
		var command = 'webppl ' + script_location + ' --require webppl-json' // + ">" + results_destination_js
		console.log('Running bda for %s model, %s data', modelname, c.id)
		shell.exec(command)
	}

	conditions.map(inference)
	// var results_destination_js = './results/' + model.alts + '_' + model.cost + '_' + model.nameability + '_results_js.txt'
	
	// var results_js = fs.readFileSync(results_destination_js,"utf8")
	// results_json = results_js.replace(/([\_a-zA-Z0-9]+):/g, '"$1":');
	// results_json = results_json.replace(/'/g, '"');
	// var results_destination_json = './results/' + model.alts + '_' + model.cost + '_' + model.nameability + '_results_json.txt'
	// fs.writeFileSync(results_destination_json, results_json)
}

models.map(get_output)






