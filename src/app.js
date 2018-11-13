$(function(){

    $.getJSON('/data.json', function(data){

        var page = window.location.pathname.substr(1) || 'home';
        loadPage(page, data);

        $('body').on('click', 'a.js-internal-link', function(e){
            e.preventDefault();

            var page = $(this).attr('href').substr(1) || 'home';
            window.history.pushState(null, null, '/'+page);
            loadPage(page, data);
        });

        window.onpopstate = function(event){
            var page = window.location.pathname.substr(1) || 'home';
            loadPage(page, data);
        };

    });

});

function loadPage(page, data) {
    $.get('/html/'+page+'.html', function(html){
        $('#content').empty();

        html = $('<div>').html(html);

        data.projects.forEach(function(project){
            if ( project.html == page ) {
                html.find('.year').text(project.year);
                project.tags.forEach(function(tag){
                    html.find('.tags').append($('<li>').addClass('tag').text(tag));
                });

                // fade in image gallery
                var images = html.find('.images img');
                var imagesLoaded = 0;
                images.each(function(){
                    $(this).css('opacity', 0);
                    $(this).on('load', function(){
                        imagesLoaded++;
                        if ( imagesLoaded == images.length ) {
                            images.each(function(i){
                                TweenMax.to($(this), 1.5, {opacity:1, delay:0.25+i*0.3, ease:'Power2.easeOut'});
                            });
                        }
                    });
                });
            }
        });

        $('#content').append(html);

        animateTitle(html);
        populateProjects(html, data);

        window.scrollTo(0,0);
    });
}

function animateTitle(container) {
    // TITLE EFFECT
    //first, split each line in the h1 into a tspan for each letter so we can animate them seperately
    container.find('h2 tspan.line').each(function(i, line){
        var letters = $(line).text().split('');
        $(line).text('');
        letters.forEach(function(letter, i){
            var letterElement = $(document.createElementNS("http://www.w3.org/2000/svg", "tspan") ).text(letter).addClass('letter');
            $(line).append(letterElement);

            TweenMax.to(letterElement, 2, {'stroke-dashoffset':0, delay:i*0.05,
                onUpdate:function(){$('h2 svg').css('width',(100-Math.random())+'%');} // an incredibly hacky way to fix the stroke animation bug in Chrome
            });
            TweenMax.to(letterElement, 1, {fill: 'rgba(50,50,50,1)', stroke: 'rgba(0,0,0,0)', delay:0.5+i*0.05});
        });
    });
}

function populateProjects(container, data) {

    container.find('.js-project-list').each(function(i, list){
        var tag = $(list).data('tag');
        var projects = _(data.projects).sortBy('year').reverse();
        var showNextAt = Date.now() + 250;
        projects.forEach(function(project){
            if ( (!tag || _(project.tags).includes(tag)) && project.image ) {
                var el = $('<a>').attr('href', '/' + project.html).addClass('js-internal-link');
                var img = $('<img>').attr('src', project.image);
                el.append(img);
                el.append($('<p>').addClass('name').text(project.name));
                el.append($('<p>').addClass('year').text(project.year));

                var tags = $('<ul>').addClass('tags');
                project.tags.forEach(function(tag){
                    tags.append($('<li>').addClass('tag').text(tag));
                });
                el.append(tags);

                el.css('opacity', 0);
                img.on('load', function(){
                    var delay = Math.max(showNextAt - Date.now(), 0);
                    console.log(delay);
                    TweenMax.to(el, 1, {opacity:1, delay:delay/1000, ease:'Power2.easeOut'});
                    showNextAt = Date.now() + delay + 100;
                });

                $(list).append(el);
            }
        });
    });

}

//
//
//function getUrlParameter(sParam) {
//    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
//        sURLVariables = sPageURL.split('&'),
//        sParameterName,
//        i;
//
//    for (i = 0; i < sURLVariables.length; i++) {
//        sParameterName = sURLVariables[i].split('=');
//
//        if (sParameterName[0] === sParam) {
//            return sParameterName[1] === undefined ? true : sParameterName[1];
//        }
//    }
//}