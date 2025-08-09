import { NextResponse } from 'next/server';

interface ApiResponseData {
  [key: string]: unknown;
}

const apiResponse = (
  data: ApiResponseData, 
  message: string = 'Success', 
  status: number = 200
): NextResponse => {
  return NextResponse.json({ data, message, status }, { status });
};

const apiError = (
  message: string = 'Internal Server Error', 
  status: number = 500, 
  error: unknown = null
): NextResponse => {
  if (error) {
    console.error(error);
  }
  return NextResponse.json({ message, status }, { status });
};

export { apiResponse, apiError };