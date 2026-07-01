// app/classroom/[id]/page.tsx
import JitsiRoom from './jitsi';
import { cookies } from 'next/headers';

export default async function ClassroomPage({ params }) {
  const cookieStore = await cookies();
  const name = cookieStore.get('name')?.value || ''; // Fallback if no user_id in cookies
  const { id } = await params;
  
  return (
    <JitsiRoom
      roomName={`${id}`}
      userName={name}
      isModerator={true} // ✅ boolean not string
    />
  );
}
