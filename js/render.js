function hasLetters(word) {
  letters = false;

  for (i = 0; i < word.length; i++) {
    char = word[i];

    if (char.charCodeAt(0) < 48 || char.charCodeAt(0) > 57) {
      letters = true;
    }
  }

  return letters;
}

function render(text_string, word_limit=100, filter='') {
  // console.log(text_string);
  // console.log(word_limit);
  // console.log(filter);

  d3.select("#chart").html("");

  drawWordCloud(text_string);

  function drawWordCloud(text_string){
    var stopwords = "a,about,above,across,after,afterwards,again,against,all,almost,alone,along,already,also,although,always,am,among,amongst,amoungst,amount,an,and,another,any,anyhow,anyone,anything,anyway,anywhere,are,around,as,at,back,be,became,because,become,becomes,becoming,been,before,beforehand,behind,being,below,beside,besides,between,beyond,bill,both,bottom,but,by,call,can,cannot,cant,co,computer,con,could,couldnt,cry,de,describe,detail,do,done,down,due,during,each,eg,eight,either,eleven,else,elsewhere,empty,enough,etc,even,ever,every,everyone,everything,everywhere,except,few,fifteen,fify,fill,find,fire,first,five,for,former,formerly,forty,found,four,from,front,full,further,get,give,go,had,has,hasnt,have,he,hence,her,here,hereafter,hereby,herein,hereupon,hers,him,his,how,however,hundred,i,ie,if,in,inc,indeed,interest,into,is,it,its,keep,last,latter,latterly,least,less,ltd,made,many,may,me,meanwhile,might,mill,mine,more,moreover,most,mostly,move,much,must,my,name,namely,neither,never,nevertheless,next,nine,no,nobody,none,noone,nor,not,nothing,now,nowhere,of,off,often,on,once,one,only,onto,or,other,others,otherwise,our,ours,ourselves,out,over,own,part,per,perhaps,please,put,rather,re,same,see,seem,seemed,seeming,seems,serious,several,she,should,show,side,since,sincere,six,sixty,so,some,somehow,someone,something,sometime,sometimes,somewhere,still,such,system,take,ten,than,that,the,their,them,themselves,then,thence,there,thereafter,thereby,therefore,therein,thereupon,these,they,thick,thin,third,this,those,though,three,through,throughout,thru,thus,to,together,too,top,toward,towards,twelve,twenty,two,un,under,until,up,upon,us,very,via,was,we,well,were,what,whatever,when,whence,whenever,where,whereafter,whereas,whereby,wherein,whereupon,wherever,whether,which,while,whither,who,whoever,whole,whom,whose,why,will,with,within,without,would,yet,you,your,yours,yourself,yourselves";

    var word_count = {};

    var words = text_string.split(/[ '\-\(\)\*":;\[\]|{},.!?]+/);
      if (words.length == 1){
        word_count[words[0]] = 1;
      } else {
        words.forEach(function(word){
          var word = word.toLowerCase();
          if (word != "" && stopwords.indexOf(word)==-1 && word.length>1 && word.length < 10 && hasLetters(word)){
            if (word_count[word]){
              word_count[word]++;
            } else {
              word_count[word] = 1;
            }
          }
        })
      }

    // Remove filtered words
    var filterterms = filter.split(" ");

    for (i = 0; i < filterterms.length; i++) {
      term = filterterms[i];
      delete word_count[term];
    }

    // Limit our results to the top 50 entries
    final_word_count = {};

    if (Object.keys(word_count).length <= word_limit) {
      final_word_count = word_count;
    }
    else {
      while (Object.keys(final_word_count).length < word_limit) {
        maxkey = Object.keys(word_count).reduce((a, b) => word_count[a] > word_count[b] ? a : b);
        final_word_count[maxkey] = word_count[maxkey];
        delete word_count[maxkey];
      }

      word_count = final_word_count;
    }

    var svg_location = "#chart";
    var width = $(document).width();
    var height = $(document).height();

    var fill = d3.scale.category20();

    var word_entries = d3.entries(word_count);

    var xScale = d3.scale.linear()
       .domain([0, d3.max(word_entries, function(d) {
          return d.value;
        })
       ])
       .range([10,100]);

    d3.layout.cloud().size([width, height])
      .timeInterval(20)
      .words(word_entries)
      .fontSize(function(d) { return xScale(+d.value); })
      .text(function(d) { return d.key; })
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .on("end", draw)
      .start();

    function draw(words) {
      d3.select(svg_location).append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return xScale(d.value) + "px"; })
          .style("font-family", "Impact")
          .style("fill", function(d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.key; });
    }

    d3.layout.cloud().stop();
  }

  return false;
}
