- create a snake of length 1 going direction up
- for each step in time
  - move snake in direction
  - if apple at coordinate
    - add 1 to length of snake
    - add a new apple at a random coordinate
  - if user input of any of the desired buttons
    - change direction of snake in given direction


## Implementation details

- snake is an object containing
  - position of snake (an array of coordinates)
  - length (int)

- time is a counter

- listening to user input is just a keyup listener