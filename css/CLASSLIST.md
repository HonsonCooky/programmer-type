- **.selected**: Element is currently selected
- **.error**: Element is indicating an issue
- **.screen**: Element has a message that should take up the whole main area

- **.test**: Indicate the contents is a test
- **.test .action**: Is an action test
- **.test .code**: Is a code test

  - **.line**: Lines of a test
  - **.line .spec-comment**: A special comment line
  - **.line .input**: Used to identify action test input line
  - **.line .comment**: A regular comment line

    - **.correct**: Indication of correct input
    - **.incorrect**: Indication of incorrect input
    - **.sincorrect**: Incorrect input is a space
    - **.hmessage**: A hidden message at the end of a line that is shown to indicate action state
    - **.hmessage show**: Show the hidden message at the end of a line
