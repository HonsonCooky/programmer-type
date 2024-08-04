- **_.selected_**: Element is currently selected
- **_.error_**: Element is indicating an issue
- **_.screen_**: Element has a message that should take up the whole main area

- **_.test_**: Indicate the contents is a test
- **_.test .action_**: Is an action test
- **_.test .code_**: Is a code test

  - **_.line_**: Lines of a test
  - **_.line .newline_**: A newline line
  - **_.line .spec-comment_**: A special comment line
  - **_.line .input_**: Used to identify action test input line
  - **_.line .comment_**: A regular comment line

    - **_.correct_**: Indication of correct input
    - **_.incorrect_**: Indication of incorrect input
    - **_.sincorrect_**: Incorrect input is a space
    - **_.hmessage_**: A hidden message at the end of a line that is shown to indicate action state
    - **_.hmessage show_**: Show the hidden message at the end of a line
