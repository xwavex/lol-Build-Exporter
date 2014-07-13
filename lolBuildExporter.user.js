// ==UserScript==
// @name        lolBuildExporter
// @namespace   http://www.sciwave.blogspot.de/
// @description League of Legends Item exporter by Dennis Leroy Wigand
// @include     http://www.mobafire.com/league-of-legends/build/*
// @version     1
// @grant   none
// ==/UserScript==
function Item(name, id, amount){
	 this.name = name;
	 this.id = id;
	 this.amount = amount;
}
Item.prototype.name = '';
Item.prototype.id = "-1";
Item.prototype.amount = "1";

function ItemBlock(name) {
	this.name = name;
	this.items = new Array();
}
ItemBlock.prototype.name = '';
ItemBlock.prototype.getItem = function(index) {
	return this.items[index];
}
ItemBlock.prototype.addItem = function(name, id, amount) {
	var tmp = new Item(name, id, amount);
	this.items.push(tmp);
}
ItemBlock.prototype.setItemId = function(elementId, id) {
	var tmpItem = this.items[elementId];
	tmpItem.id = id;
	this.items[elementId] = tmpItem;
}
ItemBlock.prototype.getSize = function() {
	return this.items.length;
}

listItemBlocks = null;
champion = null;

function processData(itemSite) {
	if (itemSite != null) {
		var allNamesplit = itemSite.split("\":{\"name\":\"");
		// find name and before ":{"name":" till " suchen > id
			for (var u = 0; u < allNamesplit.length; u++) {
					//check items:
					for (var v1 = 0; v1 < listItemBlocks.length; v1++) {
						var block = listItemBlocks[v1];
						for (var v2 = 0; v2 < block.items.length; v2++) {
							if (allNamesplit[u].indexOf(block.getItem(v2).name) != -1) {
								// find id:
								if (u > 0) {
									var lIndex = allNamesplit[u-1].lastIndexOf("\"");
									var iId = allNamesplit[u-1].substring(lIndex+1,allNamesplit[u-1].length).trim();
									block.setItemId(v2,iId);
								}
							}
						}
					}
			}


		} else {
			alert("Error: Site not found!");
		}

		// - convert to json -
		//get title:
		var title = null;
		var titleH2 = document.getElementsByTagName('h2');
		for (var j = 0; j < titleH2.length; j++) {
			if (titleH2[j].className == "guide-main-title") {
				title = titleH2[j].innerHTML.trim();
			}
		}
		console.log("Title: " + title);

		console.log("Champion: " + champion);

		var jsonString = "{\"champion\":\"" + champion + "\",\"title\":\"" + title
							+ "\",\"priority\":true,\"map\":\"1\",\"blocks\":[";
		var tmpString = "";
		for (var k = 0; k < listItemBlocks.length; k++) {
			var block = listItemBlocks[k];
			console.log(block.name);

			tmpString = tmpString + "{\"items\":[";

			for (var j = 0; j < block.items.length; j++) {
					console.log(block.getItem(j).name + ", " + block.getItem(j).id + ", " + block.getItem(j).amount);
					tmpString = tmpString + "{\"id\":\"" + block.getItem(j).id + "\",\"count\":" + block.getItem(j).amount + "}";
					if (j < (block.items.length-1)) {
				tmpString = tmpString + ",";
					}
			}
			tmpString = tmpString + "],\"type\":\"" + block.name.trim() + "\"}";
			if (k < (listItemBlocks.length-1)) {
				tmpString = tmpString + ",";
			}
		}
		jsonString = jsonString + tmpString + "]"
				+ ",\"_notes\":\"\",\"type\":\"default\",\"mode\":\"CLASSIC\",\"_author\":\"\"}";

		console.log("------------------------------------");
		console.log("------------------------------------");
		console.log(jsonString);


		saveTextAsFile(jsonString, 'DLW'+champion+'Item_1_CLASSIC-0.json');
}


function saveTextAsFile(textToWrite, fileNameToSaveAs) {
		var textFileAsBlob = new Blob([textToWrite], {type:'text/json'});

		var downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";
		if (window.webkitURL != null)
		{
				// Chrome allows the link to be clicked
				// without actually adding it to the DOM.
				downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
		}
		else
		{
				// Firefox requires the link to be added to the DOM
				// before it can be clicked.
				downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
				downloadLink.onclick = destroyClickedElement;
				downloadLink.style.display = "none";
				document.body.appendChild(downloadLink);
		}

		downloadLink.click();
}

function destroyClickedElement(event) {
		document.body.removeChild(event.target);
}


	function doAjax(url){
		if(url.match('^http')){
			$.getJSON("http://query.yahooapis.com/v1/public/yql?"+
								"q=select%20*%20from%20html%20where%20url%3D%22"+
								encodeURIComponent(url)+
								"%22&format=xml'&callback=?",
				function(data){
			console.log("data length: " + data.results.length);
					if(data.results[0]){
						var data = filterData(data.results[0]);
				processData(data);
					} else {
						var errormsg = '<p>Error: could not load the page.</p>';
				alert(errormsg);
					}
				}
			);
		} else {
			//$('#target').load(url);
		}
	}
	function filterData(data){
		data = data.replace(/<?\/body[^>]*>/g,'');
		data = data.replace(/[\r|\n]+/g,'');
		data = data.replace(/<--[\S\s]*?-->/g,'');
		data = data.replace(/<noscript[^>]*>[\S\s]*?<\/noscript>/g,'');
		data = data.replace(/<script[^>]*>[\S\s]*?<\/script>/g,'');
		data = data.replace(/<script.*\/>/,'');
		return data;
	}



// Main
$(document).ready(function(){
	// get all build-boxes
	var allDivs = document.getElementsByTagName('div');
	var allBuildBoxes = new Array();
	for (var i = 0; i < allDivs.length; i++) {
		// contains "build-box"
		if (allDivs[i].className.indexOf("build-box") != -1) {
			allBuildBoxes.push(allDivs[i]);
		}
		//get champ
		if ((champion == null) && (allDivs[i].className == "champ")) {
			var allChampImg = allDivs[i].getElementsByTagName('img');
			champion = allChampImg[0].title.trim();
			console.log("champion name = " + champion);
		}
	}
	if (allBuildBoxes.length > 0) { // only do further stuff, when button can be added properly!
		// and if there is at least one build-box.

		// generate button
		var btn = document.createElement("input");
		btn.type = "button";
		btn.value = "Export Item Build";
		btn.onclick = function() {

			// get the index for the currently active/selected build.
			var activeIndex = 0;
				for (var i = 0; i < allBuildBoxes.length; i++) {
					var style = allBuildBoxes[i].style;
					if (allBuildBoxes[i].style.display != "none") { // active one found!
						activeIndex = i;
						break;
					}
				}
				console.log("lolBuildExporter    by Dennis Leroy Wigand");
				console.log("github: https://github.com/xwavex/lol-Build-Exporter")
				console.log("-----------------------------------");
				console.log("active build index = " + activeIndex);

				// aktive build box durchgehen
				var allItems = new Array();

				divsInBuild = allBuildBoxes[activeIndex].getElementsByTagName('div');
				for (var j = 0; j < divsInBuild.length; j++) {
					if (divsInBuild[j].className.indexOf("item-wrap") != -1) {
						allItems.push(divsInBuild[j]);
					}
				}

				listItemBlocks = new Array();
					// get items:
					for (var j = 0; j < allItems.length; j++) {
						var blockName = allItems[j].getElementsByTagName('h2')[0].innerHTML;
						// remove unnecessary notes
						var n=blockName.indexOf("<");
						if (n > -1) {
							blockName = blockName.substring(0,n).trim();
						}
						//console.log("blockName name = " + blockName);

						var tmpBlock = new ItemBlock(blockName);
						// get innerItems
						var innerItems = allItems[j].getElementsByTagName('div');
						for (var k = 0; k < innerItems.length; k++) {
							if (innerItems[k].className.indexOf("main-items") != -1) {
								// all spans for title
								var innerItemSpans = innerItems[k].getElementsByTagName('span');
								var itemAmount = "1";
								for (var l = 0; l < innerItemSpans.length; l++) {
									if (innerItemSpans[l].className == "item-count") {
										var inner = innerItemSpans[l].innerHTML.trim();
										itemAmount = inner.substring(1,inner.length).trim();
									}

									if (innerItemSpans[l].className.indexOf("ajax-tooltip {t:'Item',i:") != -1) {
										//console.log("innerItemSpans[l].innerHTML = " + innerItemSpans[l].innerHTML);
										//console.log("itemAmount = " + itemAmount);
										tmpBlock.addItem(innerItemSpans[l].innerHTML,-1,itemAmount);
									}
								}
							}
						}
						listItemBlocks.push(tmpBlock);
					}

				doAjax("http://ddragon.leagueoflegends.com/cdn/4.2.6/data/en_GB/item.json");

		}; //function end
		// add button
		for (var k = 0; k < allDivs.length; k++) {
			if (allDivs[k].className.indexOf("author-info") != -1) {
				allDivs[k].appendChild(btn);
				break;
			}
		}
	}
});
