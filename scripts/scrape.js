/*  
     Headline Scraper exercise - GWU web development program

     Al Curry     updated May 7, 2018

     Modified / improved to collect articles from Berliner Morgenpost

     Technologies :  mongoDB / mongooese / node js express /     handlebars / some ajax & js on the front  end
     
     Code could be more streamlined, as often - but there are other things to work on & learn

*/  
// Require axios and cheerio, making our scrapes possible
var axios = require("axios");
var cheerio = require("cheerio");

var scrape = function() {
  // Scrape Berliner Morgenpost website
  return axios.get("http://www.morgenpost.de").then(function(res) {
    var $ = cheerio.load(res.data);

    var articles = [];

   // loop through html now in "$"
   // article a, teaser__, are specific to 
   // this site's article set up, determined
   // by inspecting the html 
    $("article a").each(function(i, element) {

      var head = $(this).attr("title");
      console.log(i, head);

      var url = $(this).attr("href");
        var sum = $(this).children('.teaser__body').children('.teaser__body__text').text().trim();
        sum = sum.substring(0, sum.length - 5);
      
       // console.log(i, sum);
      // if  headline, sum & url are not empty now:
      if (head && sum && url) {

        // use regex to cleanup strings
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        // setup an object to be pushed to the articles array

        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat,
          url: url
        };

        articles.push(dataToAdd);
      }
    });
    return articles;
  });
};

// Export the function, so other files in our backend can use it
module.exports = scrape;
