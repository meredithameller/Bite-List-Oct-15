import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LogForm } from './LogForm'

function renderForm(onSaved = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <LogForm onSaved={onSaved} />
      </MemoryRouter>
    </QueryClientProvider>,
  )
  return onSaved
}

describe('<LogForm />', () => {
  beforeEach(() => localStorage.clear())

  it('shows a friendly error and does not save when no place is picked', async () => {
    const onSaved = renderForm()
    await userEvent.click(screen.getByRole('button', { name: /save visit/i }))
    expect(await screen.findAllByText('Pick a place to log')).not.toHaveLength(0)
    expect(onSaved).not.toHaveBeenCalled()
  })

  it('asks for the sponsor name and shows the disclosure reminder when sponsored', async () => {
    renderForm()
    await userEvent.click(screen.getByRole('switch', { name: /sponsored or gifted/i }))
    expect(screen.getByLabelText('Sponsor name')).toBeInTheDocument()
    expect(screen.getByRole('note')).toHaveTextContent(/disclose/i)
  })
})
