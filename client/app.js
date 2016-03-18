$(document).ready(function(){
  $('#submit-animal').on('click', addAnimal);
  displayAnimals();
});



function addAnimal(event){
  event.preventDefault();
  var animal = {};

  $.each($("#animal-form").serializeArray(), function(i, field) {
    animal[field.name] = field.value;
  });

  console.log(animal);
  $.ajax({
    type: "POST",
    url: "/animal",
    data: animal,
    success: function(data){
        console.log("Successfully added: "+ data);
        displayAnimals();
    }
  });
}

function displayAnimals(){
  $('.zoo-keeper').empty();
  $.ajax({
    type: "GET",
    url: "/animal",
    success: function(data){
      for(var i = 0; i<data.length; i++){
        appendAnimal(data[i]);
      }
    }
  });
}

function appendAnimal(animal){
  $('.zoo-keeper').append('<div class="cage"></div>');
  $el = $('.zoo-keeper').children().last();
  $el.append('<h2>' + animal.species + '</h2>');
  $el.append('<p>Ammount: ' + animal.ammount + '</p>');
}
