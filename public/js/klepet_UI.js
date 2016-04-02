function divElementEnostavniTekst(sporocilo) {
  var jeSmesko = sporocilo.indexOf('http://sandbox.lavbic.net/teaching/OIS/gradivo/') > -1;
  var textZaPoslat="";
  if(jeSmesko || sporocilo.indexOf('http://')>-1 || sporocilo.indexOf('https://')>-1  ){
    
      textZaPoslat = obdelajBesediloSporocila(sporocilo);
      //console.log("Pred modifikacijo:"+textZaPoslat);
      textZaPoslat = textZaPoslat.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(new RegExp('&lt;img', 'gi'), '<img').replace(new RegExp('png\' /&gt;', 'gi'), 'png\' />').replace(new RegExp('jpg\' /&gt;', 'gi'), 'jpg\' />').replace(new RegExp('gif\' /&gt;', 'gi'), 'gif\' />');
      
     // console.log("Po modifikacijo:"+textZaPoslat);
      return  $('<div style="font-weight: bold;"></div>').html(textZaPoslat);
   
  }else {
    	    sporocilo=sporocilo.replace(/\"/g , "\'");
          return $('<div style="font-weight: bold;"></div>').text(sporocilo);
    }
    
  
}

function poisciMinPozKoncnice(pozGIF, pozJPG, pozPNG){      // ce je -1 pomeni da v sporocilu ni URL za slike
  var min=Number.MAX_VALUE; 
  if(pozPNG==-1 && pozJPG==-1 && pozGIF==-1 ){
    return -1;
  }
  if(pozGIF<min && pozGIF!=-1 ){
    min=pozGIF;
  }
  if(pozJPG<min && pozJPG!=-1 ){
    min=pozJPG;
  }
  if(pozPNG<min && pozPNG!=-1 ){
    min=pozPNG
  }
  return min;
  
}

function poisciMinPozHTTP(pozHTTP, pozHTTPS){      // ce je -1 pomeni da v sporocilu ni URL za slike
  var min=Number.MAX_VALUE; 
  if(pozHTTP==-1 && pozHTTPS==-1){   //ce je -1 pomeni da v sporocilu ni VEC URL-JEV
    return Number.MAX_VALUE;
  }
  if(pozHTTP<min && pozHTTP!=-1 ){
    min=pozHTTP;
  }
  if(pozHTTPS<min && pozHTTPS!=-1 ){
    min=pozHTTPS;
  }
  
  return min;
  
}
function obdelajBesediloSporocila(sporocilo1){
		var text="";
		var kontrola=0;
		var poz=0;
		var pozicijaPNG=0;
		var sporocilo=sporocilo1;
		
		var pozPNG=0;
	  var pozJPG=0;
		var pozGIF=0;
		var pozHTTP=0;
		var pozHTTPS=0;
		
	//	sporocilo=sporocilo.replace(/\"/g , "\'");
	
		console.log(sporocilo);
		for(var i=0; i<sporocilo.length; i++){
			if(poz>=sporocilo.length){break;}
			
		    if(sporocilo.charAt(poz)=='h' || sporocilo.charAt(poz)=='.'){

		      if( sporocilo.length>=poz+47 ){   // naredi smejkota
		        pozicijaPNG=0;
			      if((sporocilo.substring(poz,poz+47)==('http://sandbox.lavbic.net/teaching/OIS/gradivo/') )){ 
			        //text=text+'<img src="'+sporocilo.charAt(poz);
			        pozicijaPNG=sporocilo.indexOf(".png",poz);
			       // console.log("Pozicija .png je " +pozicijaPNG);
			        text=text+'<img src='+"'"+sporocilo.substring(poz,pozicijaPNG+3)+sporocilo.charAt(pozicijaPNG+3);
			        
			        poz=pozicijaPNG+4;
			        continue;
			      }
			  }
		    
		     if( sporocilo.length>=poz+8 ){
		       
			      if((sporocilo.substring(poz,poz+8)==("https://") )){ //preverimo ce je v sporocilu https://
			        pozPNG=sporocilo.indexOf(".png",poz+1);
		          pozJPG=sporocilo.indexOf(".jpg",poz+1);
		          pozGIF=sporocilo.indexOf(".gif",poz+1);
		          pozHTTP=sporocilo.indexOf("http://",poz+1);
		          pozHTTPS=sporocilo.indexOf("https://",poz+1);
		         /* console.log("pozPNG="+pozPNG+" pozJPG=" +pozJPG+ " pozGIF=" +pozGIF );
		          console.log("pozHTTP="+pozHTTP+" pozHTTPS=" +pozHTTPS);
		          console.log("Minimalna pozicija koncnice slike: " + poisciMinPozKoncnice(pozGIF, pozJPG, pozPNG) + "    Minimalna pozicija http://: " +  poisciMinPozHTTP(pozHTTP, pozHTTPS));*/
			        
			        if(poisciMinPozKoncnice(pozGIF, pozJPG, pozPNG)==-1){  // ce ni slikovnih url-jev obravnavaj sporocilo kot text
			          text=text+sporocilo.charAt(poz);
			          poz++;
			          continue;
			        }
			        if(poisciMinPozKoncnice(pozGIF, pozJPG, pozPNG) < poisciMinPozHTTP(pozHTTP, pozHTTPS)){ 
			          text=text+'<img style="display:block; width:200px; margin-left:20px;" src=\''+sporocilo.charAt(poz);
			          poz++;
			          continue;
			        }
			        
			        
			        
			      }
			 }

			if(sporocilo.length>=poz+7){
			      
			      if( (sporocilo.substring(poz,poz+7)==("http://") )){  // preverimo, ce je v sporocilu http://
			       
			        pozPNG=sporocilo.indexOf(".png",poz+1);
		          pozJPG=sporocilo.indexOf(".jpg",poz+1);
		          pozGIF=sporocilo.indexOf(".gif",poz+1);
		          pozHTTP=sporocilo.indexOf("http://",poz+1);
		          pozHTTPS=sporocilo.indexOf("https://",poz+1);
		         /* console.log("pozPNG="+pozPNG+" pozJPG=" +pozJPG+ " pozGIF=" +pozGIF );
		          console.log("pozHTTP="+pozHTTP+" pozHTTPS=" +pozHTTPS);
		          console.log("Minimalna pozicija koncnice slike: " + poisciMinPozKoncnice(pozGIF, pozJPG, pozPNG) + "    Minimalna pozicija http://: " +  poisciMinPozHTTP(pozHTTP, pozHTTPS));*/
			        
			        if(poisciMinPozKoncnice(pozGIF, pozJPG, pozPNG)==-1){  // ce ni slikovnih url-jev obravnavaj sporocilo kot text
			          text=text+sporocilo.charAt(poz);
			          poz++;
			          continue;
			        }
			        if(poisciMinPozKoncnice(pozGIF, pozJPG, pozPNG) < poisciMinPozHTTP(pozHTTP, pozHTTPS)){ 
			          text=text+'<img style="display:block; width:200px; margin-left:20px;" src=\''+sporocilo.charAt(poz);
			          poz++;
			          continue;
			        }
			     
			      }
			 }
		     
		     
		     
		     
		     if((sporocilo.length)>poz+3){    
			      if((  (sporocilo.substring(poz,poz+3)+sporocilo.charAt(poz+3))==(".jpg"))){ //preverimo ce je v sporocilu .gif
			        text=text+sporocilo.substring(poz,poz+3)+sporocilo.charAt(poz+3)+'\' />';
			        poz=poz+4;
			         if(poz>=sporocilo.length){break;}
			        continue;
			      }
			 }

			  if((sporocilo.length>poz+3)){
			      if( ((sporocilo.substring(poz,poz+3)+sporocilo.charAt(poz+3))==(".png") )){ 
			        text=text+sporocilo.substring(poz,poz+3)+sporocilo.charAt(poz+3)+'\' />';
			        poz=poz+4;
			         if(poz>sporocilo.length){break;}
			        continue;
			      }

			  }


			  if((sporocilo.length>poz+3)){
			      if(( (sporocilo.substring(poz,poz+3)+ sporocilo.charAt(poz+3) )==(".gif") && (sporocilo.length)>=poz+3)){ //preverimo ce je v sporocilu .jpg
			        text=text+sporocilo.substring(poz,poz+3)+sporocilo.charAt(poz+3)+'\' />';
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
  return divElementEnostavniTekst(sporocilo);
}

function procesirajVnosUporabnika(klepetApp, socket) {       //POSLJI SPOROCILO 
  var sporocilo = $('#poslji-sporocilo').val();           // pridobi tekst, ki ga zelis poslati
  sporocilo = dodajSmeske(sporocilo);
  var sistemskoSporocilo;

  if (sporocilo.charAt(0) == '/') {
    sistemskoSporocilo = klepetApp.procesirajUkaz(sporocilo);

    if (sistemskoSporocilo) {
      console.log( sistemskoSporocilo);
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
      "http://sandbox.lavbic.net/teaching/OIS/gradivo/" +
      preslikovalnaTabela[smesko]+"' />");
  }
  return vhodnoBesedilo;
}