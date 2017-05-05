window.onload = function() {
    $.ajax({
        method : "GET",
        url: '/visGraph.JSON',
        success: drawGraph
    })
}

function drawGraph(data) {
    var container = document.getElementById('graph');
    var options = {
        physics: { 
            stabilization: false
        },
        nodes: {
            shape: 'dot'
        }
      };
    var graph = new vis.Network(container, data, options);
}