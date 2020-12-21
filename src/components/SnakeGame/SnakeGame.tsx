import React from 'react'
import './SnakeGame.css'

interface Props {
  width: number,
  height: number,
}

interface GridPos {
    x: number,
    y: number,
}

enum Direction {
  Up,
  Down,
  Left,
  Right
}

interface State {
    width: number,
    height: number,
    snake: GridPos[],
    apple: GridPos,
    direction: Direction,
    isAlive: boolean,
    score: number,
    frame: number,
}

class SnakeGame extends React.Component<Props, State> {
    state: State = {
      width: 0,
      height: 0,
      snake: [],
      apple: { x: 0, y: 0 },
      direction: Direction.Right,
      isAlive: false,
      score: 0,
      frame: 0,
  }

  constructor(props: Props) {
    super(props)

    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentWillMount() {
    this.initGame()
    window.addEventListener('keydown', this.handleKeyDown)
  }

  initGame() {
    // Game size initialization
    let width: number = this.props.width
    let height: number = this.props.height
    let blockWidth = width / 30
    let blockHeight = height / 20

    // snake initialization
    let startSnakeSize = 3
    let snake = []
    let Xpos = Math.floor(width / 2)
    let Ypos = Math.floor(height / 2)
    snake.push({x: Xpos, y: Ypos})
    for (let i = 1; i < startSnakeSize; i++) {
      Xpos -= 1
      let snakePart: GridPos = { x: Xpos, y: Ypos }
      snake.push(snakePart)
    }

    // apple position initialization
    let appleXpos =
      Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) *
      blockWidth
    let appleYpos =
      Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
      blockHeight
    while (appleYpos === snake[0].y) {
      appleYpos =
        Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) *
        blockHeight
    }

    this.setState({
      width,
      height,
      snake,
      isAlive: true,
      apple: { x: appleXpos, y: appleYpos },
    })
  }

  componentDidMount() {
    this.gameLoop()
  }

  gameLoop() {
    setInterval(() => {
      // inc frame
      this.setState({
        frame: this.state.frame + 1
      })
      // move snake
      this.moveSnake()

      // render snake on canvas
      this.render()
      // sleep some ms? maybe. yes I'm think about 60 times a second so wait 100/6 mili
      }, 100/6)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  moveSnake() {
    let snake = this.state.snake
    let {x, y} = snake[0]

    switch (this.state.direction) {
      case Direction.Down:
        y -= 0.25
        break
      case Direction.Up:
        y += 0.25
        break
      case Direction.Left:
        x -= 0.25
        break
      case Direction.Right:
        x += 0.25
        break
      default:
    }
    snake.splice(0, 0, {x, y})
    snake.pop();

    this.setState({
      snake
    })
  }

  tryToEatApple() {
    
  }

  tryToEatSnake() {
  }

  moveHead() {
  }

  handleKeyDown(event: { keyCode: number }) {
    // if spacebar is pressed to run a new game

    const dir = this.state.direction

    switch (event.keyCode) {
      case 37:
      case 65:
        // left
        if (dir !== Direction.Right) {
          this.setState({
            direction: Direction.Left
          })
        }
        break
      case 38:
      case 87:
        // up
        if (dir !== Direction.Down) {
          this.setState({
            direction: Direction.Up
          })
        }
        break
      case 39:
      case 68:
        // right
        if (dir !== Direction.Left) {
          this.setState({
            direction: Direction.Right
          })
        }
        break
      case 40:
      case 83:
        //down
        if (dir !== Direction.Up) {
          this.setState({
            direction: Direction.Down
          })
        }
        break
      default:
    }
  }

  render() {
    if (!this.state.isAlive) {
        return (
            <h1>Game Over</h1>
        )
    }

    return (
      <>
        <h1>X: {this.state.snake[0].x} Y: {this.state.snake[0].y}</h1>
        <h2>Direction: {this.state.direction} </h2>
        <h2>Frame: {this.state.frame}</h2>
        <ul>
        {this.state.snake.map(s => {
          return (
            <li>X: {s.x} Y: {s.y}</li>
          )
        })}
        </ul>
      </>
    )
  }
}

export default SnakeGame