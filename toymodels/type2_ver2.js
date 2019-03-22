var states = [['x'],['x','x']]

var statePrior = function() {return uniformDraw(states);};

var utterances = ["some","all","somenotall"];

var cost = {
  "some": 1,
  "all": 1,
  "somenotall" : 1,
};

var utterancePrior = function() {
  var uttProbs = map(function(u) {return Math.exp(-cost[u]) }, utterances);
  return categorical(uttProbs, utterances);
};

var literalMeanings = {
  all: function(state) { return state.length == 2; },
  some: function(state) { return state.length >= 1; },
  somenotall: function(state) { return state.length == 1;},
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

viz.table(pragmaticListener("some"));
