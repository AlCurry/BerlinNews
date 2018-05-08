/*  
     Headline Scraper exercise - GWU web development program

     Al Curry     updated May 7, 2018

     Modified / improved to collect articles from Berliner Morgenpost

     Technologies :  mongoDB / mongooese / node js express /     handlebars / some ajax & js on the front  end
     
     Code could be more streamlined, as often - but there are other things to work on & learn

*/  
function getDateStr(dateLocale) {
   // given a location, return a nice formatted date string 
    
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var todaysDate = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (todaysDate.toLocaleDateString(dateLocale, options));
}

function handleArticleDelete() {
    //  deleting articles/headlines

    var articleToDelete = $(this)
      .parents(".card")
      .data();

    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {

      if (data.ok) {
        initPage(false);
      }
    });
}

var articleContainer = $(".article-container");
  
function initPage(savedFlag) {
  //console.log("INIT PAGE " + savedFlag);
    // Empty the article container, run an AJAX request for any unsaved headlines
    articleContainer.empty();

    dateDE = getDateStr('de-DE');
/*    document.getElementById("today").innerHTML = dateDE; */
    $("#today").html(dateDE);
 // console.log("IP 2");
  $.get("/api/headlines?saved=" + savedFlag).then(function (data) {
    //console.log("IP 3");
      // If we have headlines, render them to the page
    if (data && data.length) {
      //console.log("IP render");
        renderArticles(data, savedFlag);
      }
      else {
        // Otherwise render a message explaining we have no articles
        if (savedFlag)  
            renderEmpty();
        else  
            handleArticleScrape();
      }
    });
}
  
function renderArticles(articles,savedFlag) {
    //  append HTML containing our article data to the page
    // passed an array of JSON with all articles in our database
    var articleCards = [];
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i],savedFlag));
    }
    articleContainer.append(articleCards);
}
  
function renderEmpty() {
    // renders some HTML to the page if we don't have any articles to view
    // use joined array of HTML string data 
    // not pretty but gets it done
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center gold-color'>",
        "<h4 class='text-dark'>No articles saved.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center bg-dark'>",
        "<h3>Save articles from the home page and add notes to them here</h3>",
        "</div>",
        "<div class='text-dark card-body text-center gold-color'>",
        "<h4><a href='/' class='text-dark'>Return to home and latest scraped articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );

    articleContainer.append(emptyAlert);
  }

 
function createCard(article,savedFlag) {
    // takes in a single JSON object for an article/headline
    // and a flag indicating which html to return
    // again, not pretty but gets it done
    articleDate = formatDate(article.date);
    if (savedFlag) {
        var card = $(
            [
              "<div class='card'>",
              "<div class='card-header bg-dark'>",
              "<h5>",
              "<a class='article-link title' target='_blank' href='" + article.url + "'>",
              article.headline,
              "<a class='btn btn-danger save delete float-right'><i class='fas fa-trash-alt fa-2x'></i></a>",
              "<a class='btn btn-info save notes float-right'><i class='fas fa-plus fa-2x addBtn'></i></a>", 
              "</a>",
              "</h5>",
              "</div>",
              "<div class='card-body gold-color'>",
              articleDate,article.summary,
              "</div>",
              "</div>"
            ].join("")
          );
    } else {
        var card = $(
            [
                "<div class='card'>",
                "<div class='card-header bg-dark'>",
                "<h5>",
                "<a class='article-link title' target='_blank' href='" + article.url + "'>",
                article.headline,
                "<a class='btn btn-danger save delete float-right'><span class='fas fa-trash-alt fa-2x'></span></a>",
                "<a class='btn btn-info save float-right'><span class='far fa-save fa-2x'></span></a >",
                "</h5>",
                "</div>",
                "<div class='card-body gold-color'>",
                articleDate,article.summary,
                "</div>",
                "</div>"
            ].join("")
        );
    }    
    // attach the article's id to the jQuery element
    // used to determine which article the user wants to save
    card.data("_id", article._id);
    if (savedFlag) {
        card.data("headline", article.headline);
    }
    //return the card jQuery element
    return card;
}
  
  function handleArticleScrape() {
    //  handles the "scrape new article" function
    $.get("/api/fetch").then(function(data) {
      initPage();
      bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
    });
  }

function formatDate(dateStr) {
   // return date in European / typical German format 
   // for display with summary, this is the date article was // loaded to mongoDB, likely the publication date 
    
    var date = new Date(dateStr);
    //console.log(date);
    var month = parseInt(date.getMonth()) + 1;
    return date.getDate() + "." + month + "." + date.getFullYear() + " ";
  } 