lol-Build-Exporter
==================

This Greasemonkey-Script lets you export a League of Legends build from [mobafire.com](http://www.mobafire.com/) and insert it right into the game. That way you can try new builds very fast, because you don't have to transfer the build *item by item* into the game.

How To Use
------------------

What you need to do:

* Get [Greasemonkey](https://addons.mozilla.org/de/firefox/addon/greasemonkey/) (or a similar extension for your browser).
* Then you have to add the `lolBuildExporter`-script to your Greasemonkey-extension.

Short example:

1. Activate the Greasemonkey-extension and go to your desired build.<br />(i.e. http://www.mobafire.com/league-of-legends/build/fiora-a-double-edged-sword-198646)

2. After the website is loaded properly, you will find a new button called "Export Item Build" below the title of the specific build.
3. Click the button and download the build. It will be saved in a text/plain-json file.
4. Find your League of Legends-installation folder and go to<br />`Config/Champions/<champion-name-of-build>/Recommended/` (i.e. `Config/Champions/Fiora/Recommended/`).<br />If the folder does not exists, just create it.
5. Finally, place the downloaded json-file into that folder.

To use the new build, just select it in-game as you would normally do. **Have fun!**

Screenshots
-----------

##### Export Button added to [mobafire.com](http://www.mobafire.com/):
![Mobafire Export Button](Res/mobafire_export_screenshot.jpg "Mobafire Export Button")

Sample (exported) build
---------------------

##### Fiora - A Double-Edged Sword:
```json
{
    "champion": "Fiora",
    "title": "Fiora - A Double-Edged Sword",
    "priority": true,
    "map": "1",
    "blocks": [{
        "items": [{
            "id": "1055",
            "count": 1
        }, {
            "id": "3340",
            "count": 1
        }, {
            "id": "2003",
            "count": 1
        }],
        "type": "Risk Start"
    }, {
        "items": [{
            "id": "1006",
            "count": 2
        }, {
            "id": "2003",
            "count": 1
        }, {
            "id": "3361",
            "count": 1
        }, {
            "id": "3341",
            "count": 1
        }],
        "type": "Safe Start"
    }
    .
    .
    .
    ],
    "_notes": "",
    "type": "default",
    "mode": "CLASSIC",
    "_author": ""
}
```

Further Information
-------------------

* Author: Dennis Leroy Wigand
* Version: 1.0.0

Licenses
--------

Didn't give a thought about that yet. So feel free to use it as you like.
