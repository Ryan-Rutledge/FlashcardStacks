#FlashcardStacks


Virtual flashcard JavaScript library


##Synopsis

FlashcardStacks is a JavaScript/CSS3 library that makes it easy to add 3D-animated virtual flashcards to a webpage.

## Code Example


This is everything you need to create a stack of two flashcards that flips and switches cards when the user clicks left, right, up, or down on the keyboard:


```html
  <head>
    <link href="flashcardStacks.css" rel="stylesheet" type="text/css" />
    <script src="flashcardStacks.js" type="text/javascript"></script>
  </head>
  <body onload='fc.init()'>
    <!-- Card One -->
    <div class='fc_container' fc-enableArrowkeys>
      <div class='fc_content'>
        <!-- Content for the front of card one goes here -->
      </div>
      <div class='fc_content'>
        <!-- Content for the back of card one goes here -->
      </div>
      
      <!-- Card Two -->
      <div class='fc_content'>
        <!-- Content for the front of card two goes here -->
      </div>
      <div class='fc_content'>
        <!-- Content for the back of card two goes here -->
      </div>
    </div>
  </body>
```

For more advanced features, look at the [FlashcardStacks Documentation](https://github.com/Ryan-Rutledge/FlashcardStacks/wiki)

## About

This library was originally a very simple webpage that was part of the [NARS web application](https://github.com/JGitHubApp/narsapp), before it was discontinued. The purpose of the webpage was to provide the students of the National Academy of Railroad Science (NARS) with electronic flashcards of different railraod signals and their meanings.

This project's goal is to convert that webpage into a general-purpose flashcard library.
