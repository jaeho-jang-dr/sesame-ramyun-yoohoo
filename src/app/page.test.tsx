import { render, screen } from '@testing-library/react'
import Home from './page'
import '@testing-library/jest-dom'

// Mock the auth store
jest.mock('@/lib/auth', () => ({
    useAuthStore: jest.fn(),
    logout: jest.fn(),
}))

// Define a type for the store mock
const mockUseAuthStore = require('@/lib/auth').useAuthStore

describe('Home Page', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        // Default mock to safe values
        mockUseAuthStore.mockReturnValue({ user: null, isAdmin: false })
    })

    it('renders without crashing', () => {
        render(<Home />)
        expect(screen.getByText(/참깨라면 유후/i)).toBeInTheDocument()
    })
})
