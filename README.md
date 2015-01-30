# FlashcardStacks


Virtual flashcard JavaScript library


## Synopsis

FlashcardStacks is a JavaScript library that makes it easy to add 3D-animated virtual flashcards to a webpage.

## Code Example

This is everything necessary to create a stack of two flashcards that flips and switches cards when the user presses left, right, up, or down with the keyboard:


```html
  <head>
    <!-- Load FlashcardStacks library -->
    <script src="flashcardStacks.js" type="text/javascript"></script>
  </head>
  
  <!-- Run fc.init() after elements are loaded -->
  <body onload="fc.init()">
  
    <!-- Add flashcard container element -->
    <div id="unique_id" class="fc_container" fc-enableArrowkeys>
    
      <!-- Card One -->
      <div class="fc_content">
        <!-- Front Content -->
      </div>
      <div class="fc_content">
        <!-- Back Content -->
      </div>
      
      <!-- Card Two -->
      <div class="fc_content">
        <!-- Front Content -->
      </div>
      <div class="fc_content">
        <!-- Back Content -->
      </div>
    </div>
  </body>
```

The [FlashcardStacks_examples](https://github.com/Ryan-Rutledge/FlashcardStacks_examples) repository contains demos of the FlashcardStacks library, and is hosted [here](http://ryan-rutledge.github.io/FlashcardStacks_examples/).

For more advanced features, check out the [FlashcardStacks Documentation](https://github.com/Ryan-Rutledge/FlashcardStacks/wiki)

## About

This library was originally a simple script in part of a webpage of the [NARS web application](https://github.com/JGitHubApp/narsapp), before it was discontinued. The purpose of the webpage was to serve as a learning tool for the students of the National Academy of Railroad Science (NARS) by providing them electronic flashcards of railroad signals and their meanings.

This project's goal is to convert that webpage into a general-purpose flashcard library.
