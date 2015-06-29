// ==UserScript==
// @name         FleetSharp Tweaks
// @namespace    https://github.com/BinaryZeph/FleetSharp
// @version      1.1
// @description  Small adjustments to the FleetSharp UI
// @author       BinaryZeph
// @match        https://www.fleetsharp.com/ibis/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// ==/UserScript==

$(document).ready(function(){

    //ID of Objects on Screen
    var headerID = '#panel-1068';
    var toolbarID = '#panel-1069';
    var toolbarButtons = '#toolbar-1064-targetEl';

    //Add a button to the screen to switch to 'TV Mode'
    addDisplayToggle();

    $( "#toggleTV" ).click(function() {
        //Hides the logo and toolbar buttons
        hideHeader();
        //Alter the colors of the map
        styleMap();
        //Set the page to full-screen
        fullScreen(document.documentElement);
        //Just in-case, call FleetSharp's resetMap function to re-center things
        resetMap();
    });
    //TODO: Add a way to revert back to desktop mode
    //TODO: Add a function to turn on traffic overlay on load

    function hideHeader(){
        $(toolbarID).css("display", "none");
        $(headerID).css("height", "29px");
    }

    //Adds button by the search box
    //Tried putting it on the right, but the UI resets absolute pixels on page load/re-draw
    function addDisplayToggle(){
        $(toolbarButtons).append('<div class="x-toolbar-separator x-toolbar-separator-horizontal x-box-item x-toolbar-item" id="tbseparator-1066_2" style="right: auto; left: 270px; top: 5px; margin: 0px;"></div>');
        $(toolbarButtons).append('<a class="x-btn x-unselectable x-btn-toolbar x-box-item x-toolbar-item x-btn-default-toolbar-small x-btn-default-toolbar-small-icon-text-left" role="button" hidefocus="on" unselectable="on" tabindex="0" id="toggleTV" style="right: auto; left: 253px; top: 1px; margin: 0px;"><span id="button-1056-btnWrap_2" class="x-btn-wrap" unselectable="on"><span id="button-1056-btnEl_2" class="x-btn-button"><span id="button-1056-btnInnerEl_2" class="x-btn-inner x-btn-inner-center" unselectable="on">TV Mode</span></span></span></a>');
    }

    //Changes the map to a more monochrome color
    function styleMap(){
        myOptions = { styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-100},{"lightness":40}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"saturation":-10},{"lightness":30}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":10}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":-60},{"lightness":60}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"},{"saturation":-100},{"lightness":60}]}], zoom: 8, center: latlng, mapTypeId: google.maps.MapTypeId.ROADMAP, mapTypeControl: false, scaleControl: true, overviewMapControl: true, panControl: true,    panControlOptions: {        position: google.maps.ControlPosition.LEFT_CENTER    }, zoomControl: true,    zoomControlOptions: {        style: google.maps.ZoomControlStyle.SMALL,        position: google.maps.ControlPosition.LEFT_CENTER    }, streetViewControl: true,    streetViewControlOptions: {        position: google.maps.ControlPosition.LEFT_CENTER    } };

        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);

        Ext.EventManager.onWindowResize(function() {
            Ext.defer(function() {
                google.maps.event.trigger(map, 'resize');
            }, 100);
        });

        google.maps.event.addListener(streetViewInfoWindow, 'closeclick', function() {
            unbindStreetViewPano();
        });

        getUserLocations(setupMap, true);
        resumeRecurringUpdate();

        if (dispatch) {
            setupDispatch();
        }   
    }

    //Function to handle going full screen for various browsers
    function fullScreen(element) {
        if(element.requestFullscreen) {
            element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }

    }

});