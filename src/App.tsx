import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import './App.css';
import SnakeGame from './components/SnakeGame/SnakeGame'
import 'bootstrap/dist/css/bootstrap.min.css'

enum event {
  MOVE,
  APPLE,
  START
}

interface frame {
  id: number
  type: event
  direction?: number
  pos?: {
    x: number,
    y: number
  }
}

function serializeGame(game: frame[]) {
  let gameString = ""
  game.forEach(m => {
    switch (m.type) {
      case event.START:
        gameString += "0 S;"
        break
      case event.APPLE:
        gameString += m.id.toString() + " A " + m.pos?.x.toString() + " " + m.pos?.y.toString() + ";"
        break
      case event.MOVE:
        gameString += m.id.toString() + " M " + m.direction?.toString() + ";"
        break
    }
  })
  return gameString
}

function App() {
  const [game, setGame] = useState<frame[]>([])
  const [gdpr, setGdpr] = useState<boolean>(false)
  const [uuid, setUuid] = useState<string>()

  useEffect(() => {
    if (!document.cookie) {
      // network request to get uuid
      fetch('https://snake.jnet-it.com/api/uuid')
        .then(response => response.json())
        .then(data => {
          const token: string = data.token
          setUuid(token)
          document.cookie = token
        })
    } else {
      setUuid(document.cookie)
    }
  }, [])

  return (
    <div className="App">
      {!gdpr &&
        <div id="gdpr">
          <p>
            <b>Hi everyone</b>, thanks for playing this game to help collect data for my A-Level Project. 
            To help me sort though the data I am storing a cookie and the IP address which the data comes from.
            All of this will be deleted once the project is submitted in accordance with GDPR. Any issues drop me an email: jstone@jnet-it.com
          </p>
          <Button onClick={_ => setGdpr(true)}>Close</Button>
        </div>
      }
      <p>For my dataset I am hoping to get around 10+ games per participant. The more you have time for the better. Enjoy.</p>
      <SnakeGame
        size={800}
        onMove={(id, direction) => {
          const newMove: frame = {
            type: event.MOVE,
            id,
            direction
          }
          console.log(newMove)
          setGame([...game, newMove])
          
        }}
        onApple={(id, x, y) => {
          const newApple: frame = {
            type: event.APPLE,
            id,
            pos: {x, y}
          }
          console.log(newApple)
          setGame([...game, newApple])
        }}
        onStart={() => { 
          // clear move list
          setGame([
            {
              type: event.START,
              id: 0
            }
          ])
          console.log('START')
        }}
        onEnd={() => {
          // serialise game data
          const sGame = serializeGame(game)
          // send to server
          console.log(sGame)
          fetch('https://snake.jnet-it.com/api/game', {
            method: 'POST',
            body: JSON.stringify({
              "data": sGame,
              "token": uuid
            })
          })
        }}
      />
    </div>
  );
}

export default App;
