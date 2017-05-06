window.onload = function() {
    loadFlasher();
    $.ajax({
        method : "GET",
        url: '/search/Rush',
        success: drawGraph
    });
}

function drawGraph(data) {
    $('#loading-screen').remove();
    var container = document.getElementById('graph');
    var options = {
        layout: {improvedLayout:false},
        physics: {stabilization: false},
        nodes: {shape: 'triangle'}
      };
      console.log(data);
    var graph = new vis.Network(container, JSON.parse(data), options);
}

function loadFlasher() { 
    $('#loading-screen').animate({ 
        opacity: 0.1, 
    }, 500, 'linear') 
    .animate({ 
        opacity: 1 
    }, 500, 'linear', loadFlasher);
}