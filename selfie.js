$(document).on('change', "#image-selector", function(){
    let reader = new FileReader();
    reader.onload = function(){
        let dataURL = reader.result;
        $('#selected-image').attr("src",dataURL);
        $("#prediction").empty(); 
    }
    let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
});

let model;

async function loadMyModel(){
    model = undefined;
    
    model =await tf.loadLayersModel("https://consumingtoast.github.io/SelfieTime/model/model.json");
    $('.progress-bar').hide();
    alert("model loaded..");
 
}
try{
loadMyModel();
}
catch{
    alert("Something went wrong");
}

$(document).on('click', '#button', async function(){
    let image = $('#selected-image').get(0);
    let tensor = tf.fromPixels(image)
        .resizenearestNeighbor([224,224])
        .toFloat()
        .expandDims();
});

let predictions = await model.predict(tensor).data();
let top = Array.from(predictions)
    .map(function (p,i){
        return{
            probability: p,
            className: My_Classes[i]
        };
    }).sort(function(a,b){
        return b.probability - a.probability;
    }).slice(0,4);

$("#prediction").empty();
top.forEach(function (p){
    $('#prediction').append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
});