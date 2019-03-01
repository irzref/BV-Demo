import './main.css';
// import $ from "jquery";

const urlPrediction = "http://localhost:9011/";
const urlTranslation = "http://localhost:8080/api/translate-german-to-english";

function expandTextarea(id) {
  document.getElementById(id).addEventListener('keyup', function() {     
      // console.log("textarea", this.style.height, this.scrollHeight)

      this.style.overflow = 'hidden';          
      
      if(Number(this.style.height.replace("px", "")) < this.scrollHeight) {
        this.style.height = 0;
        this.style.height = this.scrollHeight + 'px';
      }
        
  }, false);
}

function toxicPrediction(text, callback) {

    // let text = "Fick dich Angela Merkel"
    let query_string = "?predict=" + encodeURIComponent(text);
    
    $.getJSON(urlPrediction + query_string, function(data) {
        // console.log("test", data);

        callback(data);

    });

}

function translation(text) {

  let query_string = "?text=" + encodeURIComponent(text);
  
  return new Promise(
      function (resolve, reject) {          

          $.getJSON(urlTranslation + query_string, function(data) {
              // console.log("test", data);

              if(data.text) {
                resolve(data.text);
              } else {
                reject(data);
              }
                      
          });

      }
  );  

}

function listBuilder(listdata) {
  var containerStart = '<ul class="list-group">';
  var containerEnd = '</ul>';

  var content = "";
  for (var i = 0; i < listdata.length; i++) { 
    var html = '<li class="list-group-item d-flex justify-content-between align-items-center">' +
      listdata[i][0] +
      '<span class="badge badge-primary badge-pill">' + listdata[i][1] + '</span></li>';
    
    content += html;
  } 

  return containerStart + content + containerEnd;
}

function entityListBuilderEnglish(originalList, translationList) {

  var modifiedList = [];
  for (var i = 0; i < originalList.length; i++) {     
    modifiedList.push([translationList[i + 1], originalList[i][1]]);
  }

  return listBuilder(modifiedList);

}

function showResult(text, data, translation) {

  // insert translation
  if(translation && translation[0]) {
    $('div#comment-english').html(translation[0]);
  }
  
  if(data.entities && data.entities.length > 0){
    $('div#ner-german').html(listBuilder(data.entities));

    if(translation) {
      // insert translation
      $('div#ner-english').html(entityListBuilderEnglish(data.entities, translation));
    }    

    $("div#ner").show();
  } else {
    $("div#ner").hide();
  }

  var confienceVal = Number(data.precentage * 100).toFixed(2);
  
  // dominik model uses __label__0
  // ervin model uses __label__False
  if(data.label == "__label__0") {
    $('div#classification-label').html('<span class="badge badge-success">NON-TOXIC</span>');
    $('div#classification-confidence').html('<div class="progress-bar bg-success" role="progressbar" style="width: ' + confienceVal + '%" aria-valuenow="' + confienceVal + '" aria-valuemin="0" aria-valuemax="100">' + confienceVal + '%</div>')

  } else {
    $('div#classification-label').html('<span class="badge badge-danger">TOXIC</span>');
    $('div#classification-confidence').html('<div class="progress-bar bg-danger" role="progressbar" style="width: ' + confienceVal + '%" aria-valuenow="' + confienceVal + '" aria-valuemin="0" aria-valuemax="100">' + confienceVal + '%</div>')
  }
  $('pre#classification-json').html(JSON.stringify(data, undefined, 2))      
  $("div#classification").show();

}

$(document).ready(function() {

  expandTextarea('comment-german');
  $('#comment-german').bind('input propertychange', function() {

    var text = $('textarea#comment-german').val();
    // console.log("input", text);

    if ($.trim(text) == '') {

      $('div#comment-english').html("");
      $("div#ner").hide();
      $("div#classification").hide();

    } else {

      toxicPrediction(text, function(data) {
        // console.log("prediction", data);
        
        // showResult(text, data);
  
        var promiseArr = [
          translation(text)
        ];
      
        for (var i = 0; i < data.entities.length; i++) { 
          
          promiseArr.push(translation(data.entities[i][0]));
          
        }
  
        Promise.all(promiseArr)
        .then(values => {
          // console.log("Translation", values); 
  
          showResult(text, data, values);
  
        });
  
      });
      
    }

  });

});