// game.js for Perlenspiel 3.2.x

/*
Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-17 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.
*/

// The "use strict" directive in the following line is important. Don't remove it!
"use strict";

// The following comment lines are for JSLint/JSHint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

var G;

( function() {
	"use strict";

	// Various Constants in UPPER-CASE

	var PLANE_BACKGROUND = 0;
	var PLANE_ENTITY = 1;

	var COLOR_BG = 0x000810;
	var COLOR_SKY = 0xDEDBA7;
	var COLOR_HEALTH = 0xD13F31;
	var COLOR_OCEAN_SHALLOW = 0x72B095;
	var COLOR_OCEAN_MID = 0x1F7872;
	var COLOR_OCEAN_DEEP = 0x134C47;
	var COLOR_BOAT = 0x965327;
	var COLOR_LINE = 0x515151;
	var COLOR_FISH = 0xE234A5;
	var COLOR_SHARK = 0x3536A0;
	var COLOR_SEAWEED = 0x31823D;

	var SOUND_BGM = "music_bg";
	var SOUND_END = "music_end";
	var SOUND_LINE = "sfx_splash";
	var SOUND_FISH = "sfx_coin";
	var SOUND_SHARK = "sfx_bite";
	var SOUND_SEAWEED = "sfx_seaweed";
	var SOUND_HEALTH_UP = "sfx_powerup";
	var background_ongoing;

	var MAP_SKY = 0;
	var MAP_SEA = 1;
	var MAP_FISH = 2;
	var MAP_SHARK = 3;
	var MAP_SEAWEED = 4;

	var fish_count = 4;
	var fish_caught = 0;
	var shark_count = 1;
	var shark_caught = 0;
	var weed_count = 3;
	var weed_caught = 0;
	var miss_count = 0;
	var score = 0;
	var health_count = 3;
	var is_Fishing = false;
	var is_Dead = false;

	var sec_count = 0;
	var id_timer;
	var id_fish_timer;

	var map = {
		width : 25 , height : 25 , pixelSize : 1,
		data : [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
		]
	};

	// Variable Control for Boat
	var leftRear = 8;
	var rightRear = 16;
	var boatX = [ 8,  9,  9, 10, 10, 11, 11, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 15, 15, 16];
	var boatY = [ 6,  6,  7,  6,  7,  6,  7,  1,  2,  3,  4,  5,  6,  7,  2,  3,  6,  7,  3,  6,  7,  6,  7,  6];

	// Variable Control for Fishing Line
	var dir;
	var linePos;
	var lineX = [];
	var lineY = [];

	// Variable Control for Fish, Shark and Seaweed Location
    var fx = [];
    var fy = [];
    var fdir = [];
    var sx = [];
    var sy = [];
    var sdir = [];
    var wx = [];
    var wy = [];

	// Timer function, called every 1/10th sec
	// For fishing line movement
	var tick = function () {
		var nx, ny, i, ptr, val;

		// Direction not valid (null?)
		if ( !dir ){
			return;
		}

		// Get next position of line according to casting direction
		// DOWN
        if ( dir == 1 ){
            nx = lineX[linePos];
            ny = lineY[linePos] + 1;
        }
        // D.LEFT
        if ( dir == 2 ){
            nx = lineX[linePos] - 1;
            ny = lineY[linePos] + 1;
        }
        // D.RIGHT
        if ( dir == 3 ){
            nx = lineX[linePos] + 1;
            ny = lineY[linePos] + 1;
        }

        // Add new position of line
		linePos ++;
        lineX.push(nx);
        lineY.push(ny);

        // Draw line
		for ( i = 0; i < lineX.length; i++ ) {
			PS.color( lineX[i], lineY[i], COLOR_LINE );
		}

		// If line is at border, stop casting line
		if ((nx == 0) || (nx == 24) || (ny == 24)) {
			for ( i = 0; i < lineX.length; i++ ) {
                if (lineY[i] < 13) PS.color( lineX[i], lineY[i], COLOR_OCEAN_SHALLOW )
                else if (lineY[i] < 19) PS.color( lineX[i], lineY[i], COLOR_OCEAN_MID )
                else PS.color( lineX[i], lineY[i], COLOR_OCEAN_DEEP )
			}
			miss_count = miss_count + 1;
			lineX = [];
			lineY = [];
			linePos = 0;
			dir = null;
			is_Fishing = false;
		}

		// If line has reached something, catch it
		ptr = ( ny * map.height ) + nx;
		val = map.data[ptr];

		// Catch a fish
		if ( val == MAP_FISH ){
            map.data[ ptr ] = MAP_SEA;
            PS.color( nx, ny, COLOR_LINE );
            PS.scale( nx, ny, 100);
            PS.radius( nx, ny, 0);
            fish_caught = fish_caught + 1;
            score = score + 1;

            // Play Sound Effect
            PS.audioPlay(SOUND_FISH, {fileTypes: ["wav"], path: "./audio/", volume: 1.0});

            // Find fish in the database array, and remove it
            for ( i = 0; i < fx.length; i++ ) {
                if ((fx[i] == nx) && (fy[i] == ny)) {
                    fx.splice(i, 1);
                    fy.splice(i, 1);
                    fdir.splice(i, 1);
                }
            }

            // Immediately spawn new fish
            spawnFish(1);
            fish_count = fish_count + 1;

            // When reaching certain amount of fish number, spawn new obstacle
            if ((fish_caught % 4) == 0) {
                spawnShark(1);
                shark_count++;
            }

            if ((fish_caught % 3) == 0) {
                spawnWeed(1);
                weed_count++;
            }

            // Bonus health for every 10 fish caught
            if ((fish_caught % 10) == 0) {
                // Play Sound Effect
                PS.audioPlay(SOUND_HEALTH_UP, {fileTypes: ["wav"], path: "./audio/", volume: 0.5});
                health_count++;
                if (health_count > 3) health_count = 3;
            }

            refreshScoreHealth();

            // Stop casting line after caught
            for ( i = 0; i < lineX.length; i++ ) {
                if (lineY[i] < 13) PS.color( lineX[i], lineY[i], COLOR_OCEAN_SHALLOW );
                else if (lineY[i] < 19) PS.color( lineX[i], lineY[i], COLOR_OCEAN_MID );
                else PS.color( lineX[i], lineY[i], COLOR_OCEAN_DEEP )
            }
            lineX = [];
            lineY = [];
            linePos = 0;
            dir = null;
            is_Fishing = false;
		}

        // Catch seaweed
        if ( val == MAP_SEAWEED ){
            map.data[ ptr ] = MAP_SEA;
            PS.color( nx, ny, COLOR_LINE );
            PS.scale( nx, ny, 100);
            PS.radius( nx, ny, 0);
            weed_caught = weed_caught + 1;
            miss_count = miss_count + 1;

            // Play Sound Effect
            PS.audioPlay(SOUND_SEAWEED, {fileTypes: ["wav"], path: "./audio/", volume: 0.5});

            // Find seaweed in the database array, and remove it
            for ( i = 0; i < wx.length; i++ ) {
                if ((wx[i] == nx) && (wy[i] == ny)) {
                    wx.splice(i, 1);
                    wy.splice(i, 1);
                }
            }

            // Immediately spawn new fish
            spawnWeed(1);

            // Deduct score
            if ((weed_caught % 3) == 2) {
                score = score - 1;
                if (score < 0) score = 0;
            }
            refreshScoreHealth();

            // Stop casting line after caught
            for ( i = 0; i < lineX.length; i++ ) {
                if (lineY[i] < 13) PS.color( lineX[i], lineY[i], COLOR_OCEAN_SHALLOW );
                else if (lineY[i] < 19) PS.color( lineX[i], lineY[i], COLOR_OCEAN_MID );
                else PS.color( lineX[i], lineY[i], COLOR_OCEAN_DEEP )
            }
            lineX = [];
            lineY = [];
            linePos = 0;
            dir = null;
            is_Fishing = false;
        }

        // Catch a shark
        if ( val == MAP_SHARK ){
            map.data[ ptr ] = MAP_SEA;
            PS.color( nx, ny, COLOR_LINE );
            PS.scale( nx, ny, 100);
            PS.radius( nx, ny, 0);
            shark_caught = shark_caught + 1;
            health_count = health_count - 1;
            miss_count = miss_count + 1;

            // Play Sound Effect
            PS.audioPlay(SOUND_SHARK, {fileTypes: ["wav"], path: "./audio/", volume: 0.5});

            // Find shark in the database array, and remove it
            for ( i = 0; i < sx.length; i++ ) {
                if ((sx[i] == nx) && (sy[i] == ny)) {
                    sx.splice(i, 1);
                    sy.splice(i, 1);
                    sdir.splice(i, 1);
                }
            }

            // Immediately spawn new shark
            spawnShark(1);

            refreshScoreHealth();

            // Stop casting line after caught
            for ( i = 0; i < lineX.length; i++ ) {
                if (lineY[i] < 13) PS.color( lineX[i], lineY[i], COLOR_OCEAN_SHALLOW );
                else if (lineY[i] < 19) PS.color( lineX[i], lineY[i], COLOR_OCEAN_MID );
                else PS.color( lineX[i], lineY[i], COLOR_OCEAN_DEEP )
            }
            lineX = [];
            lineY = [];
            linePos = 0;
            dir = null;
            is_Fishing = false;

            // Check Health Status
			if (health_count == 0) {
			    is_Dead = true;
                PS.timerStop( id_timer );
                PS.timerStop( id_fish_timer );
                PS.statusText( "You are exhausted. Try again!" );
                PS.statusColor ( COLOR_SKY );
                PS.audioStop(background_ongoing);
                PS.audioPlay(SOUND_END, {fileTypes: ["mp3"], path: "./audio/", loop: false, volume: 0.3});
                //PS.dbEvent("activity", "fishcount", fish_count, "weedcount", weed_count, "sharkcount", shark_count, "misses", miss_count, "health", health_count);
                //PS.dbSend( "activity", "hphong", { discard : true } );
			}
        }

    };

	// Timer function, check every minute
    // For fish/shark/seaweed movement
    var fish_tick = function () {
        var ptr, nxt, i, j;

        if (is_Dead) {
            return;
        }

        // Movement for Fish
        for ( i = 0; i < fx.length; i++ ) {
            // LEFT DIRECTION
            if (fdir[i] == 0) {
                nxt = fx[i] + 1;
                if (nxt == 25) nxt = 0;
            }
            // RIGHT DIRECTION
            if (fdir[i] == 1) {
                nxt = fx[i] - 1;
                if (nxt == -1) nxt = 24;
            }
            if (map.data[(fy[i] * map.height + nxt)] == MAP_SEA) {
                ptr = fy[i] * map.height + nxt;
                map.data[(fy[i] * map.height + fx[i])] = MAP_SEA;
                if (fy[i] < 13) PS.color( fx[i], fy[i], COLOR_OCEAN_SHALLOW );
                else if (fy[i] < 19) PS.color( fx[i], fy[i], COLOR_OCEAN_MID );
                else PS.color( fx[i], fy[i], COLOR_OCEAN_DEEP );
                PS.scale( fx[i], fy[i], 100);
                PS.radius( fx[i], fy[i], 0);
                map.data[ptr] = MAP_FISH;
                fx[i] = nxt;
            } else if (fdir[i] == 0) fdir[i] = 1;
            else fdir[i] = 0;
        }

        // Movement for Shark
        for ( i = 0; i < sx.length; i++ ) {
            // LEFT DIRECTION
            if (sdir[i] == 1) {
                nxt = sx[i] + 1;
                if (nxt == 25) nxt = 0;
            }
            // RIGHT DIRECTION
            if (sdir[i] == 0) {
                nxt = sx[i] - 1;
                if (nxt == -1) nxt = 24;
            }
            if (map.data[(sy[i] * map.height + nxt)] == MAP_SEA) {
                ptr = sy[i] * map.height + nxt;
                map.data[(sy[i] * map.height + sx[i])] = MAP_SEA;
                if (sy[i] < 13) PS.color( sx[i], sy[i], COLOR_OCEAN_SHALLOW );
                else if (sy[i] < 19) PS.color( sx[i], sy[i], COLOR_OCEAN_MID );
                else PS.color( sx[i], sy[i], COLOR_OCEAN_DEEP );
                PS.scale( sx[i], sy[i], 100);
                PS.radius( sx[i], sy[i], 0);
                map.data[ptr] = MAP_SHARK;
                sx[i] = nxt;
            } else if (sdir[i] == 0) sdir[i] = 1;
            else sdir[i] = 0;
        }

        refreshOceanLife();
    };

	// Refresh background (Sky)
	var refreshSky = function() {
		var x, y, val;
        // Draw map
        for ( x = 0; x < map.width; x++ ){
            for ( y = 0; y < map.height; y++ ){
                val = map.data[( y * map.height ) + x ];
                if ( val == MAP_SKY ) {
                    PS.color( x, y, COLOR_SKY );
                }
            }
        }
	};

	// Refresh background (Sea)
    var refreshSea = function() {
        var x, y, val;
        // Draw map
        for ( x = 0; x < map.width; x++ ){
            for ( y = 0; y < map.height; y++ ){
                val = map.data[( y * map.height ) + x ];
                if ( val == MAP_SEA ) {
                    if (y < 13) PS.color( x, y, COLOR_OCEAN_SHALLOW );
                    else if (y < 19) PS.color( x, y, COLOR_OCEAN_MID );
                    else PS.color( x, y, COLOR_OCEAN_DEEP );
                }
            }
        }
    };

    // Refresh oceanic life
    var refreshOceanLife = function() {
        var x, y, val;
        // Draw life
        for ( x = 0; x < map.width; x++ ){
            for ( y = 0; y < map.height; y++ ){
                val = map.data[( y * map.height ) + x ];
                if ( val == MAP_FISH ) {
                    PS.color( x, y, COLOR_FISH );
					PS.scale( x, y, 75 );
                    PS.radius( x, y, 50 );
                    PS.bgAlpha( x, y, PS.ALPHA_OPAQUE );
                    if (y < 13) PS.bgColor( x, y, COLOR_OCEAN_SHALLOW );
                    else if (y < 19) PS.bgColor( x, y, COLOR_OCEAN_MID );
                    else PS.bgColor( x, y, COLOR_OCEAN_DEEP );
                } else if ( val == MAP_SEAWEED ) {
                	PS.color( x , y , COLOR_SEAWEED );
                    PS.scale( x, y, 75 );
                    PS.radius( x, y, 0 );
                    PS.bgAlpha( x, y, PS.ALPHA_OPAQUE );
                    if (y < 13) PS.bgColor( x, y, COLOR_OCEAN_SHALLOW );
                    else if (y < 19) PS.bgColor( x, y, COLOR_OCEAN_MID );
                    else PS.bgColor( x, y, COLOR_OCEAN_DEEP );
				} else if ( val == MAP_SHARK ) {
                	PS.color( x, y, COLOR_SHARK );
                    PS.scale( x, y, 100 );
                    PS.radius( x, y, 25 );
                    PS.bgAlpha( x, y, PS.ALPHA_OPAQUE );
                    if (y < 13) PS.bgColor( x, y, COLOR_OCEAN_SHALLOW );
                    else if (y < 19) PS.bgColor( x, y, COLOR_OCEAN_MID );
                    else PS.bgColor( x, y, COLOR_OCEAN_DEEP );
				}
            }
        }
    };

    // Spawn random oceanic life
    // FISH
    var spawnFish = function(numOfFish) {
        var x, y, val, ptr, i;

        // Add random fish to the sea, with the assigned number of fish
        i = 0;
        while (i < numOfFish) {
            x = PS.random(23);
            y = 8 + PS.random(15);
            ptr = ( y * map.height ) + x;
            val = map.data[ptr];
            if (val == MAP_SEA) {
                map.data[ptr] = MAP_FISH;
                i++;
                fx.push(x);
                fy.push(y);
                fdir.push(0);
            }
        }
    };

    // SHARK
    var spawnShark = function(numOfShark) {
        var x, y, val, ptr, i;

        // Add random shark to the sea, with the assigned number of fish
        i = 0;
        while ( i < numOfShark ) {
            x = PS.random(23);
            y = 8 + PS.random(15);
            ptr = ( y * map.height ) + x;
            val = map.data[ptr];
            if (val == MAP_SEA) {
                map.data[ptr] = MAP_SHARK;
                i++;
                sx.push(x);
                sy.push(y);
                sdir.push(0);
            }
        }
    };

    // SEAWEED
    var spawnWeed = function(numOfWeed) {
        var x, y, val, ptr, i;

        // Add random seaweed to the sea, with the assigned number of fish
        i = 0;
        while ( i < numOfWeed ) {
            x = PS.random(23);
            y = 8 + PS.random(15);
            ptr = ( y * map.height ) + x;
            val = map.data[ptr];
            if (val == MAP_SEA) {
                map.data[ptr] = MAP_SEAWEED;
                i++;
                wx.push(x);
                wy.push(y);
            }
        }
    };

    // Refresh score and health
	var refreshScoreHealth = function() {
		// Score
		PS.color(0, 1, COLOR_FISH);
		PS.scale(0, 1, 75);
        PS.radius(0, 1, 50);
        PS.bgAlpha(0, 1, PS.ALPHA_OPAQUE);
        PS.bgColor(0, 1, COLOR_SKY);
		PS.glyph(1, 1, "X");
		if (score < 10) {
            PS.glyph(2, 1, score.toString());
        } else if (score < 99) {
		    PS.glyph(2, 1, (score / 10).toString());
		    PS.glyph(3, 1, (score % 10).toString());
        }

		// Health
        PS.color(22, 1, COLOR_SKY);
        PS.color(23, 1, COLOR_SKY);
        PS.color(24, 1, COLOR_SKY);
		if (health_count != 0) {
            for (var i = 0; i < health_count; i++) {
            	PS.color(24 - i, 1, COLOR_HEALTH);
            	PS.scale(24 - i, 1, 50);
            	PS.radius(24 - i, 1, 50);
                PS.bgAlpha(24 - i, 1, PS.ALPHA_OPAQUE );
                PS.bgColor(24 - i, 1, COLOR_SKY);
			}
        }
	};

    // Public functions are exposed in the global G object, which is initialized here.
	G = {
		// Initialize the game
		// Called at startup

		init : function () {
			var i;

			// Initialize dimension
			PS.gridSize( map.width, map.height );
			PS.gridColor( COLOR_BG );
			PS.border( PS.ALL, PS.ALL, 0);

			// Initialize background
			refreshSky();
			refreshSea();
			spawnFish(fish_count);
			spawnShark(shark_count);
			spawnWeed(weed_count);
			refreshOceanLife();
			refreshScoreHealth();

			// Finally, draw the boat
            for ( i = 0; i < boatX.length; i++) {
				PS.color( boatX[i], boatY[i], COLOR_BOAT );
            }

            // Start with idle status
			is_Fishing = false;
            linePos = 0;
            dir = null;
            id_timer = PS.timerStart( 6, tick );

            // Fish movement is active
            id_fish_timer = PS.timerStart( 30, fish_tick );

            // Background music
            PS.audioLoad(SOUND_END, {fileTypes: ["mp3"], path: "./audio/"});
            PS.audioLoad(SOUND_FISH, {fileTypes: ["wav"], path: "./audio/"});
            PS.audioLoad(SOUND_SHARK, {fileTypes: ["wav"], path: "./audio/"});
            PS.audioLoad(SOUND_LINE, {fileTypes: ["wav"], path: "./audio/"});
            PS.audioLoad(SOUND_SEAWEED, {fileTypes: ["wav"], path: "./audio/"});
            PS.audioLoad(SOUND_HEALTH_UP, {fileTypes: ["wav"], path: "./audio/"});
            background_ongoing = PS.audioPlay(SOUND_BGM, {fileTypes: ["mp3"], path: "./audio/", loop: true, volume: 0.3});
        },

        move : function ( x, y ) {
			var i, j, val;

			// If player is currently fishing, do nothing
			if ( is_Fishing ) {
				return;
			}

            // If player is dead, do nothing
            if ( is_Dead ) {
                return;
            }

            //PS.dbEvent("clickCount", "x", x, "y", y, true );

			// If click is above sea level, move the boat
			if ( y < 8 ) {
				// Check for direction of the movement of boat: LEFT
                if ( x < ( leftRear + rightRear ) / 2 ) {
                    // Check to prevent going out of the dimension
                    if (leftRear - 1 >= 0) {
                        // Valid, proceed to update draw boat
                        refreshSky();
                        refreshScoreHealth();

                        // Update boat location properties and redraw
                        leftRear = leftRear - 1;
                        rightRear = rightRear - 1;
                        for ( i = 0; i < boatX.length; i++) {
                            boatX[i] = boatX[i] - 1;
                            PS.color( boatX[i], boatY[i], COLOR_BOAT );
                        }
                    }
                }
                if ( x > ( leftRear + rightRear ) / 2 ) {
                    // Check to prevent going out of the dimension
                    if (rightRear + 1 <= 24) {
                        // Valid, proceed to update draw boat
                        refreshSky();
                        refreshScoreHealth();

                        // Update boat location properties and redraw
                        leftRear = leftRear + 1;
                        rightRear = rightRear + 1;
                        for ( i = 0; i < boatX.length; i++) {
                            boatX[i] = boatX[i] + 1;
                            PS.color( boatX[i], boatY[i], COLOR_BOAT );
                        }
                    }
                }
			}

			// If click is below the sea level, hold the boat, and cast fishing animation
			if ( y >= 8 ) {
				// Determine direction of casting
				dir = 1; // 1 for DOWN, 2 for DIAG.LEFT, 3 for DIAG.RIGHT
				var castPoint = ( leftRear + rightRear ) / 2;
				if ( x < castPoint - 3) dir = 2;
				else if (x > castPoint + 3) dir = 3;

				// Update line properties
				lineX.push(castPoint);
				lineY.push(8);
				linePos = 0;

				// Change status of fishing process
				is_Fishing = true;

                // Play Sound Effect
                PS.audioPlay(SOUND_LINE, {fileTypes: ["wav"], path: "./audio/", volume: 0.5});
			}
        }
	};
} ());

PS.init = function( system, options ) {
    "use strict";
    //PS.dbInit("activity");
    G.init();
};

PS.touch = function( x, y, data, options ) {
    "use strict";
    G.move(x, y);
};

// All event functions must be present to prevent startup errors,
// even if they don't do anything

PS.release = function( x, y, data, options ) {
    "use strict";
};

PS.enter = function( x, y, data, options ) {
    "use strict";
};

PS.exit = function( x, y, data, options ) {
    "use strict";
};

PS.exitGrid = function( options ) {
    "use strict";
};

PS.keyDown = function( key, shift, ctrl, options ) {
    "use strict";
};

PS.keyUp = function( key, shift, ctrl, options ) {
    "use strict";
};

PS.swipe = function( data, options ) {
    "use strict";
};

PS.input = function( sensors, options ) {
    "use strict";
};

PS.shutdown = function ( options ) {
    //PS.dbEvent( "activity", "shutdown", true);
    //PS.dbSend( "activity", "hphong" );
};