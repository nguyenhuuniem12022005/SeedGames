import { NextResponse } from 'next/server';

type RunRequest = {
  problemId: string;
  code: string;
};

type RunResponse = {
  status: 'success' | 'fail' | 'error';
  stdout: string[];
  events: Array<{ type: string; message: string }>;
  runtimeMs: number;
  memoryMb: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<RunRequest>;
    const problemId = body.problemId?.toString();
    const code = body.code?.toString();

    if (!problemId || !code) {
      return NextResponse.json({ error: 'Missing problemId or code' }, { status: 400 });
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const response: RunResponse = {
      status: 'success',
      stdout: [
        `Run completed for problem ${problemId}.`,
        `Code length: ${code.length} characters.`,
      ],
      events: [
        { type: 'progress', message: 'Compile OK (mock)' },
        { type: 'progress', message: 'Simulation tick 1/3' },
        { type: 'progress', message: 'Simulation tick 2/3' },
        { type: 'progress', message: 'Simulation tick 3/3' },
      ],
      runtimeMs: 123,
      memoryMb: 32,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to run code' }, { status: 500 });
  }
}
