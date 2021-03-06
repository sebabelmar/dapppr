var canvas;
var tshirts = new Array(); //prototype: [{style:'x',color:'white',front:'a',back:'b',price:{tshirt:'12.95',frontPrint:'4.99',backPrint:'4.99',total:'22.47'}}]
var a;
var b;
var line1;
var line2;
var line3;
var line4;

$(document).ready(function() {


  //setup front side canvas

  canvas = new fabric.Canvas('tcanvas', {
    moving: 'false',
    hoverCursor: 'pointer',
    selection: true,
    selectionBorderColor:'blue'
  });


    canvas.on({
         'object:moving': function(e) {
            e.target.top = 130;
            e.target.left = 100;
          },
          'object:modified': function(e) {
            e.target.opacity = 0.7;
            // e.target.globalCompositeOperation = 'darken';

          },
         'object:selected':onObjectSelected,
         'selection:cleared':onSelectedCleared
     });
    canvas.findTarget = (function(originalFn) {
      return function() {
        var target = originalFn.apply(this, arguments);
        if (target) {
          if (this._hoveredTarget !== target) {
              canvas.fire('object:over', { target: target });
            if (this._hoveredTarget) {
                canvas.fire('object:out', { target: this._hoveredTarget });
            }
            this._hoveredTarget = target;
          }
        }
        else if (this._hoveredTarget) {
            canvas.fire('object:out', { target: this._hoveredTarget });
          this._hoveredTarget = null;
        }
        return target;
      };
    })(canvas.findTarget);

    canvas.on('object:over', function(e) {
      //e.target.setFill('red');
      //canvas.renderAll();
    });

    canvas.on('object:out', function(e) {
      //e.target.setFill('green');
      //canvas.renderAll();
    });


    $(".img-polaroid").click(function(e){
        var el = e.target;
        fabric.Image.fromURL(el.src, function(image) {
              image.set({
                left: 100,
                top: 130,
                angle: 0,
                padding: 10,
                cornersize: 10,
                scaleX: 175 / image.width,
                scaleY: 125 / image.height,
                hasRotatingPoint:true
              });
              canvas.clear().renderAll();
              canvas.add(image);
              console.log(JSON.stringify(canvas));

            });
    });

    if ($('#save-product') >== 1){
      document.getElementById('save-product').onclick = function() {
                saveProduct();
      };
    }


    function saveProduct(){
      // ultimately we want to save this JSON to the database
      console.log(JSON.stringify(canvas));
    }

     $("#drawingArea").hover(
          function() {
               canvas.add(line1);
               canvas.add(line2);
               canvas.add(line3);
               canvas.add(line4);
               canvas.renderAll();
          },
          function() {
               canvas.remove(line1);
               canvas.remove(line2);
               canvas.remove(line3);
               canvas.remove(line4);
               canvas.renderAll();
          }
      );

     $('.color-preview').click(function(){
         var color = $(this).css("background-color");
         document.getElementById("shirtDiv").style.backgroundColor = color;
     });

     line1 = new fabric.Line([0,0,200,0], {"stroke":"#000000", "strokeWidth":1,hasBorders:false,hasControls:false,hasRotatingPoint:false,selectable:false});
     line2 = new fabric.Line([199,0,200,399], {"stroke":"#000000", "strokeWidth":1,hasBorders:false,hasControls:false,hasRotatingPoint:false,selectable:false});
     line3 = new fabric.Line([0,0,0,400], {"stroke":"#000000", "strokeWidth":1,hasBorders:false,hasControls:false,hasRotatingPoint:false,selectable:false});
     line4 = new fabric.Line([0,400,200,399], {"stroke":"#000000", "strokeWidth":1,hasBorders:false,hasControls:false,hasRotatingPoint:false,selectable:false});


  });//doc ready


  // function getRandomNum(min, max) {
  //   return Math.random() * (max - min) + min;
  // }

  function onObjectSelected(e) {
    var selectedObject = e.target;
    $("#text-string").val("");
    selectedObject.hasRotatingPoint = true;
    if (selectedObject && selectedObject.type === 'text') {
        //display text editor
        $("#texteditor").css('display', 'block');
        $("#text-string").val(selectedObject.getText());
        $('#text-fontcolor').miniColors('value',selectedObject.fill);
        $('#text-strokecolor').miniColors('value',selectedObject.strokeStyle);
        $("#imageeditor").css('display', 'block');
    }
    else if (selectedObject && selectedObject.type === 'image'){
        //display image editor
        $("#texteditor").css('display', 'none');
        $("#imageeditor").css('display', 'block');
    }
  }
  function onSelectedCleared(e){
     $("#texteditor").css('display', 'none');
     $("#text-string").val("");
     $("#imageeditor").css('display', 'none');
  }

  function removeWhite(){
      var activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'image') {
          activeObject.filters[2] =  new fabric.Image.filters.RemoveWhite({hreshold: 100, distance: 10});//0-255, 0-255
          activeObject.applyFilters(canvas.renderAll.bind(canvas));
      }


}
