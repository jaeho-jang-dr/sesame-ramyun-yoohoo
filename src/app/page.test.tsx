import { render, screen } from '@testing-library/react'
import Home from './page'
import '@testing-library/jest-dom'
import { useAuthStore } from '@/lib/auth'

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
    app: {},
    auth: {},
    db: {},
    storage: {},
    googleProvider: {},
}))

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    onSnapshot: jest.fn(() => jest.fn()),
}))

// Mock the auth store
jest.mock('@/lib/auth', () => ({
    useAuthStore: jest.fn(),
    logout: jest.fn(),
}))

const mockUseAuthStore = useAuthStore as unknown as jest.Mock;

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
