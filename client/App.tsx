import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

const COLS = 10;
const ROWS = 20;
const EMPTY_ROW = Array(COLS).fill(0);

const SHAPES = [
  [[1,1,1,1]], // I
  [[2,2],[2,2]], // O
  [[0,3,0],[3,3,3]], // T
  [[4,0,0],[4,4,4]], // J
  [[0,0,5],[5,5,5]], // L
  [[6,6,0],[0,6,6]], // S
  [[0,7,7],[7,7,0]]  // Z
];

function randomShape() {
  const index = Math.floor(Math.random() * SHAPES.length);
  return { shape: SHAPES[index], x: 3, y: 0 };
}

export default function App() {
  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => [...EMPTY_ROW]));
  const [current, setCurrent] = useState(randomShape());
  const [gameOver, setGameOver] = useState(false);
  const dropInterval = useRef(null);

  useEffect(() => {
    startGame();
    return () => stopGame();
  }, []);

  function startGame() {
    dropInterval.current = setInterval(() => {
      move(0, 1);
    }, 500);
  }

  function stopGame() {
    if (dropInterval.current) clearInterval(dropInterval.current);
  }

  function rotate(shape: number[][]) {
    return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
  }

  function collides(x: number, y: number, shape: number[][]) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const nx = x + c;
          const ny = y + r;
          if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
          if (ny >= 0 && board[ny][nx]) return true;
        }
      }
    }
    return false;
  }

  function merge(boardCopy: number[][], shape: number[][], x: number, y: number) {
    shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val && y + r >= 0) {
          boardCopy[y + r][x + c] = val;
        }
      });
    });
  }

  function clearLines(boardCopy: number[][]) {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (boardCopy[r].every(v => v > 0)) {
        boardCopy.splice(r, 1);
        boardCopy.unshift([...EMPTY_ROW]);
        r++;
      }
    }
  }

  function move(dx: number, dy: number, rotateShape = false) {
    const shape = rotateShape ? rotate(current.shape) : current.shape;
    const newX = current.x + dx;
    const newY = current.y + dy;

    if (!collides(newX, newY, shape)) {
      setCurrent({ shape, x: newX, y: newY });
    } else if (dy > 0 && !rotateShape) {
      const boardCopy = board.map(row => [...row]);
      merge(boardCopy, current.shape, current.x, current.y);
      clearLines(boardCopy);
      setBoard(boardCopy);
      const next = randomShape();
      if (collides(next.x, next.y, next.shape)) {
        setGameOver(true);
        stopGame();
      } else {
        setCurrent(next);
      }
    }
  }

  function renderCell(value: number, index: number) {
    return <View key={index} style={[styles.cell, value && { backgroundColor: COLORS[value] }]} />;
  }

  function renderRow(row: number[], rowIndex: number) {
    return (
      <View key={rowIndex} style={styles.row}>
        {row.map(renderCell)}
      </View>
    );
  }

  const boardWithPiece = board.map(row => [...row]);
  merge(boardWithPiece, current.shape, current.x, current.y);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tetris</Text>
      {boardWithPiece.map(renderRow)}
      {gameOver && <Text style={styles.gameOver}>Game Over</Text>}
      <View style={styles.controls}>
        <Button title="Left" onPress={() => move(-1, 0)} />
        <Button title="Rotate" onPress={() => move(0, 0, true)} />
        <Button title="Right" onPress={() => move(1, 0)} />
        <Button title="Down" onPress={() => move(0, 1)} />
      </View>
    </View>
  );
}

const COLORS = [
  'black',
  '#00f0f0', // I
  '#f0f000', // O
  '#a000f0', // T
  '#0000f0', // J
  '#f0a000', // L
  '#00f000', // S
  '#f00000', // Z
];

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  title: { color: '#fff', fontSize: 24, marginBottom: 10 },
  row: { flexDirection: 'row' },
  cell: { width: 15, height: 15, borderWidth: 1, borderColor: '#222' },
  gameOver: { color: 'red', fontSize: 20, position: 'absolute', top: '50%' },
  controls: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', width: 220 }
});

