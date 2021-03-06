var entryId='';
var token;
var resumeAt=0;

var address = '';
var e = '';

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
	
  } else {
    console.log("Geolocation is not supported by this browser");
  }
}
 function displayLocation(latitude,longitude){
        var request = new XMLHttpRequest();

        var method = 'GET';
		var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true&key=AIzaSyDXea4aF63P3bIAruuIMi_V--f6X9_Wv2A';
        var async = true;

        request.open(method, url, async);
        request.onreadystatechange = function(){
          if(request.readyState == 4 && request.status == 200){
            var data = JSON.parse(request.responseText);
            address = data.results[0].formatted_address;
			jQuery('#address').val(address.formatted_address);
          }
        };
        request.send();
      };		
//callback		
function showPosition(position) {
	var latlon = position.coords.latitude + "," + position.coords.longitude;
	//jQuery('#pos_lat').val(position.coords.latitude);
	//jQuery('#pos_lon').val(position.coords.longitude);
	//var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false&key=AIzaSyDXea4aF63P3bIAruuIMi_V--f6X9_Wv2A";
	//var img_url = "https://maps.googleapis.com/maps/api/staticmap?markers="+latlon+"&zoom=14&size=400x300&sensor=false&key=AIzaSyDXea4aF63P3bIAruuIMi_V--f6X9_Wv2A";
	console.log("Position: Latitude: " + position.coords.latitude +	" , Longitude: " + position.coords.longitude);
	//document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
  
	displayLocation(position.coords.latitude, position.coords.longitude);
}


function uploadChunk(ks ,fileData, finalChunk=0)
{
  const formData = new FormData();
  formData.append('fileData', fileData);
  var url = 'https://www.kaltura.com/api_v3/service/uploadtoken/action/upload?ks=' + ks + '&uploadTokenId=' + token;
  if(resumeAt>0)
  {
    url+= '&resume=1';
  }
  url+='&finalChunk='+finalChunk;
  
  url+= '&resumeAt=' + resumeAt;

  console.log('uploadChunk function started');
  fetch(url, {
    method: 'post',
    body: formData
  }).then(function(response) {
    console.log('uploadChunk function ended', response);
    resumeAt += fileData.size;    
    return response.json()});
}

function attachEntryAndToken(ks)
{
  resumeAt=0;
  console.log('addEntry started');
  var description = e.os.name + ' ' + e.os.version + ' | ' + e.browser.name + ' ' + e.browser.version + ' | ' + navigator.userAgent + ' | ' + navigator.appVersion + ' | ' + navigator.platform + ' | ' + navigator.vendor;
  var url = 'https://www.kaltura.com/api_v3/service/baseentry/action/add?format=1&type=1&entry%3AobjectType=KalturaMediaEntry&entry%3AmediaType=1&entry%3Adescription=' + description + '&entry%3Atags=accident&entry%3Aname=car_accident_at_' + address + '&ks=' + ks;
  fetch(url, {
    method: 'post',
  }).then(function(response) {
    return response.json();
  })
  .then(function(json) {
    console.log(json);
    entryId = json['id'];
    createToken(ks, entryId);

  });
}

function addContent(ks, entryId, token)
{
  console.log('addContent started');
  var url = 'https://www.kaltura.com/api_v3/service/baseentry/action/addContent?resource%3AobjectType=KalturaUploadedFileTokenResource&resource%3Atoken=' + token + '&entryId=' + entryId + '&ks=' + ks
  fetch(url, {
    method: 'post',
  }).then(function(response) {
    return response.json();
  }).then(function(json) {
    console.log(json);
    console.log('addContent finished');
  });
}

function createToken(ks, entryId)
{
  console.log('createToken started');
  var url = 'https://www.kaltura.com/api_v3/service/uploadtoken/action/add?format=1&ks=' + ks;
  fetch(url, {
    method: 'post',
  }).then(function(response) {
    return response.json();
  })
      .then(function(json) {
        console.log(json);
        token = json['id'];
        addContent(ks, entryId, token)
        console.log("Added entry ID "+entryId +"token ID " + token);
      });
}

function getDevicesInfo() {
    console.log("getDevicesInfo1: ")
    'use strict';
    
    var module = {
        options: [],
        header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
        dataos: [
            { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
            { name: 'Windows', value: 'Win', version: 'NT' },
            { name: 'iPhone', value: 'iPhone', version: 'OS' },
            { name: 'iPad', value: 'iPad', version: 'OS' },
            { name: 'Kindle', value: 'Silk', version: 'Silk' },
            { name: 'Android', value: 'Android', version: 'Android' },
            { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
            { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
            { name: 'Macintosh', value: 'Mac', version: 'OS X' },
            { name: 'Linux', value: 'Linux', version: 'rv' },
            { name: 'Palm', value: 'Palm', version: 'PalmOS' }
        ],
        databrowser: [
            { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
            { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
            { name: 'Safari', value: 'Safari', version: 'Version' },
            { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
            { name: 'Opera', value: 'Opera', version: 'Opera' },
            { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
            { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
        ],
        init: function () {
            var agent = this.header.join(' '),
                os = this.matchItem(agent, this.dataos),
                browser = this.matchItem(agent, this.databrowser);
            
            return { os: os, browser: browser };
        },
        matchItem: function (string, data) {
            var i = 0,
                j = 0,
                html = '',
                regex,
                regexv,
                match,
                matches,
                version;
            
            for (i = 0; i < data.length; i += 1) {
                regex = new RegExp(data[i].value, 'i');
                match = regex.test(string);
                if (match) {
                    regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                    matches = string.match(regexv);
                    version = '';
                    if (matches) { if (matches[1]) { matches = matches[1]; } }
                    if (matches) {
                        matches = matches.split(/[._]+/);
                        for (j = 0; j < matches.length; j += 1) {
                            if (j === 0) {
                                version += matches[j] + '.';
                            } else {
                                version += matches[j];
                            }
                        }
                    } else {
                        version = '0';
                    }
                    return {
                        name: data[i].name,
                        version: parseFloat(version)
                    };
                }
            }
            return { name: 'unknown', version: 0 };
        }
    };
    
    e = module.init(),
        debug = '';
	/*	
    jQuery('#os_name').val(e.os.name);
	jQuery('#e_os_version').val(e.os.version);
	jQuery('#e_browser_name').val(e.browser.name);
	jQuery('#e_browser_version').val(e.browser.version);
	
	jQuery('#navigator_userAgent').val(navigator.userAgent);
	jQuery('#navigator_appVersion').val(navigator.appVersion);
	jQuery('#navigator_platform').val(navigator.platform);
	jQuery('#navigator_vendor').val(navigator.vendor);
	*/
	
};
