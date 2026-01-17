export class ApiClient {
    private customFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<any>;

    constructor() {
        this.customFetch = async (input, init) => {
            const url = process.env.NEXT_PUBLIC_API_URL
                ? `${process.env.NEXT_PUBLIC_API_URL}${input}`
                : `http://127.0.0.1:3002${input}`;

            console.log(`[API Client] Fetching: ${url}`);

            const headers = {
                'Content-Type': 'application/json',
                ...(init?.headers || {}),
            };

            let response;
            try {
                response = await fetch(url, {
                    ...init,
                    headers,
                });
            } catch (error: any) {
                // Return null if connection refused (e.g. build time without backend)
                if (error?.cause?.code === 'ECONNREFUSED' || error?.message?.includes('fetch failed')) {
                    console.warn(`[API Client] Connection refused for ${url}. Returning null/mock.`);
                    return null;
                }
                throw error;
            }

            if (response.status === 204) {
                return null;
            }

            const text = await response.text();
            let data;
            try {
                data = text ? JSON.parse(text) : null;
            } catch (e) {
                console.error('[API Client] Failed to parse JSON:', text);
                throw new Error('Invalid JSON response from API');
            }

            if (!response.ok) {
                throw new Error(data?.message || `API error: ${response.status}`);
            }

            return data;
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
