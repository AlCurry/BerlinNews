/*  
     Headline Scraper exercise - GWU web development program

     Al Curry     updated May 7, 2018

     Modified / improved to collect articles from Berliner Morgenpost

     Technologies :  mongoDB / mongooese / node js express /     handlebars / some ajax & js on the front  end
     
     Code could be more streamlined, as often - but there are other things to work on & learn

*/  

$(document).ready(function() {
  //  event listeners for clicked functions
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  // Once the page is ready, run the initPage function to kick things off
  initPage(false);
  
  function handleArticleSave() {
   // save an article - update its "saved" boolean to true

    var articleToSave = $(this)
      .parents(".card")
      .data();
    articleToSave.saved = true;
   // console.log("Ok here");

    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    }).then(function (data) {
      if (data.saved) {
        // reload the entire list of articles
        initPage(false);
      }
    });
  }
});
