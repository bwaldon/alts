var itemData = [{"id":"baseball","observed_competitor":0.1786,"competitor_prior":0.6,"target_nameability":1,"competitor_nameability":0.9667},{"id":"cake","observed_competitor":0.25,"competitor_prior":0.5333,"target_nameability":1,"competitor_nameability":1},{"id":"flower","observed_competitor":0.1786,"competitor_prior":0.6,"target_nameability":0.9667,"competitor_nameability":0.8},{"id":"hedgehog","observed_competitor":0.2143,"competitor_prior":0.5667,"target_nameability":0.9667,"competitor_nameability":0.5333},{"id":"horse","observed_competitor":0.25,"competitor_prior":0.5667,"target_nameability":1,"competitor_nameability":1},{"id":"house","observed_competitor":0.3929,"competitor_prior":0.6667,"target_nameability":1,"competitor_nameability":1},{"id":"mouse","observed_competitor":0.3571,"competitor_prior":0.7333,"target_nameability":1,"competitor_nameability":0.4},{"id":"panda","observed_competitor":0.3929,"competitor_prior":0.4,"target_nameability":1,"competitor_nameability":0.6667},{"id":"railroad","observed_competitor":0.3571,"competitor_prior":0.4333,"target_nameability":0.9667,"competitor_nameability":0.9333},{"id":"rainbow","observed_competitor":0.4286,"competitor_prior":0.5333,"target_nameability":0.9667,"competitor_nameability":0.8667},{"id":"shark","observed_competitor":0.3214,"competitor_prior":0.3667,"target_nameability":1,"competitor_nameability":1},{"id":"spoon","observed_competitor":0.2143,"competitor_prior":0.6333,"target_nameability":1,"competitor_nameability":0.9667},{"id":"sundial","observed_competitor":0.3929,"competitor_prior":0.3667,"target_nameability":0.9667,"competitor_nameability":0.7333},{"id":"tadpole","observed_competitor":0.4643,"competitor_prior":0.5333,"target_nameability":0.7667,"competitor_nameability":0.4667},{"id":"wheel","observed_competitor":0.3929,"competitor_prior":0.4,"target_nameability":0.9667,"competitor_nameability":0.4667},{"id":"zebra","observed_competitor":0.3571,"competitor_prior":0.5,"target_nameability":1,"competitor_nameability":0.4}] 

// FIRST RSA MODEL

var rsa = function(d) {
  
  var statePrior = function() {
    return flip(d.competitor_prior) ? "competitor" : "target"
  };
  
  var utterances = ["istarget", "looksliketarget","nottarget","iscompetitor","notcompetitor","lookslikecompetitor"];
   
  var cost_looksliketarget = uniform(0, 1)
  var cost_lookslikecompetitor= uniform(0, 1)
  var cost_istarget = uniform(0, 1)
  var cost_nottarget = uniform(0, 1)
  var cost_iscompetitor = uniform(0, 1)
  var cost_notcompetitor = uniform(0, 1)
  
  var cost = {
    "istarget": cost_istarget / d.target_nameability,
    "nottarget" : cost_nottarget / d.target_nameability,
    "looksliketarget": cost_looksliketarget / d.target_nameability,
    "iscompetitor" : cost_iscompetitor / d.competitor_nameability,
    "notcompetitor" : cost_notcompetitor / d.competitor_nameability,
    "lookslikecompetitor": cost_lookslikecompetitor / d.competitor_nameability,
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

  var alpha = uniform(0, 5)

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

  return predicted_competitor; }

// SECOND RSA MODEL

var rsa2 = function(d) {
  
  var statePrior = function() {
    return flip(d.competitor_prior) ? "competitor" : "target"
  };
  
  var utterances = ["istarget", "looksliketarget","nottarget","iscompetitor","notcompetitor","lookslikecompetitor"];
   
  var cost = uniform(0, 1)
  
  var cost = {
    "istarget": cost / d.target_nameability,
    "nottarget" : cost / d.target_nameability,
    "looksliketarget": cost / d.target_nameability,
    "iscompetitor" : cost / d.competitor_nameability,
    "notcompetitor" : cost / d.competitor_nameability,
    "lookslikecompetitor": cost / d.competitor_nameability,
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

  var alpha = uniform(0, 5)

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

  return predicted_competitor; } 

// THIRD RSA MODEL

var rsa3 = function(d) {
  
  var statePrior = function() {
    return flip(d.competitor_prior) ? "competitor" : "target"
  };
  
  var utterances = ["istarget", "looksliketarget","nottarget","iscompetitor","notcompetitor","lookslikecompetitor"];
   
  var cost_looksliketarget = uniform(0, 1)
  var cost_lookslikecompetitor= uniform(0, 1)
  var cost_istarget = uniform(0, 1)
  var cost_nottarget = uniform(0, 1)
  var cost_iscompetitor = uniform(0, 1)
  var cost_notcompetitor = uniform(0, 1)
  
  var cost = {
    "istarget": cost_istarget,
    "nottarget" : cost_nottarget,
    "looksliketarget": cost_looksliketarget,
    "iscompetitor" : cost_iscompetitor,
    "notcompetitor" : cost_notcompetitor,
    "lookslikecompetitor": cost_lookslikecompetitor, 
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

  var alpha = uniform(0, 5)

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

  return predicted_competitor; } 

var bda = function() {
  var model = uniformDraw(["rsa","rsa2","rsa3"])
  
  var f = function(d) {
    
    var p = (model == "rsa" ? rsa(d) : model == "rsa2" ? 
             rsa2(d) : rsa3(d))
    
   observe(Gaussian({mu: p, sigma: 0.05}), d.observed_competitor)
    
  }
  
  map(f,itemData)
  return model
}

var inferenceSettings = {
  model: bda, method:'MCMC',
  callbacks: [editor.MCMCProgress()],
  //verbose: true,
  samples: 400, // 2000,
  lag: 10,
  burn: 4000// 20000
};

var out = Infer(inferenceSettings)

var toR = {"rsa" : Math.exp(out.score("rsa")), "rsa2" : Math.exp(out.score("rsa2")), "rsa3" : Math.exp(out.score("rsa3"))}

toR