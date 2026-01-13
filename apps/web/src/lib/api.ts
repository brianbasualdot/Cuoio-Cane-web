export class ApiClient {
    private customFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<any>;

    constructor() {
        this.customFetch = async (input, init) => {
            const url = process.env.NEXT_PUBLIC_API_URL
                ? `${process.env.NEXT_PUBLIC_API_URL}${input}`
                : `http://localhost:3002${input}`;

            const headers = {
                'Content-Type': 'application/json',
                ...(init?.headers || {}),
            };

            const response = await fetch(url, {
                ...init,
                headers,
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(error.message || `API error: ${response.status}`);
            }

            return response.json();
        };
    }

    get(endpoint: string) {
        return this.customFetch(endpoint, { method: 'GET' });
    }

    post(endpoint: string, body: any) {
        return this.customFetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    patch(endpoint: string, body: any) {
        return this.customFetch(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }
}

export const api = new ApiClient();
