const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        // 응답 본문을 텍스트로 먼저 읽기
        const text = await response.text();

        // 개발 환경에서 상세 로그 출력
        console.error('API ERROR:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          body: text,
        });

        if (text) {
          // JSON인지 확인하고 파싱 시도
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            try {
              const error = JSON.parse(text);
              errorMessage = error.message || error.error || errorMessage;
            } catch (e) {
              // JSON 파싱 실패 시 텍스트 사용
              errorMessage = text.length > 200 ? text.substring(0, 200) + '...' : text;
            }
          } else {
            // JSON이 아닌 경우 텍스트 사용 (너무 길면 잘라냄)
            errorMessage = text.length > 200 ? text.substring(0, 200) + '...' : text;
          }
        }
      } catch (e) {
        // 응답 본문 읽기 실패 시 기본 메시지 사용
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    // 성공 응답 처리
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data.data || data;
      } else {
        // JSON이 아닌 경우 텍스트로 반환
        const text = await response.text();
        return text as unknown as T;
      }
    } catch (e) {
      throw new Error(`응답 파싱 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}`);
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient(API_BASE_URL);
