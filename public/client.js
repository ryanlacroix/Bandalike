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
            shape: 'triangle'
            //shapeProperties: {
            //    size: 2
            //}
        }
      };
    var graph = new vis.Network(container, data, options);
}