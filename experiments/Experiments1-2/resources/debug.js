var filler_block1 = [
    {type: "filler", primetype = "na", target = "na", id: "low_right", fuckeditup: false, sentence: "A handful of people showed up to the meeting.", suggests: "Nobody showed up to the meeting"},
  
    {type: "filler", primetype = "na", target = "na", id: "high_right", fuckeditup: false, sentence: "Judith's hometown has a population of less than 10,000.", suggests: "Fewer than 10,000 people live in Judith's hometown"},];

var or_exh = [

{type: "prime", primetype = "exh", target = "or", id: "inherit", sentence: "Peter inherited the painting or the wardrobe from his grandmother, but not both.", suggests: "Peter inherited only one of these things from his grandmother"},
{type: "prime", primetype = "exh", target = "or", id: "birthday", sentence: "Bill gave Mary flowers or chocolate for her birthday, but not both.", suggests: "Bill gave only one of these things to Mary for her birthday"},
{type: "prime", primetype = "exh", target = "or", id: "mail", sentence: "Jenny received a bill or an invitation in the mail today, but not both.", suggests: "Jenny received only one of these things in the mail today"},
{type: "crit", primetype = "na", target = "or", id: "party", sentence: "Joanne invited David or Samantha to the party.", suggests: "Joanne invited only one of these two people to the party"},

];

// OR_STR

var or_str = [

{type: "prime", primetype = "str", target = "or", id: "inherit", sentence: "Peter inherited the painting and the wardrobe from his grandmother.", suggests: "Peter inherited only one of these things from his grandmother"},
{type: "prime", primetype = "str", target = "or", id: "birthday", sentence: "Bill gave Mary flowers and chocolate for her birthday.", suggests: "Bill gave only one of these things to Mary for her birthday"},
{type: "prime", primetype = "str", target = "or", id: "mail", sentence: "Jenny received a bill and an invitation in the mail today.", suggests: "Jenny received only one of these things in the mail today"},
{type: "crit", primetype = "na", target = "or", id: "party", sentence: "Joanne invited David or Samantha to the party.", suggests: "Joanne invited only one of these two people to the party"},

];

// OR_NO

var or_no = [

{type: "prime", primetype = "no", target = "or", id: "inherit", sentence: "Peter inherited the painting from his grandmother, whereas his aunt Jill inherited the wardrobe.", suggests: "Peter inherited only one of these things from his grandmother"},
{type: "prime", primetype = "no", target = "or", id: "birthday", sentence: "Bill gave Mary flowers for her birthday, whereas John gave her chocolate.", suggests: "Bill gave only one of these things to Mary for her birthday"},
{type: "prime", primetype = "no", target = "or", id: "mail", sentence: "Jenny received a bill in the mail today, whereas she had received invitation in the mail yesterday.", suggests: "Jenny received only one of these things in the mail today"},
{type: "crit", primetype = "na", target = "or", id: "party", sentence: "Joanne invited David or Samantha to the party.", suggests: "Joanne invited only one of these two people to the party"},

];

// SOME_EXH

var some_exh = [

{type: "prime", primetype = "exh", target = "some", id: "reunion", sentence: "Sally saw some but not all of her former classmates at her high school reunion.", suggests: "Sally didn't see every former classmate of hers at the reunion"},
{type: "prime", primetype = "exh", target = "some", id: "vote", sentence: "Some but not all of the residents of Mike's hometown are registered to vote.", suggests: "Not every resident of Mike's hometown is registered to vote"},
{type: "prime", primetype = "exh", target = "some", id: "yoga", sentence: "Nick has taught yoga at some but not all of the yoga studios in his town.", suggests: "Nick hasn't taught yoga at every yoga studio in his town"},
{type: "crit", primetype = "na", target = "some", id: "football", sentence: "Marc and Melissa sent some of their children to private school.", suggests: "Marc and Melissa didn't send every child of theirs to private school"},

];

// SOME_STR

var some_str = [

{type: "prime", primetype = "str", target = "some", id: "reunion", sentence: "Sally saw all of her former classmates at her high school reunion.", suggests: "Sally didn't see every former classmate of hers at the reunion"},
{type: "prime", primetype = "str", target = "some", id: "vote", sentence: "All of the residents of Mike's hometown are registered to vote.", suggests: "Not every resident of Mike's hometown is registered to vote"},
{type: "prime", primetype = "str", target = "some", id: "yoga", sentence: "Nick has taught yoga at some but not all of the yoga studios in his town.", suggests: "Nick hasn't taught yoga at every yoga studio in his town"},
{type: "crit", primetype = "na", target = "some", id: "football", sentence: "Marc and Melissa sent some of their children to private school.", suggests: "Marc and Melissa didn't send every child of theirs to private school"},

];

// SOME_NO

var some_no = [

{type: "prime", primetype = "no", target = "some", id: "reunion", sentence: "Sally saw her favorite teacher, Mr. Meyer, at her high school reunion.", suggests: "Sally didn't see every former classmate of hers at the reunion"},
{type: "prime", primetype = "no", target = "some", id: "vote", sentence: "The residents of Mike's hometown will vote for a new congressperson this November.", suggests: "Not every resident of Mike's hometown is registered to vote"},
{type: "prime", primetype = "no", target = "some", id: "yoga", sentence: "Nick is a certified yoga instructor in his town.", suggests: "Nick hasn't taught yoga at every yoga studio in his town"},
{type: "crit", primetype = "na", target = "some", id: "football", sentence: "Marc and Melissa sent some of their children to private school.", suggests: "Marc and Melissa didn't send every child of theirs to private school"},

];

// LOOKSLIKE_EXH

var lookslike_exh = [

{type: "prime", primetype = "exh", target = "lookslike", id: "rain", sentence: "It looks like it's raining outside, but it isn't.", suggests: "The weather outside is something other than rain"},
{type: "prime", primetype = "exh", target = "lookslike", id: "car", sentence: "Bill's car looks like it's from the 1960's, but it isn't.", suggests: "Bill's car is from some time other than the 1960's"},
{type: "prime", primetype = "exh", target = "lookslike", id: "son", sentence: "Mary's very ill son looks like he has the chicken pox, but he doesn't.", suggests: "Mary's son has some sickness other than the chicken pox"},
{type: "crit", primetype = "na", target = "lookslike", id: "golden", sentence: "Alan's new dog looks like a golden retriever.", suggests: "Alan's new dog is something other than a golden retriever"},

];

// LOOKSLIKE_STR

var lookslike_str = [

{type: "prime", primetype = "str", target = "lookslike", id: "rain", sentence: "It's raining outside.", suggests: "The weather outside is something other than rain"},
{type: "prime", primetype = "str", target = "lookslike", id: "car", sentence: "Bill's car is from the 1960's.", suggests: "Bill's car is from some time other than the 1960's"},
{type: "prime", primetype = "str", target = "lookslike", id: "son", sentence: "Mary's very ill son has the chicken pox.", suggests: "Mary's son has some sickness other than the chicken pox"},
{type: "crit", primetype = "na", target = "lookslike", id: "golden", sentence: "Alan's new dog looks like a golden retriever.", suggests: "Alan's new dog is something other than a golden retriever"},

];

// LOOKSLIKE_NO

var lookslike_no = [

{type: "prime", primetype = "no", target = "lookslike", id: "rain", sentence: "It's snowing outside.", suggests: "The weather outside is something other than rain"},
{type: "prime", primetype = "no", target = "lookslike", id: "car", sentence: "Bill's car runs as if it were new.", suggests: "Bill's car is from some time other than the 1960's"},
{type: "prime", primetype = "no", target = "lookslike", id: "son", sentence: "Mary's very ill son has been bedridden for days.", suggests: "Mary's son has some sickness other than the chicken pox"},
{type: "crit", primetype = "na", target = "lookslike", id: "golden", sentence: "Alan's new dog looks like a golden retriever.", suggests: "Alan's new dog is something other than a golden retriever"},

];

// n_exh

var n_exh = [


{type: "prime", primetype = "exh", target = "n", id: "library", sentence: "Exactly 34 books were stolen from the local library yesterday.", suggests: "No more than 34 books were stolen from the local library yesterday"},
{type: "prime", primetype = "exh", target = "n", id: "cookies", sentence: "Mr. Whiteley's students sold exactly 34 boxes of cookies at the school bake sale.", suggests: "Mr Whiteley's students sold no more than 34 boxes of cookies at the bake sale"},
{type: "prime", primetype = "exh", target = "n", id: "chairs", sentence: "There are exactly 34 papers on Sandra's desk.", suggests: "There are no more than 34 papers on Sandra's desk"},
{type: "crit", primetype = "na", target = "n", id: "bus", sentence: "34 people were injured in a bus crash in Chris's hometown last week.", suggests: "No more than 34 people were injured in a bus crash in Chris's hometown last week"},

];

// n_str

var n_str = [

{type: "prime", primetype = "str", target = "n", id: "library", sentence: "35 books were stolen from the local library yesterday.", suggests: "No more than 34 books were stolen from the local library yesterday"},
{type: "prime", primetype = "str", target = "n", id: "cookies", sentence: "Mr. Whiteley's students sold 35 boxes of cookies at the school bake sale.", suggests: "Mr Whiteley's students sold no more than 34 boxes of cookies at the bake sale"},
{type: "prime", primetype = "str", target = "n", id: "chairs", sentence: "There are 35 papers on Sandra's desk.", suggests: "There are no more than 34 papers on Sandra's desk"},
{type: "crit", primetype = "na", target = "n", id: "bus", sentence: "34 people were injured in a bus crash in Chris's hometown last week.", suggests: "No more than 34 people were injured in a bus crash in Chris's hometown last week"},

];

// n_no

var n_no = [

{type: "prime", primetype = "no", target = "n", id: "library", sentence: "There was a break-in at the local library yesterday.", suggests: "No more than 34 books were stolen from the local library yesterday"},
{type: "prime", primetype = "no", target = "n", id: "cookies", sentence: "Mr. Whiteley's students sold the most baked goods at the school bake sale.", suggests: "Mr Whiteley's students sold no more than 34 boxes of cookies at the bake sale"},
{type: "prime", primetype = "no", target = "n", id: "chairs", sentence: "Aside from a computer, there isn't much on Sandra's desk.", suggests: "There are no more than 34 papers on Sandra's desk"},
{type: "crit", primetype = "na", target = "n", id: "bus", sentence: "34 people were injured in a bus crash in Chris's hometown last week.", suggests: "No more than 34 people were injured in a bus crash in Chris's hometown last week"},

];

// tasty_exh

var tasty_exh = [

{type: "prime", primetype = "exh", target = "tasty", id: "foodtruck", sentence: "The food truck outside Max's office makes tacos that are palatable, but not delicious.", suggests: "The food truck outside Max's office makes tacos that aren't exceptionally tasty"},
{type: "prime", primetype = "exh", target = "tasty", id: "beer", sentence: "Guillermo's brewery has just released a new beer that is palatable, but not delicious.", suggests: "Guillermo's brewery has just released a new beer that is not exceptionally tasty"},
{type: "prime", primetype = "exh", target = "tasty", id: "wine", sentence: "The wine that Clare brought to her friend's party last night was palatable, but not delicious.", suggests: "The wine that Clare brought to her friend's party last night was not exceptionally tasty"},
{type: "crit", primetype = "na", target = "tasty", id: "indian", sentence: "The apples that grow on Greg's farm are palatable.", suggests: "The apples that grow on Greg's farm are not exceptionally tasty"},

];


// tasty_str 

var tasty_str = [

{type: "prime", primetype = "str", target = "tasty", id: "foodtruck", sentence: "The food truck outside Max's office makes tacos that are delicious.", suggests: "The food truck outside Max's office makes tacos that aren't exceptionally tasty"},
{type: "prime", primetype = "str", target = "tasty", id: "beer", sentence: "Guillermo's brewery has just released a new beer that is delicious.", suggests: "Guillermo's brewery has just released a new beer that is not exceptionally tasty"},
{type: "prime", primetype = "str", target = "tasty", id: "wine", sentence: "The wine that Clare brought to her friend's party last night was delicious.", suggests: "The wine that Clare brought to her friend's party last night was not exceptionally tasty"},
{type: "crit", primetype = "na", target = "tasty", id: "indian", sentence: "The apples that grow on Greg's farm are palatable.", suggests: "The apples that grow on Greg's farm are not exceptionally tasty"},

];

// tasty_no 

var tasty_no = [

{type: "prime", primetype = "no", target = "tasty", id: "foodtruck", sentence: "The food truck outside Max's office serves several kinds of beverages.", suggests: "The food truck outside Max's office makes tacos that aren't exceptionally tasty"},
{type: "prime", primetype = "no", target = "tasty", id: "beer", sentence: "Guillermo's brewery has just released a new beer.", suggests: "Guillermo's brewery has just released a new beer that is not exceptionally tasty"},
{type: "prime", primetype = "no", target = "tasty", id: "wine", sentence: "The wine that Clare brought to her friend's party was imported.", suggests: "The wine that Clare brought to her friend's party last night was not exceptionally tasty"},
{type: "crit", primetype = "na", target = "tasty", id: "indian", sentence: "The apples that grow on Greg's farm are palatable.", suggests: "The apples that grow on Greg's farm are not exceptionally tasty"},

];

// hard_exh

var hard_exh = [

{type: "prime", primetype = "exh", target = "tasty", id: "homework", sentence: "The homework that Professor Bridges assigns is hard, but not unsolvable.", suggests: "The homework that Professor Bridges assigns is not impossible to finish"},
{type: "prime", primetype = "exh", target = "tasty", id: "hospital", sentence: "Designing a new hospital in Hiram's hometown is a hard but not unsolvable problem.", suggests: "Designing a new hospital in Hiram's hometown is not an impossible problem to solve"},
{type: "prime", primetype = "exh", target = "tasty", id: "wine", sentence: "For Tamir and Frances, the issue of how to pay for their children's education is hard but not unsolvable.", suggests: "For Tamir and Frances, the issue of how to pay for their children's education not impossible to overcome"},
{type: "crit", primetype = "na", target = "tasty", id: "indian", sentence: "The final asssignment in Harrison's calculus class is hard.", suggests: "The final asssignment in Harrison's calculus class is not impossible to complete"},

];

// hard_exh

var hard_str = [

{type: "prime", primetype = "str", target = "tasty", id: "homework", sentence: "The homework that Professor Bridges assigns is unsolvable.", suggests: "The homework that Professor Bridges assigns is not impossible to finish"},
{type: "prime", primetype = "str", target = "tasty", id: "hospital", sentence: "Designing a new hospital in Hiram's hometown is an unsolvable problem.", suggests: "Designing a new hospital in Hiram's hometown is not an impossible problem to solve"},
{type: "prime", primetype = "str", target = "tasty", id: "wine", sentence: "For Tamir and Frances, the issue of how to pay for their children's education is unsolvable.", suggests: "For Tamir and Frances, the issue of how to pay for their children's education not impossible to overcome"},
{type: "crit", primetype = "na", target = "tasty", id: "indian", sentence: "The final asssignment in Harrison's calculus class is hard.", suggests: "The final asssignment in Harrison's calculus class is not impossible to complete"},

];

// hard_no

var hard_no: [

{type: "prime", primetype = "no", target = "tasty", id: "homework", sentence: "The homework that Professor Bridges assigns is always due the Monday after it is assigned.", suggests: "The homework that Professor Bridges assigns is not impossible to finish"},
{type: "prime", primetype = "no", target = "tasty", id: "hospital", sentence: "Designing a new hospital in Hiram's hometown has been a government priority for several years.", suggests: "Designing a new hospital in Hiram's hometown is not an impossible problem to solve"},
{type: "prime", primetype = "no", target = "tasty", id: "wine", sentence: "Tamir and Frances have given lots of thought to how they will pay for their children's education.", suggests: "For Tamir and Frances, the issue of how to pay for their children's education not impossible to overcome"},
{type: "crit", primetype = "na", target = "tasty", id: "indian", sentence: "The final asssignment in Harrison's calculus class is hard.", suggests: "The final asssignment in Harrison's calculus class is not impossible to complete"},

];

 var lists_dict = [
    {name: "list1", items: [or_exh,some_str,lookslike_no,n_exh,tasty_str,hard_no]},
    {name: "list2", items: [or_no,some_exh,lookslike_str,n_no,tasty_exh,hard_str]},
    {name: "list3", items: [or_str,some_no,lookslike_exh,n_str,tasty_no,hard_exh]},
  ];