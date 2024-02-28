import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  if (
    [process.env.PASSPHRASE, process.env.PASSPHRASE_DEV].includes(
      data.passphrase
    )
  ) {
    return new NextResponse(null, { status: 200, statusText: 'OK' });
  }
  return new NextResponse(null, { status: 400, statusText: 'Bad Request' });
};
