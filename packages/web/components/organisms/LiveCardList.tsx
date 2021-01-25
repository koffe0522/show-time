import React from 'react';
import Link from 'next/link';

export default function LiveCardList(): JSX.Element {
  return (
    <div>
      <Link href="/live/[id]" as="/live/523453">
        <a>live-stream</a>
      </Link>
      <Link href="/live/streamer" as="/live/streamer">
        <a>live-streamer</a>
      </Link>
      <Link href="/chat/[id]" as="/chat/523453">
        <a>chat</a>
      </Link>
    </div>
  );
}
