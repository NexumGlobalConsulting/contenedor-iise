'use client'

import Container from '@/components/core/Container'
import Button from '@/components/core/Button'

export default function DiagnosticPage() {
  const question = {
    id: 'Q1',
    text: '¿Cuál es la capital del Perú?',
    options: ['Arequipa', 'Cusco', 'Lima', 'Trujillo'],
    correct: 'Lima'
  }

  const handleAnswer = (option: string) => {
    const result = {
      questionId: question.id,
      selected: option,
      correct: option === question.correct,
      timestamp: Date.now()
    }

    console.log('NEXUM_EVENT:', result)
  }

  return (
    <Container>
      <h2>{question.text}</h2>

      {question.options.map((opt) => (
        <Button
          key={opt}
          label={opt}
          onClick={() => handleAnswer(opt)}
        />
      ))}
    </Container>
  )
}