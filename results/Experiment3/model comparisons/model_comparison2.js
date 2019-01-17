var itemData = [{"id":"baseball","observed_competitor":0.1786,"competitor_prior":0.6,"target_nameability":1,"competitor_nameability":0.9667},{"id":"cake","observed_competitor":0.25,"competitor_prior":0.5333,"target_nameability":1,"competitor_nameability":1},{"id":"flower","observed_competitor":0.1786,"competitor_prior":0.6,"target_nameability":0.9667,"competitor_nameability":0.8},{"id":"hedgehog","observed_competitor":0.2143,"competitor_prior":0.5667,"target_nameability":0.9667,"competitor_nameability":0.5333},{"id":"horse","observed_competitor":0.25,"competitor_prior":0.5667,"target_nameability":1,"competitor_nameability":1},{"id":"house","observed_competitor":0.3929,"competitor_prior":0.6667,"target_nameability":1,"competitor_nameability":1},{"id":"mouse","observed_competitor":0.3571,"competitor_prior":0.7333,"target_nameability":1,"competitor_nameability":0.4},{"id":"panda","observed_competitor":0.3929,"competitor_prior":0.4,"target_nameability":1,"competitor_nameability":0.6667},{"id":"railroad","observed_competitor":0.3571,"competitor_prior":0.4333,"target_nameability":0.9667,"competitor_nameability":0.9333},{"id":"rainbow","observed_competitor":0.4286,"competitor_prior":0.5333,"target_nameability":0.9667,"competitor_nameability":0.8667},{"id":"shark","observed_competitor":0.3214,"competitor_prior":0.3667,"target_nameability":1,"competitor_nameability":1},{"id":"spoon","observed_competitor":0.2143,"competitor_prior":0.6333,"target_nameability":1,"competitor_nameability":0.9667},{"id":"sundial","observed_competitor":0.3929,"competitor_prior":0.3667,"target_nameability":0.9667,"competitor_nameability":0.7333},{"id":"tadpole","observed_competitor":0.4643,"competitor_prior":0.5333,"target_nameability":0.7667,"competitor_nameability":0.4667},{"id":"wheel","observed_competitor":0.3929,"competitor_prior":0.4,"target_nameability":0.9667,"competitor_nameability":0.4667},{"id":"zebra","observed_competitor":0.3571,"competitor_prior":0.5,"target_nameability":1,"competitor_nameability":0.4}] 

var statePrior = function(c) {
  return flip(c) ? "competitor" : "target"
};

var utterances = ["istarget", "looksliketarget","nottarget","iscompetitor","notcompetitor","lookslikecompetitor"];

// ESTIMATE PARAMETERS OF RSA MODEL

var model = function() {
 
 // could change
 var cost_lookslike = uniformDrift({a: 0, b: 5, w: 1})
 var cost_is = uniformDrift({a: 0, b: 5, w: 1})
 var cost_not = uniformDrift({a: 0, b: 5, w: 1})

// simplifying assumption: cost of "It's a [target]" is directly proportional to 
// cost of form "It's an X", inversely proportional to nameability of target
 
var cost = function (item) {
  return {
  "istarget": cost_is / item.target_nameability,
  "nottarget" : cost_not / item.target_nameability,
  "looksliketarget": cost_lookslike / item.target_nameability,
  "iscompetitor" : cost_is / item.competitor_nameability,
  "notcompetitor" : cost_not / item.competitor_nameability,
  "lookslikecompetitor": cost_lookslike / item.competitor_nameability,
};
} 

var utterancePrior = function(item) {
  var uttProbs = map(function(u) {return Math.exp(-cost(item)[u]) }, utterances);
  return categorical(uttProbs, utterances);
};

var literalMeanings = {
  looksliketarget: function(state) { return state == "target" || state == "competitor"; },
  lookslikecompetitor: function(state) { return state == "target" || state == "competitor"; },
  istarget: function(state) { return state == "target"; },
  nottarget: function(state) {return state == "competitor";  },
  iscompetitor : function(state) {return state == "competitor";  },
  notcompetitor : function(state) { return state == "target"; },
};

var literalListener = cache(function(utt) {
  return Infer({model: function(){
    var state = statePrior()
    var meaning = literalMeanings[utt]
    condition(meaning(state))
    return state
  }})
});

// set speaker optimality
var alpha = uniformDrift({a: 0, b: 5, w: 1})

// pragmatic speaker
var speaker = cache(function(state,item) {
  return Infer({model: function(){
    var utt = utterancePrior(item)
    factor(alpha * literalListener(utt).score(state))
    return utt
  }})
});

// pragmatic listener
  
var f = function(d) {
  var posts = Infer({model: function(){
    var state = statePrior(d.competitor_prior)
    observe(speaker(state,d),"looksliketarget")
    return state
  }})

var predicted_competitor = Math.abs(Math.exp(posts.score(["competitor"])))

observe(Gaussian({mu: predicted_competitor, sigma: 0.05}), d.observed_competitor)
}

map(f, itemData)

return {
  cost_is: cost_is,
  cost_lookslike: cost_lookslike,
  cost_not: cost_not,
  alpha : alpha,
  };
  
}

var inferenceSettings = {
  model: model, method:'MCMC',
  callbacks: [editor.MCMCProgress()],
  // verbose: true,
  samples: 200, // 2000,
  lag: 10,
  burn: 2000// 20000
};

var rsa_params = Infer(inferenceSettings)

var rsa_post = function(d) {
  
// CHANGE THIS LINE TO SWITCH BETWEEN MAXIMUM A POSTERIORI VALUES AND SAMPLING FROM JOINT DISTIRBUTION
//  var samp = sample(rsa_params)
  var samp = rsa_params.MAP().val
   
  var cost_lookslike = samp.cost_lookslike
  var cost_is = samp.cost_is
  var cost_not = samp.cost_not
  
  var cost = {
    "istarget": cost_is / d.target_nameability,
    "nottarget" : cost_not / d.target_nameability,
    "looksliketarget": cost_lookslike / d.target_nameability,
    "iscompetitor" : cost_is / d.competitor_nameability,
    "notcompetitor" : cost_not / d.competitor_nameability,
    "lookslikecompetitor": cost_lookslike/ d.competitor_nameability,
  };

  var utterancePrior = function() {
    var uttProbs = map(function(u) {return Math.exp(-cost[u]) }, utterances);
    return categorical(uttProbs, utterances);
  };

  var literalMeanings = {
    looksliketarget: function(state) { return state == "target" || state == "competitor"; },
    lookslikecompetitor: function(state) { return state == "target" || state == "competitor"; },
    istarget: function(state) { return state == "target"; },
    nottarget: function(state) {return state == "competitor";  },
    iscompetitor : function(state) {return state == "competitor";  },
    notcompetitor : function(state) { return state == "target"; },
  };

  var literalListener = cache(function(utt) {
    return Infer({model: function(){
      var state = statePrior()
      var meaning = literalMeanings[utt]
      condition(meaning(state))
      return state
    }})
  });

  var alpha = samp.alpha

  // pragmatic speaker
  var speaker = cache(function(state) {
    return Infer({model: function(){
      var utt = utterancePrior()
      factor(alpha * literalListener(utt).score(state))
      return utt
    }})
  });

// pragmatic listener
  
  var posts = Infer({model: function(){
    var state = statePrior(d.competitor_prior)
    observe(speaker(state),"looksliketarget")
    return state
  }});

  var predicted_competitor = Math.abs(Math.exp(posts.score("competitor")));

 return predicted_competitor
} 

// COMPARE RSA MODEL TO IGNORANCE MODELS

var bda = function() {
  var model = uniformDraw(["ignorance1","ignorance2","rsa"])
  
  var f = function(d) {
    
   var p = (model == "ignorance1" ? 0.5 : model == "ignorance2" ? 
             d.competitor_prior : rsa_post(d))
    
   observe(Gaussian({mu: p, sigma: 0.01}), d.observed_competitor)
    
  }
  
  map(f,itemData)
  return model
}

var inferenceSettings = {
  model: bda, method:'MCMC',
  callbacks: [editor.MCMCProgress()],
  //verbose: true,
  samples: 200, // 2000,
  lag: 10,
  burn: 2000// 20000
};

var out = Infer(inferenceSettings)

var results = {"ignorance1" : Math.exp(out.score("ignorance1")), "ignorance2" : Math.exp(out.score("ignorance2")), "rsa" : Math.exp(out.score("rsa"))}

results
