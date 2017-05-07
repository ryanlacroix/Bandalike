window.onload = function () {
    loadFlasher();
    $('#submit-search').click(newSearch);
    $.ajax({
        method: "GET",
        url: '/search/Rush',
        success: drawGraph
    });
}

function drawGraph(data) {
    $('#loading-screen').remove();
    var container = document.getElementById('graph');
    var options = {
        layout: { improvedLayout: false },
        physics: { stabilization: false },
        nodes: { shape: 'triangle' }
    };
    console.log(data);
    var graph = new vis.Network(container, JSON.parse(data), options);
}

function newSearch() {
    var query = $('#search-box').val();
    console.log(query);
    $('#graph').remove();
    $('body').append('<div id="loading-screen"><h6>Loading...</h6></div>');
    loadFlasher();
    $('body').append('<div id="graph"></div>');
    if (query.length > 0) {
        $.ajax({
            method: "GET",
            url: '/search/' + query,
            success: drawGraph
        });
    }
}

function loadFlasher() {
    setInterval(function () {
        $('#loading-screen').animate({
            opacity: 0.1,
        }, 500, 'linear')
            .animate({
                opacity: 1
            }, 500, 'linear');
    }, 1000);
}

