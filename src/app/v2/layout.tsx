import Zaglavlje from "@/components/v2/Zaglavlje";
import Podnozje from "@/components/v2/Podnozje";
import Asistent from "@/components/v2/Asistent";
import { KorpaProvider } from "@/components/v2/korpa/Korpa";
import { SacuvanoProvider } from "@/components/v2/sacuvano/Sacuvano";

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <KorpaProvider>
      <SacuvanoProvider>
        <div className="v2 flex min-h-dvh flex-col">
          <Zaglavlje />
          <main className="flex-1">{children}</main>
          <Podnozje />
          <Asistent />
        </div>
      </SacuvanoProvider>
    </KorpaProvider>
  );
}
