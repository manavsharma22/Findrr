var map;
var center;
var details;
var request;
var services;
var markers=[];
var places=[];
var type;
center = new google.maps.LatLng(28.548152,77.25204); 
    

window.onload = function() {
    var startPos;
    var geoSuccess = function(position) {
    
        center = new google.maps.LatLng(position.coords.latitude,position.coords.longitude); 
        alert("You Are At: "+center);
        initialize();
        setCookie();
    };
    navigator.geolocation.getCurrentPosition(geoSuccess);
    
};


function initialize(){
    
    
    map = new google.maps.Map(document.getElementById('map'),{
        center: center,
        zoom: 13    
    });
    request = {
        location: center,
        radius: 5000,
        types: ['cafe'],
        rankby: 'distance',
    };
    details = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request,callback);

    google.maps.event.addListener(map,'rightclick',function(event){
        map.setCenter(event.latLng);
        center = event.latLng;
    
        clearResults(markers);
        var request = {
            location: event.latLng,
            radius: 5000,
            type: ['cafe'],
            rankby: 'distance',
        }
        service.nearbySearch(request,callback);
    });
}


function callback(results, status){
    if(status == google.maps.places.PlacesServiceStatus.OK){
        for (var i = 0; i < results.length; i++){
            markers.push(createMarker(results[i]));
            places[i] = results[i].name;
            
        }
        
    }
    document.getElementById('list').innerHTML=places;
    
}


function createMarker(place){                
    var Loc =  place.geometry.location;
    var pid;
    var url;
    marker = new google.maps.Marker({
    
        position: Loc,
        map: map,
        attribution: {
            source: 'Findrr',
            webUrl: 'https://developers.google.com/maps/',
        },
    });
    google.maps.event.addListener(marker,'click',function(){
        pid = place.place_id;
        request ={
            placeId: pid,
        }
        service = new google.maps.places.PlacesService(map);
        service.getDetails(request, function(place,status){
            document.getElementById("place_name").innerHTML = place.name + "<img style='height: 35px;width=35px;float:right;' src = '" +place.icon + "' />&nbsp;&nbsp;";
            if(!place.website){
                place.website = "Website Unavailable";
                url = "#"; 
            }
            else{
                url = place.website;
            }
            if(!place.formatted_phone_number){
                place.formatted_phone_number = "Phone Number Unavailable";
            }
            document.getElementById("place_content").innerHTML = "<h4>Address : </h4>"+place.formatted_address+"<br><h4>Website :</h4> <a href='"+url+"'>"+place.website+"</a><br><h4>Phone Number: </h4>"+place.formatted_phone_number;    
        });

        document.getElementById("place_content").innerHTML = place.formatted_address ;
  //modal.modal()
        $(document).ready(function(){
    
            $("#place_details").modal({backdrop: true});
          
        });
   

    });
    return marker;

}


function clearResults(markers){
    for (var marker in markers){
        markers[marker].setMap(null);

    }
    markers = [];
}


function changetype(){
    console.log("change type to: "+type);
    clearResults(markers);
    request = {
        location: center,
        radius: 5000,
        types: [type]
    };
    details = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request,callback);


}


google.maps.event.addDomListener(window,'load',initialize);


function gettype(){
    var e = document.getElementById("items");
    if(e.selectedIndex >= 0){
        type = e.options[e.selectedIndex].value;


    }
    console.log("type: "+type);
    changetype();
}

function search(){
    console.log("Button clicked")
    lat=$("input[name=latitude]").val();
    long=$("input[name=longitude]").val();
    center = new google.maps.LatLng(lat,long); 

    map = new google.maps.Map(document.getElementById('map'),{
        center: center,
        zoom: 13    
    });
    request = {
        location: center,
        radius: 5000,
        types: [type],
        rankby: 'distance',
    };
    details = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request,callback);

    google.maps.event.addListener(map,'rightclick',function(event){
        map.setCenter(event.latLng);
        center = event.latLng;
    
        clearResults(markers);
        var request = {
            location: event.latLng,
            radius: 5000,
            type: [type],
            rankby: 'distance',
        }
        service.nearbySearch(request,callback);
    });
}


function setCookie()
{
    checkCookie();
    var cname = "loc";
    var cvalue = center;
    var exdays = 7;
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
    console.log(document.cookie);
}


function getCookie(cname)
{
    var name = cname + "=";
    console.log("getting cookie: "+name);
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
      {
      var c = ca[i].trim();
      if (c.indexOf(name)==0) return c.substring(name.length,c.length);
      }
    return "";
}


function checkCookie()
{
    var loc = getCookie("loc");
    if (loc == undefined){
    
        console.log("Cookies not set yet");
    }
    else{
        alert("You were previously at: " + loc);
    }
    
}
