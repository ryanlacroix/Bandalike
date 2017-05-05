// This file crawls lastfm, creating a graph of related artists

var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var app = express();
var ROOT = './public';

var nodeStack = []
var visitedNodes = [];

var pendingRequests = 0;

var Node = function(artist) {
    return {
        artist: artist,
        children: [],
        parentIndex: 0
    };
}

// Build a graph in vis.js format
function createGraphObj(visitedNodes) {
    var nodes = [];
    var edges = [];
    for (var i = 0; i < visitedNodes.length; i++) {
        newNode = {id: visitedNodes[i].artist, label: visitedNodes[i].artist, size: 5};
        if (!alreadyContains(newNode, nodes)) {
            nodes.push(newNode);
            // Add edges from this node to all of its children
            for (var j = 0; j < visitedNodes[i].children.length; j++) {
                edges.push({from: visitedNodes[i].artist, to: visitedNodes[i].children[j].artist});
            }
        } else {
            continue;
        }
    }
    return {nodes: nodes, edges: edges};
}

// Check if node is contained in lis
function alreadyContains(node, lis) {
    for (var i = 0; i < lis.length; i++) {
        if (node.id === lis[i].id) {
            return true;
        }
    }
    return false;
}

// Check if the node has already been visited
function visited(newNode) {
    for (var i = 0; i < visitedNodes.length; i++) {
        if (newNode.artist === visitedNodes[i].artist) {
            return i;
        }
    }
    return false;
}

function getSiblingPages(linkNode, parentIndex) {
    pendingRequests++;
    request("https://www.last.fm/music/" + linkNode.artist.replace(/ /g, '+') + "/+similar", function(err, response, html) {
        if (err) {
            console.log("something went wrong")
            pendingRequests--;
            return;
        }
        var $ = cheerio.load(html);
        var counter = 0;
        $('.link-block-target').each(function(index) {
            if (counter < 10) {
                var newNode = Node($(this).text());
                console.log(newNode.artist);
                newNode.parentIndex = parentIndex;
                if (!visited(newNode)) {
                    linkNode.children.push(newNode);
                    nodeStack.push(newNode);
                }
                counter++;
            }
        });
        pendingRequests--;
    });
}

function startCrawl(artistName, totalNodes, callback) {
    nodeStack.push(Node(artistName));
    console.log("Starting first request");
    request("https://www.last.fm/music/" + artistName.replace(/ /g, '+') + "/+similar", function (err, response, html) {
        console.log("Request successful!");
        var $ = cheerio.load(html);
        var counter = 0;
        HTMLdumpToFile(html);
        $('.link-block-target').each(function(index) {
            if (counter < 8){
                nodeStack.push(Node($(this).text()));
                counter++;
            }
        });
        watchStack(totalNodes, callback);
    });
}

// Checks if anything new is on the stack
function watchStack(totalNodes, callback) {
    if (nodeStack.length > 0 && visitedNodes.length <= totalNodes) {
        currNode = nodeStack.shift();
        visitedNodes.push(currNode);
        getSiblingPages(currNode, visitedNodes.length-1);
        if (visitedNodes.length % 50 === 0){
            console.log(visitedNodes.length);
        }
    }
    if (visitedNodes.length >= totalNodes && pendingRequests == 0) {
        callback();
        return;
    } else {
        setTimeout(function() {
            watchStack(totalNodes, callback);
        }, 10);
    }
}

startCrawl("King Crimson", 300, function () {
    console.log("Finished.");
    console.log("size of nodeStack: ", nodeStack.length);
    console.log("Creating graph object for vis.js..");
    visObj = createGraphObj(visitedNodes);
    fs.writeFile("./public/visGraph.JSON", JSON.stringify(visObj), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("successfully saved JSON file");
    });
});

// Used for determining the contents of a page
// before any AJAX requests have been sent.
function HTMLdumpToFile(dat) {
    fs.writeFile("./public/dataDump.html", dat, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("successfully dumped to file");
    });
}