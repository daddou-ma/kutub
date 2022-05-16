import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

function Welcome({ name }) {
    return <div role="greeting">
        Welcome {name}
    </div>
}

test('displays Welcome', async () => {
  render(<Welcome name="Someone" />)

  await waitFor(() => screen.getByRole('greeting'))
  expect(screen.getByRole('greeting')).toHaveTextContent('Welcome Someone')
})
