import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignIn from './SignIn.jsx';
import API_BASE_URL from '../services/api.js';

const { mockLogin } = vi.hoisted(() => ({
    mockLogin: vi.fn(),
})); 

vi.mock('../context/AuthContext.jsx', () => ({
    useAuth: () => ({
        login: mockLogin, 
    }),
}));

describe('SignIn Component',  () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('fetch', vi.fn());
    }); 

    it('displays the login from with email and password fields', () => {
        render(<SignIn />);

        expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('sucessfully logs in when a valid credentials are submitted', async () => {
        const user = userEvent.setup();

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                user: { name: "Test User", role: "user" },
                token: 'test-token-123',
            }), 
        });

        render(<SignIn />);

        await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'TestPassword123!');
        await user.click(screen.getByRole('button', { name: 'Sign In' }));

        expect(fetch).toHaveBeenCalledWith(
            `${API_BASE_URL}/api/users/login`,
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'TestPassword123!',
                }),
            }),
        );

        expect(mockLogin).toHaveBeenCalledWith(
            { name: "Test User", role: "user" },
            'test-token-123'
        );

        expect(await screen.findByRole('status')).toHaveTextContent('Login successful!');
    });   
    
    it('displays an error message when login fails', async () => {
        const user = userEvent.setup();

        fetch.mockResolvedValueOnce({
           ok: false,
           json: async () => ({
                message: 'Invalid credentials',
           }),
        });

        render(<SignIn />);

        await user.type(screen.getByPlaceholderText('Email'), 'wrong@example.com');
        await user.type(screen.getByPlaceholderText('Password'), 'WrongPassword123!');
        await user.click(screen.getByRole('button', { name: 'Sign In' }));

        expect(await screen.findByRole('status')).toHaveTextContent('Invalid credentials');

        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('shows and hides the password whenthe checkbox is clicked', async () => {
        const user = userEvent.setup();

        render(<SignIn />);

        const passwordInput = screen.getByPlaceholderText('Password');
        const showPasswordCheckbox = screen.getByRole('checkbox', { name: /show password/i });

        expect(passwordInput).toHaveAttribute('type', 'password');

        await user.click(showPasswordCheckbox);

        expect(passwordInput).toHaveAttribute('type', 'text');

        await user.click(showPasswordCheckbox);

        expect(passwordInput).toHaveAttribute('type', 'password');
    });
});