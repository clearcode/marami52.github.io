
$(document).ready(function(){

  document.getElementById('result').ondragstart = drag;
  document.getElementById('replicate').ondrop = drop;
  document.getElementById('replicate').ondragover = allowDrop;

  var textItems=[];
  var textCell=[];
  var imageItems=[];
  var learned=0;
  var divClone = $("#replicate").html();
  $('textarea[name="x"]').val('```{r test, fig.width=4, fig.height=4}\n# write R code here\n myData=subset(mtcars, gear>0)\n result <- lm(mpg~disp, data=myData)\n summary(result) \n plot(result)\n```');

  $('#knit').click(function() {
    $(this).attr('class', 'btn disabled');
    $('#knitForm').submit();
  });

  $('#knit-learn').click(function() {
    $(this).attr('class', 'btn disabled');
    $('#replicate img').each(function (i, e) { imageItems[i]=$(this).attr('id') });
    $('#replicate table td').each(function (i, e) { textItems[i]=$(this).children(this).first().attr('id'); textCell[i]=$(this).attr('class'); });
    learned=1;
    console.log('voallah!', imageItems, textItems, textCell)
  });

  /* attach a submit handler to the form */
  $('#knitForm').submit(function (event) {

      /* stop form from submitting normally */
      event.preventDefault();

      /* get some values from elements on the page: */
      var $form = $(this),
        term = $form.find('textarea[name="x"]').val().replace(/\\/g, '\\\\').replace(/"/g, '\\"'),
        url = $form.attr('action'),
        rcode = 'library(knitr)\n' +
                'knit2html(text = "' + term + '", fragment.only = TRUE)';
      /* Send the data using post and put the results in a div */
      $.post(url, { x: rcode },
      function (data) {
          var myWords=data[0].replace(/&lt;/g, '')
          console.log(myWords)
          $("#result").html(myWords);

          //console.log(data[0]);

          //$("#result").html($('#result').text().replace('< ','<'))
          var words = $("pre code").text().split(/[ ,]+/);
          //words=words.replace('< ','<')
          //console.log('this is words',words)
          $("pre code").empty();
          $.each(words, function(i, v) {
            $("pre code").append($("<dummy>").text(' '+v+''));

          });



                //$(this).html( $(this).text().replace(/([\S]*)\s(.*)/, "$1 <span>$2</span>") );
                //console.log($(this).text())

          $('pre code').each(function (i, e) { hljs.highlightBlock(e) });
          $('img').each(function (i, e) { $(this).attr('id','img' + i) });
          $('pre code').each(function (i, e) { $(this).attr('id', 'code' + i) });
          $('pre code').each(function (i, e) { if (i>0){$(this).remove('#code'+i)} });
          $('dummy').each(function (i, e) { $(this).attr('id', 'row' + i) });

      })

      .complete(function(){
        $('#knit').attr('class', 'btn btn-primary');
        if (learned==0){
          $("#replicate").html(divClone);
        }
        else {
          $("#replicate").html(divClone);
          imageItems.forEach(function(e,i){
            var trial = $('#'+e).attr('src');
            $('#replicate').append($('<img>',{id:'theImg'+e,src:trial}))
          })

          textItems.forEach(function(e,i){
            var trial = $('#'+e).text();
            $('.'+textCell[i]).append().text(trial);
            console.log(trial,e,i)
          })




        }


      })
      .error(function () { alert("An error occurred!"); });


  });


  function allowDrop(ev) {

      ev.preventDefault();
  }

  function drag(ev) {
    if (learned==0){
    //console.log($(event.target).closest('span').attr('id'));
    if ($(ev.target).closest('dummy').attr('id')==undefined){

        ev.dataTransfer.setData("fext55", ev.target.id);


    }
    else{
      var myId = $(ev.target).closest('dummy').attr('id');

      ev.dataTransfer.setData("fext55", myId);
      //console.log('it is text')
    };


      //console.log('Yeeeee')
    }
    else{
      return false;
    }
      //var draggable = ev.draggable;
      //var myId = $(event.target).closest('span').attr('id');
      //ev.dataTransfer.setData("text/plain", myId);
      //console.log(myId)
  }

  function drop(ev) {
    if (learned==0){
      ev.preventDefault();
      var data = ev.dataTransfer.getData("fext55");
      var nodeCopy = document.getElementById(data).cloneNode(true);
      //nodeCopy.id = "newId"; /* We cannot use the same ID */
      ev.target.appendChild(nodeCopy);
    }
    else{
      return false;
    }

  }






});
