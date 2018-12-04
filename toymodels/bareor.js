var statePrior = function() {
  return categorical({ps: [0.33,0.33,0.33], vs: [["X"], ["Y"],["X","Y"]]});
};

var utterances = ["or", "and"];

var cost = {
  "or": 1,
  "and": 1,
};

var utterancePrior = function() {
  var uttProbs = map(function(u) {return Math.exp(-cost[u]) }, utterances);
  return categorical(uttProbs, utterances);
};

var literalMeanings = {
  and: function(state) { return state.includes("X") && state.includes("Y"); },
  or: function(state) { return state.includes("X") || state.includes("Y"); },
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
var alpha = 1

// pragmatic speaker
var speaker = cache(function(state) {
  return Infer({model: function(){
    var utt = utterancePrior()
    factor(alpha * literalListener(utt).score(state))
    return utt
  }})
});

// pragmatic listener
var pragmaticListener = cache(function(utt) {
  return Infer({model: function(){
    var state = statePrior()
    observe(speaker(state),utt)
    return state
  }})
});

viz.table(pragmaticListener("or"));