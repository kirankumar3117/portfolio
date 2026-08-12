import UniverseNav from '@/components/universe/UniverseNav';
import CustomCursor from '@/components/universe/CustomCursor';
import CommandTerminal from '@/components/universe/CommandTerminal';
import NowPlaying from '@/components/universe/NowPlaying';
import SceneLoader from '@/components/universe/SceneLoader';
import LoadingScreen from '@/components/universe/LoadingScreen';

export default function UniverseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black">
      <div className="fixed inset-0 z-0">
        <SceneLoader />
      </div>

      <LoadingScreen />
      <CustomCursor />
      <UniverseNav />
      <NowPlaying />
      <CommandTerminal />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
