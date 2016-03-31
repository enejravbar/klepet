function divElementEnostavniTekst(sporocilo) {
  var jeSmesko = sporocilo.indexOf('http://sandbox.lavbic.net/teaching/OIS/gradivo/') > -1;
  if (jeSmesko) {
    sporocilo = sporocilo.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace('&lt;img', '<img').replace('png\' /&gt;', 'png\' />');
    return $('<div style="font-weight: bold"></div>').html(sporocilo);
  } else {
    
    if(sporocilo.indexOf('http://')>-1 || sporocilo.indexOf('https://')>-1  ){
      
       console.log("USTREZNI LINK JE:" + obdelajBesediloSporocila(sporocilo));
      return  $(obdelajBesediloSporocila(sporocilo)).html(sporocilo);
     
      //return  $('<img src="'+sporocilo+'"'+ ' style="width:200px; margin-left:20px; display:block;"> ').html(sporocilo);
      
    }else{
      return $('<div style="font-weight: bold;"></div>').html(sporocilo);
    }
    
  }
}

function obdelajBesediloSporocila(sporocilo){
		var text="";
		var kontrola=0;
		var poz=0;
		for(var i=0; i<sporocilo.length; i++){
			if(poz>=sporocilo.length){break;}

		    if(sporocilo.charAt(poz)=='h' || sporocilo.charAt(poz)=='.'){
		     
		     if( sporocilo.length>=poz+8 ){
			      if((sporocilo.substring(poz,poz+8)==("https://") )){ //preverimo ce je v sporocilu https://
			        text=text+'<img src="'+sporocilo.charAt(poz);
			        poz++;
			        continue;
			      }
			 }

			 if(sporocilo.length>=poz+7){
			      if( (sporocilo.substring(poz,poz+7)==("http://") )){  // preverimo, ce je v sporocilu http://
			        text=text+'<img src="'+sporocilo.charAt(poz);
			        poz++;
			        continue;	
			      }
			 }
		     
		     if((sporocilo.length)>poz+3){    
			      if((  (sporocilo.substring(poz,poz+3)+sporocilo.charAt(poz+3))==(".jpg"))){ //preverimo ce je v sporocilu .gif
			        text=text+sporocilo.substring(poz,poz+3)+sporocilo.charAt(poz+3)+'"'+' style="display:block; width:200px;">';
			        poz=poz+4;
			         if(poz>=sporocilo.length){break;}
			        continue;
			      }
			 }

			  if((sporocilo.length>poz+3)){
			      if( ((sporocilo.substring(poz,poz+3)+sporocilo.charAt(poz+3))==(".png") )){ 
			        text=text+sporocilo.substring(poz,poz+3)+sporocilo.charAt(poz+3)+'"'+' style="display:block; width:200px;">';
			        poz=poz+4;
			         if(poz>sporocilo.length){break;}
			        continue;
			      }

			  }


			  if((sporocilo.length>poz+3)){
			      if(( (sporocilo.substring(poz,poz+3)+ sporocilo.charAt(poz+3) )==(".gif") && (sporocilo.length)>=poz+3)){ //preverimo ce je v sporocilu .jpg
			        text=text+sporocilo.substring(poz,poz+3)+sporocilo.charAt(poz+3)+'"'+' style="display:block; width:200px;">';
			        poz=poz+4;
			        if(poz>sporocilo.length){break;}
			        continue;
			      }
			  }
		        text=text+sporocilo.charAt(poz);
		      
		      
		    }else{
		      text=text+sporocilo.charAt(poz);
		    }		  
		    poz++;
		    
		}
		  return text;

	}
	
function divElementHtmlTekst(sporocilo) {
  return $('<div></div>').html('<i>' + sporocilo + '</i>');
}

function procesirajVnosUporabnika(klepetApp, socket) {
  var sporocilo = $('#poslji-sporocilo').val();
  sporocilo = dodajSmeske(sporocilo);
  var sistemskoSporocilo;

  if (sporocilo.charAt(0) == '/') {
    sistemskoSporocilo = klepetApp.procesirajUkaz(sporocilo);
    if (sistemskoSporocilo) {
      $('#sporocila').append(divElementHtmlTekst(sistemskoSporocilo));
    }
  } else {
    sporocilo = filtirirajVulgarneBesede(sporocilo);
    klepetApp.posljiSporocilo(trenutniKanal, sporocilo);
    $('#sporocila').append(divElementEnostavniTekst(sporocilo));
    $('#sporocila').scrollTop($('#sporocila').prop('scrollHeight'));
  }

  $('#poslji-sporocilo').val('');
}

var socket = io.connect();
var trenutniVzdevek = "", trenutniKanal = "";

var vulgarneBesede = [];
$.get('/swearWords.txt', function(podatki) {
  vulgarneBesede = podatki.split('\r\n');
});

function filtirirajVulgarneBesede(vhod) {
  for (var i in vulgarneBesede) {
    vhod = vhod.replace(new RegExp('\\b' + vulgarneBesede[i] + '\\b', 'gi'), function() {
      var zamenjava = "";
      for (var j=0; j < vulgarneBesede[i].length; j++)
        zamenjava = zamenjava + "*";
      return zamenjava;
    });
  }
  return vhod;
}

$(document).ready(function() {
  var klepetApp = new Klepet(socket);

  socket.on('vzdevekSpremembaOdgovor', function(rezultat) {
    var sporocilo;
    if (rezultat.uspesno) {
      trenutniVzdevek = rezultat.vzdevek;
      $('#kanal').text(trenutniVzdevek + " @ " + trenutniKanal);
      sporocilo = 'Prijavljen si kot ' + rezultat.vzdevek + '.';
    } else {
      sporocilo = rezultat.sporocilo;
    }
    $('#sporocila').append(divElementHtmlTekst(sporocilo));
  });

  socket.on('pridruzitevOdgovor', function(rezultat) {
    trenutniKanal = rezultat.kanal;
    $('#kanal').text(trenutniVzdevek + " @ " + trenutniKanal);
    $('#sporocila').append(divElementHtmlTekst('Sprememba kanala.'));
  });

  socket.on('sporocilo', function (sporocilo) {
    var novElement = divElementEnostavniTekst(sporocilo.besedilo);
    $('#sporocila').append(novElement);
    
    
  });
  
  socket.on('kanali', function(kanali) {
    $('#seznam-kanalov').empty();

    for(var kanal in kanali) {
      kanal = kanal.substring(1, kanal.length);
      if (kanal != '') {
        $('#seznam-kanalov').append(divElementEnostavniTekst(kanal));
      }
    }

    $('#seznam-kanalov div').click(function() {
      klepetApp.procesirajUkaz('/pridruzitev ' + $(this).text());
      $('#poslji-sporocilo').focus();
    });
  });

  socket.on('uporabniki', function(uporabniki) {
    $('#seznam-uporabnikov').empty();
    for (var i=0; i < uporabniki.length; i++) {
      $('#seznam-uporabnikov').append(divElementEnostavniTekst(uporabniki[i]));
    }
  });

  setInterval(function() {
    socket.emit('kanali');
    socket.emit('uporabniki', {kanal: trenutniKanal});
  }, 1000);

  $('#poslji-sporocilo').focus();

  $('#poslji-obrazec').submit(function() {
    procesirajVnosUporabnika(klepetApp, socket);
    return false;
  });
  
  
});

function dodajSmeske(vhodnoBesedilo) {
  var preslikovalnaTabela = {
    ";)": "wink.png",
    ":)": "smiley.png",
    "(y)": "like.png",
    ":*": "kiss.png",
    ":(": "sad.png"
  }
  for (var smesko in preslikovalnaTabela) {
    vhodnoBesedilo = vhodnoBesedilo.replace(smesko,
      "<img src='http://sandbox.lavbic.net/teaching/OIS/gradivo/" +
      preslikovalnaTabela[smesko] + "' />");
  }
  return vhodnoBesedilo;
}
