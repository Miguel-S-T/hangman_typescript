import { useState, useEffect, useCallback } from 'react'
import { englishWords, portugueseWords } from "./wordList"
import { HangmanDrawing } from './HangmanDrawing'
import HangmanWord from './HangmanWord'
import Keyboard from './Keyboard'
import styles from "./Keyboard.module.css"

function App() {
  const [words, setWords] = useState<string[]>(portugueseWords)
  const [wordToGuess, setWordToGuess] = useState(getWord)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [languageEnglish, setLanguageEnglish] = useState<boolean>(false)

  const incorrectLetters = guessedLetters.filter((letter) => !wordToGuess.includes(letter))
  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter))

  // useEffect(() => {
  //   console.log(wordToGuess, "wordToGuess")
  //   console.log(languageEnglish, "languageEnglish")
  // }, [wordToGuess, languageEnglish])

  useEffect(() => {
    // Load the language from local storage when the app initializes
    const savedLanguage = localStorage.getItem('languageEnglish')

    if (savedLanguage !== null) {
      setLanguageEnglish(JSON.parse(savedLanguage))
    }
  }, [])

  useEffect(() => {
    // Save the language to local storage whenever it changes
    localStorage.setItem('languageEnglish', JSON.stringify(languageEnglish))
    setWords(languageEnglish ? englishWords : portugueseWords)

  }, [languageEnglish])

  useEffect(() => {
    setWordToGuess(getWord())// Reset the word when the language changes
  }, [words])

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return

    setGuessedLetters(currentLetters => [...currentLetters, letter])
  }, [guessedLetters, isWinner, isLoser])


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if (!key.match(/^[a-z]$/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])

  function getWord() {
    return words[Math.floor(Math.random() * words.length)]
  }


  // Press Enter to refresh page
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if (key !== "Enter") return

      e.preventDefault()
      setGuessedLetters([])
      setWordToGuess(getWord())
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [])

  return (
    <div style={{
      maxWidth: "800px",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      margin: "0 auto",
      alignItems: "center",
      marginTop: "2rem",
    }}>
      <div style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.5rem"
      }}>

        <div style={{ fontSize: "2rem", textAlign: "center", }}>
          {!isWinner && !isLoser && <div style={{
            border: "3px solid black",
            backgroundColor: "darkblue",
            padding: "1rem",
            borderRadius: "5px",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            fontFamily: "monospace",
          }}>{languageEnglish ? "Hangman Game - Find the word" : "Jogo da Forca - Encontra a Palavra"}</div>}

          {isWinner && <div style={{
            border: "4px solid black",
            backgroundColor: "green",
            padding: "1rem",
            borderRadius: "5px",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            fontFamily: "monospace",
          }}>Winner! - Refresh to try again.</div>}
          {isLoser && <div style={{
            backgroundColor: "red",
            border: "4px solid black",
            padding: "1rem",
            borderRadius: "5px",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            fontFamily: "monospace",
          }}
          >Loser! - Refresh to try again.</div>}
        </div>
        <button onClick={() => {
          setLanguageEnglish((prevState => !prevState))
        }} className={styles.language_btn}>
          <span>Switch to {!languageEnglish ? "EN 🇬🇧" : "PT 🇵🇹"}</span></button>
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard disabled={isWinner || isLoser} activeLetters={guessedLetters.filter((letter) => wordToGuess.includes(letter))} inactiveLetters={incorrectLetters} addGuessedLetter={addGuessedLetter} />
      </div>

    </div>
  )
}

export default App
