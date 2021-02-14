import React from 'react'
import './SnakeGame.css'
import { ReactComponent as PlayBtn} from './play.svg'

interface Props {
  size: number,
  onMove: (id: number, direction: number) => void
  onApple: (id: number, x: number, y: number) => void
  onStart: () => void
  onEnd: () => void
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
    snake: GridPos[],
    apple: GridPos,
    moves: Direction[],
    direction: Direction,
    isAlive: boolean,
    score: number,
    frame: number,
}

class SnakeGame extends React.Component<Props, State> {
  state: State = {
    snake: [],
    moves: [],
    apple: { x: 0, y: 0 },
    direction: Direction.Right,
    isAlive: false,
    score: 0,
    frame: 0,
  }

  gameInterval?: number
  size: number
  canvas!: HTMLCanvasElement

  constructor(props: Props) {
    super(props)

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.size = this.props.size
    this.game = this.game.bind(this)
  }

  resetGame() {
    this.props.onStart()
    // snake initialization
    let startSnakeSize = 3
    let snake = []
    let x = Math.floor((this.size) / 64)
    let y = Math.floor(this.size / 64)
    snake.push({x, y})

    for (let i = 1; i < startSnakeSize; i++) {
      x -= 1
      let snakePart: GridPos = { x, y }
      snake.push(snakePart)
    }


    this.setState({
      frame: 0,
      score: 0,
      direction: Direction.Right,
      snake,
      isAlive: true,
      moves: []
    })

    this.spawnApple()

    const tickRate = 1000/8
    this.gameInterval = window.setInterval(this.game, tickRate)
  }

  componentDidMount() {
    this.resetGame()
    this.setState({
      isAlive: false
    })
    window.addEventListener('keydown', this.handleKeyDown)
  }

  spawnApple() {
    let x = Math.floor(Math.random() * 16)
    let y = Math.floor(Math.random() * 16)

    while (this.state.snake.map(s => JSON.stringify(s)).includes(JSON.stringify({ x, y }))) {
      x = Math.floor(Math.random() * 16)
      y = Math.floor(Math.random() * 16)
    }

    this.props.onApple(this.state.frame, x, y)
    
    this.setState({
      apple: {x, y}
    })
  }

  game() {
      // inc frame
      this.setState({
        frame: this.state.frame + 1
      })

      // update direction state
      if (this.state.moves.length > 0) {
        const newDir = this.state.moves[0]
        this.setState({
          direction: newDir
        })
        this.setState({
          moves: this.state.moves.slice(1)
        })

      }
      // move snake
      this.moveSnake()

      // detect apple
      const apple = this.state.apple
      if (apple.x === this.state.snake[0].x && apple.y === this.state.snake[0].y) {
        this.spawnApple()
        this.setState({
          score: this.state.score + 1,
          snake: [
            apple,
            ...this.state.snake
          ]
        })
      }

      const ctx = this.canvas!.getContext('2d')
      // background
      for (let y = 0; y < this.size / 32; y++) {
        for (let x = 0; x < this.size / 32; x++) {
          
        ctx!.fillStyle = (y%2) ? (x%2) ? '#27d817' : '#1abc0b' : (x%2) ? '#1abc0b' : '#27d817'
        ctx!.fillRect(x * 32, y * 32, 32, 32)
        }
      }

      // snake
      this.state.snake.forEach((s) => {
        ctx!.fillStyle = 'cyan'
        ctx!.fillRect((s.x * 32) + 2, (s.y * 32) + 2, 28, 28)
      })

      ctx!.fillStyle = 'blue'
      const head = this.state.snake[0]
      ctx!.fillRect((head.x * 32) + 2, (head.y * 32) + 2, 28, 28)

      // apple
      ctx!.fillStyle = 'red'
      ctx!.fillRect((apple.x * 32) + 2 , (apple.y * 32) + 2, 28, 28)

      if (!this.state.isAlive) {
        window.clearInterval(this.gameInterval)
      }
  }


  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.clearInterval(this.gameInterval)
  }

  moveSnake() {
    let snake = this.state.snake
    let {x, y} = snake[0]

    switch (this.state.direction) {
      case Direction.Down:
        y += 1
        break
      case Direction.Up:
        y -= 1
        break
      case Direction.Left:
        x -= 1
        break
      case Direction.Right:
        x += 1
        break
      default:
    }
    snake.splice(0, 0, {x, y})
    snake.pop();

    // check wall collision
    if (x < 0 || x > (this.size/32 - 1) || y < 0 || y > (this.size/32 -1)) {
      this.setState({
        isAlive: false
      })
      this.props.onEnd()
    }

    // check snake collision

    if (snake.slice(1).map(s => JSON.stringify(s)).includes(JSON.stringify(snake[0]))) {
        this.setState({
          isAlive: false
        })
        this.props.onEnd()
    }

    this.setState({
      snake
    })
  }

  handleKeyDown(event: { keyCode: number }) {

    let ldir = this.state.moves.slice(-1)[0]
    if(ldir === undefined) {
      ldir = this.state.direction
    }

    switch (event.keyCode) {
      case 37:
      case 65:
        // lef
        if (ldir !== Direction.Right && ldir !== Direction.Left && this.state.isAlive) {
          this.setState({
            moves: [
              ...this.state.moves,
              Direction.Left
            ]
          })
          this.props.onMove(this.state.frame, Direction.Left)
          }
          break
      case 38:
      case 87:
        // up
        if (ldir !== Direction.Down && ldir !== Direction.Up && this.state.isAlive) {
          this.setState({
            moves: [
              ...this.state.moves,
              Direction.Up
            ]
          })
          this.props.onMove(this.state.frame, Direction.Up)
        }
        break
      case 39:
      case 68:
        // right
        if (ldir !== Direction.Left && ldir !== Direction.Right && this.state.isAlive) {
          this.setState({
            moves: [
              ...this.state.moves,
              Direction.Right
            ]
          })
          this.props.onMove(this.state.frame, Direction.Right)
        }
        break
      case 40:
      case 83:
        //down
        if (ldir !== Direction.Up && ldir !== Direction.Down && this.state.isAlive) {
          this.setState({
            moves: [
              ...this.state.moves,
              Direction.Down
            ]
          })
          this.props.onMove(this.state.frame, Direction.Down)
        }
        break
      case 32:
        if (!this.state.isAlive) {
          this.resetGame()
        }
        break
      default:
    }
  }

  render() {
    return (
      <div id={"GameBoard"}>
        <canvas
          width={this.size}
          height={this.size}
          style={{width:this.size, height:this.size, border:"1px solid black"}}
          ref={(r) => {this.canvas = r as HTMLCanvasElement}} />
        {!this.state.isAlive && 
          <div id="overlay">
            <PlayBtn className="Play-Btn" onClick={_ => this.resetGame()} />
          </div>
        }
      </div>
    )
  }
}

export default SnakeGame