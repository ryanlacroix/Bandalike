var searching = false;

window.onload = function () {
    $('#submit-search').click(newSearch);
    $('#search-box').click(function () {
        $('#intro-info').fadeOut(300, function () {
            $(this).remove();
        });
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
    searching = false;
}

function newSearch() {
    $('#intro-info').fadeOut(300, function () {
        $(this).remove();
    });
    var query = $('#search-box').val();
    console.log(query);
    if (query.length > 0 && searching == false) {
        searching = true;
        $('#intro').fadeOut(400, function () {
            $('#graph').remove();
            $('body').append('<div id="loading-screen"><h6>Loading...</h6></div>');
            loadFlasher();
            $('body').append('<div id="graph"></div>');
            $.ajax({
                method: "GET",
                url: '/search/' + query,
                success: drawGraph
            });
        });
    } else {
        console.log("got into newSearch")
        if ($('#invalid-req').length === 0) {
            if (searching == true) {
                $('body').append('<span id="invalid-req" class="error-msg">Search already in progress</span>');
            } else {
                $('body').append('<span id="invalid-req" class="error-msg">Enter a band name</span>');
                console.log("stuff");
            }
            $('#invalid-req').fadeOut(5000, function () {
                $(this).remove();
            });
        }
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