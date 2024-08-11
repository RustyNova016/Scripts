// ==UserScript==
// @name         RYM to MusicBrainz Importer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Import albums from RateYourMusic to MusicBrainz
// @author       Your Name
// @match        https://rateyourmusic.com/release/album/*
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if jQuery is loaded
    if (typeof jQuery === 'undefined') {
        console.error('jQuery not loaded!');
        return;
    } else {
        console.log('jQuery loaded successfully.');
    }

    // Function to extract album data from RYM page
    function fetchRYMAlbumData() {
        let albumData = {};

        // Title
        albumData.title = $('div.album_title > h1').text().trim();
        console.log('Album title:', albumData.title);

        // Artist
        albumData.artist = $('div.album_title > h2').text().trim();
        console.log('Artist:', albumData.artist);

        // Release Date
        albumData.releaseDate = $('tr.release_date > td').text().trim();
        console.log('Release Date:', albumData.releaseDate);

        // Label
        albumData.label = $('tr.label').text().trim();
        console.log('Label:', albumData.label);

        // Format
        albumData.format = $('tr.format').text().trim();
        console.log('Format:', albumData.format);

        // Tracklist
        albumData.tracks = [];
        $('table.tracklist_table tr.track').each(function() {
            let track = {
                number: $(this).find('td.track_number').text().trim(),
                title: $(this).find('td.track_title').text().trim(),
                length: $(this).find('td.track_time').text().trim()
            };
            console.log('Track:', track);
            albumData.tracks.push(track);
        });

        return albumData;
    }

    // Function to format data for MusicBrainz
    function formatForMusicBrainz(data) {
        let mbData = {};

        // Mapping RYM data to MusicBrainz fields
        mbData.title = data.title;
        mbData.artist_credit = [{ name: data.artist }];
        mbData.date = data.releaseDate;
        mbData.label = data.label;
        mbData.format = data.format;
        mbData.tracklist = data.tracks.map(track => ({
            number: track.number,
            title: track.title,
            length: track.length
        }));

        console.log('Formatted data for MusicBrainz:', mbData);
        return mbData;
    }

    // Function to submit data to MusicBrainz
    function submitToMusicBrainz(mbData) {
        // This function will handle the API calls or form submission to MusicBrainz
        console.log('Data ready for MusicBrainz submission:', mbData);

        // You can integrate with MusicBrainz API here to automate the submission
    }

    // Function to create the import button on RYM page
    function addImportButton() {
        let button = $('<button>')
            .text('Import to MusicBrainz')
            .css({
                'position': 'fixed',
                'top': '20px',
                'right': '20px',
                'z-index': 1000,
                'background-color': '#1db954',
                'color': 'white',
                'border': 'none',
                'padding': '10px',
                'cursor': 'pointer'
            })
            .click(function() {
                console.log('Import button clicked');
                let albumData = fetchRYMAlbumData();
                let mbData = formatForMusicBrainz(albumData);
                submitToMusicBrainz(mbData);
            });

        $('body').append(button);
        console.log('Import button added to the page');
    }

    // Main execution flow
    $(document).ready(function() {
        addImportButton();
    });

})();
