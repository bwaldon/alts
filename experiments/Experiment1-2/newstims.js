// OR_EXH

or_exh : [

{type: "prime", primetype = "exh", target = "or", id: "inherit", sentence: "Peter inherited the painting or the wardrobe from his grandmother, but not both.", suggests: "Peter inherited only one of these things from his grandmother"},
{type: "prime", primetype = "exh", target = "or", id: "birthday", sentence: "Bill gave Mary flowers or chocolate for her birthday, but not both.", suggests: "Bill gave only one of these things to Mary for her birthday"},
{type: "prime", primetype = "exh", target = "or", id: "mail", sentence: "Jenny received a bill or an invitation in the mail today, but not both.", suggests: "Jenny received only one of these things in the mail today"},
{type: "crit", primetype = "na", target = "or", id: "party", sentence: "Joanne invited David or Samantha to the party.", suggests: "Joanne invited only one of these two people to the party"},

],

// OR_STR

orprime_str : [

{type: "prime", primetype = "str", target = "or", id: "inherit", sentence: "Peter inherited the painting and the wardrobe from his grandmother.", suggests: "Peter inherited only one of these things from his grandmother"},
{type: "prime", primetype = "str", target = "or", id: "birthday", sentence: "Bill gave Mary flowers and chocolate for her birthday.", suggests: "Bill gave only one of these things to Mary for her birthday"},
{type: "prime", primetype = "str", target = "or", id: "mail", sentence: "Jenny received a bill and an invitation in the mail today.", suggests: "Jenny received only one of these things in the mail today"},
{type: "crit", primetype = "na", target = "or", id: "party", sentence: "Joanne invited David or Samantha to the party.", suggests: "Joanne invited only one of these two people to the party"},

],

// OR_NO

or_no : [

{type: "prime", primetype = "no", target = "or", id: "inherit", sentence: "Peter inherited the painting from his grandmother, whereas his aunt Jill inherited the wardrobe.", suggests: "Peter inherited only one of these things from his grandmother"},
{type: "prime", primetype = "no", target = "or", id: "birthday", sentence: "Bill gave Mary flowers for her birthday, whereas John gave her chocolate.", suggests: "Bill gave only one of these things to Mary for her birthday"},
{type: "prime", primetype = "no", target = "or", id: "mail", sentence: "Jenny received a bill in the mail today, whereas she had received invitation in the mail yesterday.", suggests: "Jenny received only one of these things in the mail today"},
{type: "crit", primetype = "na", target = "or", id: "party", sentence: "Joanne invited David or Samantha to the party.", suggests: "Joanne invited only one of these two people to the party"},

],

// SOME_EXH

some_exh : [

{type: "prime", primetype = "exh", target = "some", id: "reunion", sentence: "Sally saw some but not all of her former classmates at her high school reunion", suggests: "Sally didn't see every former classmate of hers at the reunion"},
{type: "prime", primetype = "exh", target = "some", id: "vote", sentence: "Some but not all of the residents of Mike's hometown are registered to vote", suggests: "Not every resident of Mike's hometown is registered to vote"},
{type: "prime", primetype = "exh", target = "some", id: "yoga", sentence: "Nick has taught yoga at some but not all of the yoga studios in his town", suggests: "Nick hasn't taught yoga at every yoga studio in his town"},
{type: "crit", primetype = "na", target = "some", id: "football", sentence: "Marc and Melissa sent some of their children to private school", suggests: "Marc and Melissa didn't send every child of theirs to private school"},

],

// SOME_STR

some_str : [

{type: "prime", primetype = "str", target = "some", id: "reunion", sentence: "Sally saw all of her former classmates at her high school reunion", suggests: "Sally didn't see every former classmate of hers at the reunion"},
{type: "prime", primetype = "str", target = "some", id: "vote", sentence: "All of the residents of Mike's hometown are registered to vote", suggests: "Not every resident of Mike's hometown is registered to vote"},
{type: "prime", primetype = "str", target = "some", id: "yoga", sentence: "Nick has taught yoga at some but not all of the yoga studios in his town", suggests: "Nick hasn't taught yoga at every yoga studio in his town"},
{type: "crit", primetype = "na", target = "some", id: "football", sentence: "Marc and Melissa sent some of their children to private school", suggests: "Marc and Melissa didn't send every child of theirs to private school"},

],

// SOME_NO

some_no : [

{type: "prime", primetype = "no", target = "some", id: "reunion", sentence: "Sally saw her favorite teacher, Mr. Meyer, at her high school reunion", suggests: "Sally didn't see every former classmate of hers at the reunion"},
{type: "prime", primetype = "no", target = "some", id: "vote", sentence: "The residents of Mike's hometown will vote for a new congressperson this November", suggests: "Not every resident of Mike's hometown is registered to vote"},
{type: "prime", primetype = "no", target = "some", id: "yoga", sentence: "Nick is a certified yoga instructor in his town", suggests: "Nick hasn't taught yoga at every yoga studio in his town"},
{type: "crit", primetype = "na", target = "some", id: "football", sentence: "Marc and Melissa sent some of their children to private school", suggests: "Marc and Melissa didn't send every child of theirs to private school"},

],

// LOOKSLIKE_EXH

lookslike_exh : [

{type: "prime", primetype = "exh", target = "lookslike", id: "rain", sentence: "It looks like it's raining outside, but it isn't", suggests: "The weather outside is something other than rain"},
{type: "prime", primetype = "exh", target = "lookslike", id: "car", sentence: "Bill's car looks like it's from the 1960's, but it isn't", suggests: "Bill's car is from some time other than the 1960's"},
{type: "prime", primetype = "exh", target = "lookslike", id: "son", sentence: "Mary's very ill son looks like he has the chicken pox, but he doesn't", suggests: "Mary's son has some sickness other than the chicken pox"},
{type: "crit", primetype = "na", target = "lookslike", id: "golden", sentence: "Alan's new dog looks like a golden retriever", suggests: "Alan's new dog is something other than a golden retriever"},

],

// LOOKSLIKE_STR

lookslike_str : [

{type: "prime", primetype = "str", target = "lookslike", id: "rain", sentence: "It's raining outside", suggests: "The weather outside is something other than rain"},
{type: "prime", primetype = "str", target = "lookslike", id: "car", sentence: "Bill's car is from the 1960's", suggests: "Bill's car is from some time other than the 1960's"},
{type: "prime", primetype = "str", target = "lookslike", id: "son", sentence: "Mary's very ill son has the chicken pox", suggests: "Mary's son has some sickness other than the chicken pox"},
{type: "crit", primetype = "na", target = "lookslike", id: "golden", sentence: "Alan's new dog looks like a golden retriever", suggests: "Alan's new dog is something other than a golden retriever"},

],

// LOOKSLIKE_NO

lookslike_str : [

{type: "prime", primetype = "no", target = "lookslike", id: "rain", sentence: "It's snowing outside", suggests: "The weather outside is something other than rain"},
{type: "prime", primetype = "no", target = "lookslike", id: "car", sentence: "Bill's car runs as if it were new", suggests: "Bill's car is from some time other than the 1960's"},
{type: "prime", primetype = "no", target = "lookslike", id: "son", sentence: "Mary's very ill son has been bedridden for days", suggests: "Mary's son has some sickness other than the chicken pox"},
{type: "crit", primetype = "na", target = "lookslike", id: "golden", sentence: "Alan's new dog looks like a golden retriever", suggests: "Alan's new dog is something other than a golden retriever"},

],

// n_exh

n_exh : [

{type: "prime", primetype = "exh", target = "n", id: "library", sentence: "Exactly 34 books were stolen from the local library yesterday", suggests: "No more than 34 books were stolen from the local library yesterday"},
{type: "prime", primetype = "exh", target = "n", id: "cookies", sentence: "Mr. Whiteley's students sold exactly 34 boxes of cookies at the school bake sale", suggests: "Mr Whiteley's students sold no more than 34 boxes of cookies at the bake sale"},
{type: "prime", primetype = "exh", target = "n", id: "chairs", sentence: "There are exactly 34 papers on Sandra's desk", suggests: "There are no more than 34 papers on Sandra's desk"},
{type: "crit", primetype = "na", target = "n", id: "bus", sentence: "34 people were injured in a bus crash in Chris's hometown last week", suggests: "No more than 34 people were injured in a bus crash in Chris's hometown last week"},

],

// n_str

n_str : [

{type: "prime", primetype = "str", target = "n", id: "library", sentence: "35 books were stolen from the local library yesterday", suggests: "No more than 34 books were stolen from the local library yesterday"},
{type: "prime", primetype = "str", target = "n", id: "cookies", sentence: "Mr. Whiteley's students sold 35 boxes of cookies at the school bake sale", suggests: "Mr Whiteley's students sold no more than 34 boxes of cookies at the bake sale"},
{type: "prime", primetype = "str", target = "n", id: "chairs", sentence: "There are 35 papers on Sandra's desk", suggests: "There are no more than 34 papers on Sandra's desk"},
{type: "crit", primetype = "na", target = "n", id: "bus", sentence: "34 people were injured in a bus crash in Chris's hometown last week", suggests: "No more than 34 people were injured in a bus crash in Chris's hometown last week"},

],

// n_no

n_no : [

{type: "prime", primetype = "no", target = "n", id: "library", sentence: "There was a break-in at the local library yesterday", suggests: "No more than 34 books were stolen from the local library yesterday"},
{type: "prime", primetype = "no", target = "n", id: "cookies", sentence: "Mr. Whiteley's students sold the most baked goods at the school bake sale", suggests: "Mr Whiteley's students sold no more than 34 boxes of cookies at the bake sale"},
{type: "prime", primetype = "no", target = "n", id: "chairs", sentence: "Aside from a computer, there isn't much on Sandra's desk", suggests: "There are no more than 34 papers on Sandra's desk"},
{type: "crit", primetype = "na", target = "n", id: "bus", sentence: "34 people were injured in a bus crash in Chris's hometown last week", suggests: "No more than 34 people were injured in a bus crash in Chris's hometown last week"},

],



