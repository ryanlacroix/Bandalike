var searching = false;

window.onload = function () {
    $('#name-tag').click(function () {
        window.location.href = 'https://github.com/ryanlacroix';
    });
    $('#submit-search').click(newSearch);
    $('#search-box').click(function () {
        $('#intro-info').fadeOut(300, function () {
            $(this).remove();
        });
    });
}

function drawGraph(data) {
    data = JSON.parse(data);
    /*if($.type(data) === "string") {
        // Fixes weird problem with objects sometimes not being parsed
        data = JSON.parse(data);
    }*/
    if (data.error != undefined) {
        alert("Artist wasn't found :(");
        searching = false;
        $('#loading-screen').remove();
        console.log($('#intro-back-graphic').length);
        if ($('#intro-back-graphic').length === 0) {
            $('body').append('<div id="intro"><span id="intro-back-graphic">bandalike</span></div>');
        }
        return;
    }
    $('#loading-screen').remove();
    var container = document.getElementById('graph');
    var options = {
        layout: { improvedLayout: false },
        physics: { stabilization: false },
        nodes: { shape: 'triangle' }
    };
    var graph = new vis.Network(container, data, options);
    searching = false;
}

function sendReq(query) {
    $('#graph').remove();
    $('#intro').remove();
    $('body').append('<div id="loading-screen"><h6>Loading...</h6></div>');
    loadFlasher();
    $('body').append('<div id="graph"></div>');
    $.ajax({
        method: "GET",
        url: '/search/' + query,
        success: drawGraph
    });
}

function newSearch() {
    $('#intro-info').fadeOut(300, function () {
        $(this).remove();
    });
    var query = $('#search-box').val();
    if (query.length > 0 && searching == false) {
        searching = true;
        if ($('#intro').length > 0) {
            $('#intro').fadeOut(400, function () {
                sendReq(query);
            });
        } else {
            sendReq(query);
        }
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