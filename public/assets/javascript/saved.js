/*  
     Headline Scraper exercise - GWU web development program

     Al Curry     updated May 7, 2018

     Modified / improved to collect articles from Berliner Morgenpost

     Technologies :  mongoDB / mongooese / node js express /     handlebars / some ajax & js on the front  end
     
     Code could be more streamlined, as often - but there are other things to work on & learn

*/  
$(document).ready(function() {
  // Getting a reference to the article container div we will be rendering all articles inside of
  var articleContainer = $(".article-container");
  // Adding event listeners for dynamically generated buttons for deleting articles,
  // pulling up article notes, saving article notes, and deleting article notes
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);

  // initPage kicks everything off when the page is loaded
  initPage(true);



  function createCard(article) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card
    var card = $(
      [
        "<div class='card'>",
        "<div class='card-header bg-dark'>",
        "<h5>",
        "<a class='article-link title' target='_blank' href='" + article.url + "'>",
        article.headline,
        "<a class='btn btn-danger save delete float-right'><span class='fas fa-trash-alt'></span></a>",
        "<a class='btn btn-info save notes float-right'><span class='fas fa-plus addBtn'></span></a>", 
        "</a>",
        "</h5>",
        "</div>",
        "<div class='card-body gold-color'>",
        article.summary,
        "</div>",
        "</div>"
      ].join("")
    );
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to remove or open notes for
    card.data("_id", article._id);
    card.data("headline", article.headline);
    // We return the constructed card jQuery element
    return card;
  }

  function renderEmpty() {
    // renders HTML - we don't have any articles

    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>Would You Like to Browse Available Articles?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {
    //  render notes list items to notes modal

    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      currentNote = [
        "<li class='list-group-item gold-color'>",
        "No notes for this article yet.",
        "</li>"
      ].join("");
      notesToRender.push(currentNote);
    } else {
      // If we  have notes, iterate thru
      for (var i = 0; i < data.notes.length; i++) {
        // Constructs  li element for noteText and delete button
        currentNote = $(
          [
            "<li class='list-group-item note gold-color'>",
            data.notes[i].noteText,
            "<a class='btn btn-danger note-delete'><i class='fas fa-times'></i></a>",
            "</li>"
          ].join("")
        );
        // Store the note id on the delete button for easy access when trying to delete
        currentNote.children("button").data("_id", data.notes[i]._id);
        // Adding our currentNote to the notesToRender array
        notesToRender.push(currentNote);
      }
    }
    $(".note-container").append(notesToRender);
  }
  function handleArticleNotes(event) {

    // open notes modal, display notes, use _id of the article to get its notes
    
    var currentArticle = $(this)
      .parents(".card")
      .data();
    
    // Get notes with this article  id
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
  
      // messy but gets its done
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes For Article: ",
        "<span class='note-title'>"+currentArticle.headline+"</span>",
        "</h4>",
        "<hr />",
        "<ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "<a class='btn btn-danger save note-save'><span class='far fa-save fa-3x'></span></a>",
        "</div>"
      ].join("");
   
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });

      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };

    
      $(".btn.save").data("article", noteData);

      renderNotesList(noteData);
    });
  }

  function handleNoteSave() {
    // on save click, get the note from the input box and save/post it

    var noteData;
    var newNote = $(".bootbox-body textarea")
      .val();
    if (newNote != undefined)
      newNote = newNote.trim();  
    // clean up note if it exists
    // post to "/api/notes" route and send the formatted noteData 

    if (newNote) {
      noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
      $.post("/api/notes", noteData).then(function() {
        // close the modal
        bootbox.hideAll();
      });
    }
  }

  function handleNoteDelete() {
    //  delete notes when x button clicked

    var noteToDelete = $(this).data("_id");

    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      // when done, hide the modal
      bootbox.hideAll();
    });
  }
});
